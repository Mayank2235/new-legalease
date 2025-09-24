package com.legalease.repository;

import com.legalease.entity.CaseRequest;
import com.legalease.entity.RequestStatus;
import com.legalease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseRequestRepository extends JpaRepository<CaseRequest, UUID> {
    
    List<CaseRequest> findByClient(User client);
    
    List<CaseRequest> findByLawyer(User lawyer);
    
    List<CaseRequest> findByLawyerAndStatus(User lawyer, RequestStatus status);
    
    @Query("SELECT cr FROM CaseRequest cr WHERE cr.lawyer = :lawyer AND cr.status = 'PENDING' ORDER BY cr.createdAt DESC")
    List<CaseRequest> findPendingRequestsByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(cr) FROM CaseRequest cr WHERE cr.lawyer = :lawyer AND cr.status = 'PENDING'")
    Long countPendingRequestsByLawyer(@Param("lawyer") User lawyer);
}
