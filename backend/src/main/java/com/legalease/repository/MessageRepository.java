package com.legalease.repository;

import com.legalease.entity.Case;
import com.legalease.entity.Message;
import com.legalease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MessageRepository extends JpaRepository<Message, UUID> {
    
    List<Message> findBySenderAndReceiverOrderByCreatedAtAsc(User sender, User receiver);
    
    List<Message> findByCaseEntityOrderByCreatedAtAsc(Case caseEntity);
    
    @Query("SELECT m FROM Message m WHERE (m.sender = :user1 AND m.receiver = :user2) OR (m.sender = :user2 AND m.receiver = :user1) ORDER BY m.createdAt ASC")
    List<Message> findConversationBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);
    
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiver = :receiver AND m.isRead = false")
    Long countUnreadMessagesByReceiver(@Param("receiver") User receiver);
    
    @Query("SELECT m FROM Message m WHERE m.receiver = :receiver AND m.isRead = false ORDER BY m.createdAt DESC")
    List<Message> findUnreadMessagesByReceiver(@Param("receiver") User receiver);
    
    Long countByReceiverAndIsReadFalse(User receiver);
}
