package com.webelec.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "societe_selections")
public class SocieteSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur utilisateur;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "societe_id", nullable = false)
    private Societe societe;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UtilisateurRole role;

    @Column(name = "selected_at", nullable = false, updatable = false)
    private Instant selectedAt;

    public SocieteSelection() {
    }

    public SocieteSelection(Utilisateur utilisateur, Societe societe, UtilisateurRole role) {
        this.utilisateur = utilisateur;
        this.societe = societe;
        this.role = role;
    }

    @PrePersist
    void onCreate() {
        if (selectedAt == null) {
            selectedAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Societe getSociete() {
        return societe;
    }

    public void setSociete(Societe societe) {
        this.societe = societe;
    }

    public UtilisateurRole getRole() {
        return role;
    }

    public void setRole(UtilisateurRole role) {
        this.role = role;
    }

    public Instant getSelectedAt() {
        return selectedAt;
    }

    public void setSelectedAt(Instant selectedAt) {
        this.selectedAt = selectedAt;
    }
}
