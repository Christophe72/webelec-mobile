"use client";

import { useMemo, useState } from "react";
import type { AccountInput, ValidationResult } from "../domain/types";
import { AccountValidationEngine } from "../domain/engine";

export interface AccountValidationWizardProps {
  engine: AccountValidationEngine;
  onValidated: (result: ValidationResult) => void;
  defaultCountry?: string;
  className?: string;
}

export function AccountValidationWizard(props: AccountValidationWizardProps) {
  const [mode, setMode] = useState<"IBAN" | "BBAN">("IBAN");
  const [iban, setIban] = useState("");
  const [bban, setBban] = useState("");
  const [bic, setBic] = useState("");
  const [countryHint, setCountryHint] = useState(props.defaultCountry ?? "BE");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [busy, setBusy] = useState(false);

  const input: AccountInput = useMemo(
    () => ({
      mode,
      iban: mode === "IBAN" ? iban : undefined,
      bban: mode === "BBAN" ? bban : undefined,
      bic: bic || undefined,
      countryHint: mode === "BBAN" ? countryHint : undefined,
    }),
    [mode, iban, bban, bic, countryHint]
  );

  async function run() {
    setBusy(true);
    try {
      const r = await props.engine.run(input);
      setResult(r);
      if (r.status === "VALIDATED") props.onValidated(r);
    } catch (error) {
      setResult({
        status: "REJECTED",
        issues: [
          {
            code: "UNEXPECTED_ERROR",
            severity: "ERROR",
            message: `Erreur inattendue: ${error instanceof Error ? error.message : "Unknown error"}`,
          },
        ],
        details: {},
        meta: { steps: [] },
      });
    } finally {
      setBusy(false);
    }
  }

  function accept() {
    if (result) {
      props.onValidated({ ...result, status: "VALIDATED" });
    }
  }

  function reset() {
    setResult(null);
    setIban("");
    setBban("");
    setBic("");
  }

  const getSeverityColor = (severity: "ERROR" | "WARNING" | "INFO") => {
    switch (severity) {
      case "ERROR":
        return "text-red-600 bg-red-50 border-red-200";
      case "WARNING":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "INFO":
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className={`max-w-2xl mx-auto p-6 ${props.className ?? ""}`}>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Validation de compte bancaire</h2>

        {/* Mode Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode de saisie
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === "IBAN"}
                onChange={() => setMode("IBAN")}
                className="mr-2"
                disabled={busy}
              />
              <span>IBAN</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={mode === "BBAN"}
                onChange={() => setMode("BBAN")}
                className="mr-2"
                disabled={busy}
              />
              <span>BBAN</span>
            </label>
          </div>
        </div>

        {/* IBAN Mode */}
        {mode === "IBAN" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              placeholder="BE68 5390 0754 7034"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={busy}
            />
          </div>
        )}

        {/* BBAN Mode */}
        {mode === "BBAN" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pays (code ISO 2 lettres)
              </label>
              <input
                type="text"
                value={countryHint}
                onChange={(e) => setCountryHint(e.target.value.toUpperCase())}
                placeholder="BE"
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={busy}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BBAN
              </label>
              <input
                type="text"
                value={bban}
                onChange={(e) => setBban(e.target.value)}
                placeholder="539007547034"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={busy}
              />
            </div>
          </>
        )}

        {/* BIC Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            BIC / SWIFT (optionnel selon pays)
          </label>
          <input
            type="text"
            value={bic}
            onChange={(e) => setBic(e.target.value.toUpperCase())}
            placeholder="GEBABEBB"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={busy}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={run}
            disabled={busy}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? "Validation en cours..." : "Valider"}
          </button>
          {result && (
            <button
              onClick={reset}
              disabled={busy}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Réinitialiser
            </button>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="mt-8 border-t pt-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Résultat:{" "}
                <span
                  className={
                    result.status === "VALIDATED"
                      ? "text-green-600"
                      : result.status === "NEEDS_CONFIRMATION"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {result.status === "VALIDATED" && "✓ Validé"}
                  {result.status === "NEEDS_CONFIRMATION" && "⚠ Confirmation requise"}
                  {result.status === "REJECTED" && "✗ Rejeté"}
                </span>
              </h3>
            </div>

            {/* Issues */}
            {result.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Problèmes détectés:</h4>
                <ul className="space-y-2">
                  {result.issues.map((issue, idx) => (
                    <li
                      key={idx}
                      className={`p-3 rounded border ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-semibold">{issue.severity}</span>
                          {issue.field && (
                            <span className="text-sm ml-2">({issue.field})</span>
                          )}
                          <p className="mt-1">{issue.message}</p>
                        </div>
                        <code className="text-xs bg-white px-2 py-1 rounded">
                          {issue.code}
                        </code>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Account Details */}
            <div className="mb-4">
              <h4 className="font-medium mb-2">Détails du compte:</h4>
              <div className="bg-gray-50 p-4 rounded border border-gray-200 font-mono text-sm">
                <pre>{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            </div>

            {/* Proposed Details (if different) */}
            {result.proposedDetails && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Détails proposés (externe):</h4>
                <div className="bg-blue-50 p-4 rounded border border-blue-200 font-mono text-sm">
                  <pre>{JSON.stringify(result.proposedDetails, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Meta Information */}
            <div className="mb-4">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-600 hover:text-gray-800">
                  Informations techniques
                </summary>
                <div className="mt-2 bg-gray-50 p-3 rounded border border-gray-200">
                  <p>
                    <strong>Steps exécutés:</strong> {result.meta.steps.join(" → ")}
                  </p>
                  {result.meta.transposedDetected && (
                    <p className="text-yellow-600 mt-1">
                      ⚠ Transposition détectée
                    </p>
                  )}
                  {result.meta.externalResolved && (
                    <p className="text-blue-600 mt-1">
                      ℹ Résolu via service externe
                    </p>
                  )}
                </div>
              </details>
            </div>

            {/* Confirmation Button */}
            {result.status === "NEEDS_CONFIRMATION" && (
              <div className="mt-6">
                <button
                  onClick={accept}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-semibold"
                >
                  Accepter et valider
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
