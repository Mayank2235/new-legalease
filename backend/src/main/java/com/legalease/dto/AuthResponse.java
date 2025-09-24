package com.legalease.dto;

import com.legalease.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private UUID userId;
    private String email;
    private String name;
    private UserRole role;
    private String message;
    
    public AuthResponse(String token, UUID userId, String email, String name, UserRole role) {
        this.token = token;
        this.userId = userId;
        this.email = email;
        this.name = name;
        this.role = role;
        this.message = "Authentication successful";
    }
}


