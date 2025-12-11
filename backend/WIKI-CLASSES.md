# Wiki technique – Backend WebElec

Ce document liste les classes principales du backend Spring Boot WebElec, leur package et leur rôle général, sans extrapolation ni invention.

---

## 1. Modèles (model)

- **Chantier** : Entité persistée représentant un chantier.
- **Devis** : Entité persistée représentant un devis.
- **Client** : Entité persistée représentant un client.
- **Facture** : Entité persistée représentant une facture.
- **DevisLigne** : Entité persistée représentant une ligne de devis.
- **FactureLigne** : Entité persistée représentant une ligne de facture.
- **Intervention** : Entité persistée représentant une intervention.
- **UtilisateurRole** : Rôle d’un utilisateur.
- **Utilisateur** : Entité persistée représentant un utilisateur.
- **Societe** : Entité persistée représentant une société.
- **ProduitAvance** : Entité persistée représentant un produit avancé.
- **Produit** : Entité persistée représentant un produit.

## 2. DTO (dto)

- **UtilisateurSummary, UtilisateurResponse, UtilisateurRequest** : Objets d’échange API pour Utilisateur.
- **SocieteSummary, SocieteResponse, SocieteRequest** : Objets d’échange API pour Societe.
- **ProduitResponse, ProduitRequest** : Objets d’échange API pour Produit.
- **ProduitAvanceResponse, ProduitAvanceRequest** : Objets d’échange API pour ProduitAvance.
- **InterventionResponse, InterventionRequest** : Objets d’échange API pour Intervention.
- **FactureResponse, FactureRequest, FactureLigneRequest** : Objets d’échange API pour Facture et ses lignes.
- **DevisResponse, DevisRequest, DevisLigneRequest** : Objets d’échange API pour Devis et ses lignes.
- **ClientSummary, ClientResponse** : Objets d’échange API pour Client.

## 3. Contrôleurs (controller)

- **ChantierController** : Expose les endpoints REST pour les chantiers.
- **DevisController** : Expose les endpoints REST pour les devis.
- **ClientController** : Expose les endpoints REST pour les clients.
- **AuthController** : Expose les endpoints REST pour l’authentification.
- **InterventionController** : Expose les endpoints REST pour les interventions.
- **FactureController** : Expose les endpoints REST pour les factures.
- **UtilisateurController** : Expose les endpoints REST pour les utilisateurs.
- **SocieteController** : Expose les endpoints REST pour les sociétés.
- **ProduitController** : Expose les endpoints REST pour les produits.
- **ProduitAvanceController** : Expose les endpoints REST pour les produits avancés.

## 4. Services (service)

- **UtilisateurService, SocieteService, ProduitService, ProduitAvanceService, InterventionService, FactureService, DevisService, ClientService, ChantierService, AuthService** : Logique métier pour chaque entité correspondante.

## 5. Repositories (repository)

- **UtilisateurRepository, SocieteRepository, ProduitRepository, ProduitAvanceRepository, InterventionRepository, FactureRepository, DevisRepository, ClientRepository, ChantierRepository** : Accès aux données via JPA pour chaque entité correspondante.

---

Ce wiki ne détaille pas les champs ou méthodes internes, ni la logique métier, conformément aux instructions de sécurité backend WebElec.

Pour plus de détails sur une classe, se référer directement à son code source.
