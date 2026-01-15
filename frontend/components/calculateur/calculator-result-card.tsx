/**
 * Carte de résultat réutilisable pour les calculateurs
 *
 * Affiche le résultat d'un calcul avec code couleur selon le statut :
 * - Vert : OK / Conforme
 * - Orange : Limite / Avertissement
 * - Rouge : Non-conforme / Erreur
 */

import type { CalculStatus } from '@/types/dto/calculateur';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorResultCardProps {
  status: CalculStatus;
  title: string;
  value: string;
  message: string;
  alerte?: string;
  className?: string;
}

export function CalculatorResultCard({
  status,
  title,
  value,
  message,
  alerte,
  className,
}: CalculatorResultCardProps) {
  // Configuration selon le statut
  const statusConfig = {
    ok: {
      icon: CheckCircle,
      bgColor: 'bg-green-50 dark:bg-green-950',
      borderColor: 'border-green-500 dark:border-green-600',
      textColor: 'text-green-900 dark:text-green-100',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    limite: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      borderColor: 'border-orange-500 dark:border-orange-600',
      textColor: 'text-orange-900 dark:text-orange-100',
      iconColor: 'text-orange-600 dark:text-orange-400',
    },
    'non-conforme': {
      icon: AlertCircle,
      bgColor: 'bg-red-50 dark:bg-red-950',
      borderColor: 'border-red-500 dark:border-red-600',
      textColor: 'text-red-900 dark:text-red-100',
      iconColor: 'text-red-600 dark:text-red-400',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'rounded-lg border-2 p-4 transition-all',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      {/* Header avec icône */}
      <div className="mb-3 flex items-center gap-2">
        <Icon className={cn('h-5 w-5', config.iconColor)} />
        <h3 className={cn('text-sm font-medium uppercase tracking-wide', config.textColor)}>
          {title}
        </h3>
      </div>

      {/* Valeur principale */}
      <div className={cn('mb-2 text-lg font-bold', config.textColor)}>{value}</div>

      {/* Message */}
      <p className={cn('text-sm', config.textColor)}>{message}</p>

      {/* Alerte supplémentaire (si présente) */}
      {alerte && (
        <div className="mt-3 flex items-start gap-2 rounded border border-current/20 bg-current/10 p-2">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">{alerte}</p>
        </div>
      )}
    </div>
  );
}
