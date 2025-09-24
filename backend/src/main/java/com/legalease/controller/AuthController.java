package com.legalease.controller;

import com.legalease.dto.AuthResponse;
import com.legalease.dto.LoginRequest;
import com.legalease.dto.UserRegistrationRequest;
import com.legalease.entity.User;
import com.legalease.service.AuthService;
import com.legalease.service.TokenService;
import com.legalease.security.JwtUtil;
import com.legalease.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final TokenService tokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegistrationRequest request) {
        AuthResponse response = authService.registerUser(request);
        // create refresh token
        tokenService.createRefreshToken(response.getUserId().toString());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.loginUser(request);
        String refreshToken = tokenService.createRefreshToken(response.getUserId().toString());
        Map<String, Object> body = Map.of(
            "accessToken", response.getToken(),
            "refreshToken", refreshToken,
            "userId", response.getUserId(),
            "email", response.getEmail(),
            "name", response.getName(),
            "role", response.getRole()
        );
        return ResponseEntity.ok(body);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken == null) return ResponseEntity.badRequest().body(Map.of("error", "refreshToken required"));

        String userId = tokenService.getUserIdFromRefreshToken(refreshToken);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "invalid refresh token"));

        User user = userRepository.findById(UUID.fromString(userId)).orElseThrow();
        String newAccess = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("accessToken", newAccess));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody Map<String, String> body, @RequestHeader(value="Authorization", required=false) String authHeader) {
        String refreshToken = body.get("refreshToken");
        if (refreshToken != null) {
            tokenService.revokeRefreshToken(refreshToken);
        }
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7);
            tokenService.blacklistAccessToken(accessToken);
        }
        return ResponseEntity.ok(Map.of("message", "logged out"));
    }
}