"use client";

import { useMemo, useState } from "react";
import type { FactureDTO } from "@/types";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { downloadFactureCsv, downloadFacturePdf } from "@/lib/api/facture-export";

type ExportFormat = "pdf" | "csv";

interface FactureExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facture: FactureDTO | null;
  accountValidated: boolean;
}

export function FactureExportDialog({
  open,
  onOpenChange,
  facture,
  accountValidated,
}: FactureExportDialogProps) {
  const { status, token } = useAuth();
  const [confirmFormat, setConfirmFormat] = useState<ExportFormat | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canExport = accountValidated && status === "authenticated" && !!token;

  const formattedTotals = useMemo(() => {
    if (!facture) return null;
    return {
      ht: formatAmount(facture.montantHT),
      tva: formatAmount(facture.montantTVA),
      ttc: formatAmount(facture.montantTTC),
    };
  }, [facture]);

  function handleClose() {
    setError(null);
    setPreviewOpen(false);
    setConfirmFormat(null);
    onOpenChange(false);
  }

  async function handleDownload(format: ExportFormat) {
    if (!facture) return;
    if (!canExport || !token) {
      setError(
        "Compte non valide ou session expirée. Veuillez valider le compte puis vous reconnecter.",
      );
      return;
    }
    setLoading(format);
    setError(null);
    try {
      if (format === "pdf") {
        await downloadFacturePdf(token, facture.id);
      } else {
        await downloadFactureCsv(token, facture.id);
      }
      setConfirmFormat(null);
    } catch (err) {
      setError(formatApiError(err, "Erreur lors du téléchargement"));
    } finally {
      setLoading(null);
    }
  }

  if (!facture) return null;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleClose();
            return;
          }
          onOpenChange(true);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exporter la facture {facture.numero}</DialogTitle>
            <DialogDescription>
              Choisissez un format de téléchargement ou un aperçu.
            </DialogDescription>
          </DialogHeader>

          {!accountValidated && (
            <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
              Validation bancaire requise avant l&apos;export.
            </div>
          )}

          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => setConfirmFormat("pdf")}
              disabled={!canExport || loading !== null}
              className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {loading === "pdf" ? "Téléchargement..." : "Télécharger PDF"}
            </button>
            <button
              onClick={() => setConfirmFormat("csv")}
              disabled={!canExport || loading !== null}
              className="rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {loading === "csv" ? "Téléchargement..." : "Télécharger CSV"}
            </button>
            <button
              onClick={() => setPreviewOpen(true)}
              className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-100 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-200"
            >
              Aperçu
            </button>
          </div>

          <DialogFooter>
            <button
              onClick={handleClose}
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              Fermer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={confirmFormat !== null}
        onOpenChange={(next) => setConfirmFormat(next ? confirmFormat : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de téléchargement</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmez le téléchargement en{" "}
              {confirmFormat === "pdf" ? "PDF" : "CSV"} de la facture{" "}
              {facture.numero}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading !== null}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                confirmFormat ? handleDownload(confirmFormat) : undefined
              }
              disabled={loading !== null}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Aperçu de la facture {facture.numero}</DialogTitle>
            <DialogDescription>
              Résumé des informations disponibles dans le frontend.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex flex-wrap gap-4">
                <div>
                  <p className="text-xs uppercase text-zinc-500">Client</p>
                  <p className="font-medium">#{facture.clientId}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-zinc-500">Statut</p>
                  <p className="font-medium">{facture.statut}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-zinc-500">Emission</p>
                  <p className="font-medium">{facture.dateEmission}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-zinc-500">Echéance</p>
                  <p className="font-medium">{facture.dateEcheance}</p>
                </div>
              </div>
              {formattedTotals && (
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase text-zinc-500">HT</p>
                    <p className="font-semibold">{formattedTotals.ht}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-zinc-500">TVA</p>
                    <p className="font-semibold">{formattedTotals.tva}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-zinc-500">TTC</p>
                    <p className="font-semibold">{formattedTotals.ttc}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
              <h4 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Lignes de facture
              </h4>
              {facture.lignes && facture.lignes.length > 0 ? (
                <div className="grid gap-3">
                  {facture.lignes.map((ligne, index) => (
                    <div
                      key={`${ligne.description}-${index}`}
                      className="grid gap-1 border-b border-dashed border-zinc-200 pb-3 text-sm last:border-b-0 last:pb-0 dark:border-zinc-800"
                    >
                      <p className="font-medium">{ligne.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                        <span>Qté: {ligne.quantite}</span>
                        <span>PU: {formatAmount(ligne.prixUnitaire)}</span>
                        <span>Total: {formatAmount(ligne.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Aucune ligne disponible pour cette facture.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatAmount(value?: number) {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(2)} EUR`;
}
