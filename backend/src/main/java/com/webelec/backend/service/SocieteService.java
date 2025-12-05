package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.SocieteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SocieteService {

    private final SocieteRepository repository;

    public SocieteService(SocieteRepository repository) {
        this.repository = repository;
    }

    public List<Societe> findAll() {
        return repository.findAll();
    }

    public Optional<Societe> findById(Long id) {
        return repository.findById(id);
    }

    public Societe create(Societe societe) {
        if (repository.findByEmail(societe.getEmail()) != null) {
            throw new IllegalStateException("Email déjà utilisé");
        }
        return repository.save(societe);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Societe non trouvée");
        }
        repository.deleteById(id);
    }
}