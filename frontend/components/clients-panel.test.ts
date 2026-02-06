import { buildClientPayload, validateClientForm } from "@/components/clients-panel";
import type { ClientCreateDTO, ClientDTO } from "@/types";

describe("clients-panel helpers", () => {
  const baseForm: ClientCreateDTO = {
    nom: "  Dupont  ",
    prenom: "  Alice  ",
    telephone: "  +32 470 12 34 56 ",
    adresse: "  Rue de la Paix 1 ",
    societeId: 12,
  };

  it("buildClientPayload trims fields and normalizes empty optional values", () => {
    const payload = buildClientPayload({
      ...baseForm,
      telephone: "   ",
      adresse: "  ",
    });

    expect(payload).toEqual({
      nom: "Dupont",
      prenom: "Alice",
      telephone: undefined,
      adresse: undefined,
      societeId: 12,
    });
  });

  it("validateClientForm detects missing required fields", () => {
    const { issues } = validateClientForm(
      { ...baseForm, nom: "", prenom: "", societeId: 0 },
      [],
      null
    );

    expect(issues).toEqual([
      "Le nom est requis.",
      "Le prénom est requis.",
      "Sélectionnez une société.",
    ]);
  });

  it("validateClientForm detects duplicate telephone when editing another client", () => {
    const existing: ClientDTO[] = [
      {
        id: 1,
        nom: "Martin",
        prenom: "Jean",
        telephone: "+32470123456",
        adresse: null,
        societe: { id: 12, nom: "Demo", tva: "BE0123" },
      },
    ];

    const { issues } = validateClientForm(
      { ...baseForm, telephone: "+32 470 12 34 56" },
      existing,
      2
    );

    expect(issues).toContain("Ce téléphone est déjà utilisé par un autre client.");
  });

  it("validateClientForm allows duplicate telephone for same client", () => {
    const existing: ClientDTO[] = [
      {
        id: 3,
        nom: "Martin",
        prenom: "Jean",
        telephone: "+32470123456",
        adresse: null,
        societe: { id: 12, nom: "Demo", tva: "BE0123" },
      },
    ];

    const { issues } = validateClientForm(
      { ...baseForm, telephone: "+32 470 12 34 56" },
      existing,
      3
    );

    expect(issues).not.toContain("Ce téléphone est déjà utilisé par un autre client.");
  });
});
