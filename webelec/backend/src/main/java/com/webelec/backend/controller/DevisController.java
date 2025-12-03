package com.webelec.backend.controller;

import com.webelec.backend.dto.DevisRequest;
import com.webelec.backend.dto.DevisResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Devis;
import com.webelec.backend.service.DevisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devis")
@CrossOrigin(origins = "*")
public class DevisController {

    private final DevisService service;

    public DevisController(DevisService service) {
        this.service = service;
    }

    @GetMapping
    public List<DevisResponse> getAll() {
        return service.findAll().stream().map(DevisResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<DevisResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(DevisResponse::from).toList();
    }

    @GetMapping("/client/{clientId}")
    public List<DevisResponse> getByClient(@PathVariable Long clientId) {
        return service.findByClient(clientId).stream().map(DevisResponse::from).toList();
    }

    @GetMapping("/{id}")
    public DevisResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(DevisResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Devis non trouvé"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody DevisRequest request) {
        try {
            var created = service.create(request.toEntity());
            return ResponseEntity.ok(DevisResponse.from(created));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public DevisResponse update(@PathVariable Long id, @Valid @RequestBody DevisRequest request) {
        var updated = service.update(id, request.toEntity());
        return DevisResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}