// Woordenlijsten voor lezen (1e leerjaar). Gewone data: vrij aan te passen.

export interface WoordPlaatje {
  woord: string;
  emoji: string;
}

export const LEESWOORDEN: WoordPlaatje[][] = [
  // Niveau 1: korte woorden (MKM)
  [
    { woord: 'kat', emoji: '🐱' }, { woord: 'vis', emoji: '🐟' }, { woord: 'kip', emoji: '🐔' },
    { woord: 'bus', emoji: '🚌' }, { woord: 'zon', emoji: '☀️' }, { woord: 'bal', emoji: '⚽' },
    { woord: 'pen', emoji: '🖊️' }, { woord: 'sok', emoji: '🧦' }, { woord: 'jas', emoji: '🧥' },
    { woord: 'bed', emoji: '🛏️' }, { woord: 'bot', emoji: '🦴' }, { woord: 'tas', emoji: '👜' },
    { woord: 'ijs', emoji: '🍦' }, { woord: 'lam', emoji: '🐑' }, { woord: 'ei', emoji: '🥚' },
  ],
  // Niveau 2: lange klanken en tweeklanken
  [
    { woord: 'maan', emoji: '🌙' }, { woord: 'boom', emoji: '🌳' }, { woord: 'roos', emoji: '🌹' },
    { woord: 'muis', emoji: '🐭' }, { woord: 'koe', emoji: '🐮' }, { woord: 'hoed', emoji: '👒' },
    { woord: 'boot', emoji: '⛵' }, { woord: 'deur', emoji: '🚪' }, { woord: 'peer', emoji: '🍐' },
    { woord: 'neus', emoji: '👃' }, { woord: 'been', emoji: '🦵' }, { woord: 'voet', emoji: '🦶' },
    { woord: 'kaas', emoji: '🧀' }, { woord: 'oor', emoji: '👂' }, { woord: 'huis', emoji: '🏠' },
    { woord: 'vuur', emoji: '🔥' }, { woord: 'uil', emoji: '🦉' }, { woord: 'taart', emoji: '🎂' },
  ],
  // Niveau 3: medeklinkerclusters en langere woorden
  [
    { woord: 'ster', emoji: '⭐' }, { woord: 'trein', emoji: '🚂' }, { woord: 'fiets', emoji: '🚲' },
    { woord: 'vlag', emoji: '🚩' }, { woord: 'slang', emoji: '🐍' }, { woord: 'kikker', emoji: '🐸' },
    { woord: 'banaan', emoji: '🍌' }, { woord: 'bloem', emoji: '🌸' }, { woord: 'appel', emoji: '🍎' },
    { woord: 'sleutel', emoji: '🔑' }, { woord: 'wolk', emoji: '☁️' }, { woord: 'auto', emoji: '🚗' },
    { woord: 'spin', emoji: '🕷️' }, { woord: 'olifant', emoji: '🐘' }, { woord: 'pinguïn', emoji: '🐧' },
    { woord: 'aardbei', emoji: '🍓' }, { woord: 'brood', emoji: '🍞' }, { woord: 'schildpad', emoji: '🐢' },
  ],
];

export const TELDINGEN = ['🐞', '🐟', '🐥', '🐸', '🦋', '🐝', '🐢', '🐰', '🍎', '⭐', '🌸', '🍓'];
