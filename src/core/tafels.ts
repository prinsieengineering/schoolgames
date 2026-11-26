// Gedeelde tafelgenerator + tafelkeuze. Elk spel met maal- of deeltafels
// gebruikt `tafelVraag()`, zodat de tafelkeuze van het kind overal werkt.

import type { Profiel, SpelDef, TafelKeuze, Vraag } from './types';
import { getalOpties, kies, rand } from './random';

/** De tafels die je kan aanvinken. */
export const ALLE_TAFELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const STANDAARD_TAFELKEUZE: TafelKeuze = { tafels: [2, 5, 10], soort: 'beide' };

/** Zorgt dat een (oude of halve) keuze altijd bruikbaar is: minstens één geldige tafel. */
export function geldigeKeuze(k: Partial<TafelKeuze> | null | undefined): TafelKeuze {
  const tafels = [...new Set((k?.tafels ?? []).filter((t) => ALLE_TAFELS.includes(t)))].sort((a, b) => a - b);
  const soort = k?.soort === 'maal' || k?.soort === 'delen' || k?.soort === 'beide' ? k.soort : 'beide';
  return { tafels: tafels.length ? tafels : STANDAARD_TAFELKEUZE.tafels, soort };
}

/** De bewaarde tafelkeuze van een kind (of de standaard). */
export const tafelKeuzeVan = (p: Profiel) => geldigeKeuze(p.instellingen.tafels);

export const bewaarTafelKeuze = (p: Profiel, k: TafelKeuze): Profiel => ({ ...p, instellingen: { ...p.instellingen, tafels: geldigeKeuze(k) } });

const SOORT_TEKST = { maal: 'maal', delen: 'delen', beide: 'maal en delen' } as const;

/** Bv. "×2, ×5 en ×10 · maal en delen". */
export function tafelKeuzeTekst(k: TafelKeuze) {
  const t = k.tafels.map((x) => `×${x}`);
  const lijst = t.length > 1 ? `${t.slice(0, -1).join(', ')} en ${t[t.length - 1]}` : t[0];
  return `${lijst} · ${SOORT_TEKST[k.soort]}`;
}

export const heeftTafelkeuze = (s: SpelDef) => !!s.tafelkeuze;

/**
 * Eén tafelvraag. `deelKans` = kans op een deelsom als soort "beide" is.
 * `spreiding` bepaalt hoe dicht de foute opties bij het antwoord liggen.
 */
export function tafelVraag(k: TafelKeuze, { deelKans = 0.5, spreiding = 2 }: { deelKans?: number; spreiding?: number } = {}): Vraag {
  const keuze = geldigeKeuze(k);
  const t = kies(keuze.tafels);
  const a = rand(1, 10);
  const delen = keuze.soort === 'delen' || (keuze.soort === 'beide' && Math.random() < deelKans);
  const product = a * t;
  if (delen) {
    return {
      sleutel: `${product}:${t}`,
      prompt: `${product} : ${t} = ?`,
      voorlezen: `${product} gedeeld door ${t}`,
      antwoord: String(a),
      opties: getalOpties(a, spreiding, 4, [a + 1, a - 1, t].filter((x) => x > 0)),
      invoer: 'getal',
      uitleg: `Hoeveel keer ${t} is ${product}? ${a} × ${t} = ${product}, dus ${product} : ${t} = ${a}.`,
    };
  }
  return {
    sleutel: `${a}x${t}`,
    prompt: `${a} × ${t} = ?`,
    voorlezen: `${a} maal ${t}`,
    antwoord: String(product),
    opties: getalOpties(product, spreiding, 4, [product + t, product - t, (a + 1) * t, product + a]),
    invoer: 'getal',
    uitleg: a > 1 ? `${a} × ${t} is ${a - 1} × ${t} (= ${(a - 1) * t}) en nog ${t} erbij.` : undefined,
  };
}
