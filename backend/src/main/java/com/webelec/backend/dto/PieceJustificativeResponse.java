package com.webelec.backend.dto;

import java.time.LocalDateTime;

public class PieceJustificativeResponse {

    private Long id;
    private String filename;
    private String originalFilename;
    private String contentType;
    private Long fileSize;
    private String type;
    private String downloadUrl;
    private LocalDateTime uploadDate;
    private Long interventionId;
    private Long devisId;
    private Long factureId;

    public PieceJustificativeResponse() {
    }

    public PieceJustificativeResponse(Long id, String filename, String originalFilename,
                                      String contentType, Long fileSize, String type,
                                      String downloadUrl, LocalDateTime uploadDate,
                                      Long interventionId, Long devisId, Long factureId) {
        this.id = id;
        this.filename = filename;
        this.originalFilename = originalFilename;
        this.contentType = contentType;
        this.fileSize = fileSize;
        this.type = type;
        this.downloadUrl = downloadUrl;
        this.uploadDate = uploadDate;
        this.interventionId = interventionId;
        this.devisId = devisId;
        this.factureId = factureId;
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

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Long getInterventionId() {
        return interventionId;
    }

    public void setInterventionId(Long interventionId) {
        this.interventionId = interventionId;
    }

    public Long getDevisId() {
        return devisId;
    }

    public void setDevisId(Long devisId) {
        this.devisId = devisId;
    }

    public Long getFactureId() {
        return factureId;
    }

    public void setFactureId(Long factureId) {
        this.factureId = factureId;
    }
}
