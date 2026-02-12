"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";

export default function NetworkStatusIndicator() {
  const { isOnline, pendingCount, syncStatus, forceSync, isSyncing } = useNetworkStatus();

  // Ne rien afficher si tout est OK
  if (isOnline && pendingCount === 0 && !syncStatus) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 pointer-events-none">
      <div className="max-w-md mx-auto">
        {/* Indicateur hors-ligne */}
        {!isOnline && (
          <div className="bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2 pointer-events-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3l8.735 8.735m0 0a.374.374 0 1 1 .53.53m-.53-.53.53.53m0 0L21 21M14.652 9.348a3.75 3.75 0 0 1 0 5.304m2.121-7.425a6.75 6.75 0 0 1 0 9.546m2.121-11.667c3.808 3.807 3.808 9.98 0 13.788m-9.546-4.242a3.733 3.733 0 0 1-1.06-2.122m-1.061 4.243a6.75 6.75 0 0 1-1.625-6.929m-.496 9.05c-3.068-3.067-3.664-7.67-1.79-11.334M12 12h.008v.008H12V12z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">Mode hors-ligne</p>
              <p className="text-xs opacity-90">
                {pendingCount > 0
                  ? `${pendingCount} action(s) en attente`
                  : "Les modifications seront synchronisées"}
              </p>
            </div>
          </div>
        )}

        {/* Synchronisation en cours */}
        {syncStatus && syncStatus.status === "syncing" && (
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2 pointer-events-auto">
            <svg
              className="animate-spin h-5 w-5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">Synchronisation...</p>
              <p className="text-xs opacity-90">
                {syncStatus.current} / {syncStatus.total}
              </p>
            </div>
          </div>
        )}

        {/* Synchronisation réussie */}
        {syncStatus && syncStatus.status === "success" && (
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 mb-2 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm">Synchronisé</p>
              <p className="text-xs opacity-90">
                {syncStatus.successCount} action(s) synchronisée(s)
              </p>
            </div>
          </div>
        )}

        {/* Erreur de synchronisation */}
        {syncStatus && syncStatus.status === "error" && (
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-sm">Erreur de synchronisation</p>
                <p className="text-xs opacity-90">
                  {syncStatus.errorCount} erreur(s) sur {syncStatus.total}
                </p>
              </div>
            </div>
            {isOnline && (
              <button
                type="button"
                onClick={forceSync}
                disabled={isSyncing}
                className="w-full bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
              >
                Réessayer
              </button>
            )}
          </div>
        )}

        {/* Actions en attente (en ligne) */}
        {isOnline && pendingCount > 0 && !syncStatus && (
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg pointer-events-auto">
            <div className="flex items-center gap-3 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {pendingCount} action(s) à synchroniser
                </p>
                <p className="text-xs opacity-90">
                  Les modifications n&apos;ont pas été envoyées
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={forceSync}
              disabled={isSyncing}
              className="w-full bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSyncing ? "Synchronisation..." : "Synchroniser maintenant"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
