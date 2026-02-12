/**
 * Service de synchronisation qui traite la queue
 * quand la connexion est rétablie
 */

import { clientService, chantierService } from "../api";
import { syncQueue, SyncAction } from "./sync-queue";
import { networkStatus } from "./network-status";

class SyncService {
  private isSyncing = false;
  private syncListeners: Set<(status: SyncStatus) => void> = new Set();

  constructor() {
    // S'abonner aux changements d'état du réseau
    networkStatus.subscribe((isOnline) => {
      if (isOnline && !this.isSyncing) {
        this.syncAll();
      }
    });
  }

  /**
   * Synchroniser toutes les actions en attente
   */
  public async syncAll(): Promise<void> {
    if (this.isSyncing) {
      console.log("⏳ Synchronisation déjà en cours...");
      return;
    }

    if (!networkStatus.isOnline()) {
      console.log("📡 Pas de connexion, synchronisation impossible");
      return;
    }

    const actions = syncQueue.getAll();
    if (actions.length === 0) {
      console.log("✅ Aucune action à synchroniser");
      return;
    }

    this.isSyncing = true;
    this.notifyListeners({ status: "syncing", total: actions.length, current: 0 });

    console.log(`🔄 Début de la synchronisation de ${actions.length} action(s)`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];

      try {
        await this.processAction(action);
        syncQueue.remove(action.id);
        successCount++;

        this.notifyListeners({
          status: "syncing",
          total: actions.length,
          current: i + 1,
        });
      } catch (error) {
        console.error(`❌ Erreur lors de la synchronisation:`, error);
        syncQueue.incrementRetries(action.id);
        errorCount++;
      }
    }

    this.isSyncing = false;

    const finalStatus: SyncStatus = {
      status: errorCount === 0 ? "success" : "error",
      total: actions.length,
      current: actions.length,
      successCount,
      errorCount,
    };

    this.notifyListeners(finalStatus);

    console.log(`✅ Synchronisation terminée: ${successCount} succès, ${errorCount} erreurs`);
  }

  /**
   * Traiter une action individuelle
   */
  private async processAction(action: SyncAction): Promise<void> {
    console.log(`🔄 Traitement de l'action: ${action.type} ${action.entity}`, action);

    switch (action.entity) {
      case "client":
        await this.processClientAction(action);
        break;
      case "chantier":
        await this.processChantierAction(action);
        break;
      default:
        throw new Error(`Type d'entité inconnu: ${action.entity}`);
    }
  }

  /**
   * Traiter une action client
   */
  private async processClientAction(action: SyncAction): Promise<void> {
    switch (action.type) {
      case "CREATE":
        await clientService.create(action.data);
        break;
      case "UPDATE":
        await clientService.update(action.data.id, action.data);
        break;
      case "DELETE":
        await clientService.delete(action.data.id);
        break;
    }
  }

  /**
   * Traiter une action chantier
   */
  private async processChantierAction(action: SyncAction): Promise<void> {
    switch (action.type) {
      case "CREATE":
        await chantierService.create(action.data);
        break;
      case "UPDATE":
        await chantierService.update(action.data.id, action.data);
        break;
      case "DELETE":
        await chantierService.delete(action.data.id);
        break;
    }
  }

  /**
   * S'abonner aux événements de synchronisation
   */
  public subscribe(listener: (status: SyncStatus) => void): () => void {
    this.syncListeners.add(listener);
    return () => {
      this.syncListeners.delete(listener);
    };
  }

  /**
   * Notifier les listeners
   */
  private notifyListeners(status: SyncStatus): void {
    this.syncListeners.forEach((listener) => listener(status));
  }

  /**
   * Forcer une synchronisation manuelle
   */
  public async forceSyncNow(): Promise<void> {
    console.log("🔄 Synchronisation forcée");
    await this.syncAll();
  }

  /**
   * Obtenir le statut de synchronisation
   */
  public isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  /**
   * Obtenir le nombre d'actions en attente
   */
  public getPendingCount(): number {
    return syncQueue.size();
  }
}

export interface SyncStatus {
  status: "syncing" | "success" | "error";
  total: number;
  current: number;
  successCount?: number;
  errorCount?: number;
}

// Export une instance singleton
export const syncService = new SyncService();
