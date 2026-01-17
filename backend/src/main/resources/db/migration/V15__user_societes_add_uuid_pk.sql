-- 1️⃣ Ajouter une colonne id UUID
ALTER TABLE user_societes
ADD id UUID DEFAULT gen_random_uuid();

-- 2️⃣ Définir la clé primaire sur id
ALTER TABLE user_societes
ADD CONSTRAINT pk_user_societes_id
PRIMARY KEY (id);

-- 3️⃣ Garantir l'unicité métier user ↔ société
ALTER TABLE user_societes
ADD CONSTRAINT uq_user_societes_user_societe
UNIQUE (user_id, societe_id);
