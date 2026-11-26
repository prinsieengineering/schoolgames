// Spellingwoorden: ei/ij en au/ou (3e leerjaar) en werkwoorden voor 't kofschip (5e leerjaar).

export interface KlankWoordSpelling {
  /** Woord met __ op de plek van de klank, bv. "tr__n". */
  gat: string;
  woord: string;
  klank: string;
  emoji?: string;
}

const maak = (woord: string, klank: string, emoji?: string): KlankWoordSpelling => ({
  gat: woord.replace(klank, '__'),
  woord,
  klank,
  emoji,
});

export const EI_IJ: KlankWoordSpelling[] = [
  maak('trein', 'ei', '🚂'), maak('geit', 'ei', '🐐'), maak('klein', 'ei'), maak('reis', 'ei', '🧳'),
  maak('zeil', 'ei', '⛵'), maak('plein', 'ei'), maak('eind', 'ei', '🏁'),
  maak('ijs', 'ij', '🍦'), maak('rijst', 'ij', '🍚'), maak('pijl', 'ij', '➡️'), maak('vijf', 'ij', '5️⃣'),
  maak('tijger', 'ij', '🐯'), maak('bij', 'ij', '🐝'), maak('krijt', 'ij'), maak('fijn', 'ij'),
  maak('prijs', 'ij', '🏷️'), maak('tijd', 'ij', '⏰'), maak('lijm', 'ij'), maak('dweil', 'ei'),
];

export const AU_OU: KlankWoordSpelling[] = [
  maak('auto', 'au', '🚗'), maak('saus', 'au'), maak('blauw', 'au', '🔵'), maak('pauw', 'au', '🦚'),
  maak('gauw', 'au'), maak('kauwgom', 'au'), maak('flauw', 'au'), maak('rauw', 'au', '🥩'),
  maak('hout', 'ou', '🪵'), maak('koud', 'ou', '🥶'), maak('goud', 'ou', '🥇'), maak('zout', 'ou', '🧂'),
  maak('oud', 'ou', '👴'), maak('touw', 'ou', '🪢'), maak('vrouw', 'ou', '👩'), maak('bout', 'ou', '🔩'),
  maak('fout', 'ou', '❌'), maak('schouder', 'ou'),
];

// ---------- 't kofschip ----------
// Stam eindigt op een klank uit 't kofschip (t, k, f, s, ch, p)? Dan -te(n). Anders -de(n).
// Valkuil: kijk naar de stam zoals je hem in het hele werkwoord hoort. Leven → leefde (want v), reizen → reisde (want z).

export interface Werkwoord {
  inf: string;
  stam: string;
  /** -te of -de */
  uitgang: 'te' | 'de';
  /** Bijzonder geval (v/z in het hele werkwoord). */
  valkuil?: boolean;
}

const ww = (inf: string, stam: string, uitgang: 'te' | 'de', valkuil = false): Werkwoord => ({ inf, stam, uitgang, valkuil });

export const KOFSCHIP: Werkwoord[] = [
  ww('werken', 'werk', 'te'), ww('fietsen', 'fiets', 'te'), ww('maken', 'maak', 'te'), ww('lachen', 'lach', 'te'),
  ww('stoppen', 'stop', 'te'), ww('koken', 'kook', 'te'), ww('dansen', 'dans', 'te'), ww('hopen', 'hoop', 'te'),
  ww('poetsen', 'poets', 'te'), ww('blaffen', 'blaf', 'te'), ww('kloppen', 'klop', 'te'), ww('praten', 'praat', 'te'),
  ww('spelen', 'speel', 'de'), ww('leren', 'leer', 'de'), ww('bouwen', 'bouw', 'de'), ww('huilen', 'huil', 'de'),
  ww('wonen', 'woon', 'de'), ww('schilderen', 'schilder', 'de'), ww('zeilen', 'zeil', 'de'), ww('regenen', 'regen', 'de'),
  ww('bellen', 'bel', 'de'), ww('noemen', 'noem', 'de'), ww('wachten', 'wacht', 'te'), ww('branden', 'brand', 'de'),
  ww('leven', 'leef', 'de', true), ww('reizen', 'reis', 'de', true), ww('verven', 'verf', 'de', true),
  ww('beloven', 'beloof', 'de', true), ww('verhuizen', 'verhuis', 'de', true), ww('blozen', 'bloos', 'de', true),
];
