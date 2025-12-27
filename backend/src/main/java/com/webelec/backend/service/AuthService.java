package com.webelec.backend.service;

import com.webelec.backend.dto.AuthLoginRequest;
import com.webelec.backend.dto.AuthRefreshRequest;
import com.webelec.backend.dto.AuthRegisterRequest;
import com.webelec.backend.dto.AuthResponse;
import com.webelec.backend.dto.UtilisateurResponse;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final SocieteRepository societeRepository;
    private final UserSocieteRoleRepository userSocieteRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UtilisateurRepository utilisateurRepository,
                       SocieteRepository societeRepository,
                       UserSocieteRoleRepository userSocieteRoleRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.societeRepository = societeRepository;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(AuthLoginRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Identifiants invalides"));

        if (!passwordEncoder.matches(request.motDePasse(), utilisateur.getMotDePasse())) {
            throw new IllegalArgumentException("Identifiants invalides");
        }
        // Pour un vrai SaaS multi-sociétés, il faudrait ici choisir la société active (via le token ou le contexte)
        return buildTokens(utilisateur);
    }

    @Transactional
    public AuthResponse register(AuthRegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.email())) {
            throw new ConflictException("Email déjà utilisé");
        }
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(request.nom());
        utilisateur.setPrenom(request.prenom());
        utilisateur.setEmail(request.email());
        utilisateur.setMotDePasse(passwordEncoder.encode(request.motDePasse()));
        utilisateur = utilisateurRepository.save(utilisateur);

        Societe societe = societeRepository.findById(request.societeId())
                .orElseThrow(() -> new IllegalArgumentException("Société inconnue"));
        UtilisateurRole role = parseRole(request.role());
        UserSocieteRole link = new UserSocieteRole(utilisateur, societe, role);
        userSocieteRoleRepository.save(link);
        return buildTokens(utilisateur);
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
        // Sécurisation : éviter NPE si la liste des sociétés est nulle
        utilisateur.setSocietes(java.util.Optional.ofNullable(utilisateur.getSocietes()).orElse(java.util.List.of()));
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