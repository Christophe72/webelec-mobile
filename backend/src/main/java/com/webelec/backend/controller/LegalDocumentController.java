package com.webelec.backend.controller;

import com.webelec.backend.dto.LegalDocumentReadyRequest;
import com.webelec.backend.dto.LegalDocumentSignRequest;
import com.webelec.backend.model.LegalDocument;
import com.webelec.backend.service.LegalDocumentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/legal-documents")
public class LegalDocumentController {

    private final LegalDocumentService service;

    public LegalDocumentController(LegalDocumentService service) {
        this.service = service;
    }

    @PostMapping("/{id}/ready")
    public ResponseEntity<LegalDocument> markReady(@PathVariable UUID id,
                                                   @Valid @RequestBody LegalDocumentReadyRequest request) {
        LegalDocument updated = service.ready(id, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/sign")
    public ResponseEntity<LegalDocument> sign(@PathVariable UUID id,
                                              @Valid @RequestBody LegalDocumentSignRequest request) {
        LegalDocument updated = service.sign(id, request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/lock")
    public ResponseEntity<LegalDocument> lock(@PathVariable UUID id) {
        LegalDocument updated = service.lock(id);
        return ResponseEntity.ok(updated);
    }
}
