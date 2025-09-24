package com.legalease.controller;

import com.legalease.dto.ClientRequest;
import com.legalease.entity.Client;
import com.legalease.service.ClientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientController {
    
    private final ClientService clientService;
    
    @GetMapping("/{id}")
    public ResponseEntity<Client> getClientById(@PathVariable UUID id) {
        Client client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }
    
    @PostMapping
    public ResponseEntity<Client> createClient(@Valid @RequestBody ClientRequest request) {
        // In a real app, you'd get the user ID from the authentication context
        UUID userId = UUID.randomUUID(); // This should come from the authenticated user
        
        Client client = clientService.createClient(userId, request);
        return ResponseEntity.ok(client);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable UUID id, 
                                            @Valid @RequestBody ClientRequest request) {
        Client client = clientService.updateClient(id, request);
        return ResponseEntity.ok(client);
    }
}











