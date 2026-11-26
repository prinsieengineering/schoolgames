// 🏰 4e leerjaar: Het Breukenkasteel
import type { SpelDef } from '../../core/types';
import { breukTekst, getalOpties, kies, komma, opties, rand, schud } from '../../core/random';
import { DT_UITLEG, DT_ZINNEN } from '../../inhoud/werkwoorden';

const breukenduel: SpelDef = {
  id: 'breukenduel',
  titel: 'Breukenduel',
  beschrijving: 'Welke breuk is het grootst? En wat is gelijkwaardig?',
  icoon: '⚔️',
  leerjaar: 4,
  vak: 'breuken',
  niveaus: ['gelijke noemer', 'gelijke teller', 'gelijkwaardig'],
  doelen: ['Breuken vergelijken en gelijkwaardige breuken vinden'],
  maak(n) {
    if (n === 2) {
      const [t, noemer] = kies([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]);
      const f = rand(2, 4);
      const antwoord = t * f;
      return {
        sleutel: `${t}/${noemer}=?/${noemer * f}`,
        prompt: `${t}/${noemer} = ?/${noemer * f}`,
        antwoord: String(antwoord),
        opties: getalOpties(antwoord, 2, 4, [t + f, t * f + 1, noemer * f - antwoord]),
        invoer: 'getal',
        uitleg: `De noemer werd ${f} keer groter (${noemer} → ${noemer * f}), dus de teller ook: ${t} × ${f} = ${antwoord}.`,
      };
    }
    let breuken: [number, number][];
    if (n === 0) {
      const noemer = rand(4, 10);
      const tellers = schud(Array.from({ length: noemer - 1 }, (_, i) => i + 1)).slice(0, 3);
      breuken = tellers.map((t) => [t, noemer]);
    } else {
      const teller = rand(1, 3);
      const noemers = schud([2, 3, 4, 5, 6, 8, 10].filter((x) => x > teller)).slice(0, 3);
      breuken = noemers.map((nn) => [teller, nn]);
    }
    const grootste = breuken.reduce((a, b) => (a[0] / a[1] >= b[0] / b[1] ? a : b));
    const antwoord = breukTekst(...grootste);
    return {
      sleutel: breuken.map((b) => b.join('/')).sort().join(','),
      prompt: 'Welke breuk is het grootst?',
      antwoord,
      opties: opties(antwoord, breuken.map((b) => breukTekst(...b)), 3),
      uitleg:
        n === 0
          ? 'Zelfde noemer: de grootste teller wint.'
          : 'Zelfde teller: hoe KLEINER de noemer, hoe groter de stukken!',
    };
  },
};

const dOfT: SpelDef = {
  id: 'd-of-t',
  titel: 'd of t?',
  beschrijving: 'Kies de juiste vorm van het werkwoord.',
  icoon: '✍️',
  leerjaar: 4,
  vak: 'spelling',
  niveaus: ['ik / hij', 'stam op d', 'jij achteraan'],
  doelen: ['Werkwoordspelling tegenwoordige tijd (d/t)'],
  maak(n) {
    const z = kies(DT_ZINNEN[n]);
    return {
      sleutel: z.zin,
      prompt: `${z.zin}  (${z.ww})`,
      voorlezen: z.zin.replace('___', 'blanco') + ` Werkwoord: ${z.ww}.`,
      antwoord: z.antwoord,
      opties: opties(z.antwoord, z.fout, 3),
      uitleg: DT_UITLEG[n],
    };
  },
};

// ---------- Kommakompas ----------
const kommakompas: SpelDef = {
  id: 'kommakompas',
  titel: 'Kommakompas',
  beschrijving: 'Tienden, honderdsten en rekenen met kommagetallen.',
  icoon: '🧭',
  leerjaar: 4,
  vak: 'getallen',
  niveaus: ['tienden', 'vergelijken', 'optellen en aftrekken'],
  doelen: ['Kommagetallen: tienden en honderdsten, vergelijken, optellen en aftrekken'],
  maak(n) {
    if (n === 0) {
      const t = rand(1, 9);
      const antwoord = komma(t / 10);
      return {
        sleutel: `tiende${t}`,
        prompt: 'Welk kommagetal hoort bij het gekleurde deel?',
        visual: { type: 'breuk', teller: t, noemer: 10, vorm: 'strook' },
        antwoord,
        opties: opties(antwoord, [komma((10 - t) / 10), `0,0${t}`, String(t), komma((t + 1) / 10), komma(Math.max(1, t - 1) / 10)]),
        uitleg: `De strook heeft 10 stukken. ${t} van de 10 = ${t} tienden = ${antwoord}.`,
      };
    }
    if (n === 1) {
      // klassieke valkuil: 0,5 is groter dan 0,45 en 0,405
      const basis = rand(1, 9);
      const kandidaten = [basis / 10, basis / 10 - 0.05 + rand(0, 4) / 100, basis / 100 + rand(1, 9) / 1000, (basis - 1) / 10 + rand(10, 99) / 1000]
        .map((x) => Math.round(x * 1000) / 1000)
        .filter((x) => x > 0);
      const uniek = [...new Set(kandidaten)].slice(0, 3);
      const max = Math.max(...uniek);
      return {
        sleutel: uniek.map(komma).sort().join('|'),
        prompt: 'Welk kommagetal is het grootst?',
        antwoord: komma(max),
        opties: opties(komma(max), uniek.map(komma), 3),
        uitleg: 'Vergelijk eerst de tienden (het eerste cijfer na de komma), dan de honderdsten. Langer is niet groter!',
      };
    }
    const a = rand(10, 99) / 10;
    const b = rand(1, 50) / 10;
    const plus = Math.random() < 0.5 || b > a;
    const uitkomst = Math.round((plus ? a + b : a - b) * 10) / 10;
    return {
      sleutel: `${a}${plus ? '+' : '-'}${b}`,
      prompt: `${komma(a)} ${plus ? '+' : '−'} ${komma(b)} = ?`,
      voorlezen: `${komma(a)} ${plus ? 'plus' : 'min'} ${komma(b)}`,
      antwoord: komma(uitkomst),
      opties: opties(komma(uitkomst), [uitkomst + 1, uitkomst - 1, uitkomst + 0.1, uitkomst - 0.1, uitkomst * 10].filter((x) => x >= 0).map((x) => komma(Math.round(x * 10) / 10))),
      invoer: 'getal',
      uitleg: 'Zet de komma’s onder elkaar: tienden bij tienden, eenheden bij eenheden.',
    };
  },
};

export const LEERJAAR4: SpelDef[] = [breukenduel, kommakompas, dOfT];
