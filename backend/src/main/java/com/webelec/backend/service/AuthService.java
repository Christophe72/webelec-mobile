package com.webelec.backend.service;

import com.webelec.backend.dto.AuthLoginRequest;
import com.webelec.backend.dto.AuthRefreshRequest;
import com.webelec.backend.dto.AuthRegisterRequest;
import com.webelec.backend.dto.AuthResponse;
import com.webelec.backend.dto.UtilisateurResponse;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final SocieteRepository societeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       SocieteRepository societeRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.societeRepository = societeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthLoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants invalides"));

        if (!passwordEncoder.matches(request.motDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Identifiants invalides");
        }

        return buildTokens(utilisateur);
    }

    public AuthResponse register(AuthRegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("Email déjà utilisé");
        }
        UtilisateurRole role = parseRole(request.role());
        Societe societe = societeRepository.findById(request.societeId())
                .orElseThrow(() -> new IllegalArgumentException("Société inconnue"));
        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .motDePasse(passwordEncoder.encode(request.motDePasse()))
                .role(role)
                .societe(societe)
                .build();
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return buildTokens(saved);
    }

    public AuthResponse refresh(AuthRefreshRequest request) {
        String username = jwtService.extractUsername(request.refreshToken());
        Utilisateur utilisateur = utilisateurRepository.findByEmail(username)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        if (!jwtService.isTokenValid(request.refreshToken(), utilisateur)) {
            throw new IllegalArgumentException("Token invalide");
        }
        return buildTokens(utilisateur);
    }

    private AuthResponse buildTokens(Utilisateur utilisateur) {
        return new AuthResponse(
                jwtService.generateAccessToken(utilisateur),
                jwtService.generateRefreshToken(utilisateur),
                UtilisateurResponse.from(utilisateur)
        );
    }

    private UtilisateurRole parseRole(String value) {
        try {
            return UtilisateurRole.valueOf(value);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Rôle utilisateur invalide : " + value);
        }
    }
}
