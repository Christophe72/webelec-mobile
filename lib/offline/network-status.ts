/**
 * Service de détection de l'état du réseau
 */

type NetworkStatusListener = (isOnline: boolean) => void;

class NetworkStatusService {
  private listeners: Set<NetworkStatusListener> = new Set();
  private _isOnline: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      this._isOnline = navigator.onLine;
      this.setupListeners();
    }
  }

  private setupListeners() {
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
  }

  private handleOnline = () => {
    console.log("📡 Connexion rétablie");
    this._isOnline = true;
    this.notifyListeners(true);
  };

  private handleOffline = () => {
    console.log("📡 Connexion perdue");
    this._isOnline = false;
    this.notifyListeners(false);
  };

  private notifyListeners(isOnline: boolean) {
    this.listeners.forEach((listener) => listener(isOnline));
  }

  public subscribe(listener: NetworkStatusListener): () => void {
    this.listeners.add(listener);
    // Retourner une fonction de désabonnement
    return () => {
      this.listeners.delete(listener);
    };
  }

  public isOnline(): boolean {
    return this._isOnline;
  }

  public cleanup() {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
    }
    this.listeners.clear();
  }
}

// Export une instance singleton
export const networkStatus = new NetworkStatusService();
