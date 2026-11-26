// Getalbeelden: hoeveelheden altijd in een vaste structuur tonen, zoals in de klas.
//  - 1 tot 6: dobbelsteenbeeld
//  - 7 en meer: tienveld (2 rijen van 5, eerst de bovenste rij vol), per 10 een nieuw tienveld
// Gebruikt door de quiz (Visuals.tsx) én de arcade (kern/teken.ts), zodat het overal hetzelfde is.

export interface Vakje {
  /** Kolom en rij in het veld (0-gebaseerd). */
  x: number;
  y: number;
  vol: boolean;
}

export interface Veld {
  kolommen: number;
  rijen: number;
  vakjes: Vakje[];
  /** Tienveld: lege vakjes en een kader tekenen. */
  kader: boolean;
}

/** Dobbelsteenposities op een 3×3 rooster. */
const DOBBELSTEEN: [number, number][][] = [
  [],
  [[1, 1]],
  [[0, 0], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[0, 0], [2, 0], [0, 2], [2, 2]],
  [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]],
  [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]],
];

export function getalbeeld(aantal: number): Veld[] {
  const n = Math.max(0, Math.floor(aantal));
  if (n <= 6) {
    return [{ kolommen: 3, rijen: 3, kader: false, vakjes: DOBBELSTEEN[n].map(([x, y]) => ({ x, y, vol: true })) }];
  }
  const velden: Veld[] = [];
  for (let start = 0; start < n; start += 10) {
    const hier = Math.min(10, n - start);
    velden.push({
      kolommen: 5,
      rijen: 2,
      kader: true,
      vakjes: Array.from({ length: 10 }, (_, i) => ({ x: i % 5, y: Math.floor(i / 5), vol: i < hier })),
    });
  }
  return velden;
}

/**
 * Herkent een antwoord dat een hoeveelheid is: hetzelfde plaatje een aantal keer
 * herhaald (bv. "🐟🐟🐟"). Geeft null voor gewone tekst of één los plaatje.
 */
export function hoeveelheid(tekst: string): { emoji: string; aantal: number } | null {
  const delen = [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(tekst)].map((s) => s.segment);
  if (delen.length < 2 || delen.some((d) => d !== delen[0])) return null;
  if (!/\p{Extended_Pictographic}/u.test(delen[0])) return null;
  return { emoji: delen[0], aantal: delen.length };
}
