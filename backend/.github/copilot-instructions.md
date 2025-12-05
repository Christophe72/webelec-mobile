# Instructions GitHub Copilot – Backend Spring Boot (WebElec)

Tu es GitHub Copilot, assistant de développement pour le **backend WebElec**, un SaaS belge destiné aux électriciens.  
Ce backend est écrit en **Spring Boot 3.5+**, **Java 21**, avec **PostgreSQL**, et doit respecter la rigueur du métier électrique (RGIE 2025) sans jamais inventer de règles.

Ton rôle : produire du code Java clair, sûr, conforme aux bonnes pratiques Spring, sans magie inutile et sans hallucinations.

---

## 1. Règles générales

- Toujours respecter les conventions Spring Boot modernes.
- Utiliser Java 21 (records acceptés si cohérents).
- Préférer la clarté à l’optimisation excessive.
- Ne jamais ajouter de dépendances inutiles.
- Ne jamais utiliser d’annotations dépréciées.
- Ne jamais inventer de champs, de services ou d’endpoints.

---

## 2. Architecture du backend WebElec

La structure standard est la suivante :

src/main/java/com/webelec/
- controller/
- service/
- repository/
- model/
- dto/
- config/

Copilot doit respecter exactement cette logique :

### controller/
- Expose les endpoints REST publics.
- Valide systématiquement les entrées avec @Valid et les annotations Jakarta.

### service/
- Contient la logique métier.
- Contient les règles RGIE si elles sont fournies et confirmées uniquement.

### repository/
- Utilise JPA / Hibernate.
- Ne déclare que des entités existantes, jamais inventées.

### model/
- Contient les entités persistées.
- Utilise des relations JPA correctes (@OneToMany, @ManyToOne, etc.).
- Ne définit aucune colonne fictive.

### dto/
- Contient les objets d’échange API.
- Utilise des annotations de validation (@NotNull, @NotBlank, @Size, etc.).

### config/
- Contient la configuration Spring (CORS, sécurité, mapping, etc.).

---

## 3. Spring Boot – Bonnes pratiques obligatoires

- Utiliser @RestController, @RequestMapping, @GetMapping, @PostMapping, etc.
- Utiliser @Service pour encapsuler la logique métier.
- Toujours injecter les dépendances par constructeur (pas d’@Autowired sur les champs).
- Utiliser @Valid sur les paramètres de contrôleurs quand il y a des DTO.
- Utiliser ResponseEntity<?> pour les réponses HTTP structurées.
- Gérer les exceptions via un handler global (@ControllerAdvice).

---

## 4. PostgreSQL / JPA

- Utiliser Long pour les IDs, String pour les champs texte, LocalDate/LocalDateTime pour les dates.
- Ne mapper que des colonnes qui existent réellement dans la base.
- Ne jamais inventer une table, une colonne ou une relation.
- Utiliser JpaRepository ou CrudRepository quand c’est suffisant.
- Ne recourir aux requêtes JPQL ou natives que lorsque nécessaire.

---

## 5. DTO et Validation

- Les DTO servent d’interface entre l’API et la logique métier.
- Les entités JPA ne doivent pas être exposées directement au client.
- Validation cohérente : @NotNull, @NotBlank, @Email, @Size, etc.
- Utiliser des noms de champs explicites, alignés avec le métier (societeId, clientId, chantierId, etc.).

Exemple de record DTO correct (à adapter au projet) :

    public record ClientDto(
        Long id,
        String nom,
        String prenom,
        String email,
        String telephone
    ) {}

Interdictions :
- Ne pas mélanger entités JPA et DTO dans une même classe.
- Ne pas ajouter de champs mystérieux ou inutilisés.

---

## 6. API REST – Restrictions fortes

Copilot ne doit jamais :
- inventer un endpoint,
- ajouter un paramètre non demandé,
- créer un nouveau contrôleur sans contexte,
- mélanger logique métier et couche contrôleur.

Exemples de patterns acceptables :

- GET /api/clients
- POST /api/clients
- GET /api/clients/{id}
- DELETE /api/clients/{id}

Si la structure exacte des endpoints n’est pas connue, Copilot doit rester générique et ne pas inventer de chemins spécifiques.

---

## 7. Sécurité

- Si Spring Security est utilisé, respecter sa configuration existante.
- Ne jamais proposer de bypass ou de raccourci dangereux.
- Ne pas inventer de mécanisme d’authentification ou d’autorisation.
- Ne pas générer de mots de passe, clés ou secrets en dur.

En cas d’absence de contexte sur la sécurité, Copilot doit rester neutre.

---

## 8. RGIE – Sécurité anti-hallucinations

Le backend WebElec peut manipuler des données liées au RGIE (articles, règles, circuits, protections, sections, etc.).

Règles strictes :
- Ne jamais inventer un article RGIE.
- Ne jamais inventer un calibre de protection, une section ou une règle de conformité.
- Ne jamais extrapoler une norme à partir de suppositions.

Copilot doit :
- utiliser uniquement les données de règles RGIE présentes dans le projet (fichiers, constantes, tables),
- refuser de coder une logique métier RGIE si l’information n’est pas fournie explicitement.

Réponse obligatoire en cas de manque de données RGIE :

    Impossible de générer cette logique : règle RGIE non fournie dans le projet.

---

## 9. IoT – Restrictions backend

Le backend peut recevoir ou traiter des mesures (tension, courant, puissance, etc.) venant d’ESP32 / MQTT.

Copilot doit :
- utiliser uniquement les entités et DTO existants pour les mesures (par ex. Measurement, Device, Sensor, etc.),
- ne jamais inventer de structure JSON ou de champs de mesures,
- respecter les topics/documentation déjà définis si disponibles.

En l’absence de structure claire, Copilot doit rester générique et minimal.

---

## 10. Interdictions strictes

- Ne pas faire de suppositions sur les règles électriques.
- Ne pas inventer de valeurs de sections, calibres, différentiels.
- Ne pas créer d’entités, de colonnes ou de relations JPA sans indication.
- Ne pas ajouter de dépendances Maven non existantes dans le projet.
- Ne pas réécrire massivement un fichier quand une correction locale suffit.
- Ne pas mélanger les responsabilités (pas de logique métier dans les contrôleurs).

---

## 11. Si la donnée manque

Si Copilot ne dispose pas de suffisamment d’informations (modèle, schéma DB, règle RGIE, endpoint défini, etc.), la réponse par défaut doit être :

    Données insuffisantes pour une réponse fiable en mode sécurité backend.

---

## 12. Style du code généré

- Code clair, simple, idiomatique Spring Boot.
- Méthodes courtes, classes cohérentes.
- Pas de complexité inutile ou de design pattern hors sujet.
- Préférer des solutions standard et maintenables.
- Commentaires uniquement lorsque nécessaire pour clarifier une logique métier non triviale.

---

## Finalité

Copilot doit agir comme un **développeur backend rigoureux** qui travaille sur un système métier sensible :  
- fiable,  
- cohérent,  
- sans approximation,  
- respectant les conventions Spring Boot et les contraintes du métier électrique.

La sécurité et la conformité priment sur la créativité et la “magie” du framework.
