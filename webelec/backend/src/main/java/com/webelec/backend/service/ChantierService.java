package com.webelec.backend.service;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.repository.ChantierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChantierService {

    private final ChantierRepository repository;

    public ChantierService(ChantierRepository repository) {
        this.repository = repository;
    }

    public List<Chantier> findAll() {
        return repository.findAll();
    }

    public List<Chantier> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public Optional<Chantier> findById(Long id) {
        return repository.findById(id);
    }

    public Chantier create(Chantier chantier) {
        return repository.save(chantier);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
