/**
 * Modal d'historique des calculs électriques
 */

'use client';

import { useState, useEffect } from 'react';
import type { CalculHistoryDTO, CalculatorType } from '@/types/dto/calculateur';
import { getCalculHistory, deleteCalculHistory } from '@/lib/api/calculateur';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, Trash2, Download, Filter } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadCalculation?: (history: CalculHistoryDTO) => void;
}

export function HistoryModal({ open, onOpenChange, onLoadCalculation }: HistoryModalProps) {
  const [history, setHistory] = useState<CalculHistoryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<CalculatorType | 'all'>('all');

  // Charger l'historique au montage
  useEffect(() => {
    if (open) {
      loadHistory();
    }
  }, [open]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await getCalculHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce calcul ?')) {
      return;
    }

    try {
      await deleteCalculHistory(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Failed to delete calculation:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleLoad = (item: CalculHistoryDTO) => {
    if (onLoadCalculation) {
      onLoadCalculation(item);
      onOpenChange(false);
    }
  };

  // Filtrer l'historique
  const filteredHistory =
    filterType === 'all' ? history : history.filter((item) => item.calculatorType === filterType);

  // Formater le type de calculateur
  const formatCalculatorType = (type: CalculatorType): string => {
    const labels: Record<CalculatorType, string> = {
      section: 'Section câble',
      disjoncteur: 'Disjoncteur',
      chuteTension: 'Chute tension',
    };
    return labels[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des Calculs
          </DialogTitle>
          <DialogDescription>
            Consultez et rechargez vos calculs précédents
          </DialogDescription>
        </DialogHeader>

        {/* Filtres */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={(value: CalculatorType | 'all') => setFilterType(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les calculs</SelectItem>
              <SelectItem value="section">Section câble</SelectItem>
              <SelectItem value="disjoncteur">Disjoncteur</SelectItem>
              <SelectItem value="chuteTension">Chute tension</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Liste de l'historique */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-2">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          )}

          {!loading && filteredHistory.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <History className="mb-2 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Aucun calcul enregistré</p>
              <p className="text-sm text-muted-foreground">
                Utilisez le bouton &quot;Sauvegarder&quot; dans les calculateurs
              </p>
            </div>
          )}

          {!loading &&
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {formatCalculatorType(item.calculatorType)}
                    </span>
                    {item.chantierId && (
                      <span className="text-xs text-muted-foreground">Chantier #{item.chantierId}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                  {item.notes && <p className="mt-1 text-sm italic">{item.notes}</p>}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleLoad(item)}>
                    <Download className="mr-1 h-4 w-4" />
                    Charger
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
