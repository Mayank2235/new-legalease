package com.legalease.service;

import com.legalease.dto.ConsultationRequest;
import com.legalease.dto.ConsultationStatusRequest;
import com.legalease.entity.Consultation;
import com.legalease.entity.ConsultationStatus;
import com.legalease.entity.User;
import com.legalease.entity.UserRole;
import com.legalease.repository.ConsultationRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    
    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public Consultation createConsultation(UUID clientId, ConsultationRequest request) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        if (client.getRole() != UserRole.CLIENT) {
            throw new RuntimeException("User is not a client");
        }
        
        User lawyer = userRepository.findById(request.getLawyerId())
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        if (lawyer.getRole() != UserRole.LAWYER) {
            throw new RuntimeException("User is not a lawyer");
        }
        
        Consultation consultation = new Consultation();
        consultation.setClient(client);
        consultation.setLawyer(lawyer);
        consultation.setScheduledAt(request.getScheduledAt());
        consultation.setStatus(ConsultationStatus.PENDING);
        
        return consultationRepository.save(consultation);
    }
    
    public List<Consultation> getConsultationsByClient(UUID clientId) {
        return consultationRepository.findByClientId(clientId);
    }
    
    public List<Consultation> getConsultationsByLawyer(UUID lawyerId) {
        return consultationRepository.findByLawyerId(lawyerId);
    }
    
    @Transactional
    public Consultation updateConsultationStatus(UUID consultationId, ConsultationStatusRequest request) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Consultation not found"));
        
        consultation.setStatus(request.getStatus());
        return consultationRepository.save(consultation);
    }
}











