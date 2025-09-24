package com.legalease.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class LawyerRequest {
    
    @NotBlank(message = "Specialization is required")
    private String specialization;
    
    @NotBlank(message = "Experience is required")
    private String experience;
    
    @NotNull(message = "Hourly rate is required")
    @DecimalMin(value = "0.01", message = "Hourly rate must be greater than 0")
    private BigDecimal hourlyRate;
}


