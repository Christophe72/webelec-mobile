-- Table pour stocker les preferences utilisateur
CREATE TABLE user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    preferences JSONB,

    CONSTRAINT uk_user_preferences_user UNIQUE (user_id),
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE
);
