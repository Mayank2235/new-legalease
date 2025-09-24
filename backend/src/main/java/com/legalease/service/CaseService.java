package com.legalease.service;

import com.legalease.dto.CaseDto;
import com.legalease.entity.Case;
import com.legalease.entity.CaseStatus;
import com.legalease.entity.CaseType;
import com.legalease.entity.User;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseService {
    
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    
    public CaseDto createCase(UUID clientId, UUID lawyerId, String title, String description, 
                             CaseType type, BigDecimal hourlyRate) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        Case caseEntity = new Case();
        caseEntity.setClient(client);
        caseEntity.setLawyer(lawyer);
        caseEntity.setTitle(title);
        caseEntity.setDescription(description);
        caseEntity.setType(type);
        caseEntity.setHourlyRate(hourlyRate);
        caseEntity.setStatus(CaseStatus.ACTIVE);
        
        Case savedCase = caseRepository.save(caseEntity);
        return convertToDto(savedCase);
    }
    
    public List<CaseDto> getCasesByClient(UUID clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        return caseRepository.findByClient(client)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<CaseDto> getCasesByLawyer(UUID lawyerId) {
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        return caseRepository.findByLawyer(lawyer)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CaseDto updateCaseStatus(UUID caseId, CaseStatus status) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        
        caseEntity.setStatus(status);
        Case updatedCase = caseRepository.save(caseEntity);
        return convertToDto(updatedCase);
    }
    
    public CaseDto updateCaseHours(UUID caseId, BigDecimal hours) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        
        caseEntity.setTotalHours(hours);
        if (caseEntity.getHourlyRate() != null) {
            caseEntity.setTotalAmount(caseEntity.getHourlyRate().multiply(hours));
        }
        
        Case updatedCase = caseRepository.save(caseEntity);
        return convertToDto(updatedCase);
    }
    
    public void deleteCase(UUID caseId) {
        // Ensure documents are removed via FK ON DELETE CASCADE (DB) or manual cleanup if needed
        caseRepository.deleteById(caseId);
    }
    
    private CaseDto convertToDto(Case caseEntity) {
        CaseDto dto = new CaseDto();
        dto.setId(caseEntity.getId());
        dto.setClientId(caseEntity.getClient().getId());
        dto.setLawyerId(caseEntity.getLawyer().getId());
        dto.setTitle(caseEntity.getTitle());
        dto.setDescription(caseEntity.getDescription());
        dto.setStatus(caseEntity.getStatus());
        dto.setType(caseEntity.getType());
        dto.setHourlyRate(caseEntity.getHourlyRate());
        dto.setTotalHours(caseEntity.getTotalHours());
        dto.setTotalAmount(caseEntity.getTotalAmount());
        dto.setClientName(caseEntity.getClient().getName());
        dto.setLawyerName(caseEntity.getLawyer().getName());
        dto.setCreatedAt(caseEntity.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setUpdatedAt(caseEntity.getUpdatedAt() != null ? 
                caseEntity.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        return dto;
    }
}
