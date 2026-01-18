/**
 * Calculateur de disjoncteur
 *
 * Interface utilisateur pour le calcul du disjoncteur associé à un câble
 * selon le RGIE belge.
 */

'use client';

import { useState, useEffect } from 'react';
import type { DisjoncteurInputs, DisjoncteurResult, CircuitType, TypeInstallation } from '@/types/dto/calculateur';
import { calculateCircuitBreaker } from '@/lib/calculateur/disjoncteur';
import { CalculatorResultCard } from './calculator-result-card';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle } from 'lucide-react';
import { RGIE_DISCLAIMER } from '@/lib/calculateur/rgie-constants';
import { CABLE_SECTIONS } from '@/lib/calculateur/cable-sections';

interface DisjoncteurCalculatorProps {
  inputs: DisjoncteurInputs;
  onChange: <K extends keyof DisjoncteurInputs>(field: K, value: DisjoncteurInputs[K]) => void;
}

export function DisjoncteurCalculator({ inputs, onChange }: DisjoncteurCalculatorProps) {
  const [result, setResult] = useState<DisjoncteurResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Recalculer automatiquement quand les inputs changent
  useEffect(() => {
    if (inputs.section > 0) {
      handleCalculate();
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs.section, inputs.typeCircuit, inputs.typeInstallation, inputs.courant]);

  const handleCalculate = () => {
    setIsCalculating(true);

    setTimeout(() => {
      const calculResult = calculateCircuitBreaker(inputs);
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
          <Label htmlFor="section" className="text-base font-medium">
            Section du câble (mm²)
          </Label>
          <NumberInput
            id="section"
            min={0}
            step={0.1}
            value={inputs.section || ''}
            onChange={(e) => onChange('section', parseFloat(e.target.value) || 0)}
            presetValues={[...CABLE_SECTIONS]}
            className="h-12 text-base"
            placeholder="Ex: 2.5"
          />
          <p className="text-sm text-muted-foreground">
            Section obtenue du calculateur de section de câble
          </p>
        </div>

        {/* Type de circuit */}
        <div className="space-y-2">
          <Label htmlFor="typeCircuit-dis" className="text-base font-medium">
            Type de circuit
          </Label>
          <Select
            value={inputs.typeCircuit}
            onValueChange={(value) => onChange('typeCircuit', value as CircuitType)}
          >
            <SelectTrigger id="typeCircuit-dis" className="h-12 text-base">
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
          <Label htmlFor="typeInstallation-dis" className="text-base font-medium">
            Type d&#39;installation
          </Label>
          <Select
            value={inputs.typeInstallation}
            onValueChange={(value) => onChange('typeInstallation', value as TypeInstallation)}
          >
            <SelectTrigger id="typeInstallation-dis" className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monophase">Monophasé (230V)</SelectItem>
              <SelectItem value="triphase">Triphasé (400V)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Courant (optionnel, pour circuit dédié) */}
        {inputs.typeCircuit === 'dedie' && (
          <div className="space-y-2">
            <Label htmlFor="courant-dis" className="text-base font-medium">
              Courant de l&#39;appareil (A)
            </Label>
            <NumberInput
              id="courant-dis"
              min={0}
              step={0.1}
              value={inputs.courant || ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChange('courant', isNaN(val) ? 0 : val);
              }}
              className="h-12 text-base"
              placeholder="Ex: 20"
            />
            <p className="text-sm text-muted-foreground">
              Intensité nominale de l&#39;appareil (pour circuit dédié)
            </p>
          </div>
        )}
      </div>

      {/* Résultat */}
      {result && (
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
          <CalculatorResultCard
            status={result.status}
            title="Disjoncteur recommandé"
            value={`${result.calibreRecommande}A - Courbe ${result.courbe}`}
            message={result.message}
            alerte={result.alerte}
          />
        </div>
      )}

      {/* Message si champs manquants */}
      {!result && inputs.section === 0 && (
        <div className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-sm text-muted-foreground dark:border-zinc-700">
          Remplissez la section du câble pour voir le résultat
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
