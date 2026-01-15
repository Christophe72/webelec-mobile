/**
 * Page des calculateurs électriques RGIE
 *
 * Route: /calculateur
 */

import type { Metadata } from 'next';
import CalculateursPageContent from '@/components/calculateurs-page-content';

export const metadata: Metadata = {
  title: 'Calculateurs Électriques | WebElec',
  description: 'Outils de calcul électrique conformes au RGIE belge : section de câble, disjoncteur, chute de tension',
};

export default function CalculateurPage() {
  return <CalculateursPageContent />;
}
