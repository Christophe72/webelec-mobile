package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Produit;
import com.webelec.backend.repository.ProduitRepository;
import com.webelec.backend.repository.SocieteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ProduitService {

    private final ProduitRepository repository;
    private final SocieteRepository societeRepository;

    public ProduitService(ProduitRepository repository, SocieteRepository societeRepository) {
        this.repository = repository;
        this.societeRepository = societeRepository;
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
        Objects.requireNonNull(produit, "Produit invalide");
        produit.setSociete(resolveSociete(produit));
        return repository.save(produit);
    }

    public Produit update(Long id, Produit produit) {
        Objects.requireNonNull(produit, "Produit invalide");
        Produit existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé"));
        existing.setReference(produit.getReference());
        existing.setNom(produit.getNom());
        existing.setDescription(produit.getDescription());
        existing.setQuantiteStock(produit.getQuantiteStock());
        existing.setPrixUnitaire(produit.getPrixUnitaire());
        existing.setSociete(resolveSociete(produit));
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Produit non trouvé");
        }
        repository.deleteById(id);
    }

    private com.webelec.backend.model.Societe resolveSociete(Produit produit) {
        Long societeId = produit.getSociete() != null ? produit.getSociete().getId() : null;
        if (societeId == null) {
            throw new IllegalArgumentException("La société est obligatoire");
        }
        return societeRepository.findById(societeId)
                .orElseThrow(() -> new ResourceNotFoundException("Société non trouvée"));
    }
}
