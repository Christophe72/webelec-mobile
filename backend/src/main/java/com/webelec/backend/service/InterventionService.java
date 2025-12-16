package com.webelec.backend.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.repository.InterventionRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionService {

    private final InterventionRepository repository;
    private final UserSocieteRoleRepository userSocieteRoleRepository;

    public InterventionService(InterventionRepository repository, UserSocieteRoleRepository userSocieteRoleRepository) {
        this.repository = repository;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
    }

    public List<Intervention> findAll() {
        return repository.findAll();
    }

    private void checkAppartenanceSociete(Long societeId) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthenticatedUtilisateur utilisateur)) {
            throw new SecurityException("Utilisateur non authentifié");
        }
        Long userId = utilisateur.getUtilisateur().getId();
        boolean autorise = userSocieteRoleRepository.findByUtilisateurId(userId)
                .stream().anyMatch(link -> link.getSociete().getId().equals(societeId));
        if (!autorise) {
            throw new SecurityException("Accès interdit à cette société");
        }
    }

    public List<Intervention> findBySociete(Long societeId) {
        checkAppartenanceSociete(societeId);
        return repository.findBySocieteId(societeId);
    }

    public List<Intervention> findByChantier(Long chantierId) {
        return repository.findByChantierId(chantierId);
    }

    public Optional<Intervention> findById(Long id) {
        return repository.findById(id);
    }

    public Intervention create(Intervention intervention) {
        checkAppartenanceSociete(intervention.getSociete().getId());
        return repository.save(intervention);
    }

    public Intervention update(Long id, Intervention payload) {
        Intervention existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention non trouvée"));
        checkAppartenanceSociete(existing.getSociete().getId());

        existing.setTitre(payload.getTitre());
        existing.setDescription(payload.getDescription());
        existing.setDateIntervention(payload.getDateIntervention());
        existing.setSociete(payload.getSociete());
        existing.setChantier(payload.getChantier());
        existing.setClient(payload.getClient());
        return repository.save(existing);
    }

    public void delete(Long id) {
        Intervention existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Intervention non trouvée"));
        checkAppartenanceSociete(existing.getSociete().getId());
        repository.deleteById(id);
    }
}