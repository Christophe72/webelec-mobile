package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Devis;
import com.webelec.backend.repository.DevisRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DevisService {

    private final DevisRepository repository;

    public DevisService(DevisRepository repository) {
        this.repository = repository;
    }

    public List<Devis> findAll() {
        return repository.findAll();
    }

    public List<Devis> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public List<Devis> findByClient(Long clientId) {
        return repository.findByClientId(clientId);
    }

    public Optional<Devis> findById(Long id) {
        return repository.findById(id);
    }

    public Devis create(Devis devis) {
        if (repository.findByNumero(devis.getNumero()) != null) {
            throw new IllegalStateException("Numéro de devis déjà utilisé");
        }
        return repository.save(devis);
    }

    public Devis update(Long id, Devis payload) {
        Devis existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Devis non trouvé"));

        existing.setNumero(payload.getNumero());
        existing.setDateEmission(payload.getDateEmission());
        existing.setDateExpiration(payload.getDateExpiration());
        existing.setMontantHT(payload.getMontantHT());
        existing.setMontantTVA(payload.getMontantTVA());
        existing.setMontantTTC(payload.getMontantTTC());
        existing.setStatut(payload.getStatut());
        existing.setSociete(payload.getSociete());
        existing.setClient(payload.getClient());
        existing.setLignes(payload.getLignes());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Devis non trouvé");
        }
        repository.deleteById(id);
    }
}