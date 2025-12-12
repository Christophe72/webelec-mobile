package com.webelec.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pieces_justificatives")
public class PieceJustificative {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String filename;

    @Column(nullable = false, length = 255)
    private String originalFilename;

    @Column(nullable = false, length = 100)
    private String contentType;

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 50)
    private String type; // PHOTO, PDF, TICKET, etc.

    @Column(nullable = false, length = 500)
    private String filePath;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "intervention_id")
    private Intervention intervention;

    @ManyToOne
    @JoinColumn(name = "devis_id")
    private Devis devis;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facture;

    public PieceJustificative() {
        this.uploadDate = LocalDateTime.now();
    }

    public PieceJustificative(Long id, String filename, String originalFilename, String contentType,
                              Long fileSize, String type, String filePath, LocalDateTime uploadDate,
                              Intervention intervention, Devis devis, Facture facture) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.type = type;
        this.filePath = filePath;
        this.uploadDate = uploadDate != null ? uploadDate : LocalDateTime.now();
        this.intervention = intervention;
        this.devis = devis;
        this.facture = facture;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Intervention getIntervention() {
        return intervention;
    }

    public void setIntervention(Intervention intervention) {
        this.intervention = intervention;
    }

    public Devis getDevis() {
        return devis;
    }

    public void setDevis(Devis devis) {
        this.devis = devis;
    }

    public Facture getFacture() {
        return facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

    public static final class Builder {
        private Long id;
        private String filename;
        private String originalFilename;
        private String contentType;
        private Long fileSize;
        private String type;
        private String filePath;
        private LocalDateTime uploadDate;
        private Intervention intervention;
        private Devis devis;
        private Facture facture;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder filename(String filename) {
            this.filename = filename;
            return this;
        }

        public Builder originalFilename(String originalFilename) {
            this.originalFilename = originalFilename;
            return this;
        }

        public Builder contentType(String contentType) {
            this.contentType = contentType;
            return this;
        }

        public Builder fileSize(Long fileSize) {
            this.fileSize = fileSize;
            return this;
        }

        public Builder type(String type) {
            this.type = type;
            return this;
        }

        public Builder filePath(String filePath) {
            this.filePath = filePath;
            return this;
        }

        public Builder uploadDate(LocalDateTime uploadDate) {
            this.uploadDate = uploadDate;
            return this;
        }

        public Builder intervention(Intervention intervention) {
            this.intervention = intervention;
            return this;
        }

        public Builder devis(Devis devis) {
            this.devis = devis;
            return this;
        }

        public Builder facture(Facture facture) {
            this.facture = facture;
            return this;
        }

        public PieceJustificative build() {
            return new PieceJustificative(id, filename, originalFilename, contentType, fileSize,
                    type, filePath, uploadDate, intervention, devis, facture);
        }
    }
}
