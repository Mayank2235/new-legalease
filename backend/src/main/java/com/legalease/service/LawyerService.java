
package com.legalease.service;

import com.legalease.dto.LawyerRequest;
import com.legalease.dto.LawyerSearchDto;
import com.legalease.entity.Lawyer;
import com.legalease.entity.User;
import com.legalease.entity.UserRole;
import com.legalease.repository.LawyerRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LawyerService {
    
    private final LawyerRepository lawyerRepository;
    private final UserRepository userRepository;
    
    public List<Lawyer> getAllLawyers() {
        return lawyerRepository.findAll();
    }

    public List<Lawyer> searchLawyers(String q) {
        if (q == null || q.isBlank()) {
            return getAllLawyers();
        }
        List<Lawyer> bySpec = lawyerRepository.findBySpecializationContainingIgnoreCase(q);
        List<Lawyer> byName = lawyerRepository.findByUser_NameContainingIgnoreCase(q);
        // Simple merge without duplicates
        for (Lawyer l : byName) {
            if (!bySpec.contains(l)) bySpec.add(l);
        }
        return bySpec;
    }
    
    public List<LawyerSearchDto> searchLawyersForClients(String query) {
        List<Lawyer> lawyers;
        if (query == null || query.isBlank()) {
            lawyers = getAllLawyers();
        } else {
            lawyers = searchLawyers(query);
        }
        
        return lawyers.stream()
                .map(this::convertToSearchDto)
                .collect(Collectors.toList());
    }
    
    private LawyerSearchDto convertToSearchDto(Lawyer lawyer) {
        LawyerSearchDto dto = new LawyerSearchDto();
        dto.setId(lawyer.getId());
        
        // Fetch user data separately to avoid lazy loading issues
        User user = userRepository.findById(lawyer.getId()).orElse(null);
        if (user != null) {
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
        } else {
            dto.setName("Unknown");
            dto.setEmail("unknown@example.com");
        }
        
        dto.setSpecialization(lawyer.getSpecialization());
        dto.setExperience(lawyer.getExperience());
        dto.setVerified(lawyer.getVerified());
        dto.setHourlyRate(lawyer.getHourlyRate());
        return dto;
    }
    
    public Lawyer getLawyerById(UUID id) {
        return lawyerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
    }
    
    @Transactional
    public Lawyer createLawyer(UUID userId, LawyerRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != UserRole.LAWYER) {
            throw new RuntimeException("User is not a lawyer");
        }
        
        Lawyer lawyer = new Lawyer();
        lawyer.setId(userId);
        lawyer.setUser(user);
        lawyer.setSpecialization(request.getSpecialization());
        lawyer.setExperience(request.getExperience());
        lawyer.setVerified(false);
        lawyer.setHourlyRate(request.getHourlyRate());
        
        return lawyerRepository.save(lawyer);
    }
    
    @Transactional
    public Lawyer updateLawyer(UUID id, LawyerRequest request) {
        Lawyer lawyer = getLawyerById(id);
        
        lawyer.setSpecialization(request.getSpecialization());
        lawyer.setExperience(request.getExperience());
        lawyer.setHourlyRate(request.getHourlyRate());
        
        return lawyerRepository.save(lawyer);
    }
    
    @Transactional
    public Lawyer verifyLawyer(UUID id) {
        Lawyer lawyer = getLawyerById(id);
        lawyer.setVerified(true);
        return lawyerRepository.save(lawyer);
    }
}






