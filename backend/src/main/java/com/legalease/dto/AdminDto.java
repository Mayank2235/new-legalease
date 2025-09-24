package com.legalease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDto {
    private UUID id;
    private String name;
    private String email;
    private String department;
    private String permissions;
    private String createdAt;
}
