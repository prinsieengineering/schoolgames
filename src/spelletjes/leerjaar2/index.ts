// 🏖️ 2e leerjaar: Het Rekenstrand
import type { SpelDef } from '../../core/types';
import { getalOpties, kies, opties, rand } from '../../core/random';

const tafelschelpen: SpelDef = {
  id: 'tafelschelpen',
  titel: 'Tafelschelpen',
  beschrijving: 'De tafels van 1, 2, 5 en 10.',
  icoon: '🐚',
  leerjaar: 2,
  vak: 'rekenen',
  niveaus: ['×2 en ×10', '×1 en ×5', 'gemengd en delen'],
  voorlezen: true,
  doelen: ['Maaltafels van 1, 2, 5 en 10 inoefenen; delen als verdelen'],
  maak(n) {
    const tafels = [[2, 10], [1, 5], [1, 2, 5, 10]][n];
    const t = kies(tafels);
    const a = rand(1, 10);
    if (n === 2 && Math.random() < 0.4) {
      const product = a * t;
      return {
        sleutel: `${product}:${t}`,
        prompt: `${product} : ${t} = ?`,
        voorlezen: `${product} gedeeld door ${t}`,
        antwoord: String(a),
        opties: getalOpties(a, 2),
        invoer: 'getal',
      };
    }
    const uitkomst = a * t;
    return {
      sleutel: `${a}x${t}`,
      prompt: `${a} × ${t} = ?`,
      voorlezen: `${a} maal ${t}`,
      antwoord: String(uitkomst),
      opties: getalOpties(uitkomst, 2, 4, [uitkomst + t, uitkomst - t, (a + 1) * t]),
      invoer: 'getal',
    };
  },
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

export const LEERJAAR2: SpelDef[] = [tafelschelpen, hoeLaat];
