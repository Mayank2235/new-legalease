package com.legalease.dto;

import com.legalease.entity.ConsultationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConsultationStatusRequest {
    
    @NotNull(message = "Status is required")
    private ConsultationStatus status;
}


