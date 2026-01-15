package com.webelec.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.webelec.backend.dto.CalculHistoryCreateDTO;
import com.webelec.backend.dto.CalculHistoryDTO;
import com.webelec.backend.dto.CalculateurPreferencesDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.CalculateurService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calculateur")
@CrossOrigin(origins = "*")
public class CalculateurController {

    private final CalculateurService service;

    public CalculateurController(CalculateurService service) {
        this.service = service;
    }

    // ============================================================================
    // Endpoints pour l'historique des calculs
    // ============================================================================

    @GetMapping("/history")
    public List<CalculHistoryDTO> getHistory(
            @RequestParam(required = false) Long chantierId,
            @RequestParam(required = false) String type
    ) {
        return service.getHistory(chantierId, type)
                .stream()
                .map(CalculHistoryDTO::from)
                .toList();
    }

    @PostMapping("/history")
    public CalculHistoryDTO saveHistory(@Valid @RequestBody CalculHistoryCreateDTO request) {
        return CalculHistoryDTO.from(service.saveHistory(request));
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        try {
            service.deleteHistory(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }

    // ============================================================================
    // Endpoints pour les préférences utilisateur
    // ============================================================================

    @GetMapping("/preferences")
    public ResponseEntity<CalculateurPreferencesDTO> getPreferences() {
        JsonNode preferences = service.getPreferences();
        if (preferences == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(new CalculateurPreferencesDTO(preferences));
    }

    @PutMapping("/preferences")
    public ResponseEntity<CalculateurPreferencesDTO> updatePreferences(
            @RequestBody CalculateurPreferencesDTO request
    ) {
        JsonNode updated = service.updatePreferences(request.getPreferences());
        return ResponseEntity.ok(new CalculateurPreferencesDTO(updated));
    }
}
