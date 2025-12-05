package com.webelec.backend.controller;

import com.webelec.backend.dto.InterventionRequest;
import com.webelec.backend.dto.InterventionResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.InterventionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "*")
public class InterventionController {

    private final InterventionService service;

    public InterventionController(InterventionService service) {
        this.service = service;
    }

    @GetMapping
    public List<InterventionResponse> getAll() {
        return service.findAll().stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<InterventionResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/chantier/{chantierId}")
    public List<InterventionResponse> getByChantier(@PathVariable Long chantierId) {
        return service.findByChantier(chantierId).stream().map(InterventionResponse::from).toList();
    }

    @GetMapping("/{id}")
    public InterventionResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(InterventionResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention non trouvée"));
    }

    @PostMapping
    public ResponseEntity<InterventionResponse> create(@Valid @RequestBody InterventionRequest request) {
        var created = service.create(request.toEntity());
        return ResponseEntity.ok(InterventionResponse.from(created));
    }

    @PutMapping("/{id}")
    public InterventionResponse update(@PathVariable Long id, @Valid @RequestBody InterventionRequest request) {
        var updated = service.update(id, request.toEntity());
        return InterventionResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}