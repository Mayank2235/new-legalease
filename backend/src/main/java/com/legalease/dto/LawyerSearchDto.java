package com.legalease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LawyerSearchDto {
    private UUID id;
    private String name;
    private String email;
    private String specialization;
    private String experience;
    private Boolean verified;
    private BigDecimal hourlyRate;
    private String phone;
    private String address;
}
