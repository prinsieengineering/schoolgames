// Badgedefinities. Nieuwe badge = één object toevoegen aan de lijst.
// Badges belonen vooral inzet en vooruitgang, niet enkel perfecte scores.

import type { Leerjaar, Profiel, RondeResultaat } from './types';
import { spelletjesVoor, alleSpelletjes } from '../spelletjes/register';

export interface BadgeDef {
  id: string;
  titel: string;
  icoon: string;
  uitleg: string;
  check: (p: Profiel, ctx: { sterren: number; resultaat: RondeResultaat }) => boolean;
}

const teller = (p: Profiel, k: string) => p.stats.tellers[k] ?? 0;
const ronden = (p: Profiel) => Object.values(p.spellen).reduce((s, v) => s + v.gespeeld, 0) + Object.values(p.arcade).reduce((s, v) => s + v.gespeeld, 0);

const WERELDEN: Record<Leerjaar, string> = {
  0: 'Speeltuin',
  1: 'Letterbos',
  2: 'Rekenstrand',
  3: 'Tafelberg',
  4: 'Breukenkasteel',
  5: 'Franse Trein',
  6: 'Ruimtestation',
};

function wereldBadge(lj: Leerjaar): BadgeDef {
  return {
    id: `wereld-${lj}`,
    titel: `${WERELDEN[lj]} voltooid`,
    icoon: ['🧸', '🌳', '🏖️', '⛰️', '🏰', '🚂', '🚀'][lj],
    uitleg: `Haal minstens 2 sterren op het hoogste niveau van elk spel ${lj === 0 ? 'in de kleuterklas' : `in leerjaar ${lj}`}.`,
    check: (p) =>
      spelletjesVoor(lj)
        .filter((s) => !s.facultatief)
        .every((s) => (p.spellen[s.id]?.sterren[s.niveaus.length - 1] ?? 0) >= 2),
  };
}

