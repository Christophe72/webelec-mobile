package com.webelec.backend.security;

import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests de sécurité JWT - JwtAuthenticationFilter")
class JwtAuthenticationFilterTest {

    @Mock
    private JwtService jwtService;

    @Mock
    private UtilisateurDetailsService utilisateurDetailsService;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter jwtAuthenticationFilter;
    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private Utilisateur utilisateur;
    private AuthenticatedUtilisateur userDetails;

    @BeforeEach
    void setUp() {
        jwtAuthenticationFilter = new JwtAuthenticationFilter(jwtService, utilisateurDetailsService);
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();

        // Nettoyer le contexte de sécurité avant chaque test
        SecurityContextHolder.clearContext();

        // Créer un utilisateur de test
        Societe societe = new Societe();
        societe.setId(1L);
        societe.setNom("Test Company");

        utilisateur = new Utilisateur();
        utilisateur.setId(123L);
        utilisateur.setEmail("test@example.com");
        utilisateur.setRole(UtilisateurRole.ARTISAN);
        utilisateur.setSociete(societe);

        userDetails = new AuthenticatedUtilisateur(utilisateur);
    }

    @Test
    @DisplayName("Authentification réussie avec un token valide")
    void doFilterInternal_ValidToken_AuthenticatesUser() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, utilisateur)).thenReturn(true);
        when(jwtService.extractClaim(eq(token), any())).thenReturn("ROLE_ARTISAN");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Vérifier que l'utilisateur est authentifié
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isInstanceOf(AuthenticatedUtilisateur.class);
        assertThat(SecurityContextHolder.getContext().getAuthentication().isAuthenticated()).isTrue();

        // Vérifier que le filtre continue la chaîne
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Pas d'authentification si l'en-tête Authorization est absent")
    void doFilterInternal_NoAuthHeader_ContinuesFilterChain() throws ServletException, IOException {
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Vérifier qu'aucune authentification n'a été créée
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();

        // Vérifier que le filtre continue sans essayer d'extraire le token
        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).extractUsername(any());
    }

    @Test
    @DisplayName("Pas d'authentification si l'en-tête Authorization ne commence pas par 'Bearer '")
    void doFilterInternal_InvalidAuthHeader_ContinuesFilterChain() throws ServletException, IOException {
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verify(jwtService, never()).extractUsername(any());
    }

    @Test
    @DisplayName("Pas d'authentification si le token est invalide")
    void doFilterInternal_InvalidToken_ContinuesFilterChain() throws ServletException, IOException {
        String invalidToken = "invalid.jwt.token";
        request.addHeader("Authorization", "Bearer " + invalidToken);

        when(jwtService.extractUsername(invalidToken)).thenThrow(new JwtException("Invalid token"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verify(utilisateurDetailsService, never()).loadUserByUsername(any());
    }

    @Test
    @DisplayName("Pas d'authentification si le token est expiré")
    void doFilterInternal_ExpiredToken_ContinuesFilterChain() throws ServletException, IOException {
        String expiredToken = "expired.jwt.token";
        request.addHeader("Authorization", "Bearer " + expiredToken);

        when(jwtService.extractUsername(expiredToken)).thenThrow(new JwtException("Token expired"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Pas d'authentification si la validation du token échoue")
    void doFilterInternal_TokenValidationFails_ContinuesFilterChain() throws ServletException, IOException {
        String token = "valid.structure.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, utilisateur)).thenReturn(false);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Pas d'authentification si l'utilisateur n'existe pas")
    void doFilterInternal_UserNotFound_ContinuesFilterChain() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("nonexistent@example.com");
        when(utilisateurDetailsService.loadUserByUsername("nonexistent@example.com"))
                .thenThrow(new RuntimeException("User not found"));

        assertThatThrownBy(() -> jwtAuthenticationFilter.doFilterInternal(request, response, filterChain))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
    }

    @Test
    @DisplayName("Le filtre ne s'exécute pas pour les endpoints publics - /api/auth/login")
    void shouldNotFilter_LoginEndpoint_ReturnsTrue() throws ServletException {
        request.setRequestURI("/api/auth/login");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isTrue();
    }

    @Test
    @DisplayName("Le filtre ne s'exécute pas pour les endpoints publics - /api/auth/register")
    void shouldNotFilter_RegisterEndpoint_ReturnsTrue() throws ServletException {
        request.setRequestURI("/api/auth/register");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isTrue();
    }

    @Test
    @DisplayName("Le filtre ne s'exécute pas pour les endpoints publics - /api/auth/refresh")
    void shouldNotFilter_RefreshEndpoint_ReturnsTrue() throws ServletException {
        request.setRequestURI("/api/auth/refresh");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isTrue();
    }

    @Test
    @DisplayName("Le filtre ne s'exécute pas pour Swagger UI")
    void shouldNotFilter_SwaggerEndpoint_ReturnsTrue() throws ServletException {
        request.setRequestURI("/swagger-ui/index.html");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isTrue();
    }

    @Test
    @DisplayName("Le filtre ne s'exécute pas pour les endpoints Actuator")
    void shouldNotFilter_ActuatorEndpoint_ReturnsTrue() throws ServletException {
        request.setRequestURI("/actuator/health");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isTrue();
    }

    @Test
    @DisplayName("Le filtre s'exécute pour les endpoints protégés")
    void shouldNotFilter_ProtectedEndpoint_ReturnsFalse() throws ServletException {
        request.setRequestURI("/api/factures");

        boolean shouldNotFilter = jwtAuthenticationFilter.shouldNotFilter(request);

        assertThat(shouldNotFilter).isFalse();
    }

    @Test
    @DisplayName("Les autorités sont extraites du token")
    void doFilterInternal_ValidToken_ExtractsAuthorities() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, utilisateur)).thenReturn(true);
        when(jwtService.extractClaim(eq(token), any())).thenReturn("ROLE_ARTISAN");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication.getAuthorities())
                .hasSize(1)
                .extracting("authority")
                .contains("ROLE_ARTISAN");
    }

    @Test
    @DisplayName("Pas de double authentification si déjà authentifié")
    void doFilterInternal_AlreadyAuthenticated_SkipsAuthentication() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        // Créer une authentification existante
        var existingAuth = new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                userDetails, null, List.of(new SimpleGrantedAuthority("ROLE_ARTISAN")));
        SecurityContextHolder.getContext().setAuthentication(existingAuth);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        // Vérifier qu'on n'a pas chargé l'utilisateur une deuxième fois
        verify(utilisateurDetailsService, never()).loadUserByUsername(any());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Token avec claim role null utilise les autorités par défaut")
    void doFilterInternal_NullRoleClaim_UsesDefaultAuthorities() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, utilisateur)).thenReturn(true);
        when(jwtService.extractClaim(eq(token), any())).thenReturn(null);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        var authentication = SecurityContextHolder.getContext().getAuthentication();
        assertThat(authentication).isNotNull();
        assertThat(authentication.getAuthorities()).isNotEmpty();
    }

    @Test
    @DisplayName("Gestion d'exception lors de la validation du token")
    void doFilterInternal_ValidationThrowsException_ContinuesFilterChain() throws ServletException, IOException {
        String token = "valid.structure.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtService.extractUsername(token)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(token, utilisateur)).thenThrow(new JwtException("Validation error"));

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Le filtre extrait correctement le token de l'en-tête Bearer")
    void doFilterInternal_BearerToken_ExtractsCorrectly() throws ServletException, IOException {
        String expectedToken = "my.jwt.token";
        request.addHeader("Authorization", "Bearer " + expectedToken);

        when(jwtService.extractUsername(expectedToken)).thenReturn("test@example.com");
        when(utilisateurDetailsService.loadUserByUsername("test@example.com")).thenReturn(userDetails);
        when(jwtService.isTokenValid(expectedToken, utilisateur)).thenReturn(true);
        when(jwtService.extractClaim(eq(expectedToken), any())).thenReturn("ROLE_ARTISAN");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        verify(jwtService).extractUsername(expectedToken);
        verify(jwtService).isTokenValid(expectedToken, utilisateur);
    }
}
