-- Migration V2 : ajout de la table user_societes pour multi-entreprises

CREATE TABLE user_societes (
    user_id BIGINT NOT NULL,
    societe_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, societe_id),
    CONSTRAINT fk_us_user
        FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_us_societe
        FOREIGN KEY (societe_id) REFERENCES societes(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_societes_societe
ON user_societes (societe_id);

-- Migration des données existantes (évite les doublons)
-- Requêtes compatible PostgreSQL et SQL Server (pas de ON CONFLICT/MERGE)
INSERT INTO user_societes (user_id, societe_id, role)
SELECT u.id AS user_id, u.societe_id, u.role
FROM utilisateurs u
WHERE u.societe_id IS NOT NULL
  AND u.role IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM user_societes us
      WHERE us.user_id = u.id
        AND us.societe_id = u.societe_id
  );

-- (À faire après adaptation complète du code et migration des usages)
-- ALTER TABLE utilisateurs DROP COLUMN societe_id;
-- ALTER TABLE utilisateurs DROP COLUMN role;