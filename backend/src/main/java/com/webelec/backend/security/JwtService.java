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
import java.util.Map;
import java.util.function.Function;

/**
 * Service de gestion des tokens JWT (JSON Web Token) pour l'authentification et l'autorisation.
 * <p>
 * Ce service est responsable de la génération, validation et extraction des informations
 * contenues dans les tokens JWT utilisés pour sécuriser l'application WebElec SaaS.
 * </p>
 *
 * <h2>Structure des Tokens</h2>
 * Les tokens générés contiennent les claims suivants :
 * <ul>
 *   <li><strong>subject</strong> : L'email de l'utilisateur (identifiant unique)</li>
 *   <li><strong>issuer</strong> : L'émetteur du token (configurable via JwtProperties)</li>
 *   <li><strong>issuedAt</strong> : Date/heure de création du token</li>
 *   <li><strong>expiration</strong> : Date/heure d'expiration du token</li>
 *   <li><strong>uid</strong> : L'ID de l'utilisateur dans la base de données</li>
 *   <li><strong>role</strong> : Le rôle de l'utilisateur (ADMIN, USER, etc.)</li>
 *   <li><strong>societeId</strong> : L'ID de la société associée (architecture multi-tenant)</li>
 * </ul>
 *
 * <h2>Types de Tokens</h2>
 * Le service génère deux types de tokens :
 * <ul>
 *   <li><strong>Access Token</strong> : Token de courte durée utilisé pour les requêtes API</li>
 *   <li><strong>Refresh Token</strong> : Token de longue durée utilisé pour renouveler les access tokens</li>
 * </ul>
 *
 * <h2>Sécurité</h2>
 * <ul>
 *   <li>Les tokens sont signés avec HMAC-SHA en utilisant une clé secrète</li>
 *   <li>La clé secrète est encodée en Base64 pour assurer la compatibilité</li>
 *   <li>Les tokens expirent automatiquement selon la configuration</li>
 *   <li>La validation vérifie à la fois la signature et l'expiration</li>
 * </ul>
 *
 * <h2>Architecture Multi-Tenant</h2>
 * Les tokens incluent le <code>societeId</code> pour supporter l'architecture multi-tenant
 * de l'application, permettant l'isolation des données entre différentes sociétés clientes.
 *
 * @author WebElec Team
 * @version 1.0
 * @see JwtProperties
 * @see com.webelec.backend.security.JwtAuthenticationFilter
 * @since 2025-01-10
 */
@Component
public class JwtService {

    /**
     * Configuration des propriétés JWT (durées de validité, issuer, secret).
     */
    private final JwtProperties properties;

    /**
     * Clé secrète utilisée pour signer et vérifier les tokens JWT.
     * Dérivée du secret configuré dans JwtProperties et encodée en Base64.
     */
    private final SecretKey signingKey;

