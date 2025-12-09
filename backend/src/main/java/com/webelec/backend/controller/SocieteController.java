package com.webelec.backend.controller;

import com.webelec.backend.dto.SocieteRequest;
import com.webelec.backend.dto.SocieteResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.service.SocieteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/societes")
@CrossOrigin(origins = "*")
public class SocieteController {

    private final SocieteService service;

    public SocieteController(SocieteService service) {
        this.service = service;
    }

    @GetMapping
    public List<SocieteResponse> getAll() {
        return service.findAll().stream()
                .map(SocieteResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public SocieteResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(SocieteResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Societe non trouvée"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SocieteRequest request) {
        try {
            var created = service.create(request.toEntity());
            return ResponseEntity.ok(SocieteResponse.from(created));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
