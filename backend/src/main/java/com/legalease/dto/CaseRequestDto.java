package com.legalease.dto;

import com.legalease.entity.CaseType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseRequestDto {
    private UUID id;
    private UUID clientId;
    private UUID lawyerId;
    private UUID caseId;
    private String title;
    private String description;
    private CaseType type;
    private String clientName;
    private String lawyerName;
    private String status;
    private String createdAt;
    private String updatedAt;
}

