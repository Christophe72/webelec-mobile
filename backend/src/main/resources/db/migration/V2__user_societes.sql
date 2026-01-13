CREATE TABLE user_societes (
    user_id BIGINT NOT NULL,
    societe_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, societe_id),
    CONSTRAINT fk_user_soc_user FOREIGN KEY (user_id) REFERENCES utilisateurs(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_soc_societe FOREIGN KEY (societe_id) REFERENCES societes(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_societes_societe
ON user_societes (societe_id);

INSERT INTO user_societes (user_id, societe_id, role)
SELECT id, societe_id, role
FROM utilisateurs
WHERE societe_id IS NOT NULL
  AND role IS NOT NULL;
