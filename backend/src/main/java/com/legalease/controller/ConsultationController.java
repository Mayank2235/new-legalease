package com.legalease.controller;

import com.legalease.dto.ConsultationRequest;
import com.legalease.dto.ConsultationStatusRequest;
import com.legalease.entity.Consultation;
import com.legalease.service.ConsultationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ConsultationController {
    
    private final ConsultationService consultationService;
    
    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@Valid @RequestBody ConsultationRequest request) {
        Consultation consultation = consultationService.createConsultation(request.getClientId(), request);
        return ResponseEntity.ok(consultation);
    }
    
    @GetMapping("/client/{id}")
    public ResponseEntity<List<Consultation>> getConsultationsByClient(@PathVariable UUID id) {
        List<Consultation> consultations = consultationService.getConsultationsByClient(id);
        return ResponseEntity.ok(consultations);
    }
    
    @GetMapping("/lawyer/{id}")
    public ResponseEntity<List<Consultation>> getConsultationsByLawyer(@PathVariable UUID id) {
        List<Consultation> consultations = consultationService.getConsultationsByLawyer(id);
        return ResponseEntity.ok(consultations);
    }
    
    @PatchMapping("/{id}/status")
    public ResponseEntity<Consultation> updateConsultationStatus(@PathVariable UUID id, 
                                                              @Valid @RequestBody ConsultationStatusRequest request) {
        Consultation consultation = consultationService.updateConsultationStatus(id, request);
        return ResponseEntity.ok(consultation);
    }
}






