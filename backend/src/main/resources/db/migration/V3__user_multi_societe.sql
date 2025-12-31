-- Migration V2 : ajout de la table user_societes pour multi-entreprises

CREATE TABLE IF NOT EXISTS user_societes (
    user_id BIGINT NOT NULL,
    societe_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, societe_id),
    CONSTRAINT fk_us_user
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_us_societe
        FOREIGN KEY (societe_id) REFERENCES societes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_societes_societe
ON user_societes (societe_id);

-- Migration des données existantes (évite les doublons)
INSERT INTO user_societes (user_id, societe_id, role)
SELECT id, societe_id, role
FROM utilisateurs
WHERE societe_id IS NOT NULL
  AND role IS NOT NULL
ON CONFLICT (user_id, societe_id) DO NOTHING;

-- (À faire après adaptation complète du code et migration des usages)
-- ALTER TABLE utilisateurs DROP COLUMN societe_id;
-- ALTER TABLE utilisateurs DROP COLUMN role;