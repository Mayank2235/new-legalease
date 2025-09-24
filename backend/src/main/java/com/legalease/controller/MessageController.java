package com.legalease.controller;

import com.legalease.dto.MessageDto;
import com.legalease.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {
    
    private final MessageService messageService;
    
    @PostMapping
    public ResponseEntity<MessageDto> sendMessage(@RequestParam UUID senderId,
                                                @RequestParam UUID receiverId,
                                                @RequestParam String content,
                                                @RequestParam(required = false) UUID caseId) {
        MessageDto message = messageService.sendMessage(senderId, receiverId, content, caseId);
        return ResponseEntity.ok(message);
    }
    
    @GetMapping("/conversation")
    public ResponseEntity<List<MessageDto>> getConversation(@RequestParam UUID user1Id,
                                                          @RequestParam UUID user2Id) {
        List<MessageDto> messages = messageService.getConversation(user1Id, user2Id);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/case/{caseId}")
    public ResponseEntity<List<MessageDto>> getMessagesByCase(@PathVariable UUID caseId) {
        List<MessageDto> messages = messageService.getMessagesByCase(caseId);
        return ResponseEntity.ok(messages);
    }
    
    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/user/{userId}/read-all")
    public ResponseEntity<Void> markAllAsRead(@PathVariable UUID userId) {
        messageService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadMessageCount(@PathVariable UUID userId) {
        Long count = messageService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<MessageDto>> getUnreadMessages(@PathVariable UUID userId) {
        List<MessageDto> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages);
    }
}
