package com.webelec.backend.navigation.service;

import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.navigation.domain.CompanyLicense;
import com.webelec.backend.navigation.domain.NavigationLicense;
import com.webelec.backend.navigation.domain.NavigationModule;
import com.webelec.backend.navigation.domain.NavigationPermission;
import com.webelec.backend.navigation.domain.NavigationRole;
import com.webelec.backend.navigation.domain.NavigationRolePermission;
import com.webelec.backend.navigation.domain.UserCompanyAssignment;
import com.webelec.backend.navigation.dto.NavigationDTO;
import com.webelec.backend.navigation.dto.NavigationSectionDTO;
import com.webelec.backend.navigation.repository.CompanyLicenseRepository;
import com.webelec.backend.navigation.repository.NavigationModuleRepository;
import com.webelec.backend.navigation.repository.NavigationRolePermissionRepository;
import com.webelec.backend.navigation.repository.UserCompanyAssignmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NavigationServiceTest {

    @Mock
    private NavigationModuleRepository navigationModuleRepository;

    @Mock
    private NavigationRolePermissionRepository navigationRolePermissionRepository;

    @Mock
    private CompanyLicenseRepository companyLicenseRepository;

    @Mock
    private UserCompanyAssignmentRepository userCompanyAssignmentRepository;

    private NavigationService navigationService;

    @BeforeEach
    void setUp() {
        navigationService = new NavigationService(
                navigationModuleRepository,
                navigationRolePermissionRepository,
                companyLicenseRepository,
                userCompanyAssignmentRepository
        );
    }

    @Test
    void getNavigation_shouldThrowWhenAssignmentMissing() {
        when(userCompanyAssignmentRepository.findByUserId(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> navigationService.getNavigation(99L));
    }

    @Test
    void getNavigation_shouldFilterModulesByPermissionsAndLicenses() {
        Long userId = 7L;
        UserCompanyAssignment assignment = new UserCompanyAssignment();
        assignment.setUserId(userId);
        assignment.setCompanyId(3L);
        assignment.setRoleCode("GERANT");
        when(userCompanyAssignmentRepository.findByUserId(userId)).thenReturn(Optional.of(assignment));

        NavigationPermission dashboardPermission = permission("NAV_DASHBOARD");
        NavigationPermission adminPermission = permission("NAV_ADMIN");
        NavigationPermission reportsPermission = permission("NAV_REPORTS");

        when(navigationRolePermissionRepository.findByRoleCode("GERANT")).thenReturn(List.of(
                rolePermission("GERANT", dashboardPermission),
                rolePermission("GERANT", adminPermission)
        ));

        NavigationLicense proLicense = license("PRO");
        NavigationLicense basicLicense = license("BASIC");

        CompanyLicense activePro = new CompanyLicense();
        activePro.setActive(true);
        activePro.setLicense(proLicense);

        CompanyLicense expiredBasic = new CompanyLicense();
        expiredBasic.setActive(true);
        expiredBasic.setLicense(basicLicense);
        expiredBasic.setEndDate(LocalDate.now(ZoneOffset.UTC).minusDays(1));

        when(companyLicenseRepository.findByCompanyId(3L)).thenReturn(List.of(activePro, expiredBasic));

        NavigationModule dashboard = module(
                "dashboard",
                "Dashboard",
                "core",
                "Tableau de bord",
                1,
                dashboardPermission,
                null
        );

        NavigationModule admin = module(
                "administration",
                "Administration",
                "core",
                "Tableau de bord",
                2,
                adminPermission,
                proLicense
        );

        NavigationModule blockedPermission = module(
                "reports",
                "Rapports",
                "reports",
                "Rapports",
                3,
                reportsPermission,
                null
        );

        NavigationModule blockedLicense = module(
                "mobile",
                "Mobile",
                "extras",
                "Extras",
                4,
                adminPermission,
                basicLicense
        );

        when(navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc()).thenReturn(
                List.of(dashboard, admin, blockedPermission, blockedLicense)
        );

        NavigationDTO response = navigationService.getNavigation(userId);

        assertEquals(1, response.sections().size(), "Seule la section core doit rester");
        NavigationSectionDTO section = response.sections().get(0);
        assertEquals("core", section.code());
        assertEquals("Tableau de bord", section.label());
        assertEquals(2, section.items().size(), "Deux modules accessibles attendus");
        assertEquals("dashboard", section.items().get(0).code());
        assertEquals("administration", section.items().get(1).code());
    }

    private static NavigationRolePermission rolePermission(String roleCode, NavigationPermission permission) {
        NavigationRole role = new NavigationRole();
        role.setCode(roleCode);
        NavigationRolePermission mapping = new NavigationRolePermission();
        mapping.setRole(role);
        mapping.setPermission(permission);
        return mapping;
    }

    private static NavigationPermission permission(String code) {
        NavigationPermission permission = new NavigationPermission();
        permission.setCode(code);
        permission.setLabel(code);
        return permission;
    }

    private static NavigationLicense license(String code) {
        NavigationLicense license = new NavigationLicense();
        license.setCode(code);
        license.setLabel(code);
        return license;
    }

    private static NavigationModule module(String code,
                                           String label,
                                           String sectionCode,
                                           String sectionLabel,
                                           int displayOrder,
                                           NavigationPermission permission,
                                           NavigationLicense requiredLicense) {
        NavigationModule module = new NavigationModule();
        module.setCode(code);
        module.setLabel(label);
        module.setRoute("/" + code);
        module.setIcon("ic-" + code);
        module.setSectionCode(sectionCode);
        module.setSectionLabel(sectionLabel);
        module.setDisplayOrder(displayOrder);
        module.setActive(true);
        module.setPermission(permission);
        module.setRequiredLicense(requiredLicense);
        return module;
    }
}
