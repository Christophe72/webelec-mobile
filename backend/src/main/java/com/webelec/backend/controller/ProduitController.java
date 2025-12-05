package com.webelec.backend.controller;

import com.webelec.backend.dto.ProduitRequest;
import com.webelec.backend.dto.ProduitResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Produit;
import com.webelec.backend.service.ProduitService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    private final ProduitService service;

    public ProduitController(ProduitService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProduitResponse> getAll() {
        return service.findAll().stream().map(ProduitResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<ProduitResponse> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId).stream().map(ProduitResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ProduitResponse getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ProduitResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
    }

    @PostMapping
    public ProduitResponse create(@Valid @RequestBody ProduitRequest request) {
        var created = service.create(request.toEntity());
        return ProduitResponse.from(created);
    }

    @PutMapping("/{id}")
    public ProduitResponse update(@PathVariable Long id, @Valid @RequestBody ProduitRequest request) {
        var updated = service.update(id, request.toEntity());
        return ProduitResponse.from(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}