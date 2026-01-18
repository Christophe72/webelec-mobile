-- Make invoice numbers unique per societe instead of globally unique.
ALTER TABLE "public"."factures"
    DROP CONSTRAINT IF EXISTS factures_numero_key;

ALTER TABLE "public"."factures"
    ADD CONSTRAINT factures_societe_numero_key UNIQUE (societe_id, numero);
