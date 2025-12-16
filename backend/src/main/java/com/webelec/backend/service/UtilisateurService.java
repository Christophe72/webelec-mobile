package com.webelec.backend.service;

import com.webelec.backend.dto.UtilisateurRequest;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository repository;
    private final UserSocieteRoleRepository userSocieteRoleRepository;
    private final SocieteRepository societeRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(UtilisateurRepository repository, UserSocieteRoleRepository userSocieteRoleRepository, SocieteRepository societeRepository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
        this.societeRepository = societeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> findAll() {
        return repository.findAll();
    }

    public Optional<Utilisateur> findById(Long id) {
        return repository.findById(id);
    }

    public List<Utilisateur> findBySociete(Long societeId) {
        return userSocieteRoleRepository.findBySocieteId(societeId).stream()
                .map(UserSocieteRole::getUtilisateur)
                .toList();
    }

    @Transactional
    public Utilisateur create(UtilisateurRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new IllegalStateException("Email déjà utilisé");
        }
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        utilisateur = repository.save(utilisateur);

        Societe societe = societeRepository.findById(request.getSocieteId())
                .orElseThrow(() -> new ResourceNotFoundException("Société non trouvée"));
        UtilisateurRole role;
        try {
            role = UtilisateurRole.valueOf(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Rôle utilisateur invalide : " + request.getRole());
        }
        UserSocieteRole link = new UserSocieteRole(utilisateur, societe, role);
        userSocieteRoleRepository.save(link);
        return utilisateur;
    }

    @Transactional
    public Utilisateur update(Long id, UtilisateurRequest request) {
        Utilisateur utilisateur = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        if (request.getMotDePasse() != null) {
            utilisateur.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }
        utilisateur = repository.save(utilisateur);
        Societe societe = societeRepository.findById(request.getSocieteId())
                .orElseThrow(() -> new ResourceNotFoundException("Société non trouvée"));
        UtilisateurRole role;
        try {
            role = UtilisateurRole.valueOf(request.getRole());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Rôle utilisateur invalide : " + request.getRole());
        }
        // Met à jour ou crée la liaison pour cette société
        UserSocieteRole link = userSocieteRoleRepository.findById(new com.webelec.backend.model.UserSocieteRoleId(utilisateur.getId(), societe.getId()))
                .orElse(new UserSocieteRole(utilisateur, societe, role));
        link.setRole(role);
        userSocieteRoleRepository.save(link);
        return utilisateur;
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur non trouvé");
        }
        repository.deleteById(id);
    }
}