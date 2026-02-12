-- Migration pour ajouter les champs Peppol à la table factures
-- Date: 2026-02-12
-- Description: Ajout des colonnes pour supporter les factures Peppol (réseau européen de facturation électronique)

ALTER TABLE factures
ADD COLUMN peppol_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN peppol_sender_endpoint_id VARCHAR(100),
ADD COLUMN peppol_receiver_endpoint_id VARCHAR(100),
ADD COLUMN peppol_status VARCHAR(20),
ADD COLUMN peppol_format VARCHAR(20),
ADD COLUMN peppol_sent_date DATE,
ADD COLUMN peppol_transaction_id VARCHAR(100),
ADD COLUMN peppol_error_message VARCHAR(500);

-- Index pour améliorer les performances des requêtes Peppol
CREATE INDEX idx_factures_peppol_enabled ON factures(peppol_enabled);
CREATE INDEX idx_factures_peppol_status ON factures(peppol_status);

-- Commentaires pour la documentation
COMMENT ON COLUMN factures.peppol_enabled IS 'Indique si la facture est configurée pour Peppol';
COMMENT ON COLUMN factures.peppol_sender_endpoint_id IS 'Identifiant Peppol de l''émetteur (format: scheme:identifier, ex: 9925:BE0123456789)';
COMMENT ON COLUMN factures.peppol_receiver_endpoint_id IS 'Identifiant Peppol du destinataire (format: scheme:identifier)';
COMMENT ON COLUMN factures.peppol_status IS 'Statut Peppol: DRAFT, READY, SENT, DELIVERED, ERROR';
COMMENT ON COLUMN factures.peppol_format IS 'Format de la facture Peppol: UBL_2_1 ou CII';
COMMENT ON COLUMN factures.peppol_sent_date IS 'Date d''envoi de la facture via le réseau Peppol';
COMMENT ON COLUMN factures.peppol_transaction_id IS 'Identifiant unique de la transaction Peppol';
COMMENT ON COLUMN factures.peppol_error_message IS 'Message d''erreur en cas d''échec de traitement Peppol';
