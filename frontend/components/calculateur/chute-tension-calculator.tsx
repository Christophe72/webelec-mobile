/**
 * Calculateur de chute de tension
 *
 * Interface utilisateur pour le calcul de la chute de tension d'un circuit
 * selon le RGIE belge.
 */

"use client";

import { useState, useEffect } from "react";
import type {
  ChuteTensionInputs,
  ChuteTensionResult,
  CircuitType,
  Tension,
  InstallationType,
} from "@/types/dto/calculateur";
import { calculateVoltageDrop } from "@/lib/calculateur/chute-tension";
import { CalculatorResultCard } from "./calculator-result-card";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { RGIE_DISCLAIMER } from "@/lib/calculateur/rgie-constants";
import { CABLE_SECTIONS } from "@/lib/calculateur/cable-sections";

interface ChuteTensionCalculatorProps {
  inputs: ChuteTensionInputs;
  onChange: <K extends keyof ChuteTensionInputs>(
    field: K,
    value: ChuteTensionInputs[K]
  ) => void;
}

export function ChuteTensionCalculator({
  inputs,
  onChange,
}: ChuteTensionCalculatorProps) {
  const [result, setResult] = useState<ChuteTensionResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Recalculer automatiquement quand les inputs changent
  useEffect(() => {
    if (inputs.section > 0 && inputs.longueur > 0 && inputs.courant > 0) {
      handleCalculate();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    inputs.section,
    inputs.longueur,
    inputs.courant,
    inputs.tension,
    inputs.typeCircuit,
    inputs.typeInstallation,
  ]);

  const handleCalculate = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const calculResult = calculateVoltageDrop(inputs);
      setResult(calculResult);
      setIsCalculating(false);
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* Disclaimer RGIE */}
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{RGIE_DISCLAIMER}</p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {/* Section du câble */}
        <div className="space-y-2">
          <Label htmlFor="section-chute" className="text-base font-medium">
            Section du câble (mm²)
          </Label>
          <NumberInput
            id="section-chute"
            min={0}
            step={0.1}
            value={inputs.section || ""}
            onChange={(e) =>
              onChange("section", parseFloat(e.target.value) || 0)
            }
            presetValues={[...CABLE_SECTIONS]}
            className="h-12 text-base"
            placeholder="Ex: 2.5"
          />
        </div>

        {/* Longueur */}
        <div className="space-y-2">
          <Label htmlFor="longueur-chute" className="text-base font-medium">
            Longueur (m)
          </Label>
          <NumberInput
            id="longueur-chute"
            min={0}
            step={0.1}
            value={inputs.longueur || ""}
            onChange={(e) =>
              onChange("longueur", parseFloat(e.target.value) || 0)
            }
            className="h-12 text-base"
            placeholder="Ex: 25"
          />
          <p className="text-sm text-muted-foreground">Distance aller simple</p>
        </div>

        {/* Courant */}
        <div className="space-y-2">
          <Label htmlFor="courant-chute" className="text-base font-medium">
            Courant (A)
          </Label>
          <NumberInput
            id="courant-chute"
            min={0}
            step={0.1}
            value={inputs.courant || ""}
            onChange={(e) =>
              onChange("courant", parseFloat(e.target.value) || 0)
            }
            className="h-12 text-base"
            placeholder="Ex: 16"
          />
        </div>

        {/* Tension */}
        <div className="space-y-2">
          <Label htmlFor="tension-chute" className="text-base font-medium">
            Tension (V)
          </Label>
          <Select
            value={inputs.tension.toString()}
            onValueChange={(value) =>
              onChange("tension", parseInt(value) as Tension)
            }
          >
            <SelectTrigger id="tension-chute" className="h-12 text-base">
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
          <Label htmlFor="typeCircuit-chute" className="text-base font-medium">
            Type de circuit
          </Label>
          <Select
            value={inputs.typeCircuit}
            onValueChange={(value) =>
              onChange("typeCircuit", value as CircuitType)
            }
          >
            <SelectTrigger id="typeCircuit-chute" className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eclairage">Éclairage</SelectItem>
              <SelectItem value="prises">Prises de courant</SelectItem>
              <SelectItem value="dedie">Circuit dédié</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type d’installation */}
        <div className="space-y-2">
          <Label
            htmlFor="typeInstallation-chute"
            className="text-base font-medium"
          >
            Type d&rsquo;installation
          </Label>
          <Select
            value={inputs.typeInstallation || "neuf"}
            onValueChange={(value) =>
              onChange("typeInstallation", value as InstallationType)
            }
          >
            <SelectTrigger
              id="typeInstallation-chute"
              className="h-12 text-base"
            >
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
            title="Chute de tension"
            value={`${result.chutePourcentage}% (${result.chuteVolts}V)`}
            message={result.message}
          />
        </div>
      )}

      {/* Message si champs manquants */}
      {!result &&
        (inputs.section === 0 ||
          inputs.longueur === 0 ||
          inputs.courant === 0) && (
          <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
            Remplissez la section, la longueur et le courant pour voir le
            résultat
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
