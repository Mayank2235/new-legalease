package com.legalease.service;

import com.legalease.dto.AuthResponse;
import com.legalease.dto.LoginRequest;
import com.legalease.dto.UserRegistrationRequest;
import com.legalease.entity.Client;
import com.legalease.entity.Lawyer;
import com.legalease.entity.User;
import com.legalease.entity.UserRole;
import com.legalease.repository.ClientRepository;
import com.legalease.repository.LawyerRepository;
import com.legalease.repository.UserRepository;
import com.legalease.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final LawyerRepository lawyerRepository;
    private final ClientRepository clientRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Convert String role → UserRole enum
        UserRole role;
        try {
            role = UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + request.getRole());
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);

        // Create profile based on role
        if (role == UserRole.LAWYER) {
            Lawyer lawyer = new Lawyer();
            lawyer.setUser(savedUser);
            lawyer.setSpecialization("General Law");
            lawyer.setExperience("0 years");
            lawyer.setVerified(false);
            lawyer.setHourlyRate(java.math.BigDecimal.valueOf(100.00));
            lawyerRepository.save(lawyer);
        } else if (role == UserRole.CLIENT) {
            Client client = new Client();
            client.setUser(savedUser);
            client.setPhone("Not provided");
            client.setAddress("Not provided");
            clientRepository.save(client);
        }

        String token = jwtUtil.generateToken(savedUser);
        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(),
                savedUser.getName(), savedUser.getRole());
    }
    
    public AuthResponse loginUser(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getEmail(),
                user.getName(), user.getRole());
    }
}

