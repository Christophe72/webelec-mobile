package com.webelec.backend.service;

import com.webelec.backend.dto.LegalDocumentReadyRequest;
import com.webelec.backend.dto.LegalDocumentSignRequest;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.LegalDocument;
import com.webelec.backend.model.LegalDocumentStatus;
import com.webelec.backend.repository.LegalDocumentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class LegalDocumentServiceTest {

    @Mock
    private LegalDocumentRepository repository;

    @InjectMocks
    private LegalDocumentService service;

    @Test
    void ready_passes_from_draft() {
        UUID id = UUID.randomUUID();
        UUID userSocieteId = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.DRAFT);

        when(repository.findById(id)).thenReturn(Optional.of(document));
        when(repository.save(any(LegalDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LegalDocumentReadyRequest request = new LegalDocumentReadyRequest();
        request.setUserSocieteId(userSocieteId);

        LegalDocument updated = service.ready(id, request);

        assertEquals(LegalDocumentStatus.READY, updated.getStatus());
        assertEquals(userSocieteId, updated.getUserSocieteId());
    }

    @Test
    void ready_rejects_non_draft() {
        UUID id = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.READY);
        when(repository.findById(id)).thenReturn(Optional.of(document));

        LegalDocumentReadyRequest request = new LegalDocumentReadyRequest();
        request.setUserSocieteId(UUID.randomUUID());

        assertThrows(ConflictException.class, () -> service.ready(id, request));
    }

    @Test
    void ready_rejects_when_signed_or_locked() {
        UUID id = UUID.randomUUID();
        LegalDocument signed = documentWithStatus(id, LegalDocumentStatus.SIGNED);
        when(repository.findById(id)).thenReturn(Optional.of(signed));

        LegalDocumentReadyRequest request = new LegalDocumentReadyRequest();
        request.setUserSocieteId(UUID.randomUUID());

        assertThrows(ConflictException.class, () -> service.ready(id, request));
    }

    @Test
    void sign_passes_from_ready_and_sets_signature_fields() {
        UUID id = UUID.randomUUID();
        UUID userSocieteId = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.READY);
        when(repository.findById(id)).thenReturn(Optional.of(document));
        when(repository.save(any(LegalDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LegalDocumentSignRequest request = new LegalDocumentSignRequest();
        request.setUserSocieteId(userSocieteId);
        request.setSignerName("John Doe");
        request.setSignerRole("Technicien");
        request.setSignerBce("0123.456.789");
        request.setSignerEmail("john.doe@example.com");
        request.setSignatureProvider("TestProvider");
        request.setSignedIp("127.0.0.1");

        LegalDocument updated = service.sign(id, request);

        assertEquals(LegalDocumentStatus.SIGNED, updated.getStatus());
        assertEquals(userSocieteId, updated.getUserSocieteId());
        assertEquals("John Doe", updated.getSignerName());
        assertEquals("Technicien", updated.getSignerRole());
        assertEquals("0123.456.789", updated.getSignerBce());
        assertEquals("john.doe@example.com", updated.getSignerEmail());
        assertEquals("TestProvider", updated.getSignatureProvider());
        assertEquals("127.0.0.1", updated.getSignedIp());
        assertNotNull(updated.getSignedAt());
    }

    @Test
    void sign_rejects_invalid_status() {
        UUID id = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.DRAFT);
        when(repository.findById(id)).thenReturn(Optional.of(document));

        LegalDocumentSignRequest request = new LegalDocumentSignRequest();
        request.setUserSocieteId(UUID.randomUUID());
        request.setSignerName("John Doe");

        assertThrows(ConflictException.class, () -> service.sign(id, request));
    }

    @Test
    void lock_passes_from_signed_and_sets_locked_at() {
        UUID id = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.SIGNED);
        when(repository.findById(id)).thenReturn(Optional.of(document));
        when(repository.save(any(LegalDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LegalDocument updated = service.lock(id);

        assertEquals(LegalDocumentStatus.LOCKED, updated.getStatus());
        assertNotNull(updated.getLockedAt());
    }

    @Test
    void lock_rejects_invalid_status() {
        UUID id = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.READY);
        when(repository.findById(id)).thenReturn(Optional.of(document));

        assertThrows(ConflictException.class, () -> service.lock(id));
    }

    @Test
    void revoke_sets_revoked_status() {
        UUID id = UUID.randomUUID();
        LegalDocument document = documentWithStatus(id, LegalDocumentStatus.READY);
        when(repository.findById(id)).thenReturn(Optional.of(document));
        when(repository.save(any(LegalDocument.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LegalDocument updated = service.revoke(id);

        assertEquals(LegalDocumentStatus.REVOKED, updated.getStatus());
    }

    @Test
    void throws_not_found_when_missing_document() {
        UUID id = UUID.randomUUID();
        when(repository.findById(id)).thenReturn(Optional.empty());

        LegalDocumentReadyRequest request = new LegalDocumentReadyRequest();
        request.setUserSocieteId(UUID.randomUUID());

        assertThrows(ResourceNotFoundException.class, () -> service.ready(id, request));
    }

    private LegalDocument documentWithStatus(UUID id, LegalDocumentStatus status) {
        LegalDocument document = new LegalDocument();
        document.setId(id);
        document.setStatus(status);
        document.setCreatedAt(Instant.now());
        document.setUpdatedAt(Instant.now());
        return document;
    }
}
