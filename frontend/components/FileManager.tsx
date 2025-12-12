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

interface FileManagerProps {
  entityType: "intervention" | "devis" | "facture";
  entityId: number;
}

const DOCUMENT_TYPES = ["PHOTO", "PDF", "TICKET", "FACTURE", "DEVIS", "AUTRE"];

export default function FileManager({ entityType, entityId }: FileManagerProps) {
  const [files, setFiles] = useState<PieceJustificativeResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("PHOTO");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId]);

  async function loadFiles() {
    setLoading(true);
    setError(null);
    try {
      let data: PieceJustificativeResponse[];
      switch (entityType) {
        case "intervention":
          data = await getPiecesByIntervention(entityId);
          break;
        case "devis":
          data = await getPiecesByDevis(entityId);
          break;
        case "facture":
          data = await getPiecesByFacture(entityId);
          break;
        default:
          data = [];
      }
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setUploading(true);
    setError(null);
    try {
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
        uploadData.interventionId = entityId;
      } else if (entityType === "devis") {
        uploadData.devisId = entityId;
      } else if (entityType === "facture") {
        uploadData.factureId = entityId;
      }

      await uploadPiece(uploadData);
      setSelectedFile(null);
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(fileId: number) {
    try {
      await downloadPiece(fileId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    }
  }

  async function handleDelete(fileId: number) {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      await deletePiece(fileId);
      await loadFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  return (
    <div className="file-manager">
      <h2>File Manager</h2>

      {error && (
        <div className="error-message" style={{ color: "red", padding: "10px", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <div className="upload-section" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd" }}>
        <h3>Upload a file</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Document type:
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{ marginLeft: "10px" }}
            >
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="file"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            disabled={uploading}
          />
        </div>
        <button onClick={handleUpload} disabled={uploading || !selectedFile}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <div className="files-list">
        <h3>Attached files ({files.length})</h3>
        {loading ? (
          <p>Loading...</p>
        ) : files.length === 0 ? (
          <p>No files attached</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Type</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Size</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Date</th>
                <th style={{ padding: "10px", textAlign: "left" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{file.originalFilename}</td>
                  <td style={{ padding: "10px" }}>{file.type}</td>
                  <td style={{ padding: "10px" }}>{formatFileSize(file.fileSize)}</td>
                  <td style={{ padding: "10px" }}>{formatDate(file.uploadDate)}</td>
                  <td style={{ padding: "10px" }}>
                    <button
                      onClick={() => handleDownload(file.id)}
                      style={{ marginRight: "5px" }}
                    >
                      Download
                    </button>
                    <button onClick={() => handleDelete(file.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
