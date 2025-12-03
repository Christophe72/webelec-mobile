package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;

    public UtilisateurService(UtilisateurRepository repository) {
        this.repository = repository;
    }

    public List<Utilisateur> findAll() {
        return repository.findAll();
    }

    public Optional<Utilisateur> findById(Long id) {
        return repository.findById(id);
    }

    public List<Utilisateur> findBySociete(Long societeId) {
        return repository.findBySocieteId(societeId);
    }

    public Utilisateur create(Utilisateur utilisateur) {
        return repository.save(utilisateur);
    }

    public Utilisateur update(Long id, Utilisateur utilisateur) {
        Utilisateur existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        existing.setNom(utilisateur.getNom());
        existing.setPrenom(utilisateur.getPrenom());
        existing.setEmail(utilisateur.getEmail());
        existing.setMotDePasse(utilisateur.getMotDePasse());
        existing.setRole(utilisateur.getRole());
        existing.setSociete(utilisateur.getSociete());
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        repository.deleteById(id);
    }
}
