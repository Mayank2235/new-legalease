package com.legalease.service;

import com.legalease.dto.AdminDto;
import com.legalease.entity.Admin;
import com.legalease.entity.User;
import com.legalease.entity.UserRole;
import com.legalease.repository.AdminRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {
    
    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AdminDto createAdmin(String name, String email, String password, 
                              String department, String permissions) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(UserRole.ADMIN);
        
        User savedUser = userRepository.save(user);
        
        Admin admin = new Admin();
        admin.setUser(savedUser);
        admin.setDepartment(department);
        admin.setPermissions(permissions);
        
        Admin savedAdmin = adminRepository.save(admin);
        return convertToDto(savedAdmin);
    }
    
    public List<AdminDto> getAllAdmins() {
        return adminRepository.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public AdminDto getAdminById(UUID id) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        return convertToDto(admin);
    }
    
    public AdminDto updateAdmin(UUID id, String name, String department, String permissions) {
        Admin admin = adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        admin.getUser().setName(name);
        admin.setDepartment(department);
        admin.setPermissions(permissions);
        
        Admin updatedAdmin = adminRepository.save(admin);
        return convertToDto(updatedAdmin);
    }
    
    public void deleteAdmin(UUID id) {
        adminRepository.deleteById(id);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }
    
    private AdminDto convertToDto(Admin admin) {
        AdminDto dto = new AdminDto();
        dto.setId(admin.getId());
        dto.setName(admin.getUser().getName());
        dto.setEmail(admin.getUser().getEmail());
        dto.setDepartment(admin.getDepartment());
        dto.setPermissions(admin.getPermissions());
        dto.setCreatedAt(admin.getUser().getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        return dto;
    }
}
