import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChantierPanel } from "./chantier-panel";
import type { ChantierDTO, ClientDTO, SocieteResponse } from "@/types";
import { getChantiers, createChantier, updateChantier, deleteChantier } from "@/lib/api/chantier";
import { getSocietes } from "@/lib/api/societe";
import { getClients } from "@/lib/api/client";

// Mock des hooks d'auth
jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({
    status: "authenticated",
    token: "test-token",
  }),
}));

jest.mock("@/lib/api/chantier", () => ({
  getChantiers: jest.fn(),
  createChantier: jest.fn(),
  updateChantier: jest.fn(),
  deleteChantier: jest.fn(),
}));

jest.mock("@/lib/api/societe", () => ({
  getSocietes: jest.fn(),
}));

jest.mock("@/lib/api/client", () => ({
  getClients: jest.fn(),
}));

const mockGetChantiers = getChantiers as jest.MockedFunction<typeof getChantiers>;
const mockCreateChantier = createChantier as jest.MockedFunction<typeof createChantier>;
const mockUpdateChantier = updateChantier as jest.MockedFunction<typeof updateChantier>;
const mockDeleteChantier = deleteChantier as jest.MockedFunction<typeof deleteChantier>;
const mockGetSocietes = getSocietes as jest.MockedFunction<typeof getSocietes>;
const mockGetClients = getClients as jest.MockedFunction<typeof getClients>;

const societe: SocieteResponse = {
  id: 1,
  nom: "Test Company",
  tva: "FR12345678900",
  email: "contact@test.com",
  telephone: "0123456789",
  adresse: "123 Test Street",
};

const client: ClientDTO = {
  id: 1,
  nom: "Dupont",
  prenom: "Jean",
  email: "jean.dupont@test.com",
  telephone: "0987654321",
  adresse: "456 Client Avenue",
  societe: societe,
  societeId: 1,
};

const chantier: ChantierDTO = {
  id: 1,
  nom: "Rénovation électrique",
  adresse: "10 Rue des Travaux",
  description: "Installation électrique complète",
  societe: societe,
  client: client,
};

