package com.webelec.backend.controller;

import com.webelec.backend.dto.DevisRequest;
import com.webelec.backend.dto.DevisResponse;
import com.webelec.backend.service.DevisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devis")
public class DevisController {

    private final DevisService service;

    public DevisController(DevisService service) {
        this.service = service;
    }

    @GetMapping
    public List<DevisResponse> getAll() {
        return service.findAll().stream()
                .map(DevisResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public DevisResponse getById(@PathVariable Long id) {
        return DevisResponse.from(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<DevisResponse> create(@Valid @RequestBody DevisRequest request) {
        var created = service.create(request);
        return ResponseEntity.ok(DevisResponse.from(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DevisResponse> update(@PathVariable Long id,
                                                @Valid @RequestBody DevisRequest request) {
        var updated = service.update(id, request);
        return ResponseEntity.ok(DevisResponse.from(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}