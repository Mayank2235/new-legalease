package com.legalease.security;

public final class SecurityConstants {
    private SecurityConstants() {}

    // Central single source of truth for endpoints that do not require authentication
    public static final String[] PUBLIC_ENDPOINTS = {
        "/api/auth/**",
        "/api/public/**",
        "/api/lawyers",
        "/api/lawyers/**",
        "/swagger-ui/**",
        "/v3/api-docs/**",
        "/actuator/health"
    };
}
