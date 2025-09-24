package com.legalease.dto;

import com.legalease.entity.CaseStatus;
import com.legalease.entity.CaseType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseDto {
    private UUID id;
    private UUID clientId;
    private UUID lawyerId;
    private String title;
    private String description;
    private CaseStatus status;
    private CaseType type;
    private BigDecimal hourlyRate;
    private BigDecimal totalHours;
    private BigDecimal totalAmount;
    private String clientName;
    private String lawyerName;
    private String createdAt;
    private String updatedAt;
}
