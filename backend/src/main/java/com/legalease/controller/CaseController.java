package com.legalease.controller;

import com.legalease.dto.CaseDto;
import com.legalease.entity.CaseStatus;
import com.legalease.entity.CaseType;
import com.legalease.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
public class CaseController {
    
    private final CaseService caseService;
    
    @PostMapping
    public ResponseEntity<CaseDto> createCase(@RequestParam UUID clientId,
                                            @RequestParam UUID lawyerId,
                                            @RequestParam String title,
                                            @RequestParam String description,
                                            @RequestParam CaseType type,
                                            @RequestParam BigDecimal hourlyRate) {
        CaseDto caseDto = caseService.createCase(clientId, lawyerId, title, description, type, hourlyRate);
        return ResponseEntity.ok(caseDto);
    }
    
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<CaseDto>> getCasesByClient(@PathVariable UUID clientId) {
        List<CaseDto> cases = caseService.getCasesByClient(clientId);
        return ResponseEntity.ok(cases);
    }
    
    @GetMapping("/lawyer/{lawyerId}")
    public ResponseEntity<List<CaseDto>> getCasesByLawyer(@PathVariable UUID lawyerId) {
        List<CaseDto> cases = caseService.getCasesByLawyer(lawyerId);
        return ResponseEntity.ok(cases);
    }
    
    @PutMapping("/{caseId}/status")
    public ResponseEntity<CaseDto> updateCaseStatus(@PathVariable UUID caseId,
                                                  @RequestParam CaseStatus status) {
        CaseDto caseDto = caseService.updateCaseStatus(caseId, status);
        return ResponseEntity.ok(caseDto);
    }
    
    @PutMapping("/{caseId}/hours")
    public ResponseEntity<CaseDto> updateCaseHours(@PathVariable UUID caseId,
                                                 @RequestParam BigDecimal hours) {
        CaseDto caseDto = caseService.updateCaseHours(caseId, hours);
        return ResponseEntity.ok(caseDto);
    }
    
    @DeleteMapping("/{caseId}")
    public ResponseEntity<Void> deleteCase(@PathVariable UUID caseId) {
        caseService.deleteCase(caseId);
        return ResponseEntity.ok().build();
    }
}
