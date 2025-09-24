package com.legalease.repository;

import com.legalease.entity.Case;
import com.legalease.entity.CaseStatus;
import com.legalease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseRepository extends JpaRepository<Case, UUID> {
    
    List<Case> findByClientAndStatus(User client, CaseStatus status);
    
    List<Case> findByLawyerAndStatus(User lawyer, CaseStatus status);
    
    List<Case> findByClient(User client);
    
    List<Case> findByLawyer(User lawyer);
    
    @Query("SELECT c FROM Case c WHERE c.client = :client OR c.lawyer = :lawyer")
    List<Case> findByClientOrLawyer(@Param("client") User client, @Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.lawyer = :lawyer AND c.status = :status")
    Long countByLawyerAndStatus(@Param("lawyer") User lawyer, @Param("status") CaseStatus status);
}
