"use client";

import { useState, useEffect } from "react";
import { PieceJustificativeResponse } from "@/types";
import {
  uploadPiece,
  downloadPiece,
  deletePiece,
  getPiecesByIntervention,
  getPiecesByDevis,
  getPiecesByFacture,
} from "@/lib/api/piece";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";

interface FileManagerProps {
  entityType?: "intervention" | "devis" | "facture";
  entityId?: number;
}

const DOCUMENT_TYPES = ["PHOTO", "PDF", "TICKET", "FACTURE", "DEVIS", "AUTRE"];

export default function FileManager({
  entityType: initialEntityType = "intervention",
  entityId: initialEntityId
}: FileManagerProps) {
  const [entityType, setEntityType] = useState<"intervention" | "devis" | "facture">(initialEntityType);
  const [entityId, setEntityId] = useState<string>(initialEntityId?.toString() || "");
  const [files, setFiles] = useState<PieceJustificativeResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("PHOTO");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { status, token } = useAuth();

  const requireAuth = () => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  };

  useEffect(() => {
    if (status !== "authenticated" || !token || !entityId) return;
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId, status, token]);

  async function loadFiles() {
    const authToken = requireAuth();
    if (!authToken || !entityId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      let data: PieceJustificativeResponse[];
      const id = parseInt(entityId);
      if (isNaN(id)) {
        setError("ID invalide");
        setLoading(false);
        return;
      }

      switch (entityType) {
        case "intervention":
          data = await getPiecesByIntervention(authToken, id);
          break;
        case "devis":
          data = await getPiecesByDevis(authToken, id);
          break;
        case "facture":
          data = await getPiecesByFacture(authToken, id);
          break;
        default:
          data = [];
      }
      setFiles(data);
    } catch (err) {
      setError(formatApiError(err, "Erreur lors du chargement des fichiers"));
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier");
      return;
    }
    if (!entityId) {
      setError("Veuillez renseigner l'ID de l'entité");
      return;
    }

    const authToken = requireAuth();
    if (!authToken) return;

    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const id = parseInt(entityId);
      if (isNaN(id)) {
        setError("ID invalide");
        setUploading(false);
        return;
      }

      const uploadData: {
        file: File;
        type: string;
        interventionId?: number;
        devisId?: number;
        factureId?: number;
      } = {
        file: selectedFile,
        type: documentType,
      };

      if (entityType === "intervention") {
        uploadData.interventionId = id;
      } else if (entityType === "devis") {
        uploadData.devisId = id;
      } else if (entityType === "facture") {
        uploadData.factureId = id;
      }

      await uploadPiece(authToken, uploadData);
      setSelectedFile(null);
      setSuccess("✅ Fichier ajouté avec succès");
      await loadFiles();

      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(`❌ ${formatApiError(err, "Erreur lors de l'upload")}`);
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(fileId: number) {
    try {
      const authToken = requireAuth();
      if (!authToken) return;
      await downloadPiece(authToken, fileId);
    } catch (err) {
      setError(`❌ ${formatApiError(err, "Erreur lors du téléchargement")}`);
    }
  }

  async function handleDelete(fileId: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }

    try {
      const authToken = requireAuth();
      if (!authToken) return;
      setError(null);
      setSuccess(null);
      await deletePiece(authToken, fileId);
      setSuccess("✅ Fichier supprimé avec succès");
      await loadFiles();
    } catch (err) {
      setError(`❌ ${formatApiError(err, "Erreur lors de la suppression")}`);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Gestionnaire de fichiers</h1>

      {/* Contexte de travail */}
      <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-lg mb-6 border border-gray-300 dark:border-gray-600">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-4">🧾 Contexte de travail</h2>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">Entité :</label>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as typeof entityType)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="intervention">Intervention</option>
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-900 dark:text-gray-100">ID :</label>
            <input
              type="number"
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              placeholder="2"
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm w-24 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Ajouter un document */}
      <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 dark:border-blue-400 rounded-lg p-6 mb-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">➕ Ajouter un document</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Type de document :
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Fichier :
            </label>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              disabled={uploading}
              className="block w-full text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? "Upload en cours..." : "Uploader"}
            </button>
          </div>
        </div>
      </div>

      {/* Documents attachés */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-5">
          📂 Documents attachés ({files.length})
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        ) : files.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Aucun fichier attaché</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Taille</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{file.originalFilename}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{file.type}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{formatFileSize(file.fileSize)}</td>
                    <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{formatDate(file.uploadDate)}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownload(file.id)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                          title="Télécharger"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Aide / Mode d'emploi */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <button
          onClick={() => setHelpOpen(!helpOpen)}
          className="w-full text-left px-6 py-4 font-bold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between text-base"
        >
          <span>ℹ️ Aide / Mode d&apos;emploi</span>
          <span className="text-xl">{helpOpen ? "▼" : "▶"}</span>
        </button>

        {helpOpen && (
          <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 dark:text-gray-300 marker:text-current">
              <li>Choisir le type d&apos;entité</li>
              <li>Renseigner l&apos;ID existant</li>
              <li>Sélectionner le type de document</li>
              <li>Choisir un fichier</li>
              <li>Cliquer sur &quot;Uploader&quot;</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
