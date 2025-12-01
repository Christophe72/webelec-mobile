package com.webelec.backend.service;

import com.webelec.backend.model.Produit;
import com.webelec.backend.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProduitService {

    private final ProduitRepository repository;

    public ProduitService(ProduitRepository repository) {
        this.repository = repository;
    }

    public List<Produit> findAll() {
        return repository.findAll();
    }

    public List<Produit> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public Optional<Produit> findById(Long id) {
        return repository.findById(id);
    }

    public Produit create(Produit produit) {
        return repository.save(produit);
    }

    public Produit update(Long id, Produit produit) {
        Objects.requireNonNull(produit, "Produit invalide");
        Produit existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produit non trouvé"));
        existing.setReference(produit.getReference());
        existing.setNom(produit.getNom());
        existing.setDescription(produit.getDescription());
        existing.setQuantiteStock(produit.getQuantiteStock());
        existing.setPrixUnitaire(produit.getPrixUnitaire());
        existing.setSociete(produit.getSociete());
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}