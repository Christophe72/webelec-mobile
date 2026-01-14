CREATE TABLE modules (
    id BIGSERIAL PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description VARCHAR(1024),
    categorie VARCHAR(255),
    version VARCHAR(255),
    actif BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stock_mouvements (
    id BIGSERIAL PRIMARY KEY,
    produit_id BIGINT NOT NULL,
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT')),
    raison VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_stock_mouvement_produit FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE
);

CREATE INDEX idx_stock_mouvements_produit ON stock_mouvements (produit_id);
