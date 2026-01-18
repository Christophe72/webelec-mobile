"use client";

import { useMemo } from "react";
import { AccountValidationWizard } from "@/app/modules/account-validation";
import {
  AccountValidationEngine,
  MockBankWizardAdapter,
  LocalStorageStoreAdapter,
} from "@/app/modules/account-validation";
import type { ValidationResult } from "@/app/modules/account-validation";

export default function PeppolAccountValidationPage() {
  // Créer l'instance du moteur de validation
  const engine = useMemo(
    () =>
      new AccountValidationEngine({
        bankWizard: new MockBankWizardAdapter(),
        store: new LocalStorageStoreAdapter(),
        // Politique de confirmation personnalisée
        manualConfirmationPolicy: ({ issues, country }) => {
          // Demander confirmation si des warnings sont présents
          return issues.some((i) => i.severity === "WARNING");
        },
      }),
    []
  );

  const handleValidated = (result: ValidationResult) => {
    console.log("✅ Compte validé:", result);

    // Exemple: sauvegarder dans votre base de données
    // await fetch('/api/accounts', { method: 'POST', body: JSON.stringify(result.details) });

    // Exemple: rediriger l'utilisateur
    // router.push('/dashboard');

    alert(
      `Compte validé avec succès!\n\nIBAN: ${result.details.iban ?? "N/A"}\nBIC: ${
        result.details.bic ?? "N/A"
      }\nPays: ${result.details.country ?? "N/A"}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Validation de compte bancaire Peppol
          </h1>
          <p className="text-gray-600">
            Module de validation IBAN/BBAN/BIC conforme au standard Peppol
          </p>
        </div>

        <AccountValidationWizard
          engine={engine}
          onValidated={handleValidated}
          defaultCountry="BE"
          className="mb-8"
        />

        {/* Documentation rapide */}
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Guide d'utilisation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Mode IBAN (recommandé)
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Saisissez l'IBAN complet avec ou sans espaces.
              </p>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm font-mono">
                  Exemple: BE68 5390 0754 7034
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Mode BBAN</h3>
              <p className="text-sm text-gray-600 mb-2">
                Saisissez le code pays et le BBAN local.
              </p>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm font-mono">Pays: BE</p>
                <p className="text-sm font-mono">BBAN: 539007547034</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Exemples de test
              </h3>
              <ul className="text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <div>
                    <p className="font-mono">BE68 5390 0754 7034</p>
                    <p className="text-gray-500">IBAN belge valide</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <div>
                    <p className="font-mono">FR14 2004 1010 0505 0001 3M02 606</p>
                    <p className="text-gray-500">IBAN français valide</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 mr-2">✗</span>
                  <div>
                    <p className="font-mono">BE68 1234 5678 9012</p>
                    <p className="text-gray-500">IBAN belge invalide (checksum)</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">
                Pays supportés
              </h3>
              <div className="flex flex-wrap gap-2">
                {["BE", "FR", "DE", "NL", "LU", "IT", "ES", "PT"].map((country) => (
                  <span
                    key={country}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {country}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-semibold text-gray-900 mb-2">
                Fonctionnalités
              </h3>
              <ul className="text-sm space-y-1">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Validation modulo 97 IBAN
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Validation BBAN par pays
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Validation BIC/SWIFT
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Détection de transpositions
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
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
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Voir la documentation complète du module →
          </a>
        </div>
      </div>
    </div>
  );
}
