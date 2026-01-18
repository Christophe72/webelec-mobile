"use client";

import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  step?: number;
  min?: number;
  max?: number;
  onValueChange?: (value: number) => void;
  presetValues?: number[]; // Liste de valeurs prédéfinies pour navigation
}

function NumberInput({
  className,
  step = 1,
  min,
  max,
  value,
  onChange,
  onValueChange,
  disabled,
  presetValues,
  ...props
}: NumberInputProps) {
  const roundToStep = (value: number, step: number): number => {
    // Handle decimal precision issues by using proper rounding
    const decimals = (step.toString().split('.')[1] || '').length;
    return parseFloat(value.toFixed(decimals));
  };

  const handleIncrement = () => {
    const currentValue = typeof value === "string" ? parseFloat(value) : Number(value) || 0;

    // Si on a des valeurs prédéfinies, naviguer dans la liste
    if (presetValues && presetValues.length > 0) {
      const sortedPresets = [...presetValues].sort((a, b) => a - b);
      const nextValue = sortedPresets.find(v => v > currentValue);
      if (nextValue !== undefined) {
        updateValue(nextValue);
        return;
      }
      // Si pas de valeur suivante, on garde la valeur actuelle
      return;
    }

    // Sinon, utiliser le step classique
    const newValue = roundToStep(currentValue + step, step);
    if (max !== undefined && newValue > max) return;

    updateValue(newValue);
  };

  const handleDecrement = () => {
    const currentValue = typeof value === "string" ? parseFloat(value) : Number(value) || 0;

    // Si on a des valeurs prédéfinies, naviguer dans la liste
    if (presetValues && presetValues.length > 0) {
      const sortedPresets = [...presetValues].sort((a, b) => a - b);
      const prevValue = sortedPresets.reverse().find(v => v < currentValue);
      if (prevValue !== undefined) {
        updateValue(prevValue);
        return;
      }
      // Si pas de valeur précédente, on garde la valeur actuelle
      return;
    }

    // Sinon, utiliser le step classique
    const newValue = roundToStep(currentValue - step, step);
    if (min !== undefined && newValue < min) return;

    updateValue(newValue);
  };

  const updateValue = (newValue: number) => {
    const roundedValue = roundToStep(newValue, step);
    if (onValueChange) {
      onValueChange(roundedValue);
    }
    if (onChange) {
      const syntheticEvent = {
        target: { value: roundedValue.toString() },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value}
        onChange={onChange}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-16 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // Hide native number input arrows
          "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        {...props}
      />
      <div className="absolute right-1 flex gap-0.5">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || (min !== undefined && Number(value) <= min)}
          className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Diminuer"
        >
          <Minus className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || (max !== undefined && Number(value) >= max)}
          className="flex h-7 w-7 items-center justify-center rounded bg-zinc-100 text-zinc-700 transition hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          aria-label="Augmenter"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export { NumberInput };
