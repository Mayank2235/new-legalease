package com.legalease.controller;

import com.legalease.dto.CaseDocumentDto;
import com.legalease.service.CaseDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/case-documents")
@RequiredArgsConstructor
public class CaseDocumentController {

    private final CaseDocumentService caseDocumentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CaseDocumentDto> upload(@RequestParam UUID caseId,
                                                  @RequestParam UUID lawyerId,
                                                  @RequestPart("file") MultipartFile file) throws IOException {
        CaseDocumentDto dto = caseDocumentService.upload(caseId, lawyerId, file);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<CaseDocumentDto>> list(@RequestParam UUID caseId,
                                                      @RequestParam UUID lawyerId) {
        return ResponseEntity.ok(caseDocumentService.listByCase(caseId, lawyerId));
    }

    @GetMapping("/{documentId}/download")
    public ResponseEntity<byte[]> download(@PathVariable UUID documentId,
                                           @RequestParam UUID lawyerId) throws IOException {
        var doc = caseDocumentService.getDocument(documentId, lawyerId);
        byte[] bytes = caseDocumentService.download(documentId, lawyerId);
        MediaType media = MediaType.APPLICATION_OCTET_STREAM;
        try {
            media = MediaType.parseMediaType(doc.getContentType());
        } catch (Exception ignored) {}
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + doc.getOriginalName() + "\"")
                .contentType(media)
                .body(bytes);
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> delete(@PathVariable UUID documentId,
                                       @RequestParam UUID lawyerId) throws IOException {
        caseDocumentService.delete(documentId, lawyerId);
        return ResponseEntity.ok().build();
    }
}


