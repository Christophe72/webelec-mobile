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
import com.webelec.navigation.domain.ModulePermission;
import com.webelec.navigation.domain.NavigationLicense;
import com.webelec.navigation.domain.NavigationModule;
import com.webelec.navigation.domain.NavigationPermission;
import com.webelec.navigation.domain.RolePermission;
import com.webelec.navigation.dto.NavigationDTO;
import com.webelec.navigation.dto.NavigationItem;
import com.webelec.navigation.dto.NavigationItemDTO;
import com.webelec.navigation.dto.NavigationResponse;
import com.webelec.navigation.dto.NavigationSection;
import com.webelec.navigation.dto.NavigationSectionDTO;
import com.webelec.navigation.repository.CompanyLicenseRepository;
import com.webelec.navigation.repository.ModulePermissionRepository;
import com.webelec.navigation.repository.NavigationModuleRepository;
import com.webelec.navigation.repository.NavigationSectionRepository;
import com.webelec.navigation.repository.RolePermissionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;

@Service
@Transactional(readOnly = true)
public class NavigationService {

    private final NavigationSectionRepository navigationSectionRepository;
    private final NavigationModuleRepository navigationModuleRepository;
    private final RolePermissionRepository rolePermissionRepository;
    private final ModulePermissionRepository modulePermissionRepository;
    private final CompanyLicenseRepository companyLicenseRepository;
    private final SocieteSelectionRepository societeSelectionRepository;
    private final UserSocieteRoleRepository userSocieteRoleRepository;

    public NavigationService(NavigationSectionRepository navigationSectionRepository,
                             NavigationModuleRepository navigationModuleRepository,
                             RolePermissionRepository rolePermissionRepository,
                             ModulePermissionRepository modulePermissionRepository,
                             CompanyLicenseRepository companyLicenseRepository,
                             SocieteSelectionRepository societeSelectionRepository,
                             UserSocieteRoleRepository userSocieteRoleRepository) {
        this.navigationSectionRepository = navigationSectionRepository;
        this.navigationModuleRepository = navigationModuleRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.modulePermissionRepository = modulePermissionRepository;
        this.companyLicenseRepository = companyLicenseRepository;
        this.societeSelectionRepository = societeSelectionRepository;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
    }

    public NavigationDTO getNavigation() {
        NavigationResponse response = getNavigationForCurrentUser();
        if (response.sections().isEmpty()) {
            return new NavigationDTO(List.of());
        }
        List<NavigationSectionDTO> sections = new ArrayList<>();
        for (NavigationSection section : response.sections()) {
            List<NavigationItemDTO> items = new ArrayList<>();
            for (NavigationItem item : section.items()) {
                items.add(new NavigationItemDTO(
                        item.code(),
                        item.label(),
                        item.route(),
                        item.icon(),
                        item.active()
                ));
            }
            sections.add(new NavigationSectionDTO(section.code(), section.label(), items));
        }
        return new NavigationDTO(sections);
    }