    /**
     * Constructeur du service JWT.
     * <p>
     * Initialise le service avec les propriétés de configuration et génère la clé de signature
     * à partir du secret configuré. Le secret est automatiquement converti en Base64 si nécessaire.
     * </p>
     *
     * @param properties Configuration JWT contenant le secret, les durées de validité et l'issuer
     * @throws IllegalArgumentException si le secret est vide ou invalide
     * @see JwtProperties
     */
    public JwtService(JwtProperties properties) {
        this.properties = properties;
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(ensureBase64(properties.getSecret())));
    }

    /**
     * Génère un access token JWT pour un utilisateur authentifié.
     * <p>
     * L'access token est un token de courte durée (typiquement 15 minutes à 1 heure)
     * utilisé pour authentifier les requêtes API. Il contient l'email de l'utilisateur
     * comme subject, ainsi que son ID, rôle et société dans les claims personnalisés.
     * </p>
     *
     * <h3>Utilisation</h3>
     * Ce token doit être inclus dans l'en-tête Authorization des requêtes HTTP :
     * <pre>Authorization: Bearer {access_token}</pre>
     *
     * @param utilisateur L'utilisateur pour lequel générer le token
     * @return Le token JWT signé sous forme de String
     * @throws NullPointerException si l'utilisateur est null
     * @see #generateRefreshToken(Utilisateur)
     * @see #buildToken(Utilisateur, java.time.Duration)
     */
    public String generateAccessToken(Utilisateur utilisateur) {
        return buildToken(utilisateur, properties.getAccessTokenValidity());
    }

    /**
     * Génère un refresh token JWT pour un utilisateur authentifié.
     * <p>
     * Le refresh token est un token de longue durée (typiquement 7 à 30 jours)
     * utilisé pour obtenir un nouveau access token sans redemander les identifiants.
     * Il contient les mêmes informations que l'access token mais avec une durée de vie plus longue.
     * </p>
     *
     * <h3>Flux d'utilisation</h3>
     * <ol>
     *   <li>L'utilisateur se connecte et reçoit un access token + refresh token</li>
     *   <li>L'access token expire après la durée configurée</li>
     *   <li>Le client utilise le refresh token pour obtenir un nouvel access token</li>
     *   <li>Le processus se répète jusqu'à l'expiration du refresh token</li>
     * </ol>
     *
     * @param utilisateur L'utilisateur pour lequel générer le token
     * @return Le refresh token JWT signé sous forme de String
     * @throws NullPointerException si l'utilisateur est null
     * @see #generateAccessToken(Utilisateur)
     * @see #buildToken(Utilisateur, java.time.Duration)
     */
    public String generateRefreshToken(Utilisateur utilisateur) {
        return buildToken(utilisateur, properties.getRefreshTokenValidity());
    }

    /**
     * Construit un token JWT avec une durée de validité spécifiée.
     * <p>
     * Cette méthode privée est le cœur de la génération de tokens. Elle crée un token
     * contenant toutes les informations nécessaires pour l'authentification et l'autorisation.
     * </p>
     *
     * <h3>Claims Standards JWT</h3>
     * <ul>
     *   <li><strong>subject (sub)</strong> : Email de l'utilisateur</li>
     *   <li><strong>issuer (iss)</strong> : Émetteur du token (ex: "webelec-saas-api")</li>
     *   <li><strong>issuedAt (iat)</strong> : Timestamp de création</li>
     *   <li><strong>expiration (exp)</strong> : Timestamp d'expiration</li>
     * </ul>
     *
     * <h3>Claims Personnalisés (Multi-tenant)</h3>
     * <ul>
     *   <li><strong>uid</strong> : ID de l'utilisateur (Long)</li>
     *   <li><strong>role</strong> : Rôle de l'utilisateur (String, peut être null)</li>
     *   <li><strong>societeId</strong> : ID de la société (Long, peut être null pour super-admin)</li>
     * </ul>
     *
     * <h3>Gestion des valeurs nulles</h3>
     * Les champs <code>role</code> et <code>societeId</code> peuvent être null pour gérer
     * les cas suivants :
     * <ul>
     *   <li>Utilisateur sans rôle assigné (en attente de validation)</li>
     *   <li>Super-administrateur sans société associée</li>
     * </ul>
     *
     * @param utilisateur L'utilisateur pour lequel construire le token
     * @param validity La durée de validité du token (ex: Duration.ofHours(1))
     * @return Le token JWT signé et compact (format: header.payload.signature)
     */
    private String buildToken(Utilisateur utilisateur, java.time.Duration validity) {
        Instant now = Instant.now();
        Instant expiry = now.plus(validity);
        return Jwts.builder()
                .subject(utilisateur.getEmail())
                .issuer(properties.getIssuer())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claims(Map.of(
                        "uid", utilisateur.getId(),
                        "role", utilisateur.getRole() != null ? utilisateur.getRole().name() : null,
                        "societeId", utilisateur.getSociete() != null ? utilisateur.getSociete().getId() : null
                ))
                .signWith(signingKey)
                .compact();
    }

    /**
     * Vérifie si un token JWT est valide pour un utilisateur donné.
     * <p>
     * La validation effectue deux vérifications essentielles :
     * </p>
     * <ol>
     *   <li><strong>Correspondance utilisateur</strong> : L'email dans le subject du token
     *       doit correspondre à l'email de l'utilisateur fourni</li>
     *   <li><strong>Expiration</strong> : Le token ne doit pas être expiré</li>
     * </ol>
     *
     * <h3>Sécurité</h3>
     * Cette méthode effectue également une vérification implicite de la signature du token
     * lors de l'extraction du username. Si la signature est invalide, une exception sera levée.
     *
     * @param token Le token JWT à valider
     * @param utilisateur L'utilisateur pour lequel valider le token
     * @return {@code true} si le token est valide et non expiré, {@code false} sinon
     * @throws io.jsonwebtoken.JwtException si le token est malformé ou la signature est invalide
     * @see #extractUsername(String)
     * @see #isTokenExpired(String)
     */
    public boolean isTokenValid(String token, Utilisateur utilisateur) {
        String username = extractUsername(token);
        return username.equals(utilisateur.getEmail()) && !isTokenExpired(token);
    }

    /**
     * Extrait l'email (username) du subject du token JWT.
     * <p>
     * Dans l'architecture WebElec, l'email est utilisé comme identifiant unique
     * de l'utilisateur et est stocké dans le claim standard "subject" (sub) du JWT.
     * </p>
     *
     * <h3>Utilisation typique</h3>
     * Cette méthode est principalement utilisée par {@link JwtAuthenticationFilter}
     * pour identifier l'utilisateur lors du traitement d'une requête authentifiée.
     *
     * @param token Le token JWT à analyser
     * @return L'email de l'utilisateur extrait du subject
     * @throws io.jsonwebtoken.JwtException si le token est invalide ou expiré
     * @see #extractClaim(String, Function)
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrait la date d'expiration du token JWT.
     * <p>
     * Cette méthode récupère le claim standard "expiration" (exp) et le convertit
     * en {@link Instant} pour faciliter les comparaisons temporelles.
     * </p>
     *
     * @param token Le token JWT à analyser
     * @return La date/heure d'expiration du token sous forme d'Instant
     * @throws io.jsonwebtoken.JwtException si le token est invalide
     * @see #isTokenExpired(String)
     * @see #extractClaim(String, Function)
     */
    public Instant extractExpiration(String token) {
        return extractClaim(token, claims -> claims.getExpiration().toInstant());
    }

    /**
     * Vérifie si un token JWT est expiré.
     * <p>
     * Compare la date d'expiration du token avec l'instant actuel.
     * Un token est considéré comme expiré si sa date d'expiration est antérieure
     * à l'instant présent.
     * </p>
     *
     * @param token Le token JWT à vérifier
     * @return {@code true} si le token est expiré, {@code false} sinon
     * @throws io.jsonwebtoken.JwtException si le token est invalide
     * @see #extractExpiration(String)
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).isBefore(Instant.now());
    }

    /**
     * Extrait un claim spécifique d'un token JWT en utilisant une fonction de résolution.
     * <p>
     * Cette méthode générique permet d'extraire n'importe quel claim du token en fournissant
     * une fonction qui transforme l'objet {@link Claims} en la valeur souhaitée.
     * </p>
     *
     * <h3>Processus de validation</h3>
     * Lors de l'extraction, le token est automatiquement :
     * <ol>
     *   <li>Parsé pour vérifier sa structure</li>
     *   <li>Vérifié avec la clé de signature (authentification)</li>
     *   <li>Validé pour s'assurer qu'il n'a pas été altéré</li>
     * </ol>
     *
     * <h3>Exemples d'utilisation</h3>
     * <pre>{@code
     * // Extraire l'email (subject)
     * String email = extractClaim(token, Claims::getSubject);
     *
     * // Extraire un claim personnalisé
     * Long userId = extractClaim(token, claims -> claims.get("uid", Long.class));
     *
     * // Extraire le rôle
     * String role = extractClaim(token, claims -> claims.get("role", String.class));
     * }</pre>
     *
     * @param <T> Le type de la valeur à extraire
     * @param token Le token JWT à analyser
     * @param resolver Fonction qui transforme les Claims en la valeur souhaitée
     * @return La valeur extraite du token
     * @throws io.jsonwebtoken.JwtException si le token est invalide, expiré ou la signature est incorrecte
     * @throws io.jsonwebtoken.MalformedJwtException si le token est malformé
     * @throws io.jsonwebtoken.ExpiredJwtException si le token est expiré
     * @throws io.jsonwebtoken.SignatureException si la signature ne correspond pas
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    /**
     * Assure que le secret JWT est encodé en Base64.
     * <p>
     * Cette méthode détecte automatiquement si le secret fourni est déjà en Base64
     * ou s'il s'agit d'une chaîne de caractères brute. Si le secret n'est pas en Base64,
     * il est automatiquement encodé.
     * </p>
     *
     * <h3>Détection Base64</h3>
     * Un secret est considéré comme déjà encodé en Base64 s'il ne contient que
     * les caractères valides Base64 : A-Z, a-z, 0-9, +, / et =
     *
     * <h3>Cas d'utilisation</h3>
     * Cette flexibilité permet de configurer le secret de deux façons :
     * <ul>
     *   <li><strong>Secret brut</strong> : "mon-secret-super-securise" (sera encodé automatiquement)</li>
     *   <li><strong>Secret Base64</strong> : "bW9uLXNlY3JldC1zdXBlci1zZWN1cmlzZQ==" (utilisé tel quel)</li>
     * </ul>
     *
     * <h3>Recommandations de sécurité</h3>
     * <ul>
     *   <li>Utilisez un secret d'au moins 256 bits (32 caractères) pour HMAC-SHA256</li>
     *   <li>Générez le secret avec un générateur cryptographique sécurisé</li>
     *   <li>Ne commitez jamais le secret dans le code source (utilisez des variables d'environnement)</li>
     * </ul>
     *
     * @param secret Le secret JWT brut ou déjà encodé en Base64
     * @return Le secret encodé en Base64
     * @throws NullPointerException si le secret est null
     */
    private String ensureBase64(String secret) {
        if (secret.matches("[A-Za-z0-9+/=]+")) {
            return secret;
        }
        return java.util.Base64.getEncoder().encodeToString(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }
}