package com.webelec.backend.service;

import com.webelec.backend.dto.AuthLoginRequest;
import com.webelec.backend.dto.AuthRegisterRequest;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    private UtilisateurRepository utilisateurRepository;
    private SocieteRepository societeRepository;
    private PasswordEncoder passwordEncoder;
    private JwtService jwtService;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        utilisateurRepository = mock(UtilisateurRepository.class);
        societeRepository = mock(SocieteRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        jwtService = mock(JwtService.class);
        authService = new AuthService(utilisateurRepository, societeRepository, passwordEncoder, jwtService);
    }

    @Test
    void login_withValidCredentials_returnsTokens() {
        Utilisateur utilisateur = Utilisateur.builder()
                .id(1L)
                .email("user@test.fr")
                .motDePasse("encoded")
                .role(UtilisateurRole.ADMIN)
                .build();
        when(utilisateurRepository.findByEmail("user@test.fr")).thenReturn(Optional.of(utilisateur));
        when(passwordEncoder.matches("secret", "encoded")).thenReturn(true);
        when(jwtService.generateAccessToken(utilisateur)).thenReturn("access");
        when(jwtService.generateRefreshToken(utilisateur)).thenReturn("refresh");

        var response = authService.login(new AuthLoginRequest("user@test.fr", "secret"));

        assertEquals("access", response.accessToken());
        assertEquals("refresh", response.refreshToken());
        assertEquals("user@test.fr", response.utilisateur().getEmail());
    }

    @Test
    void register_persistsUserAndReturnsTokens() {
        AuthRegisterRequest request = new AuthRegisterRequest("Nom", "Prenom", "new@test.fr", "secret","ADMIN", 1L);
        Societe societe = new Societe(); societe.setId(1L);
        when(utilisateurRepository.existsByEmail("new@test.fr")).thenReturn(false);
        when(societeRepository.findById(1L)).thenReturn(Optional.of(societe));
        when(passwordEncoder.encode("secret")).thenReturn("encoded");
        var saved = Utilisateur.builder().id(2L).email("new@test.fr").role(UtilisateurRole.ADMIN).societe(societe).build();
        when(utilisateurRepository.save(any(Utilisateur.class))).thenReturn(saved);
        when(jwtService.generateAccessToken(saved)).thenReturn("access");
        when(jwtService.generateRefreshToken(saved)).thenReturn("refresh");

        var response = authService.register(request);

        assertEquals("access", response.accessToken());
        verify(utilisateurRepository).save(any(Utilisateur.class));
    }
}
