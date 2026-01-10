import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CataloguePanel } from "./catalogue-panel";
import type { ProduitDTO, SocieteResponse } from "@/types";
import { getProduits, createProduit, deleteProduit } from "@/lib/api/catalogue";
import { getSocietes } from "@/lib/api/societe";

jest.mock("@/lib/api/catalogue", () => ({
  getProduits: jest.fn(),
  createProduit: jest.fn(),
  updateProduit: jest.fn(),
  deleteProduit: jest.fn(),
}));

jest.mock("@/lib/api/societe", () => ({
  getSocietes: jest.fn(),
}));

const mockGetProduits = getProduits as jest.MockedFunction<typeof getProduits>;
const mockCreateProduit = createProduit as jest.MockedFunction<
  typeof createProduit
>;
const mockDeleteProduit = deleteProduit as jest.MockedFunction<
  typeof deleteProduit
>;
const mockGetSocietes = getSocietes as jest.MockedFunction<typeof getSocietes>;

const produit: ProduitDTO = {
  id: 1,
  reference: "REF001",
  nom: "Produit test",
  description: "Description test",
  quantiteStock: 15,
  prixUnitaire: 120,
  societeId: 1,
};

const societe: SocieteResponse = {
  id: 1,
  nom: "Electro SARL",
  tva: "BE0123456789",
  email: "contact@electro.test",
  telephone: "0102030405",
  adresse: "Rue des Tests",
};

describe("CataloguePanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche les produits récupérés et les sociétés associées", async () => {
    mockGetProduits.mockResolvedValueOnce([produit]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<CataloguePanel />);

    expect(
      await screen.findByText("REF001 — Produit test")
    ).toBeInTheDocument();
    // Vérifie qu'au moins une occurrence de "Electro SARL" (dans la fiche produit) est présente
    expect(screen.getAllByText("Electro SARL").length).toBeGreaterThan(0);
    expect(
      screen.getByText((content) => content.includes("Produits chargés : 1"))
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur si les champs obligatoires sont vides", async () => {
    mockGetProduits.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<CataloguePanel />);

    const submitButton = await screen.findByRole("button", { name: /Créer/i });
    const user = userEvent.setup();
    await user.click(submitButton);

    expect(
      await screen.findByText("Référence et nom sont requis")
    ).toBeInTheDocument();
  });

  it("soumet un nouveau produit quand le formulaire est valide", async () => {
    mockGetProduits.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockCreateProduit.mockResolvedValue({
      ...produit,
      id: 2,
      reference: "REF999",
    });

    render(<CataloguePanel />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText("Référence*"), "REF999");
    await user.type(
      screen.getByPlaceholderText("Nom du produit*"),
      "Produit user"
    );
    await user.type(screen.getByPlaceholderText("Description"), "Essai");
    await user.type(screen.getByPlaceholderText("Quantité en stock"), "8");
    await user.type(screen.getByPlaceholderText("Prix unitaire (€)"), "45");
    await user.selectOptions(screen.getByRole("combobox"), ["1"]);

    const submitButton = await screen.findByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    await waitFor(() =>
      expect(mockCreateProduit).toHaveBeenCalledWith({
        reference: "REF999",
        nom: "Produit user",
        description: "Essai",
        quantiteStock: 8,
        prixUnitaire: 45,
        societeId: 1,
      })
    );
  });

  it("supprime un produit existant", async () => {
    mockGetProduits.mockResolvedValueOnce([produit]).mockResolvedValueOnce([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockDeleteProduit.mockResolvedValue(undefined);

    render(<CataloguePanel />);
    const user = userEvent.setup();

    const deleteButton = await screen.findByRole("button", {
      name: /Supprimer/i,
    });
    await user.click(deleteButton);

    await waitFor(() =>
      expect(mockDeleteProduit).toHaveBeenCalledWith(produit.id)
    );
    expect(mockGetProduits).toHaveBeenCalledTimes(2);
  });
});
