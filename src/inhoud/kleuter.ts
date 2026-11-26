// Inhoud voor de 3e kleuterklas: kleuren, vormen, patronen en rijmparen.
// Alles met plaatjes, want kleuters lezen nog niet. Gewone data: vrij aan te passen.

export interface Kleur {
  naam: string;
  /** Kleur van het vlak dat we tonen. */
  hex: string;
  dingen: string[];
}

/** Basiskleuren eerst (niveau 1 en 2), daarna de extra kleuren (niveau 3). */
export const KLEUREN: Kleur[] = [
  { naam: 'rood', hex: '#e63946', dingen: ['🍎', '🍓', '🚒', '🍅', '❤️'] },
  { naam: 'geel', hex: '#ffd23f', dingen: ['🍌', '🌻', '🐤', '🍋', '⭐'] },
  { naam: 'blauw', hex: '#3a86ff', dingen: ['🐳', '💙', '🧢', '👖', '🦋'] },
  { naam: 'groen', hex: '#2a9d58', dingen: ['🥦', '🐸', '🍀', '🥒', '🌲'] },
  { naam: 'oranje', hex: '#fb8500', dingen: ['🥕', '🍊', '🎃', '🦊'] },
  { naam: 'paars', hex: '#8e44ad', dingen: ['🍇', '🍆', '💜', '🔮'] },
  { naam: 'roze', hex: '#ff8fab', dingen: ['🐷', '🌸', '🦩', '🎀'] },
  { naam: 'bruin', hex: '#8b5a2b', dingen: ['🐻', '🍫', '🌰', '🥔'] },
  { naam: 'zwart', hex: '#222222', dingen: ['🎩', '🕷️', '🖤', '🎱'] },
  { naam: 'wit', hex: '#ffffff', dingen: ['👻', '🥚', '☁️', '🦷'] },
];
export const BASISKLEUREN = 4;

export interface Vorm {
  naam: string;
  lidwoord: 'de' | 'het';
  emoji: string;
  hoeken: number;
}

export const VORMEN: Vorm[] = [
  { naam: 'cirkel', lidwoord: 'de', emoji: '🔴', hoeken: 0 },
  { naam: 'vierkant', lidwoord: 'het', emoji: '🟥', hoeken: 4 },
  { naam: 'driehoek', lidwoord: 'de', emoji: '🔺', hoeken: 3 },
  { naam: 'ster', lidwoord: 'de', emoji: '⭐', hoeken: 5 },
  { naam: 'hart', lidwoord: 'het', emoji: '❤️', hoeken: 0 },
  { naam: 'ruit', lidwoord: 'de', emoji: '🔶', hoeken: 4 },
];
export const BASISVORMEN = 3;

/** Goed te onderscheiden plaatjes voor patronen. */
export const PATROONPLAATJES = ['🍎', '🍌', '🍇', '⭐', '🌙', '❤️', '🐶', '🐱', '🚗', '🌸', '🐸', '🎈'];

export interface Rijmwoord {
  woord: string;
  emoji: string;
}

/** Elk paar rijmt; verschillende paren rijmen niet op elkaar. */
export const RIJMPAREN: [Rijmwoord, Rijmwoord][] = [
  [{ woord: 'muis', emoji: '🐭' }, { woord: 'huis', emoji: '🏠' }],
  [{ woord: 'beer', emoji: '🐻' }, { woord: 'peer', emoji: '🍐' }],
  [{ woord: 'roos', emoji: '🌹' }, { woord: 'doos', emoji: '📦' }],
  [{ woord: 'hond', emoji: '🐶' }, { woord: 'mond', emoji: '👄' }],
  [{ woord: 'hoed', emoji: '👒' }, { woord: 'voet', emoji: '🦶' }],
  [{ woord: 'bed', emoji: '🛏️' }, { woord: 'pet', emoji: '🧢' }],
  [{ woord: 'kip', emoji: '🐔' }, { woord: 'schip', emoji: '🚢' }],
  [{ woord: 'aap', emoji: '🐒' }, { woord: 'schaap', emoji: '🐑' }],
  [{ woord: 'kat', emoji: '🐱' }, { woord: 'rat', emoji: '🐀' }],
  [{ woord: 'taart', emoji: '🎂' }, { woord: 'paard', emoji: '🐴' }],
  [{ woord: 'maan', emoji: '🌙' }, { woord: 'zwaan', emoji: '🦢' }],
  [{ woord: 'tas', emoji: '👜' }, { woord: 'jas', emoji: '🧥' }],
  [{ woord: 'koek', emoji: '🍪' }, { woord: 'boek', emoji: '📖' }],
];
