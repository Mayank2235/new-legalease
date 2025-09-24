package com.legalease.service;

import com.legalease.dto.MessageDto;
import com.legalease.entity.Case;
import com.legalease.entity.Message;
import com.legalease.entity.User;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.MessageRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {
    
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    
    public MessageDto sendMessage(UUID senderId, UUID receiverId, String content, UUID caseId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setIsRead(false);
        
        if (caseId != null) {
            Case caseEntity = caseRepository.findById(caseId)
                    .orElseThrow(() -> new RuntimeException("Case not found"));
            message.setCaseEntity(caseEntity);
        }
        
        Message savedMessage = messageRepository.save(message);
        return convertToDto(savedMessage);
    }
    
    public List<MessageDto> getConversation(UUID user1Id, UUID user2Id) {
        User user1 = userRepository.findById(user1Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findConversationBetweenUsers(user1, user2)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<MessageDto> getMessagesByCase(UUID caseId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        
        return messageRepository.findByCaseEntityOrderByCreatedAtAsc(caseEntity)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public void markAsRead(UUID messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        message.setIsRead(true);
        messageRepository.save(message);
    }
    
    public Long getUnreadCount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.countByReceiverAndIsReadFalse(user);
    }
    
    public void markAllAsRead(UUID receiverId) {
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Message> unreadMessages = messageRepository.findUnreadMessagesByReceiver(receiver);
        for (Message message : unreadMessages) {
            message.setIsRead(true);
        }
        messageRepository.saveAll(unreadMessages);
    }
    
    public Long getUnreadMessageCount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.countUnreadMessagesByReceiver(user);
    }
    
    public List<MessageDto> getUnreadMessages(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return messageRepository.findUnreadMessagesByReceiver(user)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    private MessageDto convertToDto(Message message) {
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setContent(message.getContent());
        dto.setIsRead(message.getIsRead());
        dto.setSenderName(message.getSender().getName());
        dto.setReceiverName(message.getReceiver().getName());
        dto.setCreatedAt(message.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        
        if (message.getCaseEntity() != null) {
            dto.setCaseId(message.getCaseEntity().getId());
        }
        
        return dto;
    }
}
