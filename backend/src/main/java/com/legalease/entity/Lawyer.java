package com.legalease.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "lawyers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lawyer {
    
    @Id
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id", nullable = false)
    @MapsId
    private User user;
    
    @Column(nullable = false)
    private String specialization;
    
    @Column(nullable = false)
    private String experience;
    
    @Column(nullable = false)
    private Boolean verified = false;
    
    @Column(name = "hourly_rate", nullable = false, precision = 10, scale = 2)
    private BigDecimal hourlyRate;
}