describe("ChantierPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche les chantiers chargés avec leurs informations", async () => {
    mockGetChantiers.mockResolvedValue([chantier]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);

    await waitFor(() => {
      expect(screen.getByText("Rénovation électrique")).toBeInTheDocument();
    });

    expect(screen.getByText("10 Rue des Travaux")).toBeInTheDocument();
    expect(screen.getByText("Installation électrique complète")).toBeInTheDocument();
    expect(screen.getByText("1 chantier")).toBeInTheDocument();
  });

  it("affiche le layout avec formulaire à gauche et liste à droite", async () => {
    mockGetChantiers.mockResolvedValue([chantier]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    const { container } = render(<ChantierPanel />);

    // Vérifier la structure du grid
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.className).toMatch(/xl:grid-cols-3/);
  });

  it("affiche un message d'erreur si le nom est vide", async () => {
    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    const submitButton = await screen.findByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Le nom du chantier est requis")
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur si la société n'est pas sélectionnée", async () => {
    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    const nomInput = screen.getByPlaceholderText("Nom du chantier*");
    await user.type(nomInput, "Test Chantier");

    const submitButton = screen.getByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Sélectionnez une société avant de sauvegarder")
    ).toBeInTheDocument();
  });

  it("affiche un message d'erreur si le client n'est pas sélectionné", async () => {
    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    const nomInput = screen.getByPlaceholderText("Nom du chantier*");
    await user.type(nomInput, "Test Chantier");

    // Sélectionner la société
    const societeSelect = screen.getByTitle("Société du chantier");
    await user.selectOptions(societeSelect, "1");

    const submitButton = screen.getByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    expect(
      await screen.findByText("Sélectionnez un client avant de sauvegarder")
    ).toBeInTheDocument();
  });

  it("crée un nouveau chantier avec succès", async () => {
    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);
    mockCreateChantier.mockResolvedValue({
      ...chantier,
      id: 2,
      nom: "Nouveau chantier",
    });

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Remplir le formulaire
    const nomInput = screen.getByPlaceholderText("Nom du chantier*");
    await user.type(nomInput, "Nouveau chantier");

    const societeSelect = screen.getByTitle("Société du chantier");
    await user.selectOptions(societeSelect, "1");

    const clientSelect = screen.getByTitle("Client du chantier");
    await user.selectOptions(clientSelect, "1");

    const adresseInput = screen.getByPlaceholderText("Adresse");
    await user.type(adresseInput, "123 Rue Test");

    const descriptionInput = screen.getByPlaceholderText("Notes / description");
    await user.type(descriptionInput, "Description du chantier");

    const submitButton = screen.getByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateChantier).toHaveBeenCalledWith("test-token", {
        nom: "Nouveau chantier",
        adresse: "123 Rue Test",
        description: "Description du chantier",
        societeId: 1,
        clientId: 1,
      });
    });
  });

  it("modifie un chantier existant", async () => {
    mockGetChantiers.mockResolvedValue([chantier]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);
    mockUpdateChantier.mockResolvedValue({
      ...chantier,
      nom: "Chantier modifié",
    });

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Attendre que le chantier soit affiché
    await screen.findByText("Rénovation électrique");

    // Cliquer sur Modifier
    const editButton = screen.getByRole("button", { name: /Modifier/i });
    await user.click(editButton);

    // Vérifier que le formulaire est pré-rempli
    const nomInput = screen.getByPlaceholderText("Nom du chantier*") as HTMLInputElement;
    expect(nomInput.value).toBe("Rénovation électrique");

    // Modifier le nom
    await user.clear(nomInput);
    await user.type(nomInput, "Chantier modifié");

    // Soumettre
    const submitButton = screen.getByRole("button", { name: /Mettre à jour/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateChantier).toHaveBeenCalledWith("test-token", 1, expect.objectContaining({
        nom: "Chantier modifié",
      }));
    });
  });

  it("supprime un chantier", async () => {
    mockGetChantiers.mockResolvedValueOnce([chantier]).mockResolvedValueOnce([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);
    mockDeleteChantier.mockResolvedValue(undefined);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Attendre que le chantier soit affiché
    await screen.findByText("Rénovation électrique");

    // Cliquer sur Supprimer
    const deleteButton = screen.getByRole("button", { name: /Supprimer/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteChantier).toHaveBeenCalledWith("test-token", 1);
    });
  });

  it("filtre les chantiers par société", async () => {
    const societe2: SocieteResponse = {
      id: 2,
      nom: "Autre Company",
      tva: "FR98765432100",
      email: "autre@test.com",
      telephone: "9876543210",
      adresse: "789 Other Street",
    };

    const chantier2 = {
      ...chantier,
      id: 2,
      nom: "Autre chantier",
      societe: societe2,
    };

    mockGetChantiers
      .mockResolvedValueOnce([chantier, chantier2])
      .mockResolvedValueOnce([chantier]);
    mockGetSocietes.mockResolvedValue([societe, societe2]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Attendre que les chantiers soient affichés
    await screen.findByText("Rénovation électrique");
    expect(screen.getByText("Autre chantier")).toBeInTheDocument();

    // Filtrer par société 1
    const filterSelect = screen.getByTitle("Filtrer par société");
    await user.selectOptions(filterSelect, "1");

    await waitFor(() => {
      expect(mockGetChantiers).toHaveBeenCalledWith("test-token", 1);
    });
  });

  it("filtre les clients par société sélectionnée dans le formulaire", async () => {
    const societe2: SocieteResponse = {
      id: 2,
      nom: "Autre Company",
      tva: "FR98765432100",
      email: "autre@test.com",
      telephone: "9876543210",
      adresse: "789 Other Street",
    };

    const client2: ClientDTO = {
      id: 2,
      nom: "Martin",
      prenom: "Marie",
      email: "marie.martin@test.com",
      telephone: "1234567890",
      adresse: "789 Client Street",
      societe: societe2,
      societeId: 2,
    };

    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe, societe2]);
    mockGetClients.mockResolvedValue([client, client2]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Sélectionner la société 1
    const societeSelect = screen.getByTitle("Société du chantier");
    await user.selectOptions(societeSelect, "1");

    // Vérifier que seul le client de la société 1 est disponible
    const clientSelect = screen.getByTitle("Client du chantier");
    const clientOptions = Array.from(clientSelect.querySelectorAll("option"));

    // Devrait contenir l'option vide + 1 client (Dupont)
    const clientNames = clientOptions.map(opt => opt.textContent);
    expect(clientNames).toContain("Dupont Jean");
    expect(clientNames).not.toContain("Martin Marie");
  });

  it("annule l'édition d'un chantier", async () => {
    mockGetChantiers.mockResolvedValue([chantier]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Attendre que le chantier soit affiché
    await screen.findByText("Rénovation électrique");

    // Cliquer sur Modifier
    const editButton = screen.getByRole("button", { name: /Modifier/i });
    await user.click(editButton);

    // Vérifier que le bouton Annuler apparaît
    const cancelButton = screen.getByRole("button", { name: /Annuler/i });
    expect(cancelButton).toBeInTheDocument();

    // Cliquer sur Annuler
    await user.click(cancelButton);

    // Le formulaire devrait être réinitialisé
    const nomInput = screen.getByPlaceholderText("Nom du chantier*") as HTMLInputElement;
    expect(nomInput.value).toBe("");
  });

  it("rafraîchit les données quand le bouton Rafraîchir est cliqué", async () => {
    mockGetChantiers.mockResolvedValue([chantier]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Attendre le chargement initial
    await screen.findByText("Rénovation électrique");

    expect(mockGetChantiers).toHaveBeenCalledTimes(1);

    // Cliquer sur Rafraîchir
    const refreshButton = screen.getByRole("button", { name: /Rafraîchir/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockGetChantiers).toHaveBeenCalledTimes(2);
    });
  });

  it("affiche un message quand aucun chantier n'est trouvé", async () => {
    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);

    await waitFor(() => {
      expect(screen.getByText("Aucun chantier pour le moment.")).toBeInTheDocument();
    });
  });

  it("affiche le compteur de chantiers correctement", async () => {
    const chantiers = [chantier, { ...chantier, id: 2 }];
    mockGetChantiers.mockResolvedValue(chantiers);
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);

    await waitFor(() => {
      expect(screen.getByText("2 chantiers")).toBeInTheDocument();
    });
  });

  it("gère les erreurs d'API avec un message d'erreur", async () => {
    mockGetChantiers.mockRejectedValue(new Error("Erreur réseau"));
    mockGetSocietes.mockResolvedValue([societe]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur réseau/)).toBeInTheDocument();
    });
  });

  it("réinitialise le client quand on change de société", async () => {
    const societe2: SocieteResponse = {
      id: 2,
      nom: "Autre Company",
      tva: "FR98765432100",
      email: "autre@test.com",
      telephone: "9876543210",
      adresse: "789 Other Street",
    };

    mockGetChantiers.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe, societe2]);
    mockGetClients.mockResolvedValue([client]);

    render(<ChantierPanel />);
    const user = userEvent.setup();

    // Sélectionner société 1 et client
    const societeSelect = screen.getByTitle("Société du chantier");
    await user.selectOptions(societeSelect, "1");

    const clientSelect = screen.getByTitle("Client du chantier");
    await user.selectOptions(clientSelect, "1");

    expect((clientSelect as HTMLSelectElement).value).toBe("1");

    // Changer de société vers société 2
    await user.selectOptions(societeSelect, "2");

    // Le client devrait être réinitialisé
    expect((clientSelect as HTMLSelectElement).value).toBe("");
  });
});
