// 🏖️ 2e leerjaar: Het Rekenstrand
import type { SpelDef, TafelKeuze } from '../../core/types';
import { kies, opties, rand } from '../../core/random';
import { tafelVraag } from '../../core/tafels';

const SCHELP_NIVEAUS: TafelKeuze[] = [
  { tafels: [2, 10], soort: 'maal' },
  { tafels: [1, 5], soort: 'maal' },
  { tafels: [1, 2, 5, 10], soort: 'beide' },
];

const tafelschelpen: SpelDef = {
  id: 'tafelschelpen',
  titel: 'Tafelschelpen',
  beschrijving: 'De tafels van 1, 2, 5 en 10. Of kies zelf je tafels!',
  icoon: '🐚',
  leerjaar: 2,
  vak: 'rekenen',
  niveaus: ['×2 en ×10', '×1 en ×5', 'gemengd en delen'],
  voorlezen: true,
  tafelkeuze: true,
  doelen: ['Maaltafels van 1, 2, 5 en 10 inoefenen; delen als verdelen'],
  maak: (n, keuze) => tafelVraag(keuze?.tafels ?? SCHELP_NIVEAUS[n], { deelKans: 0.4 }),
};

const WOORDEN = ['', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf'];
const u = (h: number) => WOORDEN[((h - 1 + 12) % 12) + 1];

function klokTekst(uur: number, minuut: number) {
  if (minuut === 0) return `${u(uur)} uur`;
  if (minuut === 30) return `half ${u(uur + 1)}`;
  if (minuut === 15) return `kwart over ${u(uur)}`;
  return `kwart voor ${u(uur + 1)}`;
}

const hoeLaat: SpelDef = {
  id: 'hoe-laat-is-het',
  titel: 'Hoe laat is het?',
  beschrijving: 'Lees de klok: uren, halve uren en kwartieren.',
  icoon: '🕐',
  leerjaar: 2,
  vak: 'klok',
  niveaus: ['hele uren', 'halve uren', 'kwartier'],
  voorlezen: true,
  doelen: ['Kloklezen: uur, half uur, kwart over en kwart voor (analoog)'],
  maak(n) {
    const minuten = [[0], [0, 30], [0, 15, 30, 45]][n];
    const uur = rand(1, 12);
    const minuut = kies(minuten);
    const antwoord = klokTekst(uur, minuut);
    const afleiders = [
      klokTekst(uur + 1, minuut),
      klokTekst(uur - 1, minuut),
      ...minuten.filter((m) => m !== minuut).map((m) => klokTekst(uur, m)),
      minuut === 30 ? `half ${u(uur)}` : klokTekst(uur, 30),
      klokTekst(rand(1, 12), minuut),
    ].filter((x) => x !== antwoord);
    return {
      sleutel: `${uur}:${minuut}`,
      prompt: 'Hoe laat is het?',
      visual: { type: 'klok', uur, minuut },
      antwoord,
      opties: opties(antwoord, afleiders),
      uitleg: minuut === 30 ? 'Bij "half" kijk je naar het VOLGENDE uur: de kleine wijzer staat tussen twee getallen.' : undefined,
    };
  },
};

// ---------- Strandwinkel ----------
const euro = (c: number) => (c % 100 === 0 ? `€ ${c / 100}` : `€ ${(c / 100).toFixed(2).replace('.', ',')}`);
const STRANDWAREN = [['🍦', 'een ijsje'], ['🧃', 'een drankje'], ['🏐', 'een strandbal'], ['🪣', 'een emmertje'], ['🕶️', 'een zonnebril'], ['🍟', 'een pak friet'], ['🪁', 'een vlieger']];

const strandwinkel: SpelDef = {
  id: 'strandwinkel',
  titel: 'Strandwinkel',
  beschrijving: 'Tel het geld en geef wisselgeld terug.',
  icoon: '💶',
  leerjaar: 2,
  vak: 'meten',
  niveaus: ['euro’s tellen', 'met centen', 'wisselgeld'],
  voorlezen: true,
  doelen: ['Geld: munten en briefjes herkennen, bedragen tellen, wisselgeld (tot 20 euro)'],
  maak(n) {
    if (n < 2) {
      const soorten = n === 0 ? [100, 200, 500, 1000] : [10, 20, 50, 100, 200];
      const aantal = rand(2, n === 0 ? 4 : 5);
      let centen = Array.from({ length: aantal }, () => kies(soorten));
      // niet meer dan 20 euro
      while (centen.reduce((a, b) => a + b, 0) > 2000) centen = centen.slice(1);
      centen.sort((a, b) => b - a);
      const totaal = centen.reduce((a, b) => a + b, 0);
      const stap = n === 0 ? 100 : 10;
      const afl = [totaal + stap, totaal - stap, totaal + 5 * stap, totaal - 5 * stap, totaal + 2 * stap].filter((x) => x > 0);
      return {
        sleutel: centen.join('+'),
        prompt: 'Hoeveel geld is dit?',
        visual: { type: 'munten', centen },
        antwoord: euro(totaal),
        opties: opties(euro(totaal), afl.map(euro)),
        uitleg: 'Tel eerst de briefjes en grote munten, daarna de kleine.',
      };
    }
    const [emoji, naam] = kies(STRANDWAREN);
    const prijs = rand(3, 18) * 50;
    const betaal = [500, 1000, 2000].find((b) => b > prijs) ?? 2000;
    const terug = betaal - prijs;
    return {
      sleutel: `terug${prijs}van${betaal}`,
      prompt: `Je koopt ${naam} van ${euro(prijs)}. Je betaalt met ${euro(betaal)}. Hoeveel krijg je terug?`,
      visual: { type: 'emoji', tekst: emoji },
      antwoord: euro(terug),
      opties: opties(euro(terug), [terug + 50, terug - 50, terug + 100, terug - 100, prijs].filter((x) => x > 0 && x !== terug).map(euro)),
      uitleg: `Tel verder vanaf ${euro(prijs)} tot ${euro(betaal)}: dat is ${euro(terug)}.`,
    };
  },
};

export const LEERJAAR2: SpelDef[] = [tafelschelpen, hoeLaat, strandwinkel];
