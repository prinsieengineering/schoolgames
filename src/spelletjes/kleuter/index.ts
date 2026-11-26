// 🧸 3e kleuterklas: De Speeltuin
// Kleuters lezen nog niet: alles wordt voorgelezen en de antwoorden zijn plaatjes of cijfers.
import type { SpelDef } from '../../core/types';
import { kies, neem, opties, rand, schud } from '../../core/random';
import { TELDINGEN } from '../../inhoud/woorden';
import { BASISKLEUREN, BASISVORMEN, KLEUREN, PATROONPLAATJES, RIJMPAREN, VORMEN } from '../../inhoud/kleuter';

const telMee: SpelDef = {
  id: 'tel-mee',
  titel: 'Tel mee!',
  beschrijving: 'Tel de diertjes. Hoeveel zijn het er?',
  icoon: '🐣',
  leerjaar: 0,
  vak: 'getallen',
  niveaus: ['tot 3', 'tot 5', 'tot 10'],
  voorlezen: true,
  doelen: ['Hoeveelheden tot 10 tellen en het juiste cijfer kiezen'],
  maak(n) {
    const max = [3, 5, 10][n];
    const aantal = rand(1, max);
    // Foute keuzes dicht bij het antwoord, nooit 0 (er staat altijd minstens één diertje).
    const buren = [aantal - 1, aantal + 1, aantal - 2, aantal + 2].filter((x) => x >= 1 && x <= max + 1);
    return {
      sleutel: `tel-${aantal}`,
      prompt: 'Hoeveel zijn het er?',
      voorlezen: 'Tel maar mee. Hoeveel zijn het er?',
      visual: { type: 'tel', emoji: kies(TELDINGEN), aantal },
      antwoord: String(aantal),
      opties: opties(String(aantal), buren.map(String), n === 0 ? 3 : 4),
      uitspraak: { tekst: String(aantal), taal: 'nl-BE' },
    };
  },
};

const kleurenpot: SpelDef = {
  id: 'kleurenpot',
  titel: 'Kleurenpot',
  beschrijving: 'Zoek iets met de juiste kleur.',
  icoon: '🎨',
  leerjaar: 0,
  vak: 'ontdekken',
  niveaus: ['kijk naar de kleur', 'luister naar de kleur', 'nog meer kleuren'],
  voorlezen: true,
  doelen: ['Kleuren herkennen en benoemen'],
  maak(n) {
    const pool = n === 2 ? KLEUREN : KLEUREN.slice(0, BASISKLEUREN);
    const k = kies(pool);
    const ding = kies(k.dingen);
    const andere = neem(pool.filter((x) => x !== k), 3).map((x) => kies(x.dingen));
    return {
      sleutel: k.naam,
      prompt: n === 0 ? 'Wat heeft deze kleur?' : `Tik op iets dat ${k.naam} is.`,
      voorlezen: n === 0 ? `Wat is er ${k.naam}, net als dit vlak?` : `Tik op iets dat ${k.naam} is.`,
      visual: n === 0 ? { type: 'kleur', kleur: k.hex } : undefined,
      antwoord: ding,
      opties: opties(ding, andere),
      uitspraak: { tekst: k.naam, taal: 'nl-BE' },
    };
  },
};

const vormenjacht: SpelDef = {
  id: 'vormenjacht',
  titel: 'Vormenjacht',
  beschrijving: 'Cirkel, vierkant of driehoek?',
  icoon: '🔺',
  leerjaar: 0,
  vak: 'ontdekken',
  niveaus: ['cirkel, vierkant, driehoek', 'meer vormen', 'hoeken tellen'],
  voorlezen: true,
  doelen: ['Vlakke figuren herkennen en benoemen'],
  maak(n) {
    if (n === 2) {
      const v = kies(VORMEN.filter((x) => x.naam !== 'hart'));
      const antwoord = String(v.hoeken);
      return {
        sleutel: `hoeken-${v.naam}`,
        prompt: `Hoeveel hoeken heeft ${v.lidwoord} ${v.naam}?`,
        visual: { type: 'emoji', tekst: v.emoji },
        antwoord,
        opties: opties(antwoord, ['0', '3', '4', '5'].filter((x) => x !== antwoord)),
        uitleg: v.hoeken === 0 ? `Een ${v.naam} is rond: geen hoeken!` : `Tel de punten: ${v.hoeken} hoeken.`,
      };
    }
    const pool = n === 0 ? VORMEN.slice(0, BASISVORMEN) : VORMEN;
    const v = kies(pool);
    return {
      sleutel: v.naam,
      prompt: `Tik op ${v.lidwoord} ${v.naam}.`,
      antwoord: v.emoji,
      opties: opties(v.emoji, pool.filter((x) => x !== v).map((x) => x.emoji)),
      uitspraak: { tekst: v.naam, taal: 'nl-BE' },
    };
  },
};

