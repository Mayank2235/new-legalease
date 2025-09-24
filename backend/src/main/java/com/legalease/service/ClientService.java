package com.legalease.service;

import com.legalease.dto.ClientRequest;
import com.legalease.entity.Client;
import com.legalease.entity.User;
import com.legalease.entity.UserRole;
import com.legalease.repository.ClientRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {
    
    private final ClientRepository clientRepository;
    private final UserRepository userRepository;
    
    public Client getClientById(UUID id) {
        return clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found"));
    }
    
    @Transactional
    public Client createClient(UUID userId, ClientRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != UserRole.CLIENT) {
            throw new RuntimeException("User is not a client");
        }
        
        Client client = new Client();
        client.setId(userId);
        client.setUser(user);
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());
        
        return clientRepository.save(client);
    }
    
    @Transactional
    public Client updateClient(UUID id, ClientRequest request) {
        Client client = getClientById(id);
        
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());
        
        return clientRepository.save(client);
    }
}











