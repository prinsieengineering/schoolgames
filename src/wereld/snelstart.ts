// Snelstarts: een arcadespel dat meteen klaarstaat in een wereld, met een vast
// spelletje (en eventueel een vaste keuze, zoals de tafels). Het kind tikt op de
// kaart en speelt meteen, zonder eerst een vak te kiezen in de Speelhal.
// Nieuwe snelstart? Voeg een object toe aan de lijst.

import type { Leerjaar, SpelKeuze } from '../core/types';

export interface Snelstart {
  id: string;
  leerjaar: Leerjaar;
  titel: string;
  beschrijving: string;
  icoon: string;
  /** Id uit ARCADE in Speelhal.tsx. */
  arcadeId: string;
  /** Het spelletje waaruit de vragen komen. */
  spelId: string;
  keuze?: SpelKeuze;
}

export const SNELSTARTS: Snelstart[] = [
  {
    id: 'tafeltoren',
    leerjaar: 2,
    titel: 'Tafeltoren',
    beschrijving: 'Bouw de hoogste toren met de tafels van 1, 2, 5 en 10. Maal én delen!',
    icoon: '🏗️',
    arcadeId: 'torenbouwer',
    spelId: 'tafelschelpen',
    keuze: { tafels: { tafels: [1, 2, 5, 10], soort: 'beide' } },
  },
];

export const snelstartsVoor = (lj: Leerjaar) => SNELSTARTS.filter((s) => s.leerjaar === lj);
