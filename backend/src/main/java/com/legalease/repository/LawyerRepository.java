package com.legalease.repository;

import com.legalease.entity.Lawyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LawyerRepository extends JpaRepository<Lawyer, UUID> {
    List<Lawyer> findBySpecializationContainingIgnoreCase(String specialization);
    List<Lawyer> findByUser_NameContainingIgnoreCase(String name);
    
    @Query("SELECT l FROM Lawyer l JOIN FETCH l.user")
    List<Lawyer> findAllWithUser();
}


