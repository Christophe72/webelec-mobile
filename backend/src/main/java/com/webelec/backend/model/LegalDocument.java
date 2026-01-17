package com.webelec.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "legal_documents")
public class LegalDocument {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private LegalDocumentType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private LegalDocumentStatus status;

    @Column(name = "title", nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "pdf_url", columnDefinition = "TEXT")
    private String pdfUrl;

    @Column(name = "document_hash", columnDefinition = "TEXT")
    private String documentHash;

    @Column(name = "signer_name", length = 255)
    private String signerName;

    @Column(name = "signer_role", length = 255)
    private String signerRole;

    @Column(name = "signer_bce", length = 255)
    private String signerBce;

    @Column(name = "signer_email", length = 255)
    private String signerEmail;

    @Column(name = "signature_provider", length = 255)
    private String signatureProvider;

    @Column(name = "signed_at")
    private Instant signedAt;

    @Column(name = "signed_ip", length = 255)
    private String signedIp;

    @Column(name = "audit_trail_url", columnDefinition = "TEXT")
    private String auditTrailUrl;

    @Column(name = "user_societe_id", nullable = false)
    private UUID userSocieteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_societe_id", referencedColumnName = "id", insertable = false, updatable = false)
    private UserSocieteRole userSociete;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chantier_id")
    private Chantier chantier;

    @Column(name = "exam_id")
    private Long examId;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Column(name = "locked_at")
    private Instant lockedAt;

    public LegalDocument() {
    }

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = LegalDocumentStatus.DRAFT;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LegalDocumentType getType() {
        return type;
    }

    public void setType(LegalDocumentType type) {
        this.type = type;
    }

    public LegalDocumentStatus getStatus() {
        return status;
    }

    public void setStatus(LegalDocumentStatus status) {
        this.status = status;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getPdfUrl() {
        return pdfUrl;
    }

    public void setPdfUrl(String pdfUrl) {
        this.pdfUrl = pdfUrl;
    }

    public String getDocumentHash() {
        return documentHash;
    }

    public void setDocumentHash(String documentHash) {
        this.documentHash = documentHash;
    }

    public String getSignerName() {
        return signerName;
    }

    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }

    public String getSignerRole() {
        return signerRole;
    }

    public void setSignerRole(String signerRole) {
        this.signerRole = signerRole;
    }

    public String getSignerBce() {
        return signerBce;
    }

    public void setSignerBce(String signerBce) {
        this.signerBce = signerBce;
    }

    public String getSignerEmail() {
        return signerEmail;
    }

    public void setSignerEmail(String signerEmail) {
        this.signerEmail = signerEmail;
    }

    public String getSignatureProvider() {
        return signatureProvider;
    }

    public void setSignatureProvider(String signatureProvider) {
        this.signatureProvider = signatureProvider;
    }

    public Instant getSignedAt() {
        return signedAt;
    }

    public void setSignedAt(Instant signedAt) {
        this.signedAt = signedAt;
    }

    public String getSignedIp() {
        return signedIp;
    }

    public void setSignedIp(String signedIp) {
        this.signedIp = signedIp;
    }

    public String getAuditTrailUrl() {
        return auditTrailUrl;
    }

    public void setAuditTrailUrl(String auditTrailUrl) {
        this.auditTrailUrl = auditTrailUrl;
    }

    public UUID getUserSocieteId() {
        return userSocieteId;
    }

    public void setUserSocieteId(UUID userSocieteId) {
        this.userSocieteId = userSocieteId;
    }

    public UserSocieteRole getUserSociete() {
        return userSociete;
    }

    public Chantier getChantier() {
        return chantier;
    }

    public void setChantier(Chantier chantier) {
        this.chantier = chantier;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Instant getLockedAt() {
        return lockedAt;
    }

    public void setLockedAt(Instant lockedAt) {
        this.lockedAt = lockedAt;
    }
}