const watKomtErna: SpelDef = {
  id: 'wat-komt-erna',
  titel: 'Wat komt erna?',
  beschrijving: 'Kijk naar het rijtje en maak het af.',
  icoon: '🐛',
  leerjaar: 0,
  vak: 'ontdekken',
  niveaus: ['🍎🍌🍎🍌', '🍎🍎🍌 of 🍎🍌🍌', '🍎🍌🍇'],
  voorlezen: true,
  doelen: ['Patronen herkennen en verderzetten'],
  maak(n) {
    const [a, b, c] = neem(PATROONPLAATJES, 3);
    const eenheid = n === 0 ? [a, b] : n === 1 ? kies([[a, a, b], [a, b, b]]) : [a, b, c];
    const lengte = eenheid.length * 2 + rand(0, eenheid.length - 1);
    const rij = Array.from({ length: lengte }, (_, i) => eenheid[i % eenheid.length]);
    const antwoord = eenheid[lengte % eenheid.length];
    const inRij = [...new Set(eenheid)].filter((x) => x !== antwoord);
    const anders = PATROONPLAATJES.filter((x) => !eenheid.includes(x));
    return {
      sleutel: `patroon-${n}-${lengte}`,
      prompt: `${rij.join(' ')} ❓`,
      voorlezen: 'Kijk naar het rijtje. Wat komt er daarna?',
      antwoord,
      opties: opties(antwoord, [...inRij, ...neem(anders, 3 - inRij.length)], n === 0 ? 3 : 4),
    };
  },
};

const meerOfMinder: SpelDef = {
  id: 'meer-of-minder',
  titel: 'Meer of minder?',
  beschrijving: 'Waar zijn er het meest? En het minst?',
  icoon: '🐟',
  leerjaar: 0,
  vak: 'getallen',
  niveaus: ['het meest', 'goed kijken', 'het meest of het minst'],
  voorlezen: true,
  doelen: ['Hoeveelheden vergelijken: meer en minder'],
  maak(n) {
    const ding = kies(TELDINGEN);
    // Niveau 1: twee groepjes met een groot verschil. Daarna drie groepjes die dichter bij elkaar liggen.
    let aantallen: number[];
    if (n === 0) {
      const x = rand(1, 2);
      aantallen = schud([x, x + rand(3, 4)]);
    } else aantallen = neem([1, 2, 3, 4, 5], 3);
    const minst = n === 2 && Math.random() < 0.5;
    const doel = minst ? Math.min(...aantallen) : Math.max(...aantallen);
    const groep = (x: number) => ding.repeat(x);
    return {
      sleutel: `${minst ? 'minst' : 'meest'}-${[...aantallen].sort().join('-')}`,
      prompt: minst ? 'Waar zijn er het minst?' : 'Waar zijn er het meest?',
      antwoord: groep(doel),
      opties: aantallen.map(groep),
      uitleg: `Daar zijn er ${doel}.`,
    };
  },
};

const rijmenMaar: SpelDef = {
  id: 'rijmen-maar',
  titel: 'Rijmen maar!',
  beschrijving: 'Muis rijmt op huis. Wat rijmt nog?',
  icoon: '🎵',
  leerjaar: 0,
  vak: 'lezen',
  niveaus: ['2 plaatjes', '3 plaatjes', '4 plaatjes'],
  voorlezen: true,
  doelen: ['Taalbewustzijn: rijmwoorden horen'],
  maak(n) {
    const paar = kies(RIJMPAREN);
    const [w, rijm] = Math.random() < 0.5 ? paar : [paar[1], paar[0]];
    const andere = RIJMPAREN.filter((p) => p !== paar).map((p) => kies(p).emoji);
    return {
      sleutel: w.woord,
      prompt: `Wat rijmt op ${w.woord}?`,
      voorlezen: `Wat rijmt op ${w.woord}?`,
      visual: { type: 'emoji', tekst: w.emoji },
      antwoord: rijm.emoji,
      opties: opties(rijm.emoji, andere, n + 2),
      uitspraak: { tekst: `${w.woord}, ${rijm.woord}`, taal: 'nl-BE' },
    };
  },
};

export const KLEUTER: SpelDef[] = [telMee, kleurenpot, vormenjacht, watKomtErna, meerOfMinder, rijmenMaar];
