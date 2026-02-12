"use client";

import { FactureCreatePeppolPanel } from "@/components/facture-create-peppol-panel";

export default function FacturesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Formulaire de création à gauche */}
        <div className="xl:col-span-1">
          <FactureCreatePeppolPanel />
        </div>

        {/* Informations Peppol à droite */}
        <div className="xl:col-span-2">
          <div className="rounded-lg border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          📨 Qu'est-ce que Peppol ?
        </h3>

        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Peppol</strong> (Pan-European Public Procurement On-Line) est un réseau
            européen sécurisé pour l'échange de factures électroniques et de documents
            commerciaux.
          </p>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Avantages Peppol :</h4>
            <ul className="list-disc list-inside space-y-1 marker:text-foreground">
              <li>Conformité légale européenne (directive 2014/55/UE)</li>
              <li>Transmission sécurisée et traçable des factures</li>
              <li>Réduction des coûts et des délais de traitement</li>
              <li>Interopérabilité entre tous les pays européens</li>
              <li>Validation automatique selon la norme EN 16931</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Format d'identifiant Peppol :</h4>
            <div className="rounded border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
              <p className="font-mono text-xs mb-2">Scheme:Identifier</p>
              <ul className="space-y-1 text-xs marker:text-foreground">
                <li className="marker:text-current">
                  <strong>9925</strong> : Numéro TVA (BE, FR, NL, etc.)
                </li>
                <li>
                  <strong>9956</strong> : Numéro SIRET (France)
                </li>
                <li>
                  <strong>0088</strong> : GLN (Global Location Number)
                </li>
                <li>
                  <strong>0184</strong> : DUNS Number
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Exemples d'identifiants :</h4>
            <div className="space-y-2">
              <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-700/50 dark:bg-emerald-900/30">
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-100">
                  9925:BE0123456789
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-200">
                  ✓ TVA belge
                </p>
              </div>
              <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-700/50 dark:bg-emerald-900/30">
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-100">
                  9925:FR98765432100
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-200">
                  ✓ TVA française
                </p>
              </div>
              <div className="rounded border border-emerald-200 bg-emerald-50 p-2 dark:border-emerald-700/50 dark:bg-emerald-900/30">
                <p className="font-mono text-xs text-emerald-700 dark:text-emerald-100">
                  9956:12345678900123
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-200">
                  ✓ SIRET français
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h4 className="font-semibold text-foreground mb-2">Formats supportés :</h4>
            <ul className="space-y-2 marker:text-foreground">
              <li className="marker:text-current">
                <strong>UBL 2.1</strong> (Universal Business Language) - Format XML recommandé
                par Peppol
              </li>
              <li>
                <strong>CII</strong> (Cross Industry Invoice) - Format UN/CEFACT, alternatif
                au UBL
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Une fois créée, votre facture Peppol sera disponible sur la{" "}
              <a
                href="/peppol"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                page Peppol
              </a>{" "}
              pour vérification UBL et envoi via le réseau Peppol.
            </p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
