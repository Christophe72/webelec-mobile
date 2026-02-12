/**
 * Queue de synchronisation pour stocker les actions à effectuer
 * quand la connexion sera rétablie
 */

export type SyncAction = {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: "client" | "chantier";
  data: Record<string, unknown>;
  timestamp: number;
  retries: number;
};

const STORAGE_KEY = "webelec_sync_queue";
const MAX_RETRIES = 3;

class SyncQueue {
  private queue: SyncAction[] = [];

  constructor() {
    this.loadQueue();
  }

  /**
   * Charger la queue depuis le localStorage
   */
  private loadQueue(): void {
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la queue:", error);
      this.queue = [];
    }
  }

  /**
   * Sauvegarder la queue dans le localStorage
   */
  private saveQueue(): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la queue:", error);
    }
  }

  /**
   * Ajouter une action à la queue
   */
  public add(action: Omit<SyncAction, "id" | "timestamp" | "retries">): void {
    const newAction: SyncAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(newAction);
    this.saveQueue();

    console.log(`📝 Action ajoutée à la queue: ${action.type} ${action.entity}`, newAction);
  }

  /**
   * Récupérer toutes les actions de la queue
   */
  public getAll(): SyncAction[] {
    return [...this.queue];
  }

  /**
   * Récupérer les actions par entité
   */
  public getByEntity(entity: "client" | "chantier"): SyncAction[] {
    return this.queue.filter((action) => action.entity === entity);
  }

  /**
   * Supprimer une action de la queue
   */
  public remove(actionId: string): void {
    this.queue = this.queue.filter((action) => action.id !== actionId);
    this.saveQueue();
    console.log(`✅ Action supprimée de la queue: ${actionId}`);
  }

  /**
   * Incrémenter le compteur de tentatives
   */
  public incrementRetries(actionId: string): void {
    const action = this.queue.find((a) => a.id === actionId);
    if (action) {
      action.retries += 1;

      // Si trop de tentatives, supprimer l'action
      if (action.retries >= MAX_RETRIES) {
        console.error(`❌ Action échouée après ${MAX_RETRIES} tentatives:`, action);
        this.remove(actionId);
      } else {
        this.saveQueue();
      }
    }
  }

  /**
   * Vider toute la queue
   */
  public clear(): void {
    this.queue = [];
    this.saveQueue();
    console.log("🗑️ Queue vidée");
  }

  /**
   * Obtenir le nombre d'actions en attente
   */
  public size(): number {
    return this.queue.length;
  }

  /**
   * Vérifier si la queue est vide
   */
  public isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// Export une instance singleton
export const syncQueue = new SyncQueue();
