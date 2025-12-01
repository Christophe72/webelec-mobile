package com.webelec.backend.controller;

import com.webelec.backend.model.Produit;
import com.webelec.backend.service.ProduitService;
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
    public List<Produit> getAll() {
        return service.findAll();
    }

    @GetMapping("/societe/{societeId}")
    public List<Produit> getBySociete(@PathVariable Long societeId) {
        return service.findBySociete(societeId);
    }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) {
        return service.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
    }

    @PostMapping
    public Produit create(@RequestBody Produit produit) {
        return service.create(produit);
    }

    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit produit) {
        return service.update(id, produit);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
