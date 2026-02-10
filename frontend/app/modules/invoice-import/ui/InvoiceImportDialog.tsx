"use client";

import { useState } from "react";
import {
  InvoiceImportResponse,
  InvoiceImportConfig,
  DEFAULT_IMPORT_CONFIG,
} from "../domain/types";
import { IInvoiceImportAdapter } from "../adapters/apiAdapter";
import { formatApiError } from "@/lib/ui/format-api-error";

interface InvoiceImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  societeId: number;
  adapter: IInvoiceImportAdapter;
  config?: Partial<InvoiceImportConfig>;
  onSuccess?: () => void;
  className?: string;
}

export function InvoiceImportDialog({
  open,
  onOpenChange,
  societeId,
  adapter,
  config: userConfig,
  onSuccess,
  className = "",
}: InvoiceImportDialogProps) {
  const config = { ...DEFAULT_IMPORT_CONFIG, ...userConfig };
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InvoiceImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    const fileExtension = selectedFile.name.substring(
      selectedFile.name.lastIndexOf("."),
    );
    if (!config.allowedFileTypes.includes(fileExtension)) {
      setError(
        `Type de fichier non supporté. Formats acceptés: ${config.allowedFileTypes.join(", ")}`,
      );
      return;
    }

    // Validate file size
    if (selectedFile.size > config.maxFileSize) {
      setError(
        `La taille du fichier ne peut pas dépasser ${(config.maxFileSize / (1024 * 1024)).toFixed(0)}MB`,
      );
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleImport = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const response = await adapter.import({
        file,
        societeId,
      });

      setResult(response);

      // If complete success, call onSuccess and close after delay
      if (response.status === "COMPLETE_SUCCESS") {
        setTimeout(() => {
          onSuccess?.();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setError(formatApiError(err, "Erreur lors de l'import"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onOpenChange(false);
  };

  const downloadErrorReport = () => {
    if (!result) return;

    const errors = result.results
      .filter((r) => !r.success)
      .map((r) => `Ligne ${r.rowNumber}: ${r.errors.join(", ")}`)
      .join("\n");

    const blob = new Blob([errors], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import-errors.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ${className}`}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Import de factures CSV</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              disabled={loading}
              aria-label="Fermer"
            >
              ×
            </button>
          </div>

          {!result ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="file-upload"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Sélectionner un fichier CSV
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept={config.allowedFileTypes.join(",")}
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Format: {config.allowedFileTypes.join(", ")}. Taille max:{" "}
                  {(config.maxFileSize / (1024 * 1024)).toFixed(0)}MB
                </p>
              </div>

              {file && (
                <div className="p-3 bg-gray-50 rounded border border-gray-200">
                  <p className="text-sm">
                    <span className="font-semibold">Fichier sélectionné:</span>{" "}
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Taille: {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Import en cours..." : "Importer"}
                </button>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2 text-sm">
                  Format CSV attendu:
                </h3>
                <pre className="text-xs overflow-x-auto bg-white p-2 rounded border">
                  {`numero,dateEmission,dateEcheance,montantHT,montantTVA,montantTTC,statut,clientNom,clientPrenom,clientEmail,clientTelephone,clientAdresse,lignes
FAC-001,2025-01-15,2025-02-15,1000.00,210.00,1210.00,EN_ATTENTE,Dupont,Marc,marc@email.com,0601020304,"10 rue Paris","Item A|2|100|200;Item B|4|200|800"`}
                </pre>
                <div className="mt-2">
                  <a
                    href="/factures-import-template.csv"
                    download
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    📥 Télécharger le template CSV
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className={`p-4 rounded ${
                  result.status === "COMPLETE_SUCCESS"
                    ? "bg-green-50 border border-green-200"
                    : result.status === "PARTIAL_SUCCESS"
                      ? "bg-yellow-50 border border-yellow-200"
                      : "bg-red-50 border border-red-200"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  Résultats de l&apos;import
                </h3>
                <p className="text-sm mb-2">{result.message}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total:</span>{" "}
                    {result.totalRows}
                  </div>
                  <div className="text-green-600">
                    <span className="font-medium">Réussies:</span>{" "}
                    {result.successCount}
                  </div>
                  {result.errorCount > 0 && (
                    <div className="text-red-600">
                      <span className="font-medium">Échecs:</span>{" "}
                      {result.errorCount}
                    </div>
                  )}
                </div>
              </div>

              {result.errorCount > 0 && (
                <div className="border rounded p-4 max-h-96 overflow-y-auto">
                  <h4 className="font-semibold mb-2">Erreurs par ligne:</h4>
                  <div className="space-y-3">
                    {result.results
                      .filter((r) => !r.success)
                      .map((r) => (
                        <div key={r.rowNumber} className="text-sm">
                          <p className="font-semibold text-gray-700">
                            Ligne {r.rowNumber}
                            {r.invoiceNumero && ` (${r.invoiceNumero})`}:
                          </p>
                          <ul className="list-disc list-inside text-red-600 ml-2 marker:text-current">
                            {r.errors.map((err, idx) => (
                              <li key={idx}>{err}</li>
                            ))}
                          </ul>
                          {r.warnings && r.warnings.length > 0 && (
                            <ul className="list-disc list-inside text-yellow-600 ml-2 marker:text-current">
                              {r.warnings.map((warn, idx) => (
                                <li key={idx}>{warn}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {result.successCount > 0 && result.errorCount > 0 && (
                <div className="border rounded p-4">
                  <h4 className="font-semibold mb-2 text-green-600">
                    Factures importées avec succès:
                  </h4>
                  <div className="text-sm space-y-1">
                    {result.results
                      .filter((r) => r.success)
                      .slice(0, 10)
                      .map((r) => (
                        <p key={r.rowNumber} className="text-gray-600">
                          ✓ Ligne {r.rowNumber}: {r.invoiceNumero}
                          {r.warnings && r.warnings.length > 0 && (
                            <span className="text-yellow-600 ml-2">
                              ({r.warnings.length} warning
                              {r.warnings.length > 1 ? "s" : ""})
                            </span>
                          )}
                        </p>
                      ))}
                    {result.successCount > 10 && (
                      <p className="text-gray-500 italic">
                        ... et {result.successCount - 10} autres
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                {result.errorCount > 0 && (
                  <button
                    onClick={downloadErrorReport}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    📄 Télécharger rapport d&apos;erreurs
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
