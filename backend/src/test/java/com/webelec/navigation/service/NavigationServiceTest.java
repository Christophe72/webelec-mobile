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
import com.webelec.navigation.domain.NavigationSection;
import com.webelec.navigation.domain.RolePermission;
import com.webelec.navigation.dto.NavigationDTO;
import com.webelec.navigation.dto.NavigationSectionDTO;
import com.webelec.navigation.repository.CompanyLicenseRepository;
import com.webelec.navigation.repository.ModulePermissionRepository;
import com.webelec.navigation.repository.NavigationModuleRepository;
import com.webelec.navigation.repository.NavigationSectionRepository;
import com.webelec.navigation.repository.RolePermissionRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NavigationServiceTest {

    @Mock
    private NavigationSectionRepository navigationSectionRepository;

    @Mock
    private NavigationModuleRepository navigationModuleRepository;

    @Mock
    private RolePermissionRepository rolePermissionRepository;

    @Mock
    private ModulePermissionRepository modulePermissionRepository;

    @Mock
    private CompanyLicenseRepository companyLicenseRepository;

    @Mock
    private SocieteSelectionRepository societeSelectionRepository;

    @Mock
    private UserSocieteRoleRepository userSocieteRoleRepository;

    private NavigationService navigationService;

    @BeforeEach
    void setUp() {
    navigationService = new NavigationService(
        navigationSectionRepository,
        navigationModuleRepository,
        rolePermissionRepository,
        modulePermissionRepository,
        companyLicenseRepository,
        societeSelectionRepository,
        userSocieteRoleRepository
    );
    SecurityContextHolder.clearContext();
    }

    @AfterEach
    void tearDown() {
    SecurityContextHolder.clearContext();
    }

    @Test
    void shouldThrowWhenNoActiveSelection() {
    long userId = 21L;
    authenticate(userId);
    when(societeSelectionRepository.findFirstByUtilisateurIdOrderBySelectedAtDesc(userId))
        .thenReturn(Optional.empty());

    assertThrows(ResourceNotFoundException.class, () -> navigationService.getNavigation());
    }

    @Test
    void shouldReturnEmptyWhenRoleHasNoPermissions() {
    long userId = 5L;
    long companyId = 11L;
    authenticate(userId);
    mockSelection(userId, companyId);
    mockUserRole(userId, companyId, UtilisateurRole.TECHNICIEN);
    when(rolePermissionRepository.findByRoleCode("TECHNICIEN"))
        .thenReturn(List.of());

    NavigationDTO response = navigationService.getNavigation();

    assertEquals(0, response.sections().size());
    }

    @Test
    void shouldFilterModulesByPermissionsAndLicenses() {
    long userId = 7L;
    long companyId = 3L;
    authenticate(userId);
    mockSelection(userId, companyId);
    mockUserRole(userId, companyId, UtilisateurRole.GERANT);

    NavigationPermission dashboardPermission = permission("NAV_DASHBOARD");
    NavigationPermission adminPermission = permission("NAV_ADMIN");
    NavigationPermission hiddenPermission = permission("NAV_REPORTS");

    when(rolePermissionRepository.findByRoleCode("GERANT"))
        .thenReturn(List.of(
            rolePermission("GERANT", "NAV_DASHBOARD"),
            rolePermission("GERANT", "NAV_ADMIN")
        ));

    NavigationLicense facturation = license("FACTURATION");
    CompanyLicense activeFacturation = activeLicense(facturation, null, null);
    when(companyLicenseRepository.findByCompanyId(companyId)).thenReturn(List.of(activeFacturation));

    when(navigationSectionRepository.findAllByOrderByDisplayOrderAsc()).thenReturn(List.of(
        section("DASHBOARD", "Pilotage", 1),
        section("BUSINESS", "Gestion commerciale", 2),
        section("ADMIN", "Administration", 4)
    ));

    NavigationModule dashboard = module("dashboard", "Dashboard", "DASHBOARD", "Pilotage", 1,
        dashboardPermission, null);
    NavigationModule admin = module("administration", "Administration", "ADMIN", "Administration", 4,
        adminPermission, null);
    NavigationModule devis = module("devis", "Devis", "BUSINESS", "Gestion commerciale", 2,
        adminPermission, facturation);
    NavigationModule blockedPermission = module("reports", "Rapports", "BUSINESS", "Gestion commerciale", 5,
        hiddenPermission, null);
    NavigationModule blockedLicense = module("factures", "Factures", "BUSINESS", "Gestion commerciale", 3,
        adminPermission, license("RGIE"));

    when(navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc())
        .thenReturn(List.of(dashboard, devis, admin, blockedPermission, blockedLicense));
    when(modulePermissionRepository.findByModuleCodeIn(anyCollection()))
        .thenReturn(List.of(
            modulePermission("dashboard", "NAV_DASHBOARD"),
            modulePermission("administration", "NAV_ADMIN"),
            modulePermission("devis", "NAV_ADMIN"),
            modulePermission("reports", "NAV_REPORTS"),
            modulePermission("factures", "NAV_ADMIN")
        ));

    NavigationDTO response = navigationService.getNavigation();

    assertEquals(3, response.sections().size());
    NavigationSectionDTO business = response.sections().stream()
        .filter(section -> section.code().equals("BUSINESS"))
        .findFirst()
        .orElseThrow();
    assertEquals(1, business.items().size(), "Seule l'entrée devis doit rester");
    assertEquals("devis", business.items().get(0).code());
    assertEquals(true, business.items().get(0).active());
    assertEquals("DASHBOARD", response.sections().get(0).code());
    }

    @Test
    void shouldRespectDisplayOrderWithinSections() {
    long userId = 13L;
    long companyId = 2L;
    authenticate(userId);
    mockSelection(userId, companyId);
    mockUserRole(userId, companyId, UtilisateurRole.ADMIN);

    NavigationPermission p1 = permission("NAV_ONE");
    NavigationPermission p2 = permission("NAV_TWO");
    when(rolePermissionRepository.findByRoleCode("ADMIN"))
        .thenReturn(List.of(rolePermission("ADMIN", "NAV_ONE"), rolePermission("ADMIN", "NAV_TWO")));
    when(companyLicenseRepository.findByCompanyId(companyId)).thenReturn(List.of());
    when(navigationSectionRepository.findAllByOrderByDisplayOrderAsc())
        .thenReturn(List.of(section("BUSINESS", "Business", 1)));

    NavigationModule first = module("one", "One", "BUSINESS", "Business", 10, p1, null);
    NavigationModule second = module("two", "Two", "BUSINESS", "Business", 20, p2, null);
    when(navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc())
        .thenReturn(List.of(first, second));
    when(modulePermissionRepository.findByModuleCodeIn(anyCollection()))
        .thenReturn(List.of(
            modulePermission("one", "NAV_ONE"),
            modulePermission("two", "NAV_TWO")
        ));

    NavigationDTO response = navigationService.getNavigation();
    NavigationSectionDTO section = response.sections().get(0);
    assertEquals(List.of("one", "two"), section.items().stream().map(item -> item.code()).toList());
    }

    @Test
    void shouldHideModulesWhenLicenseInactive() {
    long userId = 44L;
    long companyId = 9L;
    authenticate(userId);
    mockSelection(userId, companyId);
    mockUserRole(userId, companyId, UtilisateurRole.GERANT);

    NavigationPermission p = permission("NAV_RGIE");
    when(rolePermissionRepository.findByRoleCode("GERANT"))
        .thenReturn(List.of(rolePermission("GERANT", "NAV_RGIE")));

    NavigationLicense rgie = license("RGIE");
    CompanyLicense expired = activeLicense(rgie, LocalDate.now(ZoneOffset.UTC).minusYears(1),
        LocalDate.now(ZoneOffset.UTC).minusDays(1));
    when(companyLicenseRepository.findByCompanyId(companyId)).thenReturn(List.of(expired));
    when(navigationSectionRepository.findAllByOrderByDisplayOrderAsc())
        .thenReturn(List.of(section("RGIE", "Conformité RGIE", 1)));

    NavigationModule module = module("rgie-dossiers", "RGIE", "RGIE", "Conformité RGIE", 1, p, rgie);
    when(navigationModuleRepository.findByActiveTrueOrderByDisplayOrderAsc()).thenReturn(List.of(module));
    when(modulePermissionRepository.findByModuleCodeIn(anyCollection()))
        .thenReturn(List.of(modulePermission("rgie-dossiers", "NAV_RGIE")));

    NavigationDTO response = navigationService.getNavigation();

    assertEquals(0, response.sections().size());
    }

    private void mockSelection(long userId, long companyId) {
    SocieteSelection selection = new SocieteSelection();
    Societe societe = new Societe();
    societe.setId(companyId);
    selection.setSociete(societe);
    when(societeSelectionRepository.findFirstByUtilisateurIdOrderBySelectedAtDesc(userId))
        .thenReturn(Optional.of(selection));
    }

    private void mockUserRole(long userId, long companyId, UtilisateurRole role) {
    UserSocieteRole link = new UserSocieteRole();
    link.setRole(role);
    when(userSocieteRoleRepository.findByUtilisateurIdAndSocieteId(userId, companyId))
        .thenReturn(Optional.of(link));
    }

    private void authenticate(long userId) {
    Utilisateur utilisateur = new Utilisateur();
    utilisateur.setId(userId);
    var principal = new AuthenticatedUtilisateur(utilisateur);
    var token = new TestingAuthenticationToken(principal, null);
    token.setAuthenticated(true);
    SecurityContextHolder.getContext().setAuthentication(token);
    }

    private static RolePermission rolePermission(String roleCode, String permissionCode) {
    RolePermission mapping = new RolePermission();
    mapping.setRoleCode(roleCode);
    mapping.setPermissionCode(permissionCode);
    return mapping;
    }

    private static ModulePermission modulePermission(String moduleCode, String permissionCode) {
    ModulePermission mapping = new ModulePermission();
    mapping.setModuleCode(moduleCode);
    mapping.setPermissionCode(permissionCode);
    return mapping;
    }

    private static NavigationSection section(String code, String label, int displayOrder) {
    NavigationSection section = new NavigationSection();
    section.setCode(code);
    section.setLabel(label);
    section.setDisplayOrder(displayOrder);
    return section;
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

    private static CompanyLicense activeLicense(NavigationLicense license, LocalDate start, LocalDate end) {
    CompanyLicense companyLicense = new CompanyLicense();
    companyLicense.setLicense(license);
    companyLicense.setActive(true);
    companyLicense.setStartDate(start);
    companyLicense.setEndDate(end);
    return companyLicense;
    }
}
