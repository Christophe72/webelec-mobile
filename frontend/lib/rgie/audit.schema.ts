export type InstallationInput = {
  mise_terre?: number;
  ddr?: string;
  sdb_ip?: string;
  ve_section?: number;

  // Champs additionnels libres pour l'instant.
  [key: string]: unknown;
};

