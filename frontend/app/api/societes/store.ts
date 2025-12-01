export type Societe = {
  id: string;
  name: string;
  description?: string;
  city?: string;
};

const societes = new Map<string, Societe>();

// Seed with a couple entries for demo/testing.
addSociete({ name: "Alpha Electric", city: "Paris", description: "Installation et maintenance" });
addSociete({ name: "Beta Courant", city: "Lyon", description: "Tableaux et domotique" });

export function listSocietes(): Societe[] {
  return Array.from(societes.values());
}

export function getSociete(id: string): Societe | undefined {
  return societes.get(id);
}

export function addSociete(input: Omit<Societe, "id">): Societe {
  const id = crypto.randomUUID();
  const societe: Societe = { id, ...input };
  societes.set(id, societe);
  return societe;
}

export function deleteSociete(id: string): boolean {
  return societes.delete(id);
}
