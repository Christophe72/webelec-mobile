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

    public Societe update(Long id, Societe societe) {
        Societe existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Societe non trouvée"));

        // Vérifie l'unicité de l'email (hors société courante)
        Societe byEmail = repository.findByEmail(societe.getEmail());
        if (byEmail != null && !byEmail.getId().equals(id)) {
            throw new IllegalStateException("Email déjà utilisé");
        }

        existing.setNom(societe.getNom());
        existing.setTva(societe.getTva());
        existing.setEmail(societe.getEmail());
        existing.setTelephone(societe.getTelephone());
        existing.setAdresse(societe.getAdresse());

        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Societe non trouvée");
        }
        repository.deleteById(id);
    }
}
