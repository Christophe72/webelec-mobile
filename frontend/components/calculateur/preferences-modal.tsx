/**
 * Modal de configuration des préférences utilisateur pour les calculateurs
 */

"use client";

import { useState, useEffect } from "react";
import type { CalculateurPreferences } from "@/types/dto/preferences";
import { DEFAULT_CALCULATEUR_PREFERENCES } from "@/types/dto/preferences";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/ui/number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Save } from "lucide-react";

interface PreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPreferences: CalculateurPreferences;
  onSave: (preferences: CalculateurPreferences) => Promise<void>;
}

export function PreferencesModal({
  open,
  onOpenChange,
  currentPreferences,
  onSave,
}: PreferencesModalProps) {
  const [preferences, setPreferences] =
    useState<CalculateurPreferences>(currentPreferences);
  const [saving, setSaving] = useState(false);

  // Mettre à jour les préférences locales quand les props changent
  useEffect(() => {
    setPreferences(currentPreferences);
  }, [currentPreferences]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(preferences);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      alert("Erreur lors de la sauvegarde des préférences");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(DEFAULT_CALCULATEUR_PREFERENCES);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Préférences des Calculateurs
          </DialogTitle>
          <DialogDescription>
            Configurez les valeurs par défaut pour vos calculs électriques
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tension par défaut */}
          <div className="space-y-2">
            <Label htmlFor="pref-voltage">Tension par défaut</Label>
            <Select
              value={preferences.defaultVoltage.toString()}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultVoltage: parseInt(value) as 230 | 400,
                }))
              }
            >
              <SelectTrigger id="pref-voltage">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="230">230V (monophasé)</SelectItem>
                <SelectItem value="400">400V (triphasé)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type de circuit par défaut */}
          <div className="space-y-2">
            <Label htmlFor="pref-circuit">Type de circuit par défaut</Label>
            <Select
              value={preferences.defaultCircuitType}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultCircuitType: value as "eclairage" | "prises" | "dedie",
                }))
              }
            >
              <SelectTrigger id="pref-circuit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eclairage">Éclairage</SelectItem>
                <SelectItem value="prises">Prises de courant</SelectItem>
                <SelectItem value="dedie">Circuit dédié</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Type d'installation par défaut */}
          <div className="space-y-2">
            <Label htmlFor="pref-installation">
              Type d&apos;installation par défaut
            </Label>
            <Select
              value={preferences.defaultInstallationType}
              onValueChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  defaultInstallationType: value as "renovation" | "neuf",
                }))
              }
            >
              <SelectTrigger id="pref-installation">
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

          {/* Seuils de chute de tension */}
          <div className="rounded-lg border p-4">
            <h4 className="mb-4 font-medium">Seuils de chute de tension</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="pref-warning">
                  Seuil d&apos;avertissement (%)
                </Label>
                <NumberInput
                  id="pref-warning"
                  min={0}
                  max={10}
                  step={0.1}
                  value={preferences.voltageDrop.warningThreshold}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      voltageDrop: {
                        ...prev.voltageDrop,
                        warningThreshold: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="3.0"
                />
                <p className="text-sm text-muted-foreground">Défaut: 3%</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pref-error">Seuil d&apos;erreur (%)</Label>
                <NumberInput
                  id="pref-error"
                  min={0}
                  max={10}
                  step={0.1}
                  value={preferences.voltageDrop.errorThreshold}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      voltageDrop: {
                        ...prev.voltageDrop,
                        errorThreshold: parseFloat(e.target.value) || 0,
                      },
                    }))
                  }
                  placeholder="5.0"
                />
                <p className="text-sm text-muted-foreground">Défaut: 5%</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={saving}>
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              "Sauvegarde..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
