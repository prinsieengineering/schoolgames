// ⛰️ 3e leerjaar: De Tafelberg
import type { SpelDef } from '../../core/types';
import { breukTekst, getalOpties, kies, neem, opties, rand } from '../../core/random';
import { FRANS, type FransWoord } from '../../inhoud/frans';

const tafelklim: SpelDef = {
  id: 'tafelklim',
  titel: 'Tafelklim',
  beschrijving: 'Alle maaltafels en deeltafels tot 10.',
  icoon: '✖️',
  leerjaar: 3,
  vak: 'rekenen',
  niveaus: ['tafels 1 tot 5', 'tafels 6 tot 10', 'deeltafels'],
  doelen: ['Maal- en deeltafels tot 10 automatiseren'],
  maak(n) {
    const t = n === 0 ? rand(1, 5) : rand(n === 1 ? 6 : 2, 10);
    const a = rand(1, 10);
    if (n === 2) {
      return {
        sleutel: `${a * t}:${t}`,
        prompt: `${a * t} : ${t} = ?`,
        antwoord: String(a),
        opties: getalOpties(a, 2),
        invoer: 'getal',
      };
    }
    const uitkomst = a * t;
    return {
      sleutel: `${a}x${t}`,
      prompt: `${a} × ${t} = ?`,
      antwoord: String(uitkomst),
      opties: getalOpties(uitkomst, 3, 4, [uitkomst + t, uitkomst - t, uitkomst + a]),
      invoer: 'getal',
    };
  },
};

const pizzaBreuken: SpelDef = {
  id: 'pizza-breuken',
  titel: 'Pizza-breuken',
  beschrijving: 'Welk deel is gekleurd?',
  icoon: '🍕',
  leerjaar: 3,
  vak: 'breuken',
  niveaus: ['½ en ¼', 'stambreuken', 'meer delen'],
  doelen: ['Breuken herkennen als deel van een geheel (stambreuken)'],
  maak(n) {
    const noemer = n === 0 ? kies([2, 4]) : n === 1 ? rand(2, 6) : rand(3, 8);
    const teller = n === 2 ? rand(1, noemer - 1) : 1;
    const juist = breukTekst(teller, noemer);
    const afleiders = [
      breukTekst(noemer - teller, noemer),
      `${teller}/${noemer + 1}`,
      `${teller}/${Math.max(2, noemer - 1)}`,
      `${noemer}/${teller}`,
      `${Math.min(teller + 1, noemer)}/${noemer}`,
    ].filter((x) => x !== juist && !/\/1$/.test(x));
    return {
      sleutel: juist,
      prompt: 'Welk deel is gekleurd?',
      visual: { type: 'breuk', teller, noemer, vorm: Math.random() < 0.5 ? 'taart' : 'strook' },
      antwoord: juist,
      opties: opties(juist, afleiders),
      uitleg: `Tel hoeveel stukken er in totaal zijn (${noemer}, de noemer) en hoeveel er gekleurd zijn (${teller}, de teller).`,
    };
  },
};

const petitFrancais: SpelDef = {
  id: 'petit-francais',
  titel: 'Petit français',
  beschrijving: 'Je eerste Franse woordjes (facultatief).',
  icoon: '🥐',
  leerjaar: 3,
  vak: 'frans',
  facultatief: 'frans',
  niveaus: ['kleuren', 'getallen 0-10', 'dieren'],
  doelen: ['Speelse kennismaking met Frans (facultatief vanaf het 3e leerjaar)'],
  maak(n) {
    const lijst: FransWoord[] = [FRANS.kleuren, FRANS.getallen.slice(0, 11), FRANS.dieren][n];
    const w = kies(lijst);
    const andere = neem(lijst.filter((x) => x.fr !== w.fr), 3).map((x) => x.fr);
    return {
      sleutel: w.fr,
      prompt: 'Hoe zeg je dit in het Frans?',
      visual: w.kleur ? { type: 'kleur', kleur: w.kleur } : { type: 'emoji', tekst: w.beeld },
      antwoord: w.fr,
      opties: opties(w.fr, andere),
      uitspraak: { tekst: w.fr, taal: 'fr-FR' },
    };
  },
};

export const LEERJAAR3: SpelDef[] = [tafelklim, pizzaBreuken, petitFrancais];