export const BADGES: BadgeDef[] = [
  { id: 'eerste-stap', titel: 'Eerste stap', icoon: '👣', uitleg: 'Speel je eerste ronde.', check: (p) => ronden(p) >= 1 },
  { id: 'drie-sterren', titel: 'Sterrenregen', icoon: '🌟', uitleg: 'Haal 3 sterren in een ronde.', check: (_p, c) => c.sterren === 3 },
  { id: 'reeks-10', titel: 'Op dreef', icoon: '🔥', uitleg: '10 juiste antwoorden na elkaar.', check: (p) => p.stats.besteReeks >= 10 },
  { id: 'reeks-25', titel: 'Onstuitbaar', icoon: '☄️', uitleg: '25 juiste antwoorden na elkaar.', check: (p) => p.stats.besteReeks >= 25 },
  { id: 'doorzetter', titel: 'Doorzetter', icoon: '💪', uitleg: 'Speel een spel opnieuw en doe het beter (2 sterren of meer).', check: (p) => teller(p, 'doorzetter') >= 1 },
  { id: 'ontdekker', titel: 'Ontdekker', icoon: '🧭', uitleg: 'Speel 5 verschillende spelletjes.', check: (p) => Object.keys(p.spellen).length >= 5 },
  { id: 'dagen-3', titel: 'Drie dagen', icoon: '📅', uitleg: 'Oefen op 3 verschillende dagen.', check: (p) => p.stats.dagen.length >= 3 },
  { id: 'dagen-10', titel: 'Trouwe oefenaar', icoon: '🗓️', uitleg: 'Oefen op 10 verschillende dagen.', check: (p) => p.stats.dagen.length >= 10 },
  { id: 'honderd', titel: 'Honderd!', icoon: '💯', uitleg: 'Beantwoord 100 vragen juist.', check: (p) => p.stats.juist >= 100 },
  { id: 'duizend', titel: 'Duizendpoot', icoon: '🐛', uitleg: 'Beantwoord 1000 vragen juist.', check: (p) => p.stats.juist >= 1000 },
  {
    id: 'tafelkampioen', titel: 'Tafelkampioen', icoon: '✖️', uitleg: '3 sterren op het hoogste niveau van de Tafelklim.',
    check: (p) => (p.spellen['tafelklim']?.sterren[2] ?? 0) === 3,
  },
  {
    id: 'breukenbaas', titel: 'Breukenbaas', icoon: '🍕', uitleg: '3 sterren op het hoogste niveau van een breukenspel.',
    check: (p) => alleSpelletjes.filter((s) => s.vak === 'breuken').some((s) => (p.spellen[s.id]?.sterren[s.niveaus.length - 1] ?? 0) === 3),
  },
  {
    id: 'bonjour', titel: 'Bonjour !', icoon: '🇫🇷', uitleg: 'Speel 3 rondes Frans.',
    check: (p) => alleSpelletjes.filter((s) => s.vak === 'frans').reduce((t, s) => t + (p.spellen[s.id]?.gespeeld ?? 0), 0) >= 3,
  },
  { id: 'monsterjager', titel: 'Monsterjager', icoon: '👾', uitleg: 'Speel een ronde Monsterjacht.', check: (p) => (p.arcade['monsterjacht']?.gespeeld ?? 0) >= 1 },
  { id: 'scherpschutter', titel: 'Scherpschutter', icoon: '🎯', uitleg: 'Raak in totaal 50 monsters.', check: (p) => teller(p, 'monsters') >= 50 },
  { id: 'ballonnen', titel: 'Ballonnenprikker', icoon: '🎈', uitleg: 'Prik 30 juiste ballonnen.', check: (p) => teller(p, 'ballonnen') >= 30 },
  { id: 'kikker', titel: 'Rivierheld', icoon: '🐸', uitleg: 'Steek de rivier over in Kikkersprong.', check: (p) => teller(p, 'overkant') >= 1 },
  { id: 'toren', titel: 'Wolkenkrabber', icoon: '🏗️', uitleg: 'Bouw een toren van 15 blokken.', check: (p) => teller(p, 'toren-max') >= 15 || (p.arcade['torenbouwer']?.record ?? 0) >= 150 },
  { id: 'mollen', titel: 'Mollenvanger', icoon: '🔨', uitleg: 'Tik in totaal 25 juiste mollen.', check: (p) => teller(p, 'mollen') >= 25 },
  { id: 'racer', titel: 'Turbopiloot', icoon: '🏎️', uitleg: 'Rij door 20 juiste poorten in de Rekenrace.', check: (p) => teller(p, 'race') >= 20 },
  { id: 'zeeheld', titel: 'Zeeheld', icoon: '🐬', uitleg: 'Win de Dolfijnenrace van de zeemeermin.', check: (p) => teller(p, 'dolfijnwinst') >= 1 },
  { id: 'teamspeler', titel: 'Teamspeler', icoon: '🪢', uitleg: 'Speel Touwtrekken met iemand samen.', check: (p) => teller(p, 'touwtrekken') >= 1 },
  { id: 'record', titel: 'Record!', icoon: '🏆', uitleg: 'Verbeter je eigen record in de Speelhal.', check: (p) => teller(p, 'records') >= 1 },
  { id: 'spaarpot', titel: 'Spaarpot', icoon: '🐷', uitleg: 'Spaar 300 muntjes.', check: (p) => p.muntjes >= 300 },
  ...([0, 1, 2, 3, 4, 5, 6] as Leerjaar[]).map(wereldBadge),
];

export function nieuweBadges(p: Profiel, ctx: { sterren: number; resultaat: RondeResultaat }): string[] {
  return BADGES.filter((b) => !p.badges.includes(b.id) && b.check(p, ctx)).map((b) => b.id);
}

export const vindBadge = (id: string) => BADGES.find((b) => b.id === id);
