import type { Leerjaar, Vak } from '../core/types';

export interface Wereld {
  leerjaar: Leerjaar;
  naam: string;
  icoon: string;
  kleur: string;
  lucht: string;
}

export const WERELDEN: Wereld[] = [
  { leerjaar: 1, naam: 'Het Letterbos', icoon: '🌳', kleur: '#2e9e5b', lucht: 'linear-gradient(160deg,#c8f7c5,#7fd88f)' },
  { leerjaar: 2, naam: 'Het Rekenstrand', icoon: '🏖️', kleur: '#e0a100', lucht: 'linear-gradient(160deg,#fff3b0,#ffd166)' },
  { leerjaar: 3, naam: 'De Tafelberg', icoon: '⛰️', kleur: '#5b7bd5', lucht: 'linear-gradient(160deg,#d6e4ff,#9db8ff)' },
  { leerjaar: 4, naam: 'Het Breukenkasteel', icoon: '🏰', kleur: '#b0479b', lucht: 'linear-gradient(160deg,#ffd6f3,#e79ad6)' },
  { leerjaar: 5, naam: 'De Franse Trein', icoon: '🚂', kleur: '#d64545', lucht: 'linear-gradient(160deg,#ffe0e0,#ff9e9e)' },
  { leerjaar: 6, naam: 'Het Ruimtestation', icoon: '🚀', kleur: '#4b3fb5', lucht: 'linear-gradient(160deg,#d9d4ff,#8f84f0)' },
];

export const wereldVan = (lj: Leerjaar) => WERELDEN[lj - 1];

export const VAKKEN: Record<Vak, { naam: string; icoon: string }> = {
  getallen: { naam: 'Getallen', icoon: '🔢' },
  rekenen: { naam: 'Rekenen', icoon: '➕' },
  klok: { naam: 'Klok', icoon: '🕐' },
  breuken: { naam: 'Breuken', icoon: '🍕' },
  procenten: { naam: 'Procenten', icoon: '％' },
  meten: { naam: 'Meten & geld', icoon: '📏' },
  lezen: { naam: 'Lezen', icoon: '📖' },
  spelling: { naam: 'Spelling', icoon: '✏️' },
  frans: { naam: 'Frans', icoon: '🇫🇷' },
};
