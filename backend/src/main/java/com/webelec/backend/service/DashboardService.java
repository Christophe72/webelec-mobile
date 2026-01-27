package com.webelec.backend.service;

import com.webelec.backend.dto.DashboardMetrics;
import com.webelec.backend.repository.ChantierRepository;
import com.webelec.backend.repository.ProduitRepository;
import com.webelec.backend.repository.RgieHabilitationRepository;
import com.webelec.backend.repository.UserNotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final ChantierRepository chantierRepository;
    private final ProduitRepository produitRepository;
    private final RgieHabilitationRepository rgieHabilitationRepository;
    private final UserNotificationRepository userNotificationRepository;

    public DashboardService(
        ChantierRepository chantierRepository,
        ProduitRepository produitRepository,
        RgieHabilitationRepository rgieHabilitationRepository,
        UserNotificationRepository userNotificationRepository
    ) {
        this.chantierRepository = chantierRepository;
        this.produitRepository = produitRepository;
        this.rgieHabilitationRepository = rgieHabilitationRepository;
        this.userNotificationRepository = userNotificationRepository;
    }

    public DashboardMetrics getDashboardMetrics(Long societeId, Long userId) {
        // Compter les chantiers actifs pour la société
        int activeSitesCount = (int) chantierRepository.findBySocieteId(societeId).size();

        // Compter les produits avec stock faible (quantité < 10 par exemple)
        int stockAlertsCount = (int) produitRepository.findBySocieteId(societeId).stream()
            .filter(p -> p.getQuantiteStock() != null && p.getQuantiteStock() < 10)
            .count();

        // Compter les habilitations RGIE expirées ou bientôt expirées
        int rgieAlertsCount = 0; // À implémenter selon logique métier

        // Compter les notifications critiques non lues
        int criticalNotificationsCount = (int) userNotificationRepository.countByUtilisateurIdAndReadFalse(userId);

        return new DashboardMetrics(
            activeSitesCount,
            stockAlertsCount,
            rgieAlertsCount,
            criticalNotificationsCount
        );
    }
}
