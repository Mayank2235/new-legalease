package com.legalease.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {
    private UUID id;
    private UUID senderId;
    private UUID receiverId;
    private UUID caseId;
    private String content;
    private Boolean isRead;
    private String senderName;
    private String receiverName;
    private String createdAt;
}
