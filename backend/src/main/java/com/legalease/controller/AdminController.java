package com.legalease.controller;

import com.legalease.dto.AdminDto;
import com.legalease.entity.User;
import com.legalease.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final AdminService adminService;
    
    @PostMapping("/create")
    public ResponseEntity<AdminDto> createAdmin(@RequestParam String name,
                                              @RequestParam String email,
                                              @RequestParam String password,
                                              @RequestParam String department,
                                              @RequestParam String permissions) {
        AdminDto admin = adminService.createAdmin(name, email, password, department, permissions);
        return ResponseEntity.ok(admin);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<AdminDto>> getAllAdmins() {
        List<AdminDto> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AdminDto> getAdminById(@PathVariable UUID id) {
        AdminDto admin = adminService.getAdminById(id);
        return ResponseEntity.ok(admin);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<AdminDto> updateAdmin(@PathVariable UUID id,
                                              @RequestParam String name,
                                              @RequestParam String department,
                                              @RequestParam String permissions) {
        AdminDto admin = adminService.updateAdmin(id, name, department, permissions);
        return ResponseEntity.ok(admin);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable UUID id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable UUID id) {
        User user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
