package com.webelec.backend.controller;

import com.webelec.backend.dto.ProduitAvanceRequest;
import com.webelec.backend.dto.ProduitAvanceResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.ProduitAvance;
import com.webelec.backend.service.ProduitAvanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits-avances")
public class ProduitAvanceController {

    private final ProduitAvanceService service;

    public ProduitAvanceController(ProduitAvanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProduitAvanceResponse> getAll() {
        return service.findAll().stream().map(ProduitAvanceResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<ProduitAvanceResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(ProduitAvanceResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ProduitAvanceResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ProduitAvanceResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Produit avancé non trouvé"));
    }

    @PostMapping
    public ProduitAvanceResponse create(@Valid @RequestBody ProduitAvanceRequest request) {
        var created = service.create(request.toEntity());
        return ProduitAvanceResponse.from(created);
    }

    @PutMapping("/{id}")
    public ProduitAvanceResponse update(@PathVariable Long id, @Valid @RequestBody ProduitAvanceRequest request) {
        var updated = service.update(id, request.toEntity());
        return ProduitAvanceResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}