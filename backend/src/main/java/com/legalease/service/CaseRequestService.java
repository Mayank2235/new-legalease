package com.legalease.service;

import com.legalease.dto.CaseDto;
import com.legalease.dto.CaseRequestDto;
import com.legalease.entity.CaseRequest;
import com.legalease.entity.CaseType;
import com.legalease.entity.RequestStatus;
import com.legalease.entity.User;
import com.legalease.repository.CaseRequestRepository;
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
public class CaseRequestService {
    
    private final CaseRequestRepository caseRequestRepository;
    private final UserRepository userRepository;
    private final CaseService caseService;
    
    public CaseRequestDto createRequest(UUID clientId, UUID lawyerId, String title, 
                                   String description, CaseType type) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        CaseRequest request = new CaseRequest();
        request.setClient(client);
        request.setLawyer(lawyer);
        request.setTitle(title);
        request.setDescription(description);
        request.setType(type);
        request.setStatus(RequestStatus.PENDING);
        
        CaseRequest savedRequest = caseRequestRepository.save(request);
        return convertToDtoWithFetchedData(savedRequest);
    }
    
    public List<CaseRequestDto> getRequestsByClient(UUID clientId) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        
        return caseRequestRepository.findByClient(client)
                .stream()
                .map(this::convertToDtoWithFetchedData)
                .collect(Collectors.toList());
    }
    
    public List<CaseRequestDto> getPendingRequestsByLawyer(UUID lawyerId) {
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        return caseRequestRepository.findPendingRequestsByLawyer(lawyer)
                .stream()
                .map(this::convertToDtoWithFetchedData)
                .collect(Collectors.toList());
    }
    
    public CaseRequestDto acceptRequest(UUID requestId, java.math.BigDecimal hourlyRate) {
        CaseRequest request = caseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(RequestStatus.ACCEPTED);
        CaseRequest savedRequest = caseRequestRepository.save(request);
        
        // Create a new case
        CaseDto createdCase = caseService.createCase(
                request.getClient().getId(),
                request.getLawyer().getId(),
                request.getTitle(),
                request.getDescription(),
                request.getType(),
                hourlyRate
        );
        
        CaseRequestDto dto = convertToDtoWithFetchedData(savedRequest);
        if (createdCase != null) {
            dto.setCaseId(createdCase.getId());
        }
        return dto;
    }
    
    public CaseRequestDto rejectRequest(UUID requestId) {
        CaseRequest request = caseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(RequestStatus.REJECTED);
        CaseRequest savedRequest = caseRequestRepository.save(request);
        return convertToDtoWithFetchedData(savedRequest);
    }
    
    public void cancelRequest(UUID requestId) {
        CaseRequest request = caseRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        
        request.setStatus(RequestStatus.CANCELLED);
        caseRequestRepository.save(request);
    }
    
    private CaseRequestDto convertToDto(CaseRequest request) {
        CaseRequestDto dto = new CaseRequestDto();
        dto.setId(request.getId());
        dto.setClientId(request.getClient().getId());
        dto.setLawyerId(request.getLawyer().getId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setType(request.getType());
        dto.setStatus(request.getStatus().name());
        dto.setClientName(request.getClient().getName());
        dto.setLawyerName(request.getLawyer().getName());
        dto.setCreatedAt(request.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setUpdatedAt(request.getUpdatedAt() != null ? 
                request.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        return dto;
    }
    
    private CaseRequestDto convertToDtoWithFetchedData(CaseRequest request) {
        // Fetch the client and lawyer data to avoid lazy loading issues
        User client = userRepository.findById(request.getClient().getId())
                .orElseThrow(() -> new RuntimeException("Client not found"));
        User lawyer = userRepository.findById(request.getLawyer().getId())
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        
        CaseRequestDto dto = new CaseRequestDto();
        dto.setId(request.getId());
        dto.setClientId(client.getId());
        dto.setLawyerId(lawyer.getId());
        dto.setTitle(request.getTitle());
        dto.setDescription(request.getDescription());
        dto.setType(request.getType());
        dto.setStatus(request.getStatus().name());
        dto.setClientName(client.getName());
        dto.setLawyerName(lawyer.getName());
        dto.setCreatedAt(request.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        dto.setUpdatedAt(request.getUpdatedAt() != null ? 
                request.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME) : null);
        return dto;
    }
}
