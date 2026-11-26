// Prijzen in de winkel. Alles wordt afgeleid uit de onderdelen van de avatarstijlen:
// de eerste varianten zijn gratis, de rest koop je met muntjes.

import type { Soort } from '../core/types';
import { SOORTEN } from './avatar';

export const itemId = (soort: Soort, deel: string, waarde: string) => `${soort}:${deel}:${waarde}`;

/** Prijs van een onderdeel (0 = gratis). */
export function prijs(soort: Soort, deel: string, waarde: string): number {
  if (waarde === 'geen') return 0;
  const info = SOORTEN[soort];
  if (deel.startsWith('kleur:')) {
    const k = info.kleuren.find((x) => `kleur:${x.id}` === deel);
    const i = k ? k.waarden.indexOf(waarde) : 0;
    return i < 3 ? 0 : 20;
  }
  const o = info.onderdelen.find((x) => x.id === deel);
  if (!o) return 0;
  const i = o.varianten.indexOf(waarde);
  if (deel === 'scene') return 60;
  if (o.optioneel) return 25 + i * 5;
  return i < 3 ? 0 : Math.min(60, 10 + (i - 2) * 5);
}

export const isGratis = (soort: Soort, deel: string, waarde: string) => prijs(soort, deel, waarde) === 0;

export const heeftItem = (bezit: string[], soort: Soort, deel: string, waarde: string) =>
  isGratis(soort, deel, waarde) || bezit.includes(itemId(soort, deel, waarde));
