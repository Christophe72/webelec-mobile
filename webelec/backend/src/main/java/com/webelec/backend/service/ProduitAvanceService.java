package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.ProduitAvance;
import com.webelec.backend.repository.ProduitAvanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProduitAvanceService {

    private final ProduitAvanceRepository repository;

    public ProduitAvanceService(ProduitAvanceRepository repository) {
        this.repository = repository;
    }

    public List<ProduitAvance> findAll() {
        return repository.findAll();
    }

    public List<ProduitAvance> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public Optional<ProduitAvance> findById(Long id) {
        return repository.findById(id);
    }

    public ProduitAvance create(ProduitAvance produit) {
        return repository.save(produit);
    }

    public ProduitAvance update(Long id, ProduitAvance payload) {
        ProduitAvance existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produit avancé non trouvé"));

        existing.setReference(payload.getReference());
        existing.setNom(payload.getNom());
        existing.setDescription(payload.getDescription());
        existing.setPrixAchat(payload.getPrixAchat());
        existing.setPrixVente(payload.getPrixVente());
        existing.setFournisseur(payload.getFournisseur());
        existing.setSociete(payload.getSociete());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Produit avancé non trouvé");
        }
        repository.deleteById(id);
    }
}