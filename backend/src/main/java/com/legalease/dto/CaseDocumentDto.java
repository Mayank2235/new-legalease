package com.legalease.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class CaseDocumentDto {
    private UUID id;
    private UUID caseId;
    private UUID lawyerId;
    private String originalName;
    private String contentType;
    private Long sizeBytes;
    private String downloadUrl;
    private LocalDateTime createdAt;
}



