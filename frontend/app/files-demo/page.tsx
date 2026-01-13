"use client";

import { useState } from "react";
import FileManager from "@/components/FileManager";

export default function FilesDemoPage() {
  const [entityType, setEntityType] = useState<"intervention" | "devis" | "facture">("intervention");
  const [entityId, setEntityId] = useState<number>(1);

  return (
    <div className="p-5 max-w-300 mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-3">Démonstration - Gestionnaire de Fichiers</h1>
      <p className="text-foreground mb-6">
        Cette page permet de tester le système de gestion des pièces justificatives
        (photos, PDFs, tickets, etc.) attachées aux interventions, devis et factures.
      </p>

      <div className="mb-5 p-4 border border-border bg-muted/20 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">Configuration</h3>
        <div className="mb-3">
          <label className="flex items-center gap-3 text-foreground">
            <span className="font-medium">Type d&apos;entité:</span>
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as "intervention" | "devis" | "facture")}
              className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="intervention">Intervention</option>
              <option value="devis">Devis</option>
              <option value="facture">Facture</option>
            </select>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-3 text-foreground">
            <span className="font-medium">ID de l&apos;entité:</span>
            <input
              type="number"
              value={entityId}
              onChange={(e) => setEntityId(parseInt(e.target.value) || 1)}
              className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </label>
        </div>
      </div>

      <FileManager entityType={entityType} entityId={entityId} />

      <div className="mt-8 p-4 border border-primary/20 bg-primary/5 rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
        <ul className="space-y-2 text-foreground list-disc list-inside">
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
