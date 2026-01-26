CREATE TABLE societe_selections (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    societe_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_societe_selection_user FOREIGN KEY (user_id)
        REFERENCES utilisateurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_societe_selection_societe FOREIGN KEY (societe_id)
        REFERENCES societes(id) ON DELETE CASCADE
);

CREATE INDEX idx_societe_selections_user
    ON societe_selections (user_id, selected_at DESC);
