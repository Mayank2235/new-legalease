package com.legalease.controller;

import com.legalease.dto.CaseRequestDto;
import com.legalease.entity.CaseType;
import com.legalease.service.CaseRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/case-requests")
@RequiredArgsConstructor
public class CaseRequestController {
    
    private final CaseRequestService caseRequestService;
    
    @PostMapping
    public ResponseEntity<CaseRequestDto> createRequest(@RequestParam UUID clientId,
                                                   @RequestParam UUID lawyerId,
                                                   @RequestParam String title,
                                                   @RequestParam String description,
                                                   @RequestParam String type) {
        CaseType parsedType;
        try {
            parsedType = CaseType.valueOf(type.toUpperCase());
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid case type: " + type);
        }
        CaseRequestDto request = caseRequestService.createRequest(clientId, lawyerId, title, description, parsedType);
        return ResponseEntity.ok(request);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CaseRequestDto>> getRequestsByClient(@PathVariable UUID clientId) {
        List<CaseRequestDto> requests = caseRequestService.getRequestsByClient(clientId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/lawyer/{lawyerId}/pending")
    public ResponseEntity<List<CaseRequestDto>> getPendingRequestsByLawyer(@PathVariable UUID lawyerId) {
        List<CaseRequestDto> requests = caseRequestService.getPendingRequestsByLawyer(lawyerId);
        return ResponseEntity.ok(requests);
    }
    
    @PutMapping("/{requestId}/accept")
    public ResponseEntity<CaseRequestDto> acceptRequest(@PathVariable UUID requestId,
                                                  @RequestParam BigDecimal hourlyRate) {
        CaseRequestDto request = caseRequestService.acceptRequest(requestId, hourlyRate);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{requestId}/reject")
    public ResponseEntity<CaseRequestDto> rejectRequest(@PathVariable UUID requestId) {
        CaseRequestDto request = caseRequestService.rejectRequest(requestId);
        return ResponseEntity.ok(request);
    }
    
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<Void> cancelRequest(@PathVariable UUID requestId) {
        caseRequestService.cancelRequest(requestId);
        return ResponseEntity.ok().build();
    }
}
