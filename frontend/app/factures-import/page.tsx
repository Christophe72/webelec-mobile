"use client";

import { useState } from "react";
import {
  InvoiceImportDialog,
  HttpInvoiceImportAdapter,
} from "@/app/modules/invoice-import";

export default function FacturesImportPage() {
  const [importOpen, setImportOpen] = useState(false);
  const [lastImportMessage, setLastImportMessage] = useState<string | null>(null);

  // Créer l'adaptateur HTTP pour les appels réels au backend
  const adapter = new HttpInvoiceImportAdapter();

  const handleSuccess = () => {
    setLastImportMessage("✅ Import réussi! Les factures ont été importées.");
    // Ici vous pourriez rafraîchir la liste des factures
    console.log("Import terminé avec succès");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 text-foreground dark:bg-zinc-950">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Import de Factures CSV
          </h1>
          <p className="text-muted-foreground">
            Module d'import de factures clients depuis fichiers CSV avec
            validation automatique et création de clients
          </p>
        </div>

        {/* Bouton d'action */}
        <div className="mb-8">
          <button
            onClick={() => setImportOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition-colors"
          >
            📥 Importer des factures
          </button>

          {lastImportMessage && (
            <div className="mt-4 p-4 rounded-lg border border-emerald-200 bg-emerald-50 dark:border-emerald-700/50 dark:bg-emerald-900/30">
              <p className="text-emerald-800 dark:text-emerald-100">
                {lastImportMessage}
              </p>
            </div>
          )}
        </div>

        {/* Dialog d'import */}
        <InvoiceImportDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          societeId={1} // À remplacer par l'ID de la société connectée
          adapter={adapter}
          onSuccess={handleSuccess}
        />

        {/* Documentation */}
        <div className="rounded-lg border border-zinc-200/70 bg-white/80 p-6 shadow-sm max-w-4xl mx-auto dark:border-zinc-800 dark:bg-zinc-900/60">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            Guide d'utilisation
          </h2>

          <div className="space-y-6">
            {/* Format CSV */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Format CSV requis
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Le fichier CSV doit contenir les colonnes suivantes (première ligne = headers):
              </p>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-4 overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900/70">
                <pre className="text-xs font-mono whitespace-pre">
{`numero,dateEmission,dateEcheance,montantHT,montantTVA,montantTTC,statut,clientNom,clientPrenom,clientEmail,clientTelephone,clientAdresse,lignes`}
                </pre>
              </div>
            </div>

            {/* Exemple */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Exemple de ligne
              </h3>
              <div className="rounded border border-zinc-200 bg-zinc-50 p-4 overflow-x-auto dark:border-zinc-800 dark:bg-zinc-900/70">
                <pre className="text-xs font-mono whitespace-pre">
{`FAC-2025-001,2025-01-15,2025-02-15,1000.00,210.00,1210.00,EN_ATTENTE,Dupont,Marc,marc@email.com,0601020304,"10 rue Paris","Item A|1|500|500;Item B|1|500|500"`}
                </pre>
              </div>
            </div>

            {/* Colonnes obligatoires */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Colonnes obligatoires
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  <strong>numero</strong>: Numéro unique de facture
                </li>
                <li>
                  <strong>dateEmission</strong> et <strong>dateEcheance</strong>: Format ISO (YYYY-MM-DD)
                </li>
                <li>
                  <strong>montantHT, montantTVA, montantTTC</strong>: Montants avec 2 décimales
                </li>
                <li>
                  <strong>statut</strong>: EN_ATTENTE, PAYEE, ANNULEE, etc.
                </li>
                <li>
                  <strong>clientNom</strong> et <strong>clientPrenom</strong>: Identité du client
                </li>
                <li>
                  <strong>lignes</strong>: Format{" "}
                  <code className="bg-gray-200 px-1 rounded">
                    description|quantite|prixUnitaire|total
                  </code>{" "}
                  séparés par <code className="bg-gray-200 px-1 rounded">;</code>
                </li>
              </ul>
            </div>

            {/* Colonnes optionnelles */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Colonnes optionnelles
              </h3>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  <strong>clientEmail</strong>: Utilisé pour identifier un client existant
                </li>
                <li>
                  <strong>clientTelephone</strong> et <strong>clientAdresse</strong>: Informations complémentaires
                </li>
              </ul>
            </div>

            {/* Fonctionnalités */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                Fonctionnalités
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">✓</span>
                  <div>
                    <strong>Création automatique de clients</strong>
                    <p className="text-muted-foreground">
                      Si un client n'existe pas, il sera créé automatiquement
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">✓</span>
                  <div>
                    <strong>Validation complète</strong>
                    <p className="text-muted-foreground">
                      Dates, montants, cohérence HT+TVA=TTC, unicité numéro
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">✓</span>
                  <div>
                    <strong>Import partiel</strong>
                    <p className="text-muted-foreground">
                      Les lignes valides sont importées, les autres sont rapportées avec détails
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-emerald-600 dark:text-emerald-300 mr-2">✓</span>
                  <div>
                    <strong>Rapport d'erreurs</strong>
                    <p className="text-muted-foreground">
                      Téléchargement d'un fichier texte avec toutes les erreurs
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Template */}
            <div className="pt-4 border-t dark:border-zinc-800">
              <h3 className="font-semibold text-foreground mb-2">
                Template CSV
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Téléchargez un fichier template pré-formaté pour commencer:
              </p>
              <a
                href="/factures-import-template.csv"
                download
                className="inline-flex items-center px-4 py-2 rounded bg-zinc-100 text-zinc-700 hover:bg-zinc-200 text-sm font-medium dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                📥 Télécharger le template CSV
              </a>
            </div>

            {/* Limites */}
            <div className="pt-4 border-t dark:border-zinc-800">
              <h3 className="font-semibold text-foreground mb-2">Limites</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>
                  • Taille max du fichier: <strong>10 MB</strong>
                </li>
                <li>
                  • Format supporté: <strong>CSV uniquement</strong>
                </li>
                <li>
                  • Encodage: <strong>UTF-8</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lien vers la documentation */}
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <a
            href="/app/modules/invoice-import/README.md"
            className="text-blue-600 hover:text-blue-800 text-sm dark:text-blue-400 dark:hover:text-blue-300"
          >
            Voir la documentation complète du module →
          </a>
        </div>
      </div>
    </div>
  );
}
