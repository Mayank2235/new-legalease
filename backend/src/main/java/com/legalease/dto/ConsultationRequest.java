package com.legalease.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ConsultationRequest {
    
    @NotNull(message = "Client ID is required")
    private UUID clientId;
    
    @NotNull(message = "Lawyer ID is required")
    private UUID lawyerId;
    
    @NotNull(message = "Scheduled time is required")
    private LocalDateTime scheduledAt;
}


