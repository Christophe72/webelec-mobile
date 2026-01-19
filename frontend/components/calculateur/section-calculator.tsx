/**
 * Calculateur de section de câble
 *
 * Interface utilisateur pour le calcul de la section minimale d'un câble
 * selon le RGIE belge.
 */

"use client";

import { useState, useEffect } from "react";
import type {
  SectionInputs,
  SectionResult,
  CircuitType,
  Tension,
  InstallationType,
} from "@/types/dto/calculateur";
import { calculateCableSection } from "@/lib/calculateur/section";
import { CalculatorResultCard } from "./calculator-result-card";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, AlertCircle } from "lucide-react";
import { RGIE_DISCLAIMER } from "@/lib/calculateur/rgie-constants";

interface SectionCalculatorProps {
  inputs: SectionInputs;
  onChange: <K extends keyof SectionInputs>(
    field: K,
    value: SectionInputs[K],
  ) => void;
  onUseResult?: (sectionRecommandee: number) => void;
}

export function SectionCalculator({
  inputs,
  onChange,
  onUseResult,
}: SectionCalculatorProps) {
  const [result, setResult] = useState<SectionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Recalculer automatiquement quand les inputs changent (si tous les champs sont remplis)
  useEffect(() => {
    if (inputs.courant > 0 && inputs.longueur > 0) {
      handleCalculate();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputs.courant,
    inputs.longueur,
    inputs.tension,
    inputs.typeCircuit,
    inputs.typeInstallation,
  ]);

  const handleCalculate = () => {
    setIsCalculating(true);

    // Petit délai pour l'animation (optionnel)
    setTimeout(() => {
      const calculResult = calculateCableSection(inputs);
      setResult(calculResult);
      setIsCalculating(false);
    }, 100);
  };

  const canUseResult =
    result && (result.status === "ok" || result.status === "limite");

  return (
    <div className="space-y-4">
      {/* Disclaimer RGIE */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{RGIE_DISCLAIMER}</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Courant */}
        <div className="space-y-2">
          <Label htmlFor="courant" className="text-base font-medium">
            Courant (A)
          </Label>
          <NumberInput
            id="courant"
            min={0}
            step={0.1}
            value={inputs.courant || ""}
            onChange={(e) =>
              onChange("courant", parseFloat(e.target.value) || 0)
            }
            className="h-12 text-base"
            placeholder="Ex: 16"
          />
          <p className="text-sm text-muted-foreground">
            Intensité nominale du circuit
          </p>
        </div>

        {/* Longueur */}
        <div className="space-y-2">
          <Label htmlFor="longueur" className="text-base font-medium">
            Longueur (m)
          </Label>
          <NumberInput
            id="longueur"
            min={0}
            step={0.1}
            value={inputs.longueur || ""}
            onChange={(e) =>
              onChange("longueur", parseFloat(e.target.value) || 0)
            }
            className="h-12 text-base"
            placeholder="Ex: 25"
          />
          <p className="text-sm text-muted-foreground">
            Distance aller simple (tableau → point d&#39;utilisation)
          </p>
        </div>

        {/* Tension */}
        <div className="space-y-2">
          <Label htmlFor="tension" className="text-base font-medium">
            Tension (V)
          </Label>
          <Select
            value={inputs.tension.toString()}
            onValueChange={(value) =>
              onChange("tension", parseInt(value) as Tension)
            }
          >
            <SelectTrigger id="tension" className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="230">230V (monophasé)</SelectItem>
              <SelectItem value="400">400V (triphasé)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type de circuit */}
        <div className="space-y-2">
          <Label htmlFor="typeCircuit" className="text-base font-medium">
            Type de circuit
          </Label>
          <Select
            value={inputs.typeCircuit}
            onValueChange={(value) =>
              onChange("typeCircuit", value as CircuitType)
            }
          >
            <SelectTrigger id="typeCircuit" className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eclairage">Éclairage</SelectItem>
              <SelectItem value="prises">Prises de courant</SelectItem>
              <SelectItem value="dedie">Circuit dédié</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type d'installation */}
        <div className="space-y-2">
          <Label htmlFor="typeInstallation" className="text-base font-medium">
            Type d&#39;installation
          </Label>
          <Select
            value={inputs.typeInstallation || "neuf"}
            onValueChange={(value) =>
              onChange("typeInstallation", value as InstallationType)
            }
          >
            <SelectTrigger id="typeInstallation" className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neuf">Neuf (normes strictes)</SelectItem>
              <SelectItem value="renovation">
                Rénovation (tolérances)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Résultat */}
      {result && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <CalculatorResultCard
            status={result.status}
            title="Section recommandée"
            value={`${result.sectionRecommandee} mm²`}
            message={result.message}
          />

          {/* Bouton "Utiliser ce résultat" */}
          {canUseResult && onUseResult && (
            <Button
              onClick={() => onUseResult(result.sectionRecommandee)}
              className="mt-4 h-12 w-full text-base"
              size="lg"
            >
              Utiliser ce résultat
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      )}

      {/* Message si champs manquants */}
      {!result && inputs.courant === 0 && inputs.longueur === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
          Remplissez le courant et la longueur pour voir le résultat
        </div>
      )}

      {isCalculating && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
          Calcul en cours...
        </div>
      )}
    </div>
  );
}
