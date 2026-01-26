package com.webelec.backend.dto;

import java.time.LocalDate;

public class RgieHabilitationDTO {

    private Long id;
    private String label;
    private String certificateNumber;
    private String authorityLevel;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private RgieHabilitationStatus status;

    public RgieHabilitationDTO() {
    }

    public RgieHabilitationDTO(Long id, String label, String certificateNumber, String authorityLevel,
                               LocalDate validFrom, LocalDate validUntil, RgieHabilitationStatus status) {
        this.id = id;
        this.label = label;
        this.certificateNumber = certificateNumber;
        this.authorityLevel = authorityLevel;
        this.validFrom = validFrom;
        this.validUntil = validUntil;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public String getAuthorityLevel() {
        return authorityLevel;
    }

    public void setAuthorityLevel(String authorityLevel) {
        this.authorityLevel = authorityLevel;
    }

    public LocalDate getValidFrom() {
        return validFrom;
    }

    public void setValidFrom(LocalDate validFrom) {
        this.validFrom = validFrom;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(LocalDate validUntil) {
        this.validUntil = validUntil;
    }

    public RgieHabilitationStatus getStatus() {
        return status;
    }

    public void setStatus(RgieHabilitationStatus status) {
        this.status = status;
    }
}
