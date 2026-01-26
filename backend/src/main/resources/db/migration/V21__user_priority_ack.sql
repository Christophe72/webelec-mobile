-- Table pour stocker les priorités marquées comme traitées par utilisateur
CREATE TABLE user_priority_ack (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    priority_id VARCHAR(255) NOT NULL,
    acknowledged_at TIMESTAMP NOT NULL,

    CONSTRAINT uk_user_priority UNIQUE (user_id, priority_id),
    CONSTRAINT fk_user_priority_ack_user FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);

-- Index pour optimiser les requêtes par utilisateur
CREATE INDEX idx_user_priority_ack_user_id ON user_priority_ack(user_id);
