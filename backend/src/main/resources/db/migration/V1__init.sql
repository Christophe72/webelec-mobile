CREATE TABLE societes (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    tva VARCHAR(32) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(32),
    adresse VARCHAR(255)
);

CREATE TABLE utilisateurs (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255),
    role VARCHAR(50),
    societe_id BIGINT,
    CONSTRAINT fk_utilisateur_societe
        FOREIGN KEY (societe_id) REFERENCES societes(id)
);

CREATE TABLE clients (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    telephone VARCHAR(32),
    adresse VARCHAR(512),
    societe_id BIGINT NOT NULL,
    CONSTRAINT fk_client_societe
        FOREIGN KEY (societe_id) REFERENCES societes(id)
);

CREATE TABLE chantiers (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse VARCHAR(512),
    description VARCHAR(1024),
    societe_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    CONSTRAINT fk_chantier_societe FOREIGN KEY (societe_id) REFERENCES societes(id),
    CONSTRAINT fk_chantier_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE produits (
    id BIGSERIAL PRIMARY KEY,
    reference VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL,
    description VARCHAR(1024),
    quantite_stock INTEGER,
    prix_unitaire NUMERIC(12,2),
    prix_vente NUMERIC(12,2),
    societe_id BIGINT,
    CONSTRAINT fk_produit_societe FOREIGN KEY (societe_id) REFERENCES societes(id)
);

CREATE TABLE produits_avances (
    id BIGSERIAL PRIMARY KEY,
    reference VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(255) NOT NULL,
    description VARCHAR(1024),
    prix_achat NUMERIC(12,2),
    prix_vente NUMERIC(12,2),
    fournisseur VARCHAR(255),
    societe_id BIGINT NOT NULL,
    CONSTRAINT fk_produit_avance_societe FOREIGN KEY (societe_id) REFERENCES societes(id)
);

CREATE TABLE devis (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(255) NOT NULL UNIQUE,
    date_emission DATE NOT NULL,
    date_expiration DATE NOT NULL,
    montant_ht NUMERIC(12,2) NOT NULL,
    montant_tva NUMERIC(12,2),
    montant_ttc NUMERIC(12,2),
    statut VARCHAR(20),
    societe_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    CONSTRAINT fk_devis_societe FOREIGN KEY (societe_id) REFERENCES societes(id),
    CONSTRAINT fk_devis_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE devis_lignes (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(1024) NOT NULL,
    quantite INTEGER NOT NULL,
    prix_unitaire NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    devis_id BIGINT NOT NULL,
    CONSTRAINT fk_devis_ligne_devis FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE
);

CREATE TABLE factures (
    id BIGSERIAL PRIMARY KEY,
    numero VARCHAR(255) NOT NULL UNIQUE,
    date_emission DATE NOT NULL,
    date_echeance DATE NOT NULL,
    montant_ht NUMERIC(12,2) NOT NULL,
    montant_tva NUMERIC(12,2) NOT NULL,
    montant_ttc NUMERIC(12,2) NOT NULL,
    statut VARCHAR(20),
    societe_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    CONSTRAINT fk_facture_societe FOREIGN KEY (societe_id) REFERENCES societes(id),
    CONSTRAINT fk_facture_client FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE facture_lignes (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(1024) NOT NULL,
    quantite INTEGER NOT NULL,
    prix_unitaire NUMERIC(12,2) NOT NULL,
    total NUMERIC(12,2) NOT NULL,
    facture_id BIGINT NOT NULL,
    CONSTRAINT fk_facture_ligne_facture FOREIGN KEY (facture_id) REFERENCES factures(id) ON DELETE CASCADE
);

CREATE TABLE interventions (
    id BIGSERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description VARCHAR(1024),
    date_intervention DATE,
    societe_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    chantier_id BIGINT NOT NULL,
    utilisateur_id BIGINT NOT NULL,
    CONSTRAINT fk_intervention_societe FOREIGN KEY (societe_id) REFERENCES societes(id),
    CONSTRAINT fk_intervention_client FOREIGN KEY (client_id) REFERENCES clients(id),
    CONSTRAINT fk_intervention_chantier FOREIGN KEY (chantier_id) REFERENCES chantiers(id),
    CONSTRAINT fk_intervention_utilisateur FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

CREATE TABLE produit_avance_lignes (
    id BIGSERIAL PRIMARY KEY,
    description VARCHAR(1024) NOT NULL,
    quantite INTEGER NOT NULL,
    prix_achat NUMERIC(12,2),
    prix_vente NUMERIC(12,2),
    produit_avance_id BIGINT NOT NULL,
    CONSTRAINT fk_produit_avance_ligne FOREIGN KEY (produit_avance_id) REFERENCES produits_avances(id)
);
