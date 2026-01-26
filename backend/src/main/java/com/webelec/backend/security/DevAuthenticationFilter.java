package com.webelec.backend.security;

import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.repository.UtilisateurRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

/**
 * Filtre utilise uniquement en developpement pour pre-remplir le SecurityContext
 * avec un utilisateur existant. Cela permet de tester l'API sans login.
 */
@Component
@Profile("dev")
public class DevAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(DevAuthenticationFilter.class);

    private final UtilisateurRepository utilisateurRepository;
    private final String devUserEmail;

    public DevAuthenticationFilter(UtilisateurRepository utilisateurRepository,
                                   @Value("${webelec.security.dev-user-email:admin@webelec.fr}") String devUserEmail) {
        this.utilisateurRepository = utilisateurRepository;
        this.devUserEmail = devUserEmail;
    }
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            resolveDevUtilisateur().ifPresent(utilisateur -> {
                var principal = new AuthenticatedUtilisateur(utilisateur);
                var authToken = new UsernamePasswordAuthenticationToken(
                        principal,
                        null,
                        principal.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            });
        }
        filterChain.doFilter(request, response);
    }

    private Optional<Utilisateur> resolveDevUtilisateur() {
        Optional<Utilisateur> utilisateur = utilisateurRepository.findByEmail(devUserEmail);
        if (utilisateur.isEmpty()) {
            utilisateur = utilisateurRepository.findFirstByOrderByIdAsc();
        }
        if (utilisateur.isEmpty()) {
            log.warn("[DEV AUTH] Aucun utilisateur n'est disponible pour le bypass. Le login reste requis.");
        }
        return utilisateur;
    }
}
