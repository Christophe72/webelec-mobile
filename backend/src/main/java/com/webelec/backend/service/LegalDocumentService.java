package com.webelec.backend.service;

import com.webelec.backend.dto.LegalDocumentReadyRequest;
import com.webelec.backend.dto.LegalDocumentSignRequest;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.LegalDocument;
import com.webelec.backend.model.LegalDocumentStatus;
import com.webelec.backend.repository.LegalDocumentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.EnumSet;
import java.util.UUID;

@Service
public class LegalDocumentService {

    private static final EnumSet<LegalDocumentStatus> IMMUTABLE_STATUSES = EnumSet.of(LegalDocumentStatus.SIGNED, LegalDocumentStatus.LOCKED);

    private final LegalDocumentRepository repository;

    public LegalDocumentService(LegalDocumentRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public LegalDocument ready(UUID id, LegalDocumentReadyRequest request) {
        LegalDocument document = findOrThrow(id);
        ensureMutable(document);
        if (document.getStatus() != LegalDocumentStatus.DRAFT) {
            throw new ConflictException("Transition invalide : seul un brouillon peut passer en READY");
        }
        document.setStatus(LegalDocumentStatus.READY);
        document.setUserSocieteId(request.getUserSocieteId());
        return repository.save(document);
    }

    @Transactional
    public LegalDocument sign(UUID id, LegalDocumentSignRequest request) {
        LegalDocument document = findOrThrow(id);
        ensureMutable(document);
        if (document.getStatus() != LegalDocumentStatus.READY) {
            throw new ConflictException("Transition invalide : seul un document READY peut être signé");
        }
        document.setStatus(LegalDocumentStatus.SIGNED);
        document.setUserSocieteId(request.getUserSocieteId());
        document.setSignerName(request.getSignerName());
        document.setSignerRole(request.getSignerRole());
        document.setSignerBce(request.getSignerBce());
        document.setSignerEmail(request.getSignerEmail());
        document.setSignatureProvider(request.getSignatureProvider());
        document.setSignedIp(request.getSignedIp());
        document.setSignedAt(Instant.now());
        // placeholder: hash/pdf generation can be set here when available
        return repository.save(document);
    }

    @Transactional
    public LegalDocument lock(UUID id) {
        LegalDocument document = findOrThrow(id);
        if (document.getStatus() != LegalDocumentStatus.SIGNED) {
            throw new ConflictException("Transition invalide : seul un document SIGNED peut être verrouillé");
        }
        document.setStatus(LegalDocumentStatus.LOCKED);
        document.setLockedAt(Instant.now());
        return repository.save(document);
    }

    @Transactional
    public LegalDocument revoke(UUID id) {
        LegalDocument document = findOrThrow(id);
        document.setStatus(LegalDocumentStatus.REVOKED);
        return repository.save(document);
    }

    private LegalDocument findOrThrow(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document non trouvé"));
    }

    private void ensureMutable(LegalDocument document) {
        if (IMMUTABLE_STATUSES.contains(document.getStatus())) {
            throw new ConflictException("Modification interdite : document signé ou verrouillé");
        }
    }
}
