package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Facture;
import com.webelec.backend.repository.FactureRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FactureService {

    private final FactureRepository repository;

    public FactureService(FactureRepository repository) {
        this.repository = repository;
    }

    public List<Facture> findAll() {
        return repository.findAll();
    }

    public List<Facture> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public List<Facture> findByClient(Long clientId) {
        return repository.findByClientId(clientId);
    }

    public List<Facture> findBySocieteAndClient(Long societeId, Long clientId) {
        return repository.findBySocieteIdAndClientId(societeId, clientId);
    }

    public Optional<Facture> findById(Long id) {
        return repository.findById(id);
    }

    public Facture create(Facture facture) {
        return repository.save(facture);
    }

    public Facture update(Long id, Facture payload) {
        Facture existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvée"));

        existing.setNumero(payload.getNumero());
        existing.setDateEmission(payload.getDateEmission());
        existing.setDateEcheance(payload.getDateEcheance());
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
            throw new ResourceNotFoundException("Facture non trouvée");
        }
        repository.deleteById(id);
    }
}
