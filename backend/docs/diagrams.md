# Backend diagrams (Mermaid)

These diagrams are based on the current Java packages under
`backend/src/main/java/com/webelec/backend`.

## Class diagram (domain model)

```mermaid
classDiagram
  direction LR

  class Societe
  class Client
  class Chantier
  class Intervention
  class Utilisateur
  class UserSocieteRole
  class UtilisateurRole {
    <<enumeration>>
  }
  class Produit
  class ProduitAvance
  class StockMouvement
  class StockMouvementType {
    <<enumeration>>
  }
  class Devis
  class DevisLigne
  class Facture
  class FactureLigne
  class PieceJustificative
  class LegalDocument
  class LegalDocumentType {
    <<enumeration>>
  }
  class LegalDocumentStatus {
    <<enumeration>>
  }
  class Module
  class CalculHistory

  Societe --> UserSocieteRole : utilisateurs
  Utilisateur --> UserSocieteRole : societes
  UserSocieteRole --> UtilisateurRole : role

  Societe --> Client : clients
  Societe --> Chantier : chantiers
  Client --> Chantier : chantiers

  Societe --> Intervention : interventions
  Client --> Intervention : interventions
  Chantier --> Intervention : interventions
  Utilisateur --> Intervention : interventions

  Societe --> Produit : produits
  Societe --> ProduitAvance : produitsAvances
  Produit --> StockMouvement : mouvements
  StockMouvement --> StockMouvementType : type

  Societe --> Devis : devis
  Client --> Devis : devis
  Devis *-- DevisLigne : lignes

  Societe --> Facture : factures
  Client --> Facture : factures
  Facture *-- FactureLigne : lignes

  PieceJustificative --> Intervention
  PieceJustificative --> Devis
  PieceJustificative --> Facture

  LegalDocument --> LegalDocumentType : type
  LegalDocument --> LegalDocumentStatus : status
  UserSocieteRole --> LegalDocument : documents
  Chantier --> LegalDocument : documents
```

## Synthèse relationnelle (Mermaid)

```mermaid
flowchart LR
  Societe -->|possede| Client
  Societe --> Chantier
  Societe --> Intervention
  Societe --> Produit
  Societe --> ProduitAvance
  Societe --> Devis
  Societe --> Facture
  Client --> Chantier
  Client --> Devis
  Client --> Facture
  Chantier --> Intervention
  Devis --> DevisLigne
  Facture --> FactureLigne
  Produit --> StockMouvement
  StockMouvement --> StockMouvementType
  Utilisateur --> UserSocieteRole
  Societe --> UserSocieteRole
  UserSocieteRole --> UtilisateurRole
  UserSocieteRole --> LegalDocument
  LegalDocument --> LegalDocumentType
  LegalDocument --> LegalDocumentStatus
  PieceJustificative --> Intervention
  PieceJustificative --> Devis
  PieceJustificative --> Facture
```

## Graph simplifie (Mermaid)

```mermaid
graph LR
  Societe --> Client
  Societe --> Chantier
  Societe --> Produit
  Societe --> Devis
  Societe --> Facture
  Client --> Devis
  Client --> Facture
  Devis --> Facture
  Produit --> Stock
```

## Diagramme entite-relation (Mermaid)

```mermaid
erDiagram
  SOCIETE ||--o{ CLIENT : possede
  SOCIETE ||--o{ CHANTIER : gere
  SOCIETE ||--o{ INTERVENTION : planifie
  SOCIETE ||--o{ PRODUIT : vend
  SOCIETE ||--o{ PRODUITAVANCE : vend
  SOCIETE ||--o{ DEVIS : ecrit
  SOCIETE ||--o{ FACTURE : facture
  CLIENT ||--o{ CHANTIER : commande
  CLIENT ||--o{ DEVIS : demande
  CLIENT ||--o{ FACTURE : regle
  CHANTIER ||--o{ INTERVENTION : accueille
  DEVIS ||--o{ DEVISLIGNE : compose
  FACTURE ||--o{ FACTURELIGNE : compose
  PRODUIT ||--o{ STOCKMOUVEMENT : genere
  STOCKMOUVEMENT }|--|| STOCKMOUVEMENTTYPE : type
  UTILISATEUR ||--o{ USERSOCIETERROLE : rattache
  SOCIETE ||--o{ USERSOCIETERROLE : attribue
  USERSOCIETERROLE }|--|| UTILISATEURROLE : role
  USERSOCIETERROLE ||--o{ LEGALDOCUMENT : gere
  LEGALDOCUMENT }|--|| LEGALDOCUMENTTYPE : type
  LEGALDOCUMENT }|--|| LEGALDOCUMENTSTATUS : statut
  PIECEJUSTIFICATIVE }o--|| INTERVENTION : supporte
  PIECEJUSTIFICATIVE }o--|| DEVIS : supporte
  PIECEJUSTIFICATIVE }o--|| FACTURE : supporte
```

## System context (C4-style, Mermaid)

```mermaid
flowchart LR
  electricien[Electricien]
  frontend[WebElec Frontend]
  backend[WebElec Backend]
  db[(PostgreSQL)]

  electricien --> frontend
  frontend --> backend
  backend --> db
```

## Containers (C4-style, Mermaid)

```mermaid
flowchart LR
  electricien[Electricien]

  subgraph WebElec SaaS
    frontend[Frontend Web\nNext.js]
    backend[Backend API\nSpring Boot]
    db[(PostgreSQL)]
    files[(Files/Uploads)]
  end

  electricien --> frontend
  frontend --> backend
  backend --> db
  backend --> files
```

