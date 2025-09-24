package com.legalease.repository;

import com.legalease.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, UUID> {
    
    List<Consultation> findByClientId(UUID clientId);
    
    List<Consultation> findByLawyerId(UUID lawyerId);
}











