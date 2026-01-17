package com.webelec.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class LegalDocumentSignRequest {

    @NotNull(message = "L'identifiant userSociete est obligatoire")
    private UUID userSocieteId;

    @NotBlank(message = "Le nom du signataire est obligatoire")
    @Size(max = 255, message = "Le nom du signataire est trop long")
    private String signerName;

    @Size(max = 255, message = "Le rôle du signataire est trop long")
    private String signerRole;

    @Size(max = 255, message = "Le BCE du signataire est trop long")
    private String signerBce;

    @Email(message = "Email du signataire invalide")
    @Size(max = 255, message = "L'email du signataire est trop long")
    private String signerEmail;

    @Size(max = 255, message = "Le fournisseur de signature est trop long")
    private String signatureProvider;

    @Size(max = 255, message = "L'IP de signature est trop longue")
    private String signedIp;

    public UUID getUserSocieteId() {
        return userSocieteId;
    }

    public void setUserSocieteId(UUID userSocieteId) {
        this.userSocieteId = userSocieteId;
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

    public String getSignedIp() {
        return signedIp;
    }

    public void setSignedIp(String signedIp) {
        this.signedIp = signedIp;
    }
}
