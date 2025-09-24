package com.legalease.repository;

import com.legalease.entity.Case;
import com.legalease.entity.CaseDocument;
import com.legalease.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseDocumentRepository extends JpaRepository<CaseDocument, UUID> {
    List<CaseDocument> findByCaseEntity(Case caseEntity);
    List<CaseDocument> findByCaseEntityAndLawyer(Case caseEntity, User lawyer);
    void deleteByCaseEntity(Case caseEntity);
}



