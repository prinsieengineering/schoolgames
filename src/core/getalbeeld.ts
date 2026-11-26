// Getalbeelden: hoeveelheden altijd in dezelfde structuur tonen, zoals in de klas.
// Twee rijen, van links naar rechts aangevuld: eerst boven, dan onder
// (1 = ●, 2 = ● boven ●, 3 = ●● boven ●, ..., 10 = twee rijen van 5).
// Boven 10 komt er per tiental een nieuw blok onder.
// Gebruikt door de quiz (Visuals.tsx) én de arcade (kern/teken.ts), zodat het overal hetzelfde is.

export interface Vakje {
  /** Kolom en rij in het blok (0-gebaseerd). */
  x: number;
  y: number;
}

export interface Veld {
  kolommen: number;
  rijen: number;
  vakjes: Vakje[];
}

export function getalbeeld(aantal: number): Veld[] {
  const n = Math.max(0, Math.floor(aantal));
  const velden: Veld[] = [];
  for (let start = 0; start < n; start += 10) {
    const hier = Math.min(10, n - start);
    // Bolletje i: kolom i/2, afwisselend boven en onder -> boven ceil(n/2), onder floor(n/2).
    velden.push({
      kolommen: Math.ceil(hier / 2),
      rijen: hier > 1 ? 2 : 1,
      vakjes: Array.from({ length: hier }, (_, i) => ({ x: Math.floor(i / 2), y: i % 2 })),
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
