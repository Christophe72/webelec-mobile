# Pistes d’amélioration pour WebElec SaaS

Ce document liste des idées d’amélioration **sans modifier le code**. Il sert de repère pour savoir **où** intervenir dans le SaaS (frontend, backend, données, documentation, process) et **quoi** prioriser.

## 1) Expérience utilisateur (frontend)

**Où ?** `frontend/`

- **Parcours de création de devis/factures** : guider l’utilisateur pas à pas (wizard) et afficher les erreurs métier au bon endroit.
- **Tableaux de bord plus actionnables** : KPIs (factures en retard, interventions à planifier) + raccourcis.
- **Recherche globale** : un champ unique pour clients/chantiers/interventions.
- **Accessibilité** : contrastes, tailles de texte, navigation clavier, messages d’erreur clairs.

## 2) Qualité des données & conformité (backend)

**Où ?** `backend/`

- **Validation renforcée** : règles RGIE versionnées par date, contrôles TVA/PEPPOL plus stricts.
- **Traçabilité** : journalisation des actions sensibles (création/modif/suppression).
- **Sécurité** : durcir les rôles, limiter les endpoints critiques, audit des permissions.

## 3) Performances & scalabilité

**Où ?** `backend/`, `docker/`, `docker-compose.yml`

- **Cache** pour données statiques (catalogues, RGIE) et réponses souvent lues.
- **Pagination systématique** sur les listes volumineuses.
- **Optimisation DB** : index sur colonnes de recherche (clients, chantiers, factures).

## 4) Observabilité & opérations

**Où ?** `backend/`, `docker/`, documentation `docs/`

- **Logs structurés** (JSON) + corrélation des requêtes.
- **Tableaux de bord santé** : uptime, latence, erreurs 4xx/5xx.
- **Alerting** : seuils d’erreur, délais de réponse, stockage pièces jointes.

## 5) Fiabilité & tests

**Où ?** `backend/`, `frontend/`

- **Tests API** sur flux critiques (devis -> facture -> UBL/Peppol).
- **Tests UI** pour écrans sensibles (connexion, facturation).
- **Matrice d’environnements** (dev/staging/prod) avec données réalistes.

## 6) Documentation & onboarding

**Où ?** `README.md`, `docs/`

- **Guide d’onboarding** pour nouveaux clients (premiers pas, checklist RGIE).
- **FAQ** orientée terrain (erreurs courantes, cas RGIE fréquents).
- **Modèles** : exemple de devis/facture, pièce justificative attendue.

## 7) IA & assistance

**Où ?** `module-ia-stock.md`, backend IA si existant

- **Assistant contextuel** : suggérer des actions correctives plutôt que répondre génériquement.
- **Explications RGIE** : liens directs vers articles, seuils et cas d’usage.

## 8) Produits & stock

**Où ?** `backend/` (produits), `frontend/`

- **Catalogue enrichi** : catégories, filtres, favoris, import fournisseurs.
- **Alertes de stock** : seuils critiques + notifications.

## 9) Facturation électronique (Peppol/UBL)

**Où ?** `backend/`

- **Interopérabilité** : validation UBL stricte, tests de conformité BIS 3.0.
- **Statuts d’envoi** : suivi clair (envoyé, accepté, rejeté, erreur).

## 10) Sécurité & conformité légale

**Où ?** `backend/`, `docs/`

- **RGPD** : politique de rétention, suppression, export données client.
- **PII** : chiffrement au repos (pièces justificatives et données sensibles).

---

## Priorisation suggérée (rapide)

1. **Fiabilité** : validations RGIE + tests critiques.
2. **UX** : parcours devis/factures + recherche globale.
3. **Observabilité** : logs, erreurs, monitoring.
4. **Peppol** : statuts et conformité UBL.

---

Si tu veux, je peux détailler l’un des axes (ex : UX facturation, RGIE, Peppol) ou rédiger un plan d’action par sprint.
