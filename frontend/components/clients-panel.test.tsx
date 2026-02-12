import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientsPanel } from "./clients-panel";
import type { ClientDTO, SocieteResponse } from "@/types";
import { getClients, createClient, updateClient, deleteClient } from "@/lib/api/client";
import { getSocietes } from "@/lib/api/societe";

// Mock des hooks d'auth
jest.mock("@/lib/hooks/useAuth", () => ({
  useAuth: () => ({
    status: "authenticated",
    token: "test-token",
  }),
}));

jest.mock("@/lib/api/client", () => ({
  getClients: jest.fn(),
  createClient: jest.fn(),
  updateClient: jest.fn(),
  deleteClient: jest.fn(),
}));

jest.mock("@/lib/api/societe", () => ({
  getSocietes: jest.fn(),
}));

const mockGetClients = getClients as jest.MockedFunction<typeof getClients>;
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockUpdateClient = updateClient as jest.MockedFunction<typeof updateClient>;
const mockDeleteClient = deleteClient as jest.MockedFunction<typeof deleteClient>;
const mockGetSocietes = getSocietes as jest.MockedFunction<typeof getSocietes>;

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

describe("ClientsPanel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("affiche les clients chargés avec leurs informations", async () => {
    mockGetClients.mockResolvedValue([client]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);

    // Attendre que les données soient chargées
    await waitFor(() => {
      expect(screen.getByText("Dupont Jean")).toBeInTheDocument();
    });

    expect(screen.getByText("jean.dupont@test.com")).toBeInTheDocument();
    expect(screen.getByText(/0987654321/)).toBeInTheDocument();
    expect(screen.getByText("1 client")).toBeInTheDocument();
  });

  it("affiche le layout avec formulaire à gauche et liste à droite", async () => {
    mockGetClients.mockResolvedValue([client]);
    mockGetSocietes.mockResolvedValue([societe]);

    const { container } = render(<ClientsPanel />);

    // Vérifier la structure du grid (1 colonne par défaut, 3 colonnes sur xl)
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer?.className).toMatch(/xl:grid-cols-3/);
  });

  it("affiche un message d'erreur si les champs obligatoires sont vides", async () => {
    mockGetClients.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);

    const user = userEvent.setup();
    const submitButton = await screen.findByRole("button", { name: /Créer/i });

    await user.click(submitButton);

    expect(
      await screen.findByText("Le nom du client est requis")
    ).toBeInTheDocument();
  });

  it("crée un nouveau client avec succès", async () => {
    mockGetClients.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockCreateClient.mockResolvedValue({
      ...client,
      id: 2,
      nom: "Martin",
      prenom: "Marie",
    });

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Remplir le formulaire
    const nomInput = screen.getByPlaceholderText("Nom du client*");
    await user.type(nomInput, "Martin");

    const prenomInput = screen.getByPlaceholderText("Prénom");
    await user.type(prenomInput, "Marie");

    const emailInput = screen.getByPlaceholderText("Email");
    await user.type(emailInput, "marie.martin@test.com");

    const telephoneInput = screen.getByPlaceholderText("Téléphone");
    await user.type(telephoneInput, "0611223344");

    // Sélectionner la société
    const societeSelect = screen.getByRole("combobox", { name: /Société liée/i });
    await user.selectOptions(societeSelect, "1");

    const submitButton = screen.getByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateClient).toHaveBeenCalledWith("test-token", {
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@test.com",
        telephone: "0611223344",
        adresse: "",
        societeId: 1,
      });
    });
  });

  it("modifie un client existant", async () => {
    mockGetClients.mockResolvedValue([client]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockUpdateClient.mockResolvedValue({ ...client, nom: "Dupont-Martin" });

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Attendre que le client soit affiché
    await screen.findByText("Dupont Jean");

    // Cliquer sur le bouton Modifier
    const editButton = screen.getByRole("button", { name: /Modifier/i });
    await user.click(editButton);

    // Vérifier que le formulaire est pré-rempli
    const nomInput = screen.getByPlaceholderText("Nom du client*") as HTMLInputElement;
    expect(nomInput.value).toBe("Dupont");

    // Modifier le nom
    await user.clear(nomInput);
    await user.type(nomInput, "Dupont-Martin");

    // Soumettre
    const submitButton = screen.getByRole("button", { name: /Mettre à jour/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateClient).toHaveBeenCalledWith("test-token", 1, expect.objectContaining({
        nom: "Dupont-Martin",
      }));
    });
  });

  it("supprime un client", async () => {
    mockGetClients.mockResolvedValueOnce([client]).mockResolvedValueOnce([]);
    mockGetSocietes.mockResolvedValue([societe]);
    mockDeleteClient.mockResolvedValue(undefined);

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Attendre que le client soit affiché
    await screen.findByText("Dupont Jean");

    // Cliquer sur le bouton Supprimer
    const deleteButton = screen.getByRole("button", { name: /Supprimer/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteClient).toHaveBeenCalledWith("test-token", 1);
    });
  });

  it("filtre les clients par recherche", async () => {
    const clients: ClientDTO[] = [
      client,
      {
        ...client,
        id: 2,
        nom: "Martin",
        prenom: "Marie",
        email: "marie.martin@test.com",
      },
    ];

    mockGetClients.mockResolvedValue(clients);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Attendre que les clients soient affichés
    await screen.findByText("Dupont Jean");
    expect(screen.getByText("Martin Marie")).toBeInTheDocument();

    // Rechercher "Martin"
    const searchInput = screen.getByPlaceholderText("Rechercher un client...");
    await user.type(searchInput, "Martin");

    // Dupont ne devrait plus être visible, seulement Martin
    await waitFor(() => {
      expect(screen.queryByText("Dupont Jean")).not.toBeInTheDocument();
      expect(screen.getByText("Martin Marie")).toBeInTheDocument();
    });
  });

  it("affiche un message quand aucun client n'est trouvé", async () => {
    mockGetClients.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);

    await waitFor(() => {
      expect(screen.getByText("Aucun client pour le moment.")).toBeInTheDocument();
    });
  });

  it("affiche le compteur de clients correctement", async () => {
    const clients = [client, { ...client, id: 2 }, { ...client, id: 3 }];
    mockGetClients.mockResolvedValue(clients);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);

    await waitFor(() => {
      expect(screen.getByText("3 clients")).toBeInTheDocument();
    });
  });

  it("gère les erreurs d'API avec un message d'erreur", async () => {
    mockGetClients.mockRejectedValue(new Error("Erreur réseau"));
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);

    await waitFor(() => {
      expect(screen.getByText(/Erreur réseau/)).toBeInTheDocument();
    });
  });

  it("annule l'édition d'un client", async () => {
    mockGetClients.mockResolvedValue([client]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Attendre que le client soit affiché
    await screen.findByText("Dupont Jean");

    // Cliquer sur Modifier
    const editButton = screen.getByRole("button", { name: /Modifier/i });
    await user.click(editButton);

    // Vérifier que le bouton Annuler apparaît
    const cancelButton = screen.getByRole("button", { name: /Annuler/i });
    expect(cancelButton).toBeInTheDocument();

    // Cliquer sur Annuler
    await user.click(cancelButton);

    // Le formulaire devrait être réinitialisé
    const nomInput = screen.getByPlaceholderText("Nom du client*") as HTMLInputElement;
    expect(nomInput.value).toBe("");
  });

  it("rafraîchit les données quand le bouton Rafraîchir est cliqué", async () => {
    mockGetClients.mockResolvedValue([client]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Attendre le chargement initial
    await screen.findByText("Dupont Jean");

    expect(mockGetClients).toHaveBeenCalledTimes(1);

    // Cliquer sur Rafraîchir
    const refreshButton = screen.getByRole("button", { name: /Rafraîchir/i });
    await user.click(refreshButton);

    await waitFor(() => {
      expect(mockGetClients).toHaveBeenCalledTimes(2);
    });
  });

  it("vérifie que la sélection de société est requise", async () => {
    mockGetClients.mockResolvedValue([]);
    mockGetSocietes.mockResolvedValue([societe]);

    render(<ClientsPanel />);
    const user = userEvent.setup();

    // Remplir uniquement le nom sans sélectionner de société
    const nomInput = screen.getByPlaceholderText("Nom du client*");
    await user.type(nomInput, "Test");

    const submitButton = screen.getByRole("button", { name: /Créer/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Sélectionnez une société")).toBeInTheDocument();
    });
  });
});
