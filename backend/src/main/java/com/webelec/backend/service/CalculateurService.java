package com.webelec.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.webelec.backend.dto.CalculHistoryCreateDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.CalculHistory;
import com.webelec.backend.model.UserPreferences;
import com.webelec.backend.repository.CalculHistoryRepository;
import com.webelec.backend.repository.UserPreferencesRepository;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CalculateurService {

    private final CalculHistoryRepository repository;
    private final UserPreferencesRepository preferencesRepository;
    private final boolean allowAnonymous;

    public CalculateurService(CalculHistoryRepository repository,
                              UserPreferencesRepository preferencesRepository,
                              Environment environment) {
        this.repository = repository;
        this.preferencesRepository = preferencesRepository;
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

    public JsonNode getPreferences() {
        Long userId = getCurrentUserId();
        return preferencesRepository.findByUserId(userId)
                .map(UserPreferences::getPreferences)
                .orElse(null);
    }

    public JsonNode updatePreferences(JsonNode preferences) {
        Long userId = getCurrentUserId();
        JsonNode safePreferences = preferences != null
                ? preferences
                : JsonNodeFactory.instance.objectNode();

        UserPreferences entity = preferencesRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreferences created = new UserPreferences();
                    created.setUserId(userId);
                    return created;
                });

        if (safePreferences.equals(entity.getPreferences())) {
            return entity.getPreferences();
        }

        entity.setPreferences(safePreferences);
        return preferencesRepository.save(entity).getPreferences();
    }
}
