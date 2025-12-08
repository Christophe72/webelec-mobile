package com.webelec.backend.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        UtilisateurResponse utilisateur
) {}
