package com.webelec.backend.controller;

import com.webelec.backend.dto.ChantierRequest;
import com.webelec.backend.dto.ChantierResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.ChantierService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/chantiers")
@CrossOrigin(origins = "*")
public class ChantierController {

    private final ChantierService service;

    public ChantierController(ChantierService service) {
        this.service = service;
    }

    @GetMapping
    public List<ChantierResponse> getAll() {
        return service.findAll().stream().map(ChantierResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<ChantierResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(ChantierResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ChantierResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ChantierResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Chantier non trouvé"));
    }

    @PostMapping
    public ChantierResponse create(@Valid @RequestBody ChantierRequest request) {
        var created = service.create(request.toEntity());
        return ChantierResponse.from(created);
    }

    @PutMapping("/{id}")
    public ChantierResponse update(@PathVariable Long id, @Valid @RequestBody ChantierRequest request) {
        var updated = service.update(id, request.toEntity());
        return ChantierResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}