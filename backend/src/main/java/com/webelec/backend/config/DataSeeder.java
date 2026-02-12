package com.webelec.backend.config;

import com.webelec.backend.model.Chantier;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Devis;
import com.webelec.backend.model.DevisLigne;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;
import com.webelec.backend.model.Intervention;
import com.webelec.backend.model.Produit;
import com.webelec.backend.model.Societe;
import com.webelec.backend.model.Utilisateur;
import com.webelec.backend.model.UtilisateurRole;
import com.webelec.backend.model.UserSocieteRole;
import com.webelec.backend.repository.ChantierRepository;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.DevisRepository;
import com.webelec.backend.repository.FactureRepository;
import com.webelec.backend.repository.InterventionRepository;
import com.webelec.backend.repository.ProduitRepository;
import com.webelec.backend.repository.SocieteRepository;
import com.webelec.backend.repository.UtilisateurRepository;
import com.webelec.backend.repository.UserSocieteRoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@Profile("!test")
public class DataSeeder {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final SocieteRepository societeRepository;
    private final SocieteSeedProperties seedProperties;
    private final UtilisateurRepository utilisateurRepository;
    private final ClientRepository clientRepository;
    private final ChantierRepository chantierRepository;
    private final ProduitRepository produitRepository;
    private final InterventionRepository interventionRepository;
    private final DevisRepository devisRepository;
    private final FactureRepository factureRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserSocieteRoleRepository userSocieteRoleRepository;

    public DataSeeder(SocieteRepository societeRepository,
                      SocieteSeedProperties seedProperties,
                      UtilisateurRepository utilisateurRepository,
                      ClientRepository clientRepository,
                      ChantierRepository chantierRepository,
                      ProduitRepository produitRepository,
                      InterventionRepository interventionRepository,
                      DevisRepository devisRepository,
                      FactureRepository factureRepository,
                      PasswordEncoder passwordEncoder,
                      UserSocieteRoleRepository userSocieteRoleRepository) {
        this.societeRepository = societeRepository;
        this.seedProperties = seedProperties;
        this.utilisateurRepository = utilisateurRepository;
        this.clientRepository = clientRepository;
        this.chantierRepository = chantierRepository;
        this.produitRepository = produitRepository;
        this.interventionRepository = interventionRepository;
        this.devisRepository = devisRepository;
        this.factureRepository = factureRepository;
        this.passwordEncoder = passwordEncoder;
        this.userSocieteRoleRepository = userSocieteRoleRepository;
    }

    @PostConstruct
    public void seed() {
        try {
            seedSocietes();
            seedDemoData();
        } catch (DataAccessException ex) {
            // Typiquement: première exécution, schéma pas encore créé => tables inexistantes.
            // On ne bloque pas le démarrage en dev; les seeds seront rejoués au prochain restart.
            log.warn("Seed ignoré car la base n'est pas prête (tables absentes ou schéma indisponible): {}", ex.getMostSpecificCause() != null ? ex.getMostSpecificCause().getMessage() : ex.getMessage());
        }
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
                || devisRepository.count() > 0
                || factureRepository.count() > 0
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
                .build());
        userSocieteRoleRepository.save(new UserSocieteRole(laura, elecPro, UtilisateurRole.ARTISAN));

        Utilisateur hugo = utilisateurRepository.save(Utilisateur.builder()
                .nom("Martin")
                .prenom("Hugo")
                .email("hugo.martin@elecpro.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .build());
        userSocieteRoleRepository.save(new UserSocieteRole(hugo, elecPro, UtilisateurRole.TECH));

        Utilisateur clara = utilisateurRepository.save(Utilisateur.builder()
                .nom("Gonzales")
                .prenom("Clara")
                .email("clara.gonzales@voltservices.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .build());
        userSocieteRoleRepository.save(new UserSocieteRole(clara, voltServices, UtilisateurRole.ARTISAN));

        Utilisateur nabil = utilisateurRepository.save(Utilisateur.builder()
                .nom("Benali")
                .prenom("Nabil")
                .email("nabil.benali@voltservices.fr")
                .motDePasse(passwordEncoder.encode("demo123!"))
                .build());
        userSocieteRoleRepository.save(new UserSocieteRole(nabil, voltServices, UtilisateurRole.TECH));

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

        // Produits ElecPro
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
                .reference("DISJ-16A")
                .nom("Disjoncteur 16A")
                .description("Disjoncteur modulaire courbe C")
                .quantiteStock(48)
                .prixUnitaire(new BigDecimal("12.50"))
                .societe(elecPro)
                .build());

        produitRepository.save(Produit.builder()
                .reference("CABLE-2.5")
                .nom("Câble 2.5mm²")
                .description("Câble H07VK 2.5mm² (rouleau 100m)")
                .quantiteStock(8)
                .prixUnitaire(new BigDecimal("89.00"))
                .societe(elecPro)
                .build());

        produitRepository.save(Produit.builder()
                .reference("INTER-VA-ET-VIENT")
                .nom("Interrupteur va-et-vient")
                .description("Interrupteur simple encastré blanc")
                .quantiteStock(65)
                .prixUnitaire(new BigDecimal("3.80"))
                .societe(elecPro)
                .build());

        produitRepository.save(Produit.builder()
                .reference("PRISE-2P-T")
                .nom("Prise 2P+T 16A")
                .description("Prise encastrée avec terre")
                .quantiteStock(82)
                .prixUnitaire(new BigDecimal("4.20"))
                .societe(elecPro)
                .build());

        // Produits VoltServices
        produitRepository.save(Produit.builder()
                .reference("LED-PRO-40W")
                .nom("Projecteur LED 40W IP65")
                .description("Projecteur extérieur blanc neutre")
                .quantiteStock(30)
                .prixUnitaire(new BigDecimal("79.90"))
                .societe(voltServices)
                .build());

        produitRepository.save(Produit.builder()
                .reference("TUBE-LED-120")
                .nom("Tube LED 120cm")
                .description("Tube LED T8 18W blanc froid")
                .quantiteStock(45)
                .prixUnitaire(new BigDecimal("15.90"))
                .societe(voltServices)
                .build());

        produitRepository.save(Produit.builder()
                .reference("DETECT-MOUV")
                .nom("Détecteur de mouvement")
                .description("Détecteur IR 180° encastrable")
                .quantiteStock(15)
                .prixUnitaire(new BigDecimal("28.50"))
                .societe(voltServices)
                .build());

        produitRepository.save(Produit.builder()
                .reference("GAINE-ICTA-20")
                .nom("Gaine ICTA Ø20mm")
                .description("Gaine annelée ICTA (couronne 100m)")
                .quantiteStock(6)
                .prixUnitaire(new BigDecimal("42.00"))
                .societe(voltServices)
                .build());

        produitRepository.save(Produit.builder()
                .reference("DIFF-30MA")
                .nom("Interrupteur différentiel 30mA")
                .description("Différentiel type A 40A 30mA")
                .quantiteStock(0)
                .prixUnitaire(new BigDecimal("78.00"))
                .societe(voltServices)
                .build());

        produitRepository.save(Produit.builder()
                .reference("BOITE-ENCAST")
                .nom("Boîte d'encastrement")
                .description("Boîte simple étanche Ø67mm")
                .quantiteStock(120)
                .prixUnitaire(new BigDecimal("1.25"))
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

        // Factures réparties sur 6 mois pour alimenter les graphiques
        LocalDate now = LocalDate.now();

        // Mois actuel
        factureRepository.save(Facture.builder()
                .numero("FAC-2025-015")
                .dateEmission(now.minusDays(3))
                .dateEcheance(now.plusDays(27))
                .montantHT(new BigDecimal("1588.00"))
                .montantTVA(new BigDecimal("333.48"))
                .montantTTC(new BigDecimal("1921.48"))
                .statut("EN_ATTENTE")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2025-016")
                .dateEmission(now.minusDays(5))
                .dateEcheance(now.plusDays(25))
                .montantHT(new BigDecimal("890.00"))
                .montantTVA(new BigDecimal("186.90"))
                .montantTTC(new BigDecimal("1076.90"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        // Mois -1
        factureRepository.save(Facture.builder()
                .numero("FAC-2025-012")
                .dateEmission(now.minusMonths(1).minusDays(8))
                .dateEcheance(now.minusMonths(1).plusDays(22))
                .montantHT(new BigDecimal("2450.00"))
                .montantTVA(new BigDecimal("514.50"))
                .montantTTC(new BigDecimal("2964.50"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2025-013")
                .dateEmission(now.minusMonths(1).minusDays(15))
                .dateEcheance(now.minusMonths(1).plusDays(15))
                .montantHT(new BigDecimal("1120.00"))
                .montantTVA(new BigDecimal("235.20"))
                .montantTTC(new BigDecimal("1355.20"))
                .statut("PAYEE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2025-014")
                .dateEmission(now.minusMonths(1).minusDays(20))
                .dateEcheance(now.minusMonths(1).plusDays(10))
                .montantHT(new BigDecimal("675.00"))
                .montantTVA(new BigDecimal("141.75"))
                .montantTTC(new BigDecimal("816.75"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        // Mois -2
        factureRepository.save(Facture.builder()
                .numero("FAC-2024-009")
                .dateEmission(now.minusMonths(2).minusDays(5))
                .dateEcheance(now.minusMonths(2).plusDays(25))
                .montantHT(new BigDecimal("3200.00"))
                .montantTVA(new BigDecimal("672.00"))
                .montantTTC(new BigDecimal("3872.00"))
                .statut("PAYEE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-010")
                .dateEmission(now.minusMonths(2).minusDays(12))
                .dateEcheance(now.minusMonths(2).plusDays(18))
                .montantHT(new BigDecimal("1890.00"))
                .montantTVA(new BigDecimal("396.90"))
                .montantTTC(new BigDecimal("2286.90"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        // Mois -3
        factureRepository.save(Facture.builder()
                .numero("FAC-2024-006")
                .dateEmission(now.minusMonths(3).minusDays(7))
                .dateEcheance(now.minusMonths(3).plusDays(23))
                .montantHT(new BigDecimal("2780.00"))
                .montantTVA(new BigDecimal("583.80"))
                .montantTTC(new BigDecimal("3363.80"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-007")
                .dateEmission(now.minusMonths(3).minusDays(18))
                .dateEcheance(now.minusMonths(3).plusDays(12))
                .montantHT(new BigDecimal("1450.00"))
                .montantTVA(new BigDecimal("304.50"))
                .montantTTC(new BigDecimal("1754.50"))
                .statut("PAYEE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-008")
                .dateEmission(now.minusMonths(3).minusDays(22))
                .dateEcheance(now.minusMonths(3).plusDays(8))
                .montantHT(new BigDecimal("920.00"))
                .montantTVA(new BigDecimal("193.20"))
                .montantTTC(new BigDecimal("1113.20"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        // Mois -4
        factureRepository.save(Facture.builder()
                .numero("FAC-2024-003")
                .dateEmission(now.minusMonths(4).minusDays(10))
                .dateEcheance(now.minusMonths(4).plusDays(20))
                .montantHT(new BigDecimal("1650.00"))
                .montantTVA(new BigDecimal("346.50"))
                .montantTTC(new BigDecimal("1996.50"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-004")
                .dateEmission(now.minusMonths(4).minusDays(16))
                .dateEcheance(now.minusMonths(4).plusDays(14))
                .montantHT(new BigDecimal("2340.00"))
                .montantTVA(new BigDecimal("491.40"))
                .montantTTC(new BigDecimal("2831.40"))
                .statut("PAYEE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-005")
                .dateEmission(now.minusMonths(4).minusDays(25))
                .dateEcheance(now.minusMonths(4).plusDays(5))
                .montantHT(new BigDecimal("780.00"))
                .montantTVA(new BigDecimal("163.80"))
                .montantTTC(new BigDecimal("943.80"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(marcDupont)
                .build());

        // Mois -5
        factureRepository.save(Facture.builder()
                .numero("FAC-2024-001")
                .dateEmission(now.minusMonths(5).minusDays(8))
                .dateEcheance(now.minusMonths(5).plusDays(22))
                .montantHT(new BigDecimal("3450.00"))
                .montantTVA(new BigDecimal("724.50"))
                .montantTTC(new BigDecimal("4174.50"))
                .statut("PAYEE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        factureRepository.save(Facture.builder()
                .numero("FAC-2024-002")
                .dateEmission(now.minusMonths(5).minusDays(19))
                .dateEcheance(now.minusMonths(5).plusDays(11))
                .montantHT(new BigDecimal("1280.00"))
                .montantTVA(new BigDecimal("268.80"))
                .montantTTC(new BigDecimal("1548.80"))
                .statut("PAYEE")
                .societe(elecPro)
                .client(julieMartin)
                .build());

        Devis devisBoutique = devisRepository.save(Devis.builder()
                .numero("DEV-2025-045")
                .dateEmission(LocalDate.now().minusDays(10))
                .dateExpiration(LocalDate.now().plusDays(20))
                .montantHT(new BigDecimal("2397.00"))
                .montantTVA(new BigDecimal("503.37"))
                .montantTTC(new BigDecimal("2900.37"))
                .statut("ACCEPTE")
                .societe(voltServices)
                .client(lucasBernard)
                .build());

        DevisLigne ledLigne = new DevisLigne(
                null,
                "Projecteur LED PRO 40W",
                18,
                new BigDecimal("79.90"),
                new BigDecimal("1438.20"),
                devisBoutique);
        DevisLigne mainOeuvreLigne = new DevisLigne(
                null,
                "Main d'oeuvre relamping (heure)",
                12,
                new BigDecimal("80.00"),
                new BigDecimal("960.00"),
                devisBoutique);
        devisBoutique.getLignes().add(ledLigne);
        devisBoutique.getLignes().add(mainOeuvreLigne);
        devisRepository.save(devisBoutique);
    }

    private void seedAdmin(List<Societe> societes) {
        if (societes.isEmpty()) {
            return;
        }
        if (utilisateurRepository.existsByEmail("admin@webelec.fr")) {
            return;
        }
        Societe societe = societes.get(0);
        Utilisateur admin = utilisateurRepository.save(Utilisateur.builder()
                .nom("Admin")
                .prenom("WebElec")
                .email("admin@webelec.fr")
                .motDePasse(passwordEncoder.encode("Admin@12345"))
                .build());
        userSocieteRoleRepository.save(new UserSocieteRole(admin, societe, UtilisateurRole.ADMIN));
    }
}
