package com.webelec.backend.controller;

import com.webelec.backend.dto.SocieteRequest;
import com.webelec.backend.dto.SocieteResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.backend.security.SocieteSecurityService;
import com.webelec.backend.service.SocieteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/societes")
public class SocieteController {

    private final SocieteService service;
    private final SocieteSecurityService securityService;

    public SocieteController(SocieteService service, SocieteSecurityService securityService) {
        this.service = service;
        this.securityService = securityService;
    }

    /**
     * Liste les sociétés auxquelles l'utilisateur appartient.
     * Un ADMIN voit toutes les sociétés, les autres uniquement les leurs.
     */
    @GetMapping
    public List<SocieteResponse> getAll(@AuthenticationPrincipal AuthenticatedUtilisateur principal) {
        if (securityService.isAdmin()) {
            // Les admins peuvent voir toutes les sociétés
            return service.findAll().stream()
                    .map(SocieteResponse::from)
                    .toList();
        }
        // Les autres utilisateurs ne voient que leurs sociétés
        return principal.getUtilisateur().getSocietes().stream()
                .map(usr -> usr.getSociete())
                .filter(s -> s != null)
                .map(SocieteResponse::from)
                .toList();
    }

    /**
     * Récupère une société par ID.
     * L'utilisateur doit appartenir à la société ou être ADMIN.
     */
    @GetMapping("/{id}")
    @PreAuthorize("@societeSecurityService.belongsToSociete(#id) or @societeSecurityService.isAdmin()")
    public SocieteResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(SocieteResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Societe non trouvée"));
    }

    /**
     * Crée une nouvelle société.
     * Seuls les ADMIN peuvent créer des sociétés.
     */
    @PostMapping
    @PreAuthorize("@societeSecurityService.isAdmin()")
    public ResponseEntity<?> create(@Valid @RequestBody SocieteRequest request) {
        try {
            var created = service.create(request.toEntity());
            return ResponseEntity.ok(SocieteResponse.from(created));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    /**
     * Met à jour une société existante.
     * L'utilisateur doit être ADMIN ou GERANT de la société.
     */
    @PutMapping("/{id}")
    @PreAuthorize("@societeSecurityService.isAdminOrGerantInSociete(#id)")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody SocieteRequest request) {
        try {
            var updated = service.update(id, request.toEntity());
            return ResponseEntity.ok(SocieteResponse.from(updated));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    /**
     * Supprime une société.
     * Seuls les ADMIN peuvent supprimer des sociétés.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("@societeSecurityService.isAdmin()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
