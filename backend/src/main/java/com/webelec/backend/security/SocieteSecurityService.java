package com.webelec.backend.security;

import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service de sécurité pour vérifier l'accès aux sociétés.
 * Vérifie l'appartenance de l'utilisateur courant à une société et son rôle.
 */
@Service("societeSecurityService")
public class SocieteSecurityService {

    /**
     * Vérifie si l'utilisateur courant appartient à la société donnée.
     */
    public boolean belongsToSociete(Long societeId) {
        Utilisateur utilisateur = getCurrentUtilisateur();
        if (utilisateur == null) {
            return false;
        }
        return utilisateur.getSocietes().stream()
                .anyMatch(usr -> usr.getSociete() != null && 
                         usr.getSociete().getId().equals(societeId));
    }

    /**
     * Vérifie si l'utilisateur courant a un rôle spécifique dans la société donnée.
     */
    public boolean hasRoleInSociete(Long societeId, UtilisateurRole requiredRole) {
        Utilisateur utilisateur = getCurrentUtilisateur();
        if (utilisateur == null) {
            return false;
        }
        return utilisateur.getSocietes().stream()
                .anyMatch(usr -> usr.getSociete() != null && 
                         usr.getSociete().getId().equals(societeId) &&
                         usr.getRole() == requiredRole);
    }

    /**
     * Vérifie si l'utilisateur courant est ADMIN ou GERANT dans la société donnée.
     */
    public boolean isAdminOrGerantInSociete(Long societeId) {
        Utilisateur utilisateur = getCurrentUtilisateur();
        if (utilisateur == null) {
            return false;
        }
        return utilisateur.getSocietes().stream()
                .anyMatch(usr -> usr.getSociete() != null && 
                         usr.getSociete().getId().equals(societeId) &&
                         (usr.getRole() == UtilisateurRole.ADMIN || 
                          usr.getRole() == UtilisateurRole.GERANT));
    }

    /**
     * Vérifie si l'utilisateur courant est ADMIN dans au moins une société.
     */
    public boolean isAdmin() {
        Utilisateur utilisateur = getCurrentUtilisateur();
        if (utilisateur == null) {
            return false;
        }
        return utilisateur.getSocietes().stream()
                .anyMatch(usr -> usr.getRole() == UtilisateurRole.ADMIN);
    }

    /**
     * Récupère le rôle de l'utilisateur dans une société donnée.
     */
    public Optional<UtilisateurRole> getRoleInSociete(Long societeId) {
        Utilisateur utilisateur = getCurrentUtilisateur();
        if (utilisateur == null) {
            return Optional.empty();
        }
        return utilisateur.getSocietes().stream()
                .filter(usr -> usr.getSociete() != null && 
                        usr.getSociete().getId().equals(societeId))
                .map(UserSocieteRole::getRole)
                .findFirst();
    }

    /**
     * Récupère l'utilisateur courant depuis le contexte de sécurité.
     */
    public Utilisateur getCurrentUtilisateur() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof AuthenticatedUtilisateur) {
            return ((AuthenticatedUtilisateur) principal).getUtilisateur();
        }
        return null;
    }
}
