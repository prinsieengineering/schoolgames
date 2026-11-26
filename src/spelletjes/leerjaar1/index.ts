// 🌳 1e leerjaar: Het Letterbos
import type { SpelDef } from '../../core/types';
import { getalOpties, kies, neem, opties, rand } from '../../core/random';
import { LEESWOORDEN, TELDINGEN } from '../../inhoud/woorden';
import { KLANKWOORDEN, KLINKERS, MEDEKLINKERS } from '../../inhoud/klanken';

const telDiertjes: SpelDef = {
  id: 'tel-de-diertjes',
  titel: 'Tel de diertjes',
  beschrijving: 'Hoeveel zie je er? Tel goed!',
  icoon: '🐞',
  leerjaar: 1,
  vak: 'getallen',
  niveaus: ['tot 5', 'tot 10', 'tot 20'],
  voorlezen: true,
  doelen: ['Getallen tot 20: hoeveelheden tellen en herkennen'],
  maak(n) {
    const [min, max] = [[1, 5], [3, 10], [8, 20]][n];
    const aantal = rand(min, max);
    return {
      sleutel: `tel-${aantal}`,
      prompt: 'Hoeveel zie je er?',
      visual: { type: 'tel', emoji: kies(TELDINGEN), aantal },
      antwoord: String(aantal),
      opties: getalOpties(aantal, 2),
    };
  },
};

const plusMinBos: SpelDef = {
  id: 'plus-min-bos',
  titel: 'Plus- en minbos',
  beschrijving: 'Optellen en aftrekken tot 20.',
  icoon: '➕',
  leerjaar: 1,
  vak: 'rekenen',
  niveaus: ['+ tot 10', '+ en − tot 10', '+ en − tot 20'],
  voorlezen: true,
  doelen: ['Optellen en aftrekken tot 10, daarna tot 20'],
  maak(n) {
    const max = n === 2 ? 20 : 10;
    const plus = n === 0 || Math.random() < 0.5;
    let a: number, b: number, uitkomst: number;
    if (plus) {
      a = rand(0, max - 1);
      b = rand(0, max - a);
      uitkomst = a + b;
    } else {
      a = rand(1, max);
      b = rand(0, a);
      uitkomst = a - b;
    }
    const teken = plus ? '+' : '−';
    return {
      sleutel: `${a}${plus ? '+' : '-'}${b}`,
      prompt: `${a} ${teken} ${b} = ?`,
      voorlezen: `${a} ${plus ? 'plus' : 'min'} ${b}`,
      antwoord: String(uitkomst),
      opties: getalOpties(uitkomst, 2),
      invoer: 'getal',
    };
  },
};

const woordPlaatje: SpelDef = {
  id: 'woord-en-plaatje',
  titel: 'Woord en plaatje',
  beschrijving: 'Lees het woord en kies het juiste plaatje.',
  icoon: '📖',
  leerjaar: 1,
  vak: 'lezen',
  niveaus: ['korte woorden', 'lange klanken', 'moeilijke woorden'],
  doelen: ['Technisch lezen: klank-tekenkoppeling, MKM-woorden, clusters'],
  maak(n) {
    const lijst = LEESWOORDEN[n];
    const w = kies(lijst);
    const andere = neem(lijst.filter((x) => x.emoji !== w.emoji), 3).map((x) => x.emoji);
    return {
      sleutel: w.woord,
      prompt: w.woord,
      voorlezen: 'Lees het woord. Welk plaatje past erbij?',
      antwoord: w.emoji,
      opties: opties(w.emoji, andere),
      uitspraak: { tekst: w.woord, taal: 'nl-BE' },
    };
  },
};

// ---------- Klankenjacht ----------
const klankenjacht: SpelDef = {
  id: 'klankenjacht',
  titel: 'Klankenjacht',
  beschrijving: 'Luister goed: welke klank hoor je?',
  icoon: '👂',
  leerjaar: 1,
  vak: 'lezen',
  niveaus: ['beginklank', 'eindklank', 'middenklank'],
  voorlezen: true,
  doelen: ['Auditieve analyse: klanken in een woord herkennen (begin, eind, midden)'],
  maak(n) {
    const w = kies(KLANKWOORDEN);
    const plek = ['begint', 'eindigt', 'hoor je in het midden van'][n];
    const antwoord = w.klanken[[0, 2, 1][n]];
    const pool = n === 2 ? KLINKERS : MEDEKLINKERS;
    return {
      sleutel: `${w.woord}-${n}`,
      prompt: n === 2 ? 'Welke klank hoor je in het midden?' : `Met welke klank ${plek} het woord?`,
      voorlezen: n === 2 ? `Luister: ${w.woord}. Welke klank hoor je in het midden van ${w.woord}?` : `Luister: ${w.woord}. Met welke klank ${plek} ${w.woord}?`,
      visual: { type: 'emoji', tekst: w.emoji },
      antwoord,
      opties: opties(antwoord, neem(pool.filter((k) => k !== antwoord), 3)),
      uitspraak: { tekst: w.woord, taal: 'nl-BE' },
      uitleg: `${w.woord}: ${w.klanken.join(' - ')}`,
    };
  },
};

export const LEERJAAR1: SpelDef[] = [telDiertjes, plusMinBos, woordPlaatje, klankenjacht];

