"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AccountValidationWizard } from "@/app/modules/account-validation";
import {
  AccountValidationEngine,
  MockBankWizardAdapter,
  LocalStorageStoreAdapter,
} from "@/app/modules/account-validation";
import type {
  ValidationResult,
  ValidationStatus,
} from "@/app/modules/account-validation";
import {
  HttpInvoiceImportAdapter,
  InvoiceImportDialog,
} from "@/app/modules/invoice-import";
import { getFactures } from "@/lib/api/facture";
import { envoyerPeppol, getUbl } from "@/lib/api/peppol";
import type { FactureDTO } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { FactureExportDialog } from "@/components/facture-export-dialog";

export default function PeppolAccountValidationPage() {
  const societeId = 1;
  // Créer l'instance du moteur de validation
  const engine = useMemo(
    () =>
      new AccountValidationEngine({
        bankWizard: new MockBankWizardAdapter(),
        store: new LocalStorageStoreAdapter(),
        // Politique de confirmation personnalisée
        manualConfirmationPolicy: ({ issues }) => {
          // Demander confirmation si des warnings sont présents
          return issues.some((i) => i.severity === "WARNING");
        },
      }),
    [],
  );
  const { status, token } = useAuth();
  const importAdapter = useMemo(
    () => (token ? new HttpInvoiceImportAdapter(token) : null),
    [token]
  );
  const [importOpen, setImportOpen] = useState(false);
  const [factures, setFactures] = useState<FactureDTO[]>([]);
  const [loadingFactures, setLoadingFactures] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [lastImportMessage, setLastImportMessage] = useState<string | null>(
    null,
  );
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [accountStatus, setAccountStatus] = useState<ValidationStatus | null>(
    null,
  );
  const [exportFacture, setExportFacture] = useState<FactureDTO | null>(null);
  const [peppolStates, setPeppolStates] = useState<
    Record<number, { verified?: boolean; sent?: boolean; message?: string }>
  >({});
  const formatAmount = (value?: number) =>
    value === null || value === undefined ? "-" : `${value.toFixed(2)} €`;
  const isAccountValidated = accountStatus === "VALIDATED";

  const handleValidated = (result: ValidationResult) => {
    console.log("✅ Compte validé:", result);
    setAccountStatus(result.status);

    // Exemple: sauvegarder dans votre base de données
    // await fetch('/api/accounts', { method: 'POST', body: JSON.stringify(result.details) });

    // Exemple: rediriger l'utilisateur
    // router.push('/dashboard');

    alert(
      `Compte validé avec succès!\n\nIBAN: ${result.details.iban ?? "N/A"}\nBIC: ${
        result.details.bic ?? "N/A"
      }\nPays: ${result.details.country ?? "N/A"}`,
    );
  };

  const loadFactures = useCallback(async () => {
    if (status !== "authenticated" || !token) return;
    setLoadingFactures(true);
    setActionError(null);
    try {
      const data = await getFactures(token, { societeId });
      setFactures(data ?? []);
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des factures",
      );
    } finally {
      setLoadingFactures(false);
    }
  }, [societeId, status, token]);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    loadFactures();
  }, [loadFactures, status, token]);

  const handleImportSuccess = () => {
    setLastImportMessage("✅ Import réussi! Les factures ont été importées.");
    loadFactures();
  };

  const handleVerify = async (factureId: number) => {
    if (status !== "authenticated" || !token) return;
    setVerifyingId(factureId);
    setActionError(null);
    try {
      await getUbl(token, String(factureId));
      setPeppolStates((prev) => ({
        ...prev,
        [factureId]: {
          verified: true,
          sent: prev[factureId]?.sent,
          message: "UBL valide",
        },
      }));
    } catch (err) {
      setPeppolStates((prev) => ({
        ...prev,
        [factureId]: {
          verified: false,
          sent: false,
          message:
            err instanceof Error ? err.message : "Echec de validation UBL",
        },
      }));
    } finally {
      setVerifyingId(null);
    }
  };

  const handleSend = async (factureId: number) => {
    if (status !== "authenticated" || !token) return;
    setSendingId(factureId);
    setActionError(null);
    try {
      const result = await envoyerPeppol(token, String(factureId));
      setPeppolStates((prev) => ({
        ...prev,
        [factureId]: {
          verified: true,
          sent: true,
          message: result.message || "Facture envoyee via Peppol",
        },
      }));
    } catch (err) {
      setPeppolStates((prev) => ({
        ...prev,
        [factureId]: {
          verified: prev[factureId]?.verified,
          sent: false,
          message: err instanceof Error ? err.message : "Echec envoi Peppol",
        },
      }));
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-foreground dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Peppol: factures et validation bancaire
          </h1>
          <p className="text-muted-foreground">
            Importer, verifier et envoyer des factures, puis valider les comptes
            bancaires IBAN/BBAN/BIC.
          </p>
        </div>

        <div className="rounded-lg border border-zinc-200/70 bg-white/80 p-6 shadow-sm mb-8 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Factures Peppol
              </h2>
              <p className="text-sm text-muted-foreground">
                Import CSV, verification UBL et envoi Peppol.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Statut compte:{" "}
                <span
                  className={
                    isAccountValidated
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }
                >
                  {isAccountValidated ? "VALIDE" : "NON VALIDE"}
                </span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setImportOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                📥 Importer des factures
              </button>
              <button
                onClick={loadFactures}
                className="px-4 py-2 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                Rafraichir
              </button>
            </div>
          </div>

          {lastImportMessage && (
            <div className="mb-4 p-3 rounded border border-emerald-200 bg-emerald-50 dark:border-emerald-700/50 dark:bg-emerald-900/30">
              <p className="text-sm text-emerald-700 dark:text-emerald-100">
                {lastImportMessage}
              </p>
            </div>
          )}

          {actionError && (
            <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 dark:border-red-700/60 dark:bg-red-900/40">
              <p className="text-sm text-red-700 dark:text-red-100">
                {actionError}
              </p>
            </div>
          )}

          {loadingFactures ? (
            <p className="text-sm text-muted-foreground">
              Chargement des factures...
            </p>
          ) : factures.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucune facture disponible pour cette societe.
            </p>
          ) : (
            <div className="border border-zinc-200 rounded-lg overflow-hidden dark:border-zinc-800">
              <div className="grid grid-cols-6 gap-4 bg-zinc-50 px-4 py-2 text-xs font-semibold text-zinc-600 uppercase dark:bg-zinc-900/70 dark:text-zinc-300">
                <div>Numero</div>
                <div>Client</div>
                <div>Montant TTC</div>
                <div>Statut</div>
                <div>Peppol</div>
                <div>Actions</div>
              </div>
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {factures.map((facture) => {
                  const state = peppolStates[facture.id];
                  const isVerified = state?.verified;
                  const isSent = state?.sent;
                  const statusLabel = isSent
                    ? "Envoyee"
                    : isVerified
                      ? "Verifiee"
                      : "Non verifiee";
                  return (
                    <div
                      key={facture.id}
                      className="grid grid-cols-6 gap-4 px-4 py-3 text-sm text-foreground"
                    >
                      <div className="font-medium">{facture.numero}</div>
                      <div>Client #{facture.clientId}</div>
                      <div>{formatAmount(facture.montantTTC)}</div>
                      <div>{facture.statut}</div>
                      <div>
                        <p className="font-medium text-foreground">
                          {statusLabel}
                        </p>
                        {state?.message && (
                          <p className="text-xs text-muted-foreground">
                            {state.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleVerify(facture.id)}
                          disabled={verifyingId === facture.id}
                          className="px-3 py-1 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                        >
                          {verifyingId === facture.id
                            ? "Verification..."
                            : "Verifier"}
                        </button>
                        <button
                          onClick={() => setExportFacture(facture)}
                          disabled={!isAccountValidated}
                          title={
                            isAccountValidated
                              ? "Exporter la facture"
                              : "Validation bancaire requise"
                          }
                          className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          Exporter
                        </button>
                        <button
                          onClick={() => handleSend(facture.id)}
                          disabled={
                            sendingId === facture.id || !isVerified || isSent
                          }
                          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          {sendingId === facture.id ? "Envoi..." : "Envoyer"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <AccountValidationWizard
          engine={engine}
          onValidated={handleValidated}
          defaultCountry="BE"
          className="mb-8"
        />

        {/* Documentation rapide */}
        <div className="rounded-lg border border-zinc-200/70 bg-white/80 p-6 shadow-sm max-w-2xl mx-auto dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Guide d&apos;utilisation
          </h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Mode IBAN (recommandé)
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Saisissez l&apos;IBAN complet avec ou sans espaces.
              </p>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <p className="text-sm font-mono">
                  Exemple: BE68 5390 0754 7034
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Mode BBAN</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Saisissez le code pays et le BBAN local.
              </p>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                <p className="text-sm font-mono">Pays: BE</p>
                <p className="text-sm font-mono">BBAN: 539007547034</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Exemples de test
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  <div>
                    <p className="font-mono">BE68 5390 0754 7034</p>
                    <p className="text-muted-foreground">IBAN belge valide</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  <div>
                    <p className="font-mono">
                      FR14 2004 1010 0505 0001 3M02 606
                    </p>
                    <p className="text-muted-foreground">
                      IBAN français valide
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 dark:text-red-300 mr-2">✗</span>
                  <div>
                    <p className="font-mono">BE68 1234 5678 9012</p>
                    <p className="text-muted-foreground">
                      IBAN belge invalide (checksum)
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t dark:border-zinc-800">
              <h3 className="font-semibold text-foreground mb-2">
                Pays supportés
              </h3>
              <div className="flex flex-wrap gap-2">
                {["BE", "FR", "DE", "NL", "LU", "IT", "ES", "PT"].map(
                  (country) => (
                    <span
                      key={country}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium dark:bg-blue-900/40 dark:text-blue-200"
                    >
                      {country}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="pt-4 border-t dark:border-zinc-800">
              <h3 className="font-semibold text-foreground mb-2">
                Fonctionnalités
              </h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  Validation modulo 97 IBAN
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  Validation BBAN par pays
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  Validation BIC/SWIFT
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  Détection de transpositions
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">
                    ✓
                  </span>
                  Intégration API externe (Bank Wizard)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lien vers la documentation */}
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <a
            href="/modules/account-validation/README.md"
            className="text-blue-600 hover:text-blue-800 text-sm dark:text-blue-400 dark:hover:text-blue-300"
          >
            Voir la documentation complète du module →
          </a>
        </div>
      </div>

      {importAdapter && (
        <InvoiceImportDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          societeId={societeId}
          adapter={importAdapter}
          onSuccess={handleImportSuccess}
        />
      )}

      <FactureExportDialog
        open={!!exportFacture}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setExportFacture(null);
        }}
        facture={exportFacture}
        accountValidated={isAccountValidated}
      />
    </div>
  );
}
