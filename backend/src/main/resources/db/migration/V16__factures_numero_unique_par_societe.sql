-- Make invoice numbers unique per societe instead of globally unique.
DO $$
DECLARE
    constraint_name text;
BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_class rel ON rel.oid = con.conrelid
    JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
    WHERE rel.relname = 'factures'
      AND nsp.nspname = 'public'
      AND con.contype = 'u'
      AND con.conkey = ARRAY[
        (SELECT attnum FROM pg_attribute
         WHERE attrelid = rel.oid AND attname = 'numero')
      ]
    LIMIT 1;

    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE public.factures DROP CONSTRAINT %I', constraint_name);
    END IF;
END
$$;

ALTER TABLE public.factures
    ADD CONSTRAINT factures_societe_numero_key UNIQUE (societe_id, numero);
