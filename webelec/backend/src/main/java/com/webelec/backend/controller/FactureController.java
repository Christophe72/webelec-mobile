package com.webelec.backend.controller;

import com.webelec.backend.dto.FactureRequest;
import com.webelec.backend.dto.FactureResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Facture;
import com.webelec.backend.service.FactureService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureService service;

    public FactureController(FactureService service) {
        this.service = service;
    }

    @GetMapping
    public List<FactureResponse> getAll() {
        return service.findAll().stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<FactureResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/client/{clientId}")
    public List<FactureResponse> getByClient(@PathVariable Long clientId) {
        return service.findByClient(clientId).stream().map(FactureResponse::from).toList();
    }

    @GetMapping("/{id}")
    public FactureResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(FactureResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));
    }

    @PostMapping
    public FactureResponse create(@Valid @RequestBody FactureRequest request) {
        var created = service.create(request.toEntity());
        return FactureResponse.from(created);
    }

    @PutMapping("/{id}")
    public FactureResponse update(@PathVariable Long id, @Valid @RequestBody FactureRequest request) {
        var updated = service.update(id, request.toEntity());
        return FactureResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}