package com.webelec.navigation.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.SocieteSelection;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteSelectionRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import com.webelec.backend.security.AuthenticatedUtilisateur;
import com.webelec.navigation.domain.CompanyLicense;
import com.webelec.navigation.domain.NavigationLicense;
import com.webelec.navigation.domain.NavigationModule;
import com.webelec.navigation.domain.NavigationPermission;
import com.webelec.navigation.domain.NavigationRolePermission;
import com.webelec.navigation.dto.NavigationDTO;
import com.webelec.navigation.dto.NavigationItemDTO;
import com.webelec.navigation.dto.NavigationSectionDTO;
import com.webelec.navigation.repository.CompanyLicenseRepository;
import com.webelec.navigation.repository.NavigationModuleRepository;
import com.webelec.navigation.repository.NavigationRolePermissionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class NavigationService {

    private final NavigationModuleRepository navigationModuleRepository;
    private final NavigationRolePermissionRepository navigationRolePermissionRepository;
    private final CompanyLicenseRepository companyLicenseRepository;
    private final SocieteSelectionRepository societeSelectionRepository;
    private final UserSocieteRoleRepository userSocieteRoleRepository;

    public NavigationService(NavigationModuleRepository navigationModuleRepository,
                             NavigationRolePermissionRepository navigationRolePermissionRepository,
                             CompanyLicenseRepository companyLicenseRepository,
                             SocieteSelectionRepository societeSelectionRepository,
                             UserSocieteRoleRepository userSocieteRoleRepository) {
        this.navigationModuleRepository = navigationModuleRepository;
        this.navigationRolePermissionRepository = navigationRolePermissionRepository;
        this.companyLicenseRepository = companyLicenseRepository;
        this.societeSelectionRepository = societeSelectionRepository;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
    }

    public NavigationDTO getNavigation() {
        Utilisateur utilisateur = requireAuthenticatedUtilisateur();
        SocieteSelection selection = societeSelectionRepository
                .findFirstByUtilisateurIdOrderBySelectedAtDesc(utilisateur.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Aucune société active sélectionnée"));

        Long companyId = extractCompanyId(selection);
        UtilisateurRole role = resolveRole(utilisateur.getId(), companyId);
        Set<String> permissionCodes = resolvePermissions(role);
        if (permissionCodes.isEmpty()) {
            return new NavigationDTO(List.of());
        }

        Set<String> activeLicenseCodes = resolveActiveLicenses(companyId);
        List<NavigationSectionDTO> sections = buildSections(permissionCodes, activeLicenseCodes);
        return new NavigationDTO(sections);
    }

    private Utilisateur requireAuthenticatedUtilisateur() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException("Utilisateur non authentifié");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof AuthenticatedUtilisateur authenticated) {
            Utilisateur utilisateur = authenticated.getUtilisateur();
            if (utilisateur != null && utilisateur.getId() != null) {
                return utilisateur;
            }
        }
        throw new AccessDeniedException("Utilisateur non authentifié");
    }

    private Long extractCompanyId(SocieteSelection selection) {
        Societe societe = selection.getSociete();
        if (societe == null || societe.getId() == null) {
            throw new ResourceNotFoundException("Société active introuvable");
        }
        return societe.getId();
    }

    private UtilisateurRole resolveRole(Long userId, Long companyId) {
        return userSocieteRoleRepository.findByUtilisateurIdAndSocieteId(userId, companyId)
                .map(UserSocieteRole::getRole)
                .orElseThrow(() -> new ResourceNotFoundException("Aucun rôle actif pour cette société"));
    }

    private Set<String> resolvePermissions(UtilisateurRole role) {
        if (role == null) {
            return Set.of();
        }
        return navigationRolePermissionRepository.findByRoleCode(role.name()).stream()
                .map(NavigationRolePermission::getPermission)
                .filter(Objects::nonNull)
                .map(NavigationPermission::getCode)
                .filter(this::hasText)
                .collect(Collectors.toSet());
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private Set<String> resolveActiveLicenses(Long companyId) {
        if (companyId == null) {
            return Set.of();
        }
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        return companyLicenseRepository.findByCompanyId(companyId).stream()
                .filter(Objects::nonNull)
                .filter(CompanyLicense::isActive)
                .filter(license -> isWithinValidityWindow(license, today))
                .map(CompanyLicense::getLicense)
                .filter(Objects::nonNull)
                .map(NavigationLicense::getCode)
                .filter(this::hasText)
                .collect(Collectors.toSet());
    }

    private boolean isWithinValidityWindow(CompanyLicense license, LocalDate today) {
        LocalDate startDate = license.getStartDate();
        if (startDate != null && startDate.isAfter(today)) {
            return false;
        }
        LocalDate endDate = license.getEndDate();
        return endDate == null || !endDate.isBefore(today);
    }

    private List<NavigationSectionDTO> buildSections(Set<String> permissionCodes, Set<String> activeLicenses) {
        List<NavigationModule> modules = navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc();
        if (modules.isEmpty()) {
            return List.of();
        }

        Map<String, SectionAccumulator> sections = new LinkedHashMap<>();
        for (NavigationModule module : modules) {
            if (!isModuleAccessible(module, permissionCodes, activeLicenses)) {
                continue;
            }
            SectionAccumulator accumulator = sections.computeIfAbsent(
                    module.getSectionCode(),
                    code -> new SectionAccumulator(module.getSectionCode(), module.getSectionLabel())
            );
            accumulator.addItem(toItem(module));
        }

        return sections.values().stream()
                .map(SectionAccumulator::toDto)
                .filter(section -> !section.items().isEmpty())
                .toList();
    }

    private boolean isModuleAccessible(NavigationModule module,
                                       Set<String> permissionCodes,
                                       Set<String> activeLicenses) {
        NavigationPermission permission = module.getPermission();
        if (permission == null || !hasText(permission.getCode())) {
            return false;
        }
        if (!permissionCodes.contains(permission.getCode())) {
            return false;
        }
        NavigationLicense requiredLicense = module.getRequiredLicense();
        if (requiredLicense == null || !hasText(requiredLicense.getCode())) {
            return true;
        }
        return activeLicenses.contains(requiredLicense.getCode());
    }

    private NavigationItemDTO toItem(NavigationModule module) {
        return new NavigationItemDTO(
                module.getCode(),
                module.getLabel(),
                module.getRoute(),
                module.getIcon(),
                module.isActive()
        );
    }

    private static final class SectionAccumulator {
        private final String code;
        private final String label;
        private final List<NavigationItemDTO> items = new ArrayList<>();

        private SectionAccumulator(String code, String label) {
            this.code = code;
            this.label = label;
        }

        private void addItem(NavigationItemDTO item) {
            items.add(item);
        }

        private NavigationSectionDTO toDto() {
            return new NavigationSectionDTO(code, label, items);
        }
    }
}
