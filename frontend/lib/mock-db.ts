import { mockSocietes } from "@/lib/api/mockSocietes";
import { mockClients } from "@/lib/api/mockClients";
import { mockChantiers } from "@/lib/api/mockChantiers";
import { mockDevis } from "@/lib/api/mockDevis";
import { mockModules } from "@/lib/api/mockModules";
import { mockProduits } from "@/lib/api/mockProduits";
import { mockInterventions } from "@/lib/api/mockInterventions";
import type {
  ChantierDTO,
  ClientDTO,
  SocieteResponse,
  DevisDTO,
  ModuleDTO,
  ProduitDTO,
  InterventionDTO,
  PieceJustificativeResponse,
  StockMouvementDTO
} from "@/types";

type PieceRecord = PieceJustificativeResponse & { data: Buffer };

type StockMouvementRecord = StockMouvementDTO & {
  id: number;
  date: string;
};

type MockDb = {
  societes: SocieteResponse[];
  clients: ClientDTO[];
  chantiers: ChantierDTO[];
  devis: DevisDTO[];
  modules: ModuleDTO[];
  produits: ProduitDTO[];
  interventions: InterventionDTO[];
  pieces: PieceRecord[];
  stockMouvements: StockMouvementRecord[];
  nextSocieteId: number;
  nextClientId: number;
  nextChantierId: number;
  nextDevisId: number;
  nextModuleId: number;
  nextProduitId: number;
  nextInterventionId: number;
  nextPieceId: number;
  nextStockMouvementId: number;
};

const globalStore = globalThis as typeof globalThis & {
  __webelecMockDb?: MockDb;
};

function nextId<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
}

if (!globalStore.__webelecMockDb) {
  globalStore.__webelecMockDb = {
    societes: [...mockSocietes],
    clients: [...mockClients],
    chantiers: [...mockChantiers],
    devis: [...mockDevis],
    modules: [...mockModules],
    produits: [...mockProduits],
    interventions: [...mockInterventions],
    pieces: [],
    stockMouvements: [],
    nextSocieteId: nextId(mockSocietes),
    nextClientId: nextId(mockClients),
    nextChantierId: nextId(mockChantiers),
    nextDevisId: nextId(mockDevis),
    nextModuleId: nextId(mockModules),
    nextProduitId: nextId(mockProduits),
    nextInterventionId: nextId(mockInterventions),
    nextPieceId: 1,
    nextStockMouvementId: 1
  };
}

export const mockDb = globalStore.__webelecMockDb!;
