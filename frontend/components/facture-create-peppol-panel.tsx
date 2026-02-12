"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatApiError } from "@/lib/ui/format-api-error";
import type { ClientDTO, SocieteResponse } from "@/types";
import { getClients } from "@/lib/api/client";
import { getSocietes } from "@/lib/api/societe";
import { NumberInput } from "@/components/ui/number-input";

/**
 * Composant pour créer une facture avec support Peppol intégré.
 *
 * Permet de :
 * - Créer une facture standard ou Peppol
 * - Configurer les identifiants Peppol (émetteur/destinataire)
 * - Choisir le format UBL ou CII
 * - Ajouter des lignes de facture
 * - Calculer automatiquement HT, TVA et TTC
 */
export function FactureCreatePeppolPanel() {
  const { status, token } = useAuth();
  const [clients, setClients] = useState<ClientDTO[]>([]);
  const [societes, setSocietes] = useState<SocieteResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Données de la facture
  const [numero, setNumero] = useState("");
  const [dateEmission, setDateEmission] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateEcheance, setDateEcheance] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [societeId, setSocieteId] = useState<number | "">("");
  const [clientId, setClientId] = useState<number | "">("");

  // Configuration Peppol
  const [peppolEnabled, setPeppolEnabled] = useState(false);
  const [peppolSenderEndpointId, setPeppolSenderEndpointId] = useState("");
  const [peppolReceiverEndpointId, setPeppolReceiverEndpointId] = useState("");
  const [peppolFormat, setPeppolFormat] = useState<"UBL_2_1" | "CII">("UBL_2_1");

  // Lignes de facture
  const [lignes, setLignes] = useState([
    { description: "", quantite: 1, prixUnitaire: 0, tauxTVA: 21 },
  ]);

  const requireAuth = useCallback(() => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour créer une facture.");
    return null;
  }, [status, token]);

  const loadData = useCallback(async () => {
    const authToken = requireAuth();
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const [clientsData, societesData] = await Promise.all([
        getClients(authToken),
        getSocietes(authToken),
      ]);
      setClients(clientsData ?? []);
      setSocietes(societesData ?? []);
    } catch (err) {
      setError(formatApiError(err, "Erreur inconnue"));
    } finally {
      setLoading(false);
    }
  }, [requireAuth]);

  useEffect(() => {
    if (status === "authenticated" && token) {
      loadData();
    }
  }, [status, token, loadData]);

  // Calculer les totaux
  const calculerTotaux = () => {
    let montantHT = 0;
    let montantTVA = 0;

    lignes.forEach((ligne) => {
      const totalLigneHT = ligne.quantite * ligne.prixUnitaire;
      const tvaTigne = (totalLigneHT * ligne.tauxTVA) / 100;
      montantHT += totalLigneHT;
      montantTVA += tvaTigne;
    });

    const montantTTC = montantHT + montantTVA;

    return { montantHT, montantTVA, montantTTC };
  };

  const { montantHT, montantTVA, montantTTC } = calculerTotaux();

  const ajouterLigne = () => {
    setLignes([
      ...lignes,
      { description: "", quantite: 1, prixUnitaire: 0, tauxTVA: 21 },
    ]);
  };

  const supprimerLigne = (index: number) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const authToken = requireAuth();
    if (!authToken) return;

    // Validation
    if (!numero.trim()) {
      setError("Le numéro de facture est requis");
      return;
    }
    if (!societeId) {
      setError("Sélectionnez une société");
      return;
    }
    if (!clientId) {
      setError("Sélectionnez un client");
      return;
    }
    if (lignes.length === 0 || !lignes[0].description.trim()) {
      setError("Ajoutez au moins une ligne de facture");
      return;
    }

    // Validation Peppol
    if (peppolEnabled) {
      if (!peppolSenderEndpointId.trim()) {
        setError("L'identifiant Peppol émetteur est requis pour une facture Peppol");
        return;
      }
      if (!peppolReceiverEndpointId.trim()) {
        setError("L'identifiant Peppol destinataire est requis pour une facture Peppol");
        return;
      }
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload = {
        numero,
        dateEmission,
        dateEcheance,
        montantHT,
        montantTVA,
        montantTTC,
        statut: peppolEnabled ? "EN_ATTENTE" : "BROUILLON",
        societeId,
        clientId,
        lignes: lignes.map((ligne) => ({
          description: ligne.description,
          quantite: ligne.quantite,
          prixUnitaire: ligne.prixUnitaire,
          total: ligne.quantite * ligne.prixUnitaire,
        })),
        // Champs Peppol
        peppolEnabled,
        peppolSenderEndpointId: peppolEnabled ? peppolSenderEndpointId : null,
        peppolReceiverEndpointId: peppolEnabled
          ? peppolReceiverEndpointId
          : null,
        peppolFormat: peppolEnabled ? peppolFormat : null,
      };

      const response = await fetch("/api/factures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      setSuccess(
        peppolEnabled
          ? `✅ Facture Peppol créée avec succès ! (${data.numero})`
          : `✅ Facture créée avec succès ! (${data.numero})`
      );

      // Réinitialiser le formulaire
      setNumero("");
      setDateEmission(new Date().toISOString().split("T")[0]);
      setDateEcheance(
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
      );
      setSocieteId("");
      setClientId("");
      setLignes([{ description: "", quantite: 1, prixUnitaire: 0, tauxTVA: 21 }]);
      setPeppolEnabled(false);
      setPeppolSenderEndpointId("");
      setPeppolReceiverEndpointId("");
    } catch (err) {
      setError(formatApiError(err, "Erreur lors de la création de la facture"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto mt-8 w-full max-w-7xl rounded-2xl border border-zinc-200/70 bg-white/60 p-4 sm:p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-4 sm:mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-600 dark:text-gray-400">
          Facturation
        </p>
        <h2 className="text-xl font-semibold">Créer une facture {peppolEnabled && "Peppol"}</h2>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
          {peppolEnabled
            ? "Créez une facture électronique conforme Peppol pour envoi automatisé"
            : "Créez une facture standard ou activez Peppol pour la conformité européenne"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Configuration Peppol */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <input
              type="checkbox"
              id="peppol-enabled"
              checked={peppolEnabled}
              onChange={(e) => setPeppolEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-blue-600"
            />
            <label htmlFor="peppol-enabled" className="text-sm font-semibold text-foreground">
              📨 Activer Peppol (facture électronique européenne)
            </label>
          </div>

          {peppolEnabled && (
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 mt-3 sm:mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Identifiant Peppol émetteur* (ex: 9925:BE0123456789)
                </label>
                <input
                  type="text"
                  value={peppolSenderEndpointId}
                  onChange={(e) => setPeppolSenderEndpointId(e.target.value)}
                  placeholder="9925:BE0123456789"
                  className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Format: scheme:identifier (ex: 9925 pour TVA belge)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Identifiant Peppol destinataire* (ex: 9925:FR98765432100)
                </label>
                <input
                  type="text"
                  value={peppolReceiverEndpointId}
                  onChange={(e) => setPeppolReceiverEndpointId(e.target.value)}
                  placeholder="9925:FR98765432100"
                  className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Format Peppol
                </label>
                <select
                  value={peppolFormat}
                  onChange={(e) => setPeppolFormat(e.target.value as "UBL_2_1" | "CII")}
                  className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
                >
                  <option value="UBL_2_1">UBL 2.1 (recommandé)</option>
                  <option value="CII">CII (Cross Industry Invoice)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Informations de base */}
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Numéro de facture*
            </label>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              placeholder="FAC-2026-001"
              className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Société*
            </label>
            <select
              value={societeId}
              onChange={(e) => setSocieteId(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              required
            >
              <option value="">Sélectionner une société</option>
              {societes.map((societe) => (
                <option key={societe.id} value={societe.id}>
                  {societe.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Client*
            </label>
            <select
              value={clientId}
              onChange={(e) => setClientId(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              required
            >
              <option value="">Sélectionner un client</option>
              {clients
                .filter((c) => !societeId || c.societe?.id === societeId)
                .map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Date d'émission*
            </label>
            <input
              type="date"
              value={dateEmission}
              onChange={(e) => setDateEmission(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Date d'échéance*
            </label>
            <input
              type="date"
              value={dateEcheance}
              onChange={(e) => setDateEcheance(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
              required
            />
          </div>
        </div>

        {/* Lignes de facture */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-foreground">Lignes de facture*</label>
            <button
              type="button"
              onClick={ajouterLigne}
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-foreground dark:border-zinc-700"
            >
              + Ajouter une ligne
            </button>
          </div>

          <div className="space-y-3">
            {lignes.map((ligne, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-lg border border-zinc-200 bg-white/70 p-3 dark:border-zinc-700 dark:bg-zinc-900/60 md:grid-cols-5"
              >
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={ligne.description}
                    onChange={(e) => {
                      const newLignes = [...lignes];
                      newLignes[index].description = e.target.value;
                      setLignes(newLignes);
                    }}
                    placeholder="Description"
                    className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    required
                  />
                </div>
                <div>
                  <NumberInput
                    value={ligne.quantite}
                    onChange={(e) => {
                      const newLignes = [...lignes];
                      newLignes[index].quantite = Number(e.target.value);
                      setLignes(newLignes);
                    }}
                    placeholder="Qté"
                    min={1}
                    className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
                <div>
                  <NumberInput
                    value={ligne.prixUnitaire}
                    onChange={(e) => {
                      const newLignes = [...lignes];
                      newLignes[index].prixUnitaire = Number(e.target.value);
                      setLignes(newLignes);
                    }}
                    step={0.01}
                    placeholder="Prix €"
                    min={0}
                    className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <NumberInput
                    value={ligne.tauxTVA}
                    onChange={(e) => {
                      const newLignes = [...lignes];
                      newLignes[index].tauxTVA = Number(e.target.value);
                      setLignes(newLignes);
                    }}
                    placeholder="TVA %"
                    min={0}
                    max={100}
                    className="w-full rounded border border-zinc-200 bg-white px-2 py-1.5 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                  />
                  {lignes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => supprimerLigne(index)}
                      className="text-red-600 hover:text-red-700"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totaux */}
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
          <div className="grid gap-2 sm:gap-3 text-sm md:grid-cols-3">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total HT :</span>
              <span className="ml-2 font-semibold text-foreground">
                {montantHT.toFixed(2)} €
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total TVA :</span>
              <span className="ml-2 font-semibold text-foreground">
                {montantTVA.toFixed(2)} €
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Total TTC :</span>
              <span className="ml-2 text-lg font-bold text-foreground">
                {montantTTC.toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-700/60 dark:bg-red-900/40 dark:text-red-100">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-700/50 dark:bg-emerald-900/30 dark:text-emerald-100">
            {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={() => {
              setNumero("");
              setLignes([{ description: "", quantite: 1, prixUnitaire: 0, tauxTVA: 21 }]);
              setPeppolEnabled(false);
              setError(null);
              setSuccess(null);
            }}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-foreground dark:border-zinc-700"
          >
            Réinitialiser
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-2 text-sm font-semibold text-white dark:bg-white dark:text-black disabled:opacity-70"
          >
            {saving ? "Création..." : peppolEnabled ? "Créer facture Peppol" : "Créer facture"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default FactureCreatePeppolPanel;
