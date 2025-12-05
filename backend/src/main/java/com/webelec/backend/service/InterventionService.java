package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.repository.InterventionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionService {

    private final InterventionRepository repository;

    public InterventionService(InterventionRepository repository) {
        this.repository = repository;
    }

    public List<Intervention> findAll() {
        return repository.findAll();
    }

    public List<Intervention> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public List<Intervention> findByChantier(Long chantierId) {
        return repository.findByChantierId(chantierId);
    }

    public Optional<Intervention> findById(Long id) {
        return repository.findById(id);
    }

    public Intervention create(Intervention intervention) {
        return repository.save(intervention);
    }

    public Intervention update(Long id, Intervention payload) {
        Intervention existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention non trouvée"));

        existing.setTitre(payload.getTitre());
        existing.setDescription(payload.getDescription());
        existing.setDateIntervention(payload.getDateIntervention());
        existing.setSociete(payload.getSociete());
        existing.setChantier(payload.getChantier());
        existing.setClient(payload.getClient());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Intervention non trouvée");
        }
        repository.deleteById(id);
    }
}