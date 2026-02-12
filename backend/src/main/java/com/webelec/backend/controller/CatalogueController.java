package com.webelec.backend.controller;

import com.webelec.backend.dto.ProduitResponse;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.service.ProduitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalogue")
public class CatalogueController {

    private final ProduitService produitService;

    public CatalogueController(ProduitService produitService) {
        this.produitService = produitService;
    }

    @GetMapping
    public List<ProduitResponse> getAll() {
        return produitService.findAll().stream().map(ProduitResponse::from).toList();
    }

    @GetMapping("/societe/{societeId}")
    public List<ProduitResponse> getBySociete(@PathVariable Long societeId) {
        return produitService.findBySociete(societeId).stream().map(ProduitResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ProduitResponse getById(@PathVariable Long id) {
        return produitService.findById(id)
                .map(ProduitResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
    }
}
