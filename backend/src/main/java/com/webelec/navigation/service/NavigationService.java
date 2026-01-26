package com.webelec.backend.navigation.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.navigation.domain.CompanyLicense;
import com.webelec.backend.navigation.domain.NavigationLicense;
import com.webelec.backend.navigation.domain.NavigationModule;
import com.webelec.backend.navigation.domain.NavigationPermission;
import com.webelec.backend.navigation.domain.NavigationRolePermission;
import com.webelec.backend.navigation.domain.UserCompanyAssignment;
import com.webelec.backend.navigation.dto.NavigationDTO;
import com.webelec.backend.navigation.dto.NavigationItemDTO;
import com.webelec.backend.navigation.dto.NavigationSectionDTO;
import com.webelec.backend.navigation.repository.CompanyLicenseRepository;
import com.webelec.backend.navigation.repository.NavigationModuleRepository;
import com.webelec.backend.navigation.repository.NavigationRolePermissionRepository;
import com.webelec.backend.navigation.repository.UserCompanyAssignmentRepository;
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
    private final UserCompanyAssignmentRepository userCompanyAssignmentRepository;

    public NavigationService(NavigationModuleRepository navigationModuleRepository,
                             NavigationRolePermissionRepository navigationRolePermissionRepository,
                             CompanyLicenseRepository companyLicenseRepository,
                             UserCompanyAssignmentRepository userCompanyAssignmentRepository) {
        this.navigationModuleRepository = navigationModuleRepository;
        this.navigationRolePermissionRepository = navigationRolePermissionRepository;
        this.companyLicenseRepository = companyLicenseRepository;
        this.userCompanyAssignmentRepository = userCompanyAssignmentRepository;
    }

    public NavigationDTO getNavigation(Long userId) {
        UserCompanyAssignment assignment = userCompanyAssignmentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non rattaché à une société"));

        Set<String> permissionCodes = resolvePermissions(assignment.getRoleCode());
        Set<String> activeLicenseCodes = resolveActiveLicenses(assignment.getCompanyId());
        List<NavigationSectionDTO> sections = buildSections(permissionCodes, activeLicenseCodes);

        return new NavigationDTO(
                assignment.getUserId(),
                assignment.getCompanyId(),
                assignment.getRoleCode(),
                sections
        );
    }

    private Set<String> resolvePermissions(String roleCode) {
        if (roleCode == null || roleCode.isBlank()) {
            return Set.of();
        }
        return navigationRolePermissionRepository.findByRoleCode(roleCode).stream()
                .map(NavigationRolePermission::getPermission)
                .filter(Objects::nonNull)
                .map(NavigationPermission::getCode)
                .filter(code -> code != null && !code.isBlank())
                .collect(Collectors.toSet());
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
                .filter(code -> code != null && !code.isBlank())
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
        if (permissionCodes.isEmpty()) {
            return List.of();
        }
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
        if (permission == null || permission.getCode() == null) {
            return false;
        }
        if (!permissionCodes.contains(permission.getCode())) {
            return false;
        }
        NavigationLicense requiredLicense = module.getRequiredLicense();
        if (requiredLicense == null || requiredLicense.getCode() == null) {
            return true;
        }
        return activeLicenses.contains(requiredLicense.getCode());
    }

    private NavigationItemDTO toItem(NavigationModule module) {
        return new NavigationItemDTO(
                module.getCode(),
                module.getLabel(),
                module.getRoute(),
                module.getIcon()
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
