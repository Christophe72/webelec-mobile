"use client";

import { useState } from "react";
import FileManager from "@/components/FileManager";

export default function FilesDemoPage() {
  const [entityType, setEntityType] = useState<"intervention" | "devis" | "facture">("intervention");
  const [entityId, setEntityId] = useState<number>(1);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Demo - File Manager</h1>
      <p>
        This page allows you to test the supporting documents management system
        (photos, PDFs, tickets, etc.) attached to interventions, devis and factures.
      </p>

      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", background: "#f9f9f9" }}>
        <h3>Configuration</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Entity type:
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as "intervention" | "devis" | "facture")}
              style={{ marginLeft: "10px" }}
            >
              <option value="intervention">Intervention</option>
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Entity ID:
            <input
              type="number"
              value={entityId}
              onChange={(e) => setEntityId(parseInt(e.target.value) || 1)}
              style={{ marginLeft: "10px", width: "100px" }}
            />
          </label>
        </div>
      </div>

      <FileManager entityType={entityType} entityId={entityId} />

      <div style={{ marginTop: "30px", padding: "15px", border: "1px solid #ddd", background: "#f0f8ff" }}>
        <h3>Instructions</h3>
        <ul>
          <li>Select the entity type (intervention, devis or facture)</li>
          <li>Enter the entity ID (must exist in the database)</li>
          <li>Select a document type (PHOTO, PDF, TICKET, etc.)</li>
          <li>Choose a file to upload</li>
          <li>Click &quot;Upload&quot; to send the file</li>
          <li>Files will appear in the list below</li>
          <li>Use the &quot;Download&quot; and &quot;Delete&quot; buttons to manage files</li>
        </ul>
      </div>
    </div>
  );
}