## Components (C4-style, Mermaid)

```mermaid
flowchart LR
  db[(PostgreSQL)]

  subgraph Backend API
    authController[AuthController]
    authService[AuthService]
    jwtService[JwtService]

    controllers[Controllers]
    services[Services]
    repositories[Repositories]
    entities[Entities]
  end

  authController --> authService
  authService --> jwtService

  controllers --> services
  services --> repositories
  repositories --> db
  repositories --> entities
```

## DTOs -> Controllers (API)

```mermaid
flowchart LR
  subgraph Controllers
    AuthController
    CalculateurController
    ChantierController
    ClientController
    DevisController
    FactureController
    InterventionController
    LegalDocumentController
    ModuleController
    PieceJustificativeController
    ProduitAvanceController
    ProduitController
    SocieteController
    StockController
    UtilisateurController
  end

  subgraph DTOs
    AuthLoginRequest
    AuthRefreshRequest
    AuthRegisterRequest
    AuthResponse
    UtilisateurResponse
    CalculHistoryCreateDTO
    CalculHistoryDTO
    CalculateurPreferencesDTO
    ChantierRequest
    ChantierResponse
    ClientRequest
    ClientResponse
    DevisRequest
    DevisResponse
    FactureImportResponse
    FactureRequest
    FactureResponse
    PeppolResultDTO
    UblDTO
    InterventionRequest
    InterventionResponse
    LegalDocumentReadyRequest
    LegalDocumentSignRequest
    ModuleRequest
    ModuleResponse
    ModuleUpdateRequest
    PieceJustificativeResponse
    ProduitAvanceRequest
    ProduitAvanceResponse
    ProduitRequest
    ProduitResponse
    SocieteRequest
    SocieteResponse
    StockMouvementRequest
    StockMouvementResponse
    UtilisateurRequest
  end

  AuthController --> AuthLoginRequest
  AuthController --> AuthRefreshRequest
  AuthController --> AuthRegisterRequest
  AuthController --> AuthResponse
  AuthController --> UtilisateurResponse

  CalculateurController --> CalculHistoryCreateDTO
  CalculateurController --> CalculHistoryDTO
  CalculateurController --> CalculateurPreferencesDTO

  ChantierController --> ChantierRequest
  ChantierController --> ChantierResponse

  ClientController --> ClientRequest
  ClientController --> ClientResponse

  DevisController --> DevisRequest
  DevisController --> DevisResponse

  FactureController --> FactureImportResponse
  FactureController --> FactureRequest
  FactureController --> FactureResponse
  FactureController --> PeppolResultDTO
  FactureController --> UblDTO

  InterventionController --> InterventionRequest
  InterventionController --> InterventionResponse

  LegalDocumentController --> LegalDocumentReadyRequest
  LegalDocumentController --> LegalDocumentSignRequest

  ModuleController --> ModuleRequest
  ModuleController --> ModuleResponse
  ModuleController --> ModuleUpdateRequest

  PieceJustificativeController --> PieceJustificativeResponse

  ProduitAvanceController --> ProduitAvanceRequest
  ProduitAvanceController --> ProduitAvanceResponse

  ProduitController --> ProduitRequest
  ProduitController --> ProduitResponse

  SocieteController --> SocieteRequest
  SocieteController --> SocieteResponse

  StockController --> StockMouvementRequest
  StockController --> StockMouvementResponse

  UtilisateurController --> UtilisateurRequest
  UtilisateurController --> UtilisateurResponse
```

## Architecture graph (layers)

```mermaid
flowchart LR
  subgraph API
    Controllers[controller/*]
    DTOs[dto/*]
  end

  subgraph Metier
    Services[service/*]
    Models[model/*]
  end

  subgraph Data
    Repositories[repository/*]
    DB[(PostgreSQL)]
  end

  Controllers --> Services
  Controllers --> DTOs
  Services --> Repositories
  Repositories --> Models
  Models --> DB
```

## Sequence graph (auth login)

```mermaid
sequenceDiagram
  actor Client
  participant AuthController
  participant AuthService
  participant UtilisateurRepository
  participant PasswordEncoder
  participant JwtService

  Client->>AuthController: POST /api/auth/login
  AuthController->>AuthService: login(request)
  AuthService->>UtilisateurRepository: findByEmail(email)
  AuthService->>PasswordEncoder: matches(raw, hash)
  AuthService->>JwtService: generateAccessToken(user)
  AuthService->>JwtService: generateRefreshToken(user)
  AuthService-->>AuthController: AuthResponse
  AuthController-->>Client: 200 + tokens
```

## Annexe – Graphe Client (Mermaid)

```mermaid
flowchart LR
  Societe -->|possede| Client
  Societe --> Chantier
  Societe --> Intervention
  Societe --> Produit
  Societe --> ProduitAvance
  Societe --> Devis
  Societe --> Facture
  Client --> Chantier
  Client --> Devis
  Client --> Facture
  Chantier --> Intervention
  Devis --> DevisLigne
  Facture --> FactureLigne
  Produit --> StockMouvement
  StockMouvement --> StockMouvementType
  Utilisateur --> UserSocieteRole
  Societe --> UserSocieteRole
  UserSocieteRole --> UtilisateurRole
  UserSocieteRole --> LegalDocument
  LegalDocument --> LegalDocumentType
  LegalDocument --> LegalDocumentStatus
  PieceJustificative --> Intervention
  PieceJustificative --> Devis
  PieceJustificative --> Facture
```
