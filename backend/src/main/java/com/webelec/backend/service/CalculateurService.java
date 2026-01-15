package com.webelec.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.webelec.backend.dto.CalculHistoryCreateDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.CalculHistory;
import com.webelec.backend.repository.CalculHistoryRepository;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalculateurService {

    private final CalculHistoryRepository repository;
    private final boolean allowAnonymous;

    public CalculateurService(CalculHistoryRepository repository, Environment environment) {
        this.repository = repository;
        this.allowAnonymous = environment.acceptsProfiles(Profiles.of("dev"));
    }

    private Long getCurrentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof AuthenticatedUtilisateur utilisateur)) {
            if (allowAnonymous) {
                return 1L; // User ID par défaut en mode dev
            }
            throw new SecurityException("Utilisateur non authentifié");
        }
        return utilisateur.getUtilisateur().getId();
    }

    public List<CalculHistory> getHistory(Long chantierId, String calculatorType) {
        Long userId = getCurrentUserId();

        if (chantierId != null && calculatorType != null) {
            return repository.findByUserIdAndChantierId(userId, chantierId);
        } else if (chantierId != null) {
            return repository.findByUserIdAndChantierId(userId, chantierId);
        } else if (calculatorType != null) {
            return repository.findByUserIdAndCalculatorType(userId, calculatorType);
        } else {
            return repository.findByUserIdOrderByCreatedAtDesc(userId);
        }
    }

    public CalculHistory saveHistory(CalculHistoryCreateDTO dto) {
        Long userId = getCurrentUserId();

        CalculHistory entity = CalculHistory.builder()
                .userId(userId)
                .chantierId(dto.getChantierId())
                .calculatorType(dto.getCalculatorType())
                .inputs(dto.getInputs())
                .results(dto.getResults())
                .notes(dto.getNotes())
                .build();

        return repository.save(entity);
    }

    public void deleteHistory(Long id) {
        Long userId = getCurrentUserId();
        CalculHistory entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Calcul non trouvé"));

        // Vérifier que le calcul appartient bien à l'utilisateur
        if (!entity.getUserId().equals(userId)) {
            throw new SecurityException("Accès interdit à ce calcul");
        }

        repository.deleteById(id);
    }

    // Gestion des préférences utilisateur (stockées en JSON dans une table séparée ou redis)
    // Pour V1, on va juste retourner des valeurs par défaut et accepter les mises à jour
    // Dans une vraie implémentation, il faudrait une table user_preferences

    public JsonNode getPreferences() {
        // TODO: Implémenter avec une vraie table user_preferences
        // Pour l'instant, retourner null pour forcer le frontend à utiliser localStorage
        return null;
    }

    public JsonNode updatePreferences(JsonNode preferences) {
        // TODO: Implémenter avec une vraie table user_preferences
        // Pour l'instant, juste retourner ce qui a été envoyé
        return preferences;
    }
}
