// 🏰 4e leerjaar: Het Breukenkasteel
import type { SpelDef } from '../../core/types';
import { breukTekst, getalOpties, kies, opties, rand, schud } from '../../core/random';
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

export const LEERJAAR4: SpelDef[] = [breukenduel, dOfT];
