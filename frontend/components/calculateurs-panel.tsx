/**
 * Panneau principal des calculateurs électriques
 *
 * Propriétaire de l'état global des 3 calculateurs.
 * Gère la propagation des résultats entre calculateurs.
 */

'use client';

import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type {
  CalculatorType,
  SectionInputs,
  DisjoncteurInputs,
  ChuteTensionInputs,
  CalculHistoryDTO,
} from '@/types/dto/calculateur';
import type { CalculateurPreferences } from '@/types/dto/preferences';
import { DEFAULT_CALCULATEUR_PREFERENCES } from '@/types/dto/preferences';
import { getCalculateurPreferences, updateCalculateurPreferences } from '@/lib/api/preferences';
import { SectionCalculator } from './calculateur/section-calculator';
import { DisjoncteurCalculator } from './calculateur/disjoncteur-calculator';
import { ChuteTensionCalculator } from './calculateur/chute-tension-calculator';
import { PreferencesModal } from './calculateur/preferences-modal';
import { HistoryModal } from './calculateur/history-modal';
import { Button } from './ui/button';
import { Cable, Zap, TrendingDown, Settings, History } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/hooks/useAuth';

function CalculateursPanelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = (searchParams.get('tab') as CalculatorType) || 'section';

  const [activeTab, setActiveTab] = useState<CalculatorType>(tabFromUrl);

  const initialPreferences = useMemo(() => {
    if (typeof window === 'undefined') return DEFAULT_CALCULATEUR_PREFERENCES;
    const cachedPrefs = localStorage.getItem('calculateur-preferences');
    if (!cachedPrefs) return DEFAULT_CALCULATEUR_PREFERENCES;
    try {
      return JSON.parse(cachedPrefs) as CalculateurPreferences;
    } catch (error) {
      console.error('Failed to parse cached preferences:', error);
      return DEFAULT_CALCULATEUR_PREFERENCES;
    }
  }, []);

  // Préférences utilisateur
  const [preferences, setPreferences] = useState<CalculateurPreferences>(initialPreferences);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const { status, token } = useAuth();

  // État des calculateurs (initialisés avec les préférences)
  const [sectionInputs, setSectionInputs] = useState<SectionInputs>({
    courant: 1,
    longueur: 1,
    tension: initialPreferences.defaultVoltage,
    typeCircuit: initialPreferences.defaultCircuitType,
    typeInstallation: initialPreferences.defaultInstallationType,
  });

  const [disjoncteurInputs, setDisjoncteurInputs] = useState<DisjoncteurInputs>({
    section: 1,
    typeCircuit: initialPreferences.defaultCircuitType,
    typeInstallation: 'monophase',
  });

  const [chuteTensionInputs, setChuteTensionInputs] = useState<ChuteTensionInputs>({
    section: 1,
    longueur: 1,
    courant: 1,
    tension: initialPreferences.defaultVoltage,
    typeCircuit: initialPreferences.defaultCircuitType,
    typeInstallation: initialPreferences.defaultInstallationType,
  });

  const applyPreferencesToInputs = useCallback((prefs: CalculateurPreferences) => {
    setSectionInputs((prev) => ({
      ...prev,
      tension: prefs.defaultVoltage,
      typeCircuit: prefs.defaultCircuitType,
      typeInstallation: prefs.defaultInstallationType,
    }));
    setDisjoncteurInputs((prev) => ({
      ...prev,
      typeCircuit: prefs.defaultCircuitType,
    }));
    setChuteTensionInputs((prev) => ({
      ...prev,
      tension: prefs.defaultVoltage,
      typeCircuit: prefs.defaultCircuitType,
      typeInstallation: prefs.defaultInstallationType,
    }));
  }, []);

  const loadPreferences = useCallback(async () => {
    try {
      if (status !== 'authenticated' || !token) return;
      const backendPrefs = await getCalculateurPreferences(token);
      if (backendPrefs) {
        setPreferences(backendPrefs);
        applyPreferencesToInputs(backendPrefs);
        localStorage.setItem('calculateur-preferences', JSON.stringify(backendPrefs));
      }
    } catch (error) {
      console.error('Failed to load preferences from backend:', error);
    }
  }, [applyPreferencesToInputs, status, token]);

  // Charger les préférences au montage
  useEffect(() => {
    if (status !== 'authenticated' || !token) return;
    queueMicrotask(() => {
      void loadPreferences();
    });
  }, [loadPreferences, status, token]);

  const handleSavePreferences = async (newPrefs: CalculateurPreferences) => {
    // Sauvegarder dans localStorage
    localStorage.setItem('calculateur-preferences', JSON.stringify(newPrefs));
    setPreferences(newPrefs);

    // Sauvegarder dans le backend
    try {
      if (status === 'authenticated' && token) {
        await updateCalculateurPreferences(token, newPrefs);
      }
    } catch (error) {
      console.error('Failed to save preferences to backend:', error);
      // On continue quand même, localStorage est sauvegardé
    }

    // Appliquer aux inputs actuels
    applyPreferencesToInputs(newPrefs);
  };

  const handleLoadFromHistory = (history: CalculHistoryDTO) => {
    // Charger les inputs depuis l'historique
    if (history.calculatorType === 'section' && history.inputs) {
      setSectionInputs(history.inputs as unknown as SectionInputs);
      setActiveTab('section');
    } else if (history.calculatorType === 'disjoncteur' && history.inputs) {
      setDisjoncteurInputs(history.inputs as unknown as DisjoncteurInputs);
      setActiveTab('disjoncteur');
    } else if (history.calculatorType === 'chuteTension' && history.inputs) {
      setChuteTensionInputs(history.inputs as unknown as ChuteTensionInputs);
      setActiveTab('chuteTension');
    }
  };

  // Gestion du changement d'onglet
  const handleTabChange = (tab: CalculatorType) => {
    setActiveTab(tab);
    // Mettre à jour l'URL
    router.push(`/calculateur?tab=${tab}`, { scroll: false });
  };

  // Propagation des résultats du calculateur de section
  const handleUseResult = (sectionRecommandee: number) => {
    // Mettre à jour les inputs des calculateurs 2 et 3
    setDisjoncteurInputs((prev) => ({
      ...prev,
      section: sectionRecommandee,
      typeCircuit: sectionInputs.typeCircuit,
    }));

    setChuteTensionInputs((prev) => ({
      ...prev,
      section: sectionRecommandee,
      longueur: sectionInputs.longueur,
      courant: sectionInputs.courant,
      tension: sectionInputs.tension,
      typeCircuit: sectionInputs.typeCircuit,
      typeInstallation: sectionInputs.typeInstallation,
    }));

    // Passer au deuxième onglet
    handleTabChange('disjoncteur');
  };

  // Handlers pour les changements d'inputs
  const handleSectionChange = <K extends keyof SectionInputs>(field: K, value: SectionInputs[K]) => {
    setSectionInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDisjoncteurChange = <K extends keyof DisjoncteurInputs>(
    field: K,
    value: DisjoncteurInputs[K]
  ) => {
    setDisjoncteurInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChuteTensionChange = <K extends keyof ChuteTensionInputs>(
    field: K,
    value: ChuteTensionInputs[K]
  ) => {
    setChuteTensionInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Configuration des onglets
  const tabs = [
    {
      id: 'section' as CalculatorType,
      label: 'Section câble',
      icon: Cable,
      description: 'Calcul de la section minimale',
    },
    {
      id: 'disjoncteur' as CalculatorType,
      label: 'Disjoncteur',
      icon: Zap,
      description: 'Calibre du disjoncteur',
    },
    {
      id: 'chuteTension' as CalculatorType,
      label: 'Chute tension',
      icon: TrendingDown,
      description: 'Vérification conformité',
    },
  ];

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl px-4 pb-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calculateurs Électriques</h1>
          <p className="mt-2 text-muted-foreground">
            Outils de calcul conformes au RGIE belge pour vos installations électriques
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setHistoryModalOpen(true)}>
            <History className="mr-2 h-4 w-4" />
            Historique
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPreferencesModalOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Préférences
          </Button>
        </div>
      </div>

      {/* Navigation tabs - Mobile: Pills scrollables | Desktop: Grid */}
      <div className="mb-6">
        {/* Mobile (< 768px) : Pills scrollables */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                className={cn('h-12 shrink-0 gap-2 whitespace-nowrap')}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Desktop (>= 768px) : Grid 3 colonnes */}
        <div className="hidden grid-cols-3 gap-4 md:grid">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-start gap-2 rounded-lg border-2 p-4 text-left transition-all',
                  isActive
                    ? 'border-primary bg-primary/5'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  <span className={cn('font-medium', isActive ? 'text-primary' : '')}>{tab.label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tab.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu du calculateur actif */}
      <div className="rounded-2xl border border-zinc-200/70 bg-white/60 p-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60 md:p-6">
        {activeTab === 'section' && (
          <SectionCalculator
            inputs={sectionInputs}
            onChange={handleSectionChange}
            onUseResult={handleUseResult}
          />
        )}

        {activeTab === 'disjoncteur' && (
          <DisjoncteurCalculator inputs={disjoncteurInputs} onChange={handleDisjoncteurChange} />
        )}

        {activeTab === 'chuteTension' && (
          <ChuteTensionCalculator inputs={chuteTensionInputs} onChange={handleChuteTensionChange} />
        )}
      </div>

      {/* Modals */}
      <PreferencesModal
        open={preferencesModalOpen}
        onOpenChange={setPreferencesModalOpen}
        currentPreferences={preferences}
        onSave={handleSavePreferences}
      />

      <HistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        onLoadCalculation={handleLoadFromHistory}
      />
    </section>
  );
}

// Wrapper avec Suspense pour gérer useSearchParams
export function CalculateursPanel() {
  return (
    <Suspense fallback={<div className="mx-auto mt-8 w-full max-w-5xl px-4 pb-12">Chargement...</div>}>
      <CalculateursPanelContent />
    </Suspense>
  );
}
