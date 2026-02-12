"use client";

import { useState, useEffect } from "react";
import { networkStatus } from "@/lib/offline/network-status";
import { syncService, SyncStatus } from "@/lib/offline/sync-service";
import { syncQueue } from "@/lib/offline/sync-queue";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    // État initial
    setIsOnline(networkStatus.isOnline());
    setPendingCount(syncQueue.size());

    // S'abonner aux changements d'état du réseau
    const unsubscribeNetwork = networkStatus.subscribe((online) => {
      setIsOnline(online);
    });

    // S'abonner aux événements de synchronisation
    const unsubscribeSync = syncService.subscribe((status) => {
      setSyncStatus(status);
      setPendingCount(syncQueue.size());

      // Réinitialiser le status après 3 secondes si c'est un succès
      if (status.status === "success") {
        setTimeout(() => {
          setSyncStatus(null);
        }, 3000);
      }
    });

    // Vérifier périodiquement le nombre d'actions en attente
    const interval = setInterval(() => {
      setPendingCount(syncQueue.size());
    }, 1000);

    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      unsubscribeNetwork();
      unsubscribeSync();
      clearInterval(interval);
    };
  }, []);

  const forceSync = async () => {
    if (isOnline) {
      await syncService.forceSyncNow();
    }
  };

  return {
    isOnline,
    pendingCount,
    syncStatus,
    forceSync,
    isSyncing: syncService.isSyncInProgress(),
  };
}
