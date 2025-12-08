package com.webelec.backend.config;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Produit;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.repository.ChantierRepository;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.InterventionRepository;
import com.webelec.backend.repository.ProduitRepository;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@Profile("!test")
public class DataSeeder {

    private final SocieteRepository societeRepository;
    private final SocieteSeedProperties seedProperties;
    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final ChantierRepository chantierRepository;
    private final ProduitRepository produitRepository;
    private final InterventionRepository interventionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(SocieteRepository societeRepository,
                      SocieteSeedProperties seedProperties,
                      UtilisateurRepository utilisateurRepository,
                      ClientRepository clientRepository,
                      ChantierRepository chantierRepository,
                      ProduitRepository produitRepository,
                      InterventionRepository interventionRepository,
                      PasswordEncoder passwordEncoder) {
        this.societeRepository = societeRepository;
        this.seedProperties = seedProperties;
        this.utilisateurRepository = utilisateurRepository;
        this.clientRepository = clientRepository;
        this.chantierRepository = chantierRepository;
        this.produitRepository = produitRepository;
        this.interventionRepository = interventionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void seed() {
        seedSocietes();
        seedDemoData();
    }

    private void seedSocietes() {
        if (societeRepository.count() > 0 || seedProperties.getSocietes().isEmpty()) {
            return;
        }

        seedProperties.getSocietes().forEach(entry -> societeRepository.save(createSociete(entry)));
    }

    private Societe createSociete(SocieteSeedProperties.Societe entry) {
        return Societe.builder()
                .nom(entry.getNom())
                .tva(entry.getTva())
                .email(entry.getEmail())
                .telephone(entry.getTelephone())
                .adresse(entry.getAdresse())
                .build();
    }

    @Transactional
    void seedDemoData() {
        if (clientRepository.count() > 0
                || chantierRepository.count() > 0
                || produitRepository.count() > 0
                || interventionRepository.count() > 0
                || utilisateurRepository.count() > 0) {
            return;
        }

        List<Societe> societes = societeRepository.findAll();
        if (societes.isEmpty()) {
            return;
        }

        seedAdmin(societes);

        Societe elecPro = societes.get(0);
        Societe voltServices = societes.size() > 1 ? societes.get(1) : elecPro;

        Utilisateur laura = utilisateurRepository.save(Utilisateur.builder()
                .nom("Lefevre")
                .prenom("Laura")
                .email("laura.lefevre@elecpro.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .role(UtilisateurRole.GERANT)
                .societe(elecPro)
                .build());

        Utilisateur hugo = utilisateurRepository.save(Utilisateur.builder()
                .nom("Martin")
                .prenom("Hugo")
                .email("hugo.martin@elecpro.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .role(UtilisateurRole.TECHNICIEN)
                .societe(elecPro)
                .build());

        Utilisateur clara = utilisateurRepository.save(Utilisateur.builder()
                .nom("Gonzales")
                .prenom("Clara")
                .email("clara.gonzales@voltservices.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .role(UtilisateurRole.GERANT)
                .societe(voltServices)
                .build());

        Utilisateur nabil = utilisateurRepository.save(Utilisateur.builder()
                .nom("Benali")
                .prenom("Nabil")
                .email("nabil.benali@voltservices.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .role(UtilisateurRole.TECHNICIEN)
                .societe(voltServices)
                .build());

        Client marcDupont = clientRepository.save(Client.builder()
                .nom("Dupont")
                .prenom("Marc")
                .email("marc.dupont@gmail.com")
                .telephone("06 01 02 03 04")
                .adresse("51 rue Centrale, Paris")
                .societe(elecPro)
                .build());

        Client julieMartin = clientRepository.save(Client.builder()
                .nom("Martin")
                .prenom("Julie")
                .email("julie.martin@gmail.com")
                .telephone("06 22 33 44 55")
                .adresse("12 impasse des Lilas, Paris")
                .societe(elecPro)
                .build());

        Client lucasBernard = clientRepository.save(Client.builder()
                .nom("Bernard")
                .prenom("Lucas")
                .email("lucas.bernard@gmail.com")
                .telephone("07 55 44 33 22")
                .adresse("8 rue des Oliviers, Lyon")
                .societe(voltServices)
                .build());

        Chantier garage = chantierRepository.save(Chantier.builder()
                .nom("Garage - Rue Centrale 51")
                .adresse("51 rue Centrale, Paris")
                .description("Installation d'une borne 11kW et d'un tableau secondaire")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        Chantier bureaux = chantierRepository.save(Chantier.builder()
                .nom("Bureaux Martin - Réseau")
                .adresse("12 impasse des Lilas, Paris")
                .description("Remise aux normes du réseau prises et RJ45")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        Chantier boutique = chantierRepository.save(Chantier.builder()
                .nom("Boutique Bernard - Lyon 2")
                .adresse("8 rue des Oliviers, Lyon")
                .description("Relamping LED + maintenance tableau général")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        produitRepository.save(Produit.builder()
                .reference("BORNE-11KW")
                .nom("Borne murale 11kW")
                .description("Borne triphasée connectée")
                .quantiteStock(5)
                .prixUnitaire(new BigDecimal("1199.00"))
                .societe(elecPro)
                .build());

        produitRepository.save(Produit.builder()
                .reference("TAB-63A")
                .nom("Tableau secondaire 63A")
                .description("Tableau pré-câblé pour extension garage")
                .quantiteStock(12)
                .prixUnitaire(new BigDecimal("389.00"))
                .societe(elecPro)
                .build());

        produitRepository.save(Produit.builder()
                .reference("LED-PRO-40W")
                .nom("Projecteur LED 40W IP65")
                .description("Projecteur extérieur blanc neutre")
                .quantiteStock(30)
                .prixUnitaire(new BigDecimal("79.90"))
                .societe(voltServices)
                .build());

        interventionRepository.save(Intervention.builder()
                .titre("Installation borne garage")
                .description("Pose borne BORNE-11KW et essais de charge")
                .dateIntervention(LocalDate.now().plusDays(3))
                .societe(elecPro)
                .client(marcDupont)
                .chantier(garage)
                .utilisateur(hugo)
                .build());

        interventionRepository.save(Intervention.builder()
                .titre("Audit réseau bureaux")
                .description("Diagnostic prises et baie de brassage")
                .dateIntervention(LocalDate.now().plusDays(7))
                .societe(elecPro)
                .client(julieMartin)
                .chantier(bureaux)
                .utilisateur(laura)
                .build());

        interventionRepository.save(Intervention.builder()
                .titre("Relamping LED boutique")
                .description("Remplacement de 18 projecteurs par LED-PRO-40W")
                .dateIntervention(LocalDate.now().plusDays(5))
                .societe(voltServices)
                .client(lucasBernard)
                .chantier(boutique)
                .utilisateur(nabil)
                .build());
    }

    private void seedAdmin(List<Societe> societes) {
        if (societes.isEmpty()) {
            return;
        }
        if (utilisateurRepository.existsByEmail("admin@webelec.fr")) {
            return;
        }
        Societe societe = societes.get(0);
        utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin")
                .prenom("WebElec")
                .email("admin@webelec.fr")
                .motDePasse(passwordEncoder.encode("Admin@12345"))
                .role(UtilisateurRole.ADMIN)
                .societe(societe)
                .build());
    }
}