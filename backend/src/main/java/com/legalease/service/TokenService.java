package com.legalease.service;

import com.legalease.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenService {
    
    @Value("${jwt.secret:your-super-secret-key-that-is-at-least-32-characters-long-for-security}")
    private String secretKey;
    
    @Value("${jwt.expiration:3600000}")
    private long expirationTime;
    
    // In-memory storage for refresh tokens and blacklisted tokens
    // In production, use Redis or database
    private final Map<String, String> refreshToUser = new ConcurrentHashMap<>();
    private final Map<String, Boolean> blacklistedTokens = new ConcurrentHashMap<>();

    private SecretKey getSigningKey() {
        String key = secretKey.length() >= 32 ? secretKey : 
                     secretKey + "0123456789abcdefghijklmnopqrstuvwxyz";
        return Keys.hmacShaKeyFor(key.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
    
    public String createRefreshToken(String userId) {
        String refreshToken = UUID.randomUUID().toString();
        refreshToUser.put(refreshToken, userId);
        return refreshToken;
    }
    
    public String getUserIdFromRefreshToken(String refreshToken) {
        return refreshToUser.get(refreshToken);
    }
    
    public void revokeRefreshToken(String refreshToken) {
        refreshToUser.remove(refreshToken);
    }
    
    public void blacklistAccessToken(String token) {
        blacklistedTokens.put(token, true);
    }
    
    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.getOrDefault(token, false);
    }
}