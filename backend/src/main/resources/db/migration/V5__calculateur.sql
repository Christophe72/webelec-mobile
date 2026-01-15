-- Table pour l'historique des calculs électriques
CREATE TABLE calcul_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    chantier_id BIGINT,
    calculator_type VARCHAR(50) NOT NULL,
    inputs JSONB NOT NULL,
    results JSONB NOT NULL,
    notes VARCHAR(1024),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_calcul_history_chantier FOREIGN KEY (chantier_id) REFERENCES chantiers(id) ON DELETE SET NULL
);

-- Index pour optimiser les requêtes fréquentes
CREATE INDEX idx_calcul_history_user ON calcul_history (user_id);
CREATE INDEX idx_calcul_history_chantier ON calcul_history (chantier_id);
CREATE INDEX idx_calcul_history_type ON calcul_history (calculator_type);
CREATE INDEX idx_calcul_history_created_at ON calcul_history (created_at DESC);

-- Index composite pour les requêtes combinées
CREATE INDEX idx_calcul_history_user_created ON calcul_history (user_id, created_at DESC);
