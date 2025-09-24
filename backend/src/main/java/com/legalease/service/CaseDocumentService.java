package com.legalease.service;

import com.legalease.dto.CaseDocumentDto;
import com.legalease.entity.Case;
import com.legalease.entity.CaseDocument;
import com.legalease.entity.User;
import com.legalease.repository.CaseDocumentRepository;
import com.legalease.repository.CaseRepository;
import com.legalease.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CaseDocumentService {

    private final CaseDocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final UserRepository userRepository;

    @Value("${app.storage.case-docs:uploads/case-docs}")
    private String storageRoot;

    public CaseDocumentDto upload(UUID caseId, UUID lawyerId, MultipartFile file) throws IOException {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));

        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID() + ext;

        Path dir = Paths.get(storageRoot, caseEntity.getId().toString());
        Files.createDirectories(dir);
        Path dest = dir.resolve(storedName);
        file.transferTo(dest);

        CaseDocument doc = new CaseDocument();
        doc.setCaseEntity(caseEntity);
        doc.setLawyer(lawyer);
        doc.setOriginalName(original);
        doc.setStoredName(storedName);
        doc.setContentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream");
        doc.setSizeBytes(file.getSize());
        doc.setStoragePath(dest.toString());

        CaseDocument saved = documentRepository.save(doc);
        return toDto(saved);
    }

    public List<CaseDocumentDto> listByCase(UUID caseId, UUID lawyerId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));
        User lawyer = userRepository.findById(lawyerId)
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));
        return documentRepository.findByCaseEntityAndLawyer(caseEntity, lawyer)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public byte[] download(UUID documentId, UUID lawyerId) throws IOException {
        CaseDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getLawyer().getId().equals(lawyerId)) {
            throw new RuntimeException("Forbidden");
        }
        return Files.readAllBytes(Paths.get(doc.getStoragePath()));
    }

    public CaseDocument getDocument(UUID documentId, UUID lawyerId) {
        CaseDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getLawyer().getId().equals(lawyerId)) {
            throw new RuntimeException("Forbidden");
        }
        return doc;
    }

    public void delete(UUID documentId, UUID lawyerId) throws IOException {
        CaseDocument doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        if (!doc.getLawyer().getId().equals(lawyerId)) {
            throw new RuntimeException("Forbidden");
        }
        Files.deleteIfExists(Paths.get(doc.getStoragePath()));
        documentRepository.delete(doc);
    }

    private CaseDocumentDto toDto(CaseDocument doc) {
        CaseDocumentDto dto = new CaseDocumentDto();
        dto.setId(doc.getId());
        dto.setCaseId(doc.getCaseEntity().getId());
        dto.setLawyerId(doc.getLawyer().getId());
        dto.setOriginalName(doc.getOriginalName());
        dto.setContentType(doc.getContentType());
        dto.setSizeBytes(doc.getSizeBytes());
        dto.setDownloadUrl("/api/case-documents/" + doc.getId() + "/download");
        dto.setCreatedAt(doc.getCreatedAt());
        return dto;
    }
}


