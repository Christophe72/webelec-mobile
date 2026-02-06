import { buildDevisLines, buildDevisPayload } from "@/components/devis-panel";
import type { DevisCreateDTO, DevisLigneDTO } from "@/types";

describe("devis-panel helpers", () => {
  const baseDevis: DevisCreateDTO = {
    numero: "DEV-2026-0001",
    dateEmission: "2026-02-01",
    dateExpiration: "2026-03-03",
    montantHT: 1000,
    montantTVA: 210,
    montantTTC: 1210,
    statut: "BROUILLON",
    societeId: 10,
    clientId: 20,
    chantierId: undefined,
    lignes: [],
  };

  it("buildDevisLines creates a default line when empty", () => {
    const lines = buildDevisLines([], "Prestation forfaitaire", 1500);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toEqual({
      description: "Prestation forfaitaire",
      quantite: 1,
      prixUnitaire: 1500,
      total: 1500,
    });
  });

  it("buildDevisLines keeps existing lines", () => {
    const existing: DevisLigneDTO[] = [
      {
        description: "Test",
        quantite: 2,
        prixUnitaire: 50,
        total: 100,
      },
    ];
    const lines = buildDevisLines(existing, "X", 200);
    expect(lines).toBe(existing);
  });

  it("buildDevisPayload injects default lines when missing", () => {
    const payload = buildDevisPayload(baseDevis, "Ligne principale");
    expect(payload.lignes).toHaveLength(1);
    expect(payload.lignes[0].description).toBe("Ligne principale");
    expect(payload.lignes[0].prixUnitaire).toBe(baseDevis.montantHT);
  });
});
