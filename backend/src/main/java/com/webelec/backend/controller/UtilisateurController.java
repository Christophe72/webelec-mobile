package com.webelec.backend.controller;

import com.webelec.backend.dto.UtilisateurRequest;
import com.webelec.backend.dto.UtilisateurResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.UtilisateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "*")
public class UtilisateurController {

    private final UtilisateurService service;

    public UtilisateurController(UtilisateurService service) {
        this.service = service;
    }

    @GetMapping
    public List<UtilisateurResponse> getAll() {
        return service.findAll().stream().map(UtilisateurResponse::from).toList();
    }

    @GetMapping("/{id}")
    public UtilisateurResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(UtilisateurResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
    }

    @GetMapping("/societe/{societeId}")
    public List<UtilisateurResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream()
                .map(UtilisateurResponse::from)
                .toList();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@Valid @RequestBody UtilisateurRequest request) {
        try {
            var created = service.create(request.toEntity());
            return ResponseEntity.ok(UtilisateurResponse.from(created));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UtilisateurResponse update(@PathVariable Long id,
                                      @Valid @RequestBody UtilisateurRequest request) {
        var updated = service.update(id, request.toEntity());
        return UtilisateurResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}