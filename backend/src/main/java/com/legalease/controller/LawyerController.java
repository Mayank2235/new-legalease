package com.legalease.controller;

import com.legalease.dto.LawyerRequest;
import com.legalease.dto.LawyerSearchDto;
import com.legalease.entity.Lawyer;
import com.legalease.service.LawyerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lawyers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LawyerController {
    
    private final LawyerService lawyerService;
    
    @GetMapping
    public ResponseEntity<List<Lawyer>> getAllLawyers(@RequestParam(value = "q", required = false) String q) {
        List<Lawyer> lawyers = (q == null || q.isBlank())
                ? lawyerService.getAllLawyers()
                : lawyerService.searchLawyers(q);
        return ResponseEntity.ok(lawyers);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<LawyerSearchDto>> searchLawyersForClients(@RequestParam(value = "q", required = false) String query) {
        List<LawyerSearchDto> lawyers = lawyerService.searchLawyersForClients(query);
        return ResponseEntity.ok(lawyers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Lawyer> getLawyerById(@PathVariable UUID id) {
        Lawyer lawyer = lawyerService.getLawyerById(id);
        return ResponseEntity.ok(lawyer);
    }
    
    @PostMapping
    public ResponseEntity<Lawyer> createLawyer(@Valid @RequestBody LawyerRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        // In a real app, you'd get the user ID from the authentication context
        // For now, we'll use a placeholder
        UUID userId = UUID.randomUUID(); // This should come from the authenticated user
        
        Lawyer lawyer = lawyerService.createLawyer(userId, request);
        return ResponseEntity.ok(lawyer);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Lawyer> updateLawyer(@PathVariable UUID id, 
                                             @Valid @RequestBody LawyerRequest request) {
        Lawyer lawyer = lawyerService.updateLawyer(id, request);
        return ResponseEntity.ok(lawyer);
    }
    
    @PatchMapping("/{id}/verify")
    public ResponseEntity<Lawyer> verifyLawyer(@PathVariable UUID id) {
        Lawyer lawyer = lawyerService.verifyLawyer(id);
        return ResponseEntity.ok(lawyer);
    }
}






