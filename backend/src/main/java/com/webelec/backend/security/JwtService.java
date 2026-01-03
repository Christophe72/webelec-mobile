package com.webelec.backend.security;

import javax.crypto.SecretKey;

import com.webelec.backend.config.JwtProperties;
import com.webelec.backend.model.Utilisateur;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {

    private final JwtProperties properties;
    private final SecretKey signingKey;

    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(ensureBase64(properties.getSecret())));
    }

    public String generateAccessToken(Utilisateur utilisateur) {
        return buildToken(utilisateur, properties.getAccessTokenValidity());
    }

    public String generateRefreshToken(Utilisateur utilisateur) {
        return buildToken(utilisateur, properties.getRefreshTokenValidity());
    }

    private String buildToken(Utilisateur utilisateur, java.time.Duration validity) {
        Instant now = Instant.now();
        Instant expiry = now.plus(validity);
        Map<String, Object> claims = buildClaims(utilisateur);
        return Jwts.builder()
                .subject(utilisateur.getEmail())
                .issuer(properties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claims(claims)
                .signWith(signingKey)
                .compact();
    }

    public boolean isTokenValid(String token, Utilisateur utilisateur) {
        String username = extractUsername(token);
        return username.equals(utilisateur.getEmail()) && !isTokenExpired(token);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Instant extractExpiration(String token) {
        return extractClaim(token, claims -> claims.getExpiration().toInstant());
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).isBefore(Instant.now());
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    private String ensureBase64(String secret) {
        if (secret.matches("[A-Za-z0-9+/=]+")) {
            return secret;
        }
        return java.util.Base64.getEncoder().encodeToString(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    private Map<String, Object> buildClaims(Utilisateur utilisateur) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("uid", utilisateur.getId());

        String role = utilisateur.getRole() != null ? utilisateur.getRole().name() : null;
        Long societeId = utilisateur.getSociete() != null ? utilisateur.getSociete().getId() : null;

        if ((role == null || societeId == null)
                && utilisateur.getSocietes() != null
                && !utilisateur.getSocietes().isEmpty()) {
            var link = utilisateur.getSocietes().get(0);
            if (role == null && link.getRole() != null) {
                role = link.getRole().name();
            }
            if (societeId == null && link.getSociete() != null) {
                societeId = link.getSociete().getId();
            }
        }

        if (role != null) {
            claims.put("role", role);
        }
        if (societeId != null) {
            claims.put("societeId", societeId);
        }

        return claims;
    }
}
