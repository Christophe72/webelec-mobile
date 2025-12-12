"use client";

import { useState } from "react";
import FileManager from "@/components/FileManager";

export default function FilesDemoPage() {
  const [entityType, setEntityType] = useState<"intervention" | "devis" | "facture">("intervention");
  const [entityId, setEntityId] = useState<number>(1);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Démonstration - Gestionnaire de Fichiers</h1>
      <p>
        Cette page permet de tester le système de gestion des pièces justificatives
        (photos, PDFs, tickets, etc.) attachées aux interventions, devis et factures.
      </p>

      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", background: "#f9f9f9" }}>
        <h3>Configuration</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>
            Type d&apos;entité:
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
            ID de l&apos;entité:
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
          <li>Sélectionnez le type d&apos;entité (intervention, devis ou facture)</li>
          <li>Entrez l&apos;ID de l&apos;entité (doit exister dans la base de données)</li>
          <li>Sélectionnez un type de document (PHOTO, PDF, TICKET, etc.)</li>
          <li>Choisissez un fichier à uploader</li>
          <li>Cliquez sur &quot;Upload&quot; pour envoyer le fichier</li>
          <li>Les fichiers apparaîtront dans la liste ci-dessous</li>
          <li>Utilisez les boutons &quot;Télécharger&quot; et &quot;Supprimer&quot; pour gérer les fichiers</li>
        </ul>
      </div>
    </div>
  );
}