    public NavigationResponse getNavigationForCurrentUser() {
        Utilisateur utilisateur = requireAuthenticatedUtilisateur();
        SocieteSelection selection = societeSelectionRepository
                .findFirstByUtilisateurIdOrderBySelectedAtDesc(utilisateur.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Aucune société active sélectionnée"));

        Long companyId = extractCompanyId(selection);
        UtilisateurRole role = resolveRole(utilisateur.getId(), companyId);
        Set<String> permissionCodes = resolveRolePermissions(role);
        if (permissionCodes.isEmpty()) {
            return new NavigationResponse(List.of());
        }

        Set<String> activeLicenseCodes = resolveActiveLicenses(companyId);
        List<NavigationSection> sections = buildSections(permissionCodes, activeLicenseCodes);
        return new NavigationResponse(sections);
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

    private Set<String> resolveRolePermissions(UtilisateurRole role) {
        if (role == null) {
            return Set.of();
        }
        List<RolePermission> rolePermissions = rolePermissionRepository.findByRoleCode(role.name());
        if (rolePermissions == null || rolePermissions.isEmpty()) {
            return Set.of();
        }
        Set<String> permissions = new HashSet<>();
        for (RolePermission mapping : rolePermissions) {
            if (mapping == null) {
                continue;
            }
            String code = mapping.getPermissionCode();
            if (hasText(code)) {
                permissions.add(code);
            }
        }
        return permissions;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private Set<String> resolveActiveLicenses(Long companyId) {
        if (companyId == null) {
            return Set.of();
        }
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        List<CompanyLicense> licenses = companyLicenseRepository.findByCompanyId(companyId);
        if (licenses == null || licenses.isEmpty()) {
            return Set.of();
        }
        Set<String> active = new HashSet<>();
        for (CompanyLicense license : licenses) {
            if (license == null || !license.isActive()) {
                continue;
            }
            if (!isWithinValidityWindow(license, today)) {
                continue;
            }
            NavigationLicense navigationLicense = license.getLicense();
            if (navigationLicense == null) {
                continue;
            }
            String code = navigationLicense.getCode();
            if (hasText(code)) {
                active.add(code);
            }
        }
        return active;
    }

    private boolean isWithinValidityWindow(CompanyLicense license, LocalDate today) {
        LocalDate startDate = license.getStartDate();
        if (startDate != null && startDate.isAfter(today)) {
            return false;
        }
        LocalDate endDate = license.getEndDate();
        return endDate == null || !endDate.isBefore(today);
    }

    private List<NavigationSection> buildSections(Set<String> permissionCodes, Set<String> activeLicenses) {
        List<NavigationModule> modules = navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc();
        if (modules == null || modules.isEmpty()) {
            return List.of();
        }
        List<NavigationModule> orderedModules = new ArrayList<>(modules);
        orderedModules.sort(Comparator
                .comparing(NavigationModule::getDisplayOrder, Comparator.nullsLast(Integer::compareTo))
                .thenComparing(NavigationModule::getCode, Comparator.nullsLast(String::compareTo)));

        List<com.webelec.navigation.domain.NavigationSection> sections =
                navigationSectionRepository.findAllByOrderByDisplayOrderAsc();
        List<com.webelec.navigation.domain.NavigationSection> orderedSections = sections == null
                ? List.of()
                : new ArrayList<>(sections);
        orderedSections.sort(Comparator
                .comparing(com.webelec.navigation.domain.NavigationSection::getDisplayOrder,
                        Comparator.nullsLast(Integer::compareTo))
                .thenComparing(com.webelec.navigation.domain.NavigationSection::getCode,
                        Comparator.nullsLast(String::compareTo)));

        Map<String, SectionAccumulator> sectionBuckets = new LinkedHashMap<>();
        for (com.webelec.navigation.domain.NavigationSection section : orderedSections) {
            if (section == null || !hasText(section.getCode())) {
                continue;
            }
            String label = hasText(section.getLabel()) ? section.getLabel() : section.getCode();
            sectionBuckets.put(section.getCode(), new SectionAccumulator(section.getCode(), label));
        }

        Map<String, Set<String>> modulePermissions = resolveModulePermissions(orderedModules);
        Map<String, SectionAccumulator> extraSections = new TreeMap<>();

        for (NavigationModule module : orderedModules) {
            if (!isModuleAccessible(module, permissionCodes, modulePermissions, activeLicenses)) {
                continue;
            }
            String sectionCode = module.getSectionCode();
            if (!hasText(sectionCode)) {
                continue;
            }
            SectionAccumulator accumulator = sectionBuckets.get(sectionCode);
            if (accumulator == null) {
                String label = hasText(module.getSectionLabel()) ? module.getSectionLabel() : sectionCode;
                accumulator = extraSections.computeIfAbsent(sectionCode,
                        code -> new SectionAccumulator(code, label));
            }
            accumulator.addItem(toItem(module));
        }

        if (!extraSections.isEmpty()) {
            sectionBuckets.putAll(extraSections);
        }

        List<NavigationSection> results = new ArrayList<>();
        for (SectionAccumulator accumulator : sectionBuckets.values()) {
            NavigationSection section = accumulator.toDto();
            if (!section.items().isEmpty()) {
                results.add(section);
            }
        }
        return results;
    }

    private Map<String, Set<String>> resolveModulePermissions(List<NavigationModule> modules) {
        List<String> moduleCodes = new ArrayList<>();
        for (NavigationModule module : modules) {
            if (module != null && hasText(module.getCode())) {
                moduleCodes.add(module.getCode());
            }
        }
        if (moduleCodes.isEmpty()) {
            return Map.of();
        }
        List<ModulePermission> mappings = modulePermissionRepository.findByModuleCodeIn(moduleCodes);
        if (mappings == null || mappings.isEmpty()) {
            return Map.of();
        }
        Map<String, Set<String>> result = new HashMap<>();
        for (ModulePermission mapping : mappings) {
            if (mapping == null) {
                continue;
            }
            String moduleCode = mapping.getModuleCode();
            String permissionCode = mapping.getPermissionCode();
            if (!hasText(moduleCode) || !hasText(permissionCode)) {
                continue;
            }
            result.computeIfAbsent(moduleCode, code -> new HashSet<>()).add(permissionCode);
        }
        return result;
    }

    private boolean isModuleAccessible(NavigationModule module,
                                       Set<String> permissionCodes,
                                       Map<String, Set<String>> modulePermissions,
                                       Set<String> activeLicenses) {
        if (module == null || !module.isActive()) {
            return false;
        }
        String moduleCode = module.getCode();
        if (!hasText(moduleCode)) {
            return false;
        }
        Set<String> requiredPermissions = modulePermissions.get(moduleCode);
        if (requiredPermissions == null || requiredPermissions.isEmpty()) {
            NavigationPermission permission = module.getPermission();
            if (permission != null && hasText(permission.getCode())) {
                requiredPermissions = Set.of(permission.getCode());
            }
        }
        if (requiredPermissions == null || requiredPermissions.isEmpty()) {
            return false;
        }
        boolean permitted = false;
        for (String code : requiredPermissions) {
            if (permissionCodes.contains(code)) {
                permitted = true;
                break;
            }
        }
        if (!permitted) {
            return false;
        }
        NavigationLicense requiredLicense = module.getRequiredLicense();
        if (requiredLicense == null || !hasText(requiredLicense.getCode())) {
            return true;
        }
        return activeLicenses.contains(requiredLicense.getCode());
    }

    private NavigationItem toItem(NavigationModule module) {
        return new NavigationItem(
                module.getCode(),
                module.getLabel(),
                module.getRoute(),
                module.getIcon(),
                true
        );
    }

    private static final class SectionAccumulator {
        private final String code;
        private final String label;
        private final List<NavigationItem> items = new ArrayList<>();

        private SectionAccumulator(String code, String label) {
            this.code = code;
            this.label = label;
        }

        private void addItem(NavigationItem item) {
            items.add(item);
        }

        private NavigationSection toDto() {
            return new NavigationSection(code, label, items);
        }
    }
}
