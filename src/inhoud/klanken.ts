// Klankzuivere woorden (medeklinker-klinker-medeklinker) voor de Klankenjacht (1e leerjaar).
// Elke klank apart, zoals in de klas gezegd wordt: m - aa - n.
// Woorden die eindigen op een d (klinkt als t) laten we bewust weg.

export interface KlankWoord {
  woord: string;
  emoji: string;
  klanken: [string, string, string];
}

export const KLANKWOORDEN: KlankWoord[] = [
  { woord: 'maan', emoji: '🌙', klanken: ['m', 'aa', 'n'] },
  { woord: 'vis', emoji: '🐟', klanken: ['v', 'i', 's'] },
  { woord: 'kat', emoji: '🐱', klanken: ['k', 'a', 't'] },
  { woord: 'kip', emoji: '🐔', klanken: ['k', 'i', 'p'] },
  { woord: 'bus', emoji: '🚌', klanken: ['b', 'u', 's'] },
  { woord: 'zon', emoji: '☀️', klanken: ['z', 'o', 'n'] },
  { woord: 'bal', emoji: '⚽', klanken: ['b', 'a', 'l'] },
  { woord: 'pen', emoji: '🖊️', klanken: ['p', 'e', 'n'] },
  { woord: 'sok', emoji: '🧦', klanken: ['s', 'o', 'k'] },
  { woord: 'jas', emoji: '🧥', klanken: ['j', 'a', 's'] },
  { woord: 'tas', emoji: '👜', klanken: ['t', 'a', 's'] },
  { woord: 'net', emoji: '🥅', klanken: ['n', 'e', 't'] },
  { woord: 'vos', emoji: '🦊', klanken: ['v', 'o', 's'] },
  { woord: 'roos', emoji: '🌹', klanken: ['r', 'oo', 's'] },
  { woord: 'muis', emoji: '🐭', klanken: ['m', 'ui', 's'] },
  { woord: 'boom', emoji: '🌳', klanken: ['b', 'oo', 'm'] },
  { woord: 'boot', emoji: '⛵', klanken: ['b', 'oo', 't'] },
  { woord: 'peer', emoji: '🍐', klanken: ['p', 'ee', 'r'] },
  { woord: 'neus', emoji: '👃', klanken: ['n', 'eu', 's'] },
  { woord: 'been', emoji: '🦵', klanken: ['b', 'ee', 'n'] },
  { woord: 'voet', emoji: '🦶', klanken: ['v', 'oe', 't'] },
  { woord: 'kaas', emoji: '🧀', klanken: ['k', 'aa', 's'] },
  { woord: 'raam', emoji: '🪟', klanken: ['r', 'aa', 'm'] },
  { woord: 'huis', emoji: '🏠', klanken: ['h', 'ui', 's'] },
  { woord: 'vuur', emoji: '🔥', klanken: ['v', 'uu', 'r'] },
  { woord: 'deur', emoji: '🚪', klanken: ['d', 'eu', 'r'] },
  { woord: 'wiel', emoji: '🛞', klanken: ['w', 'ie', 'l'] },
  { woord: 'zeep', emoji: '🧼', klanken: ['z', 'ee', 'p'] },
  { woord: 'bijl', emoji: '🪓', klanken: ['b', 'ij', 'l'] },
  { woord: 'duim', emoji: '👍', klanken: ['d', 'ui', 'm'] },
];

export const MEDEKLINKERS = ['b', 'd', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
export const KLINKERS = ['a', 'e', 'i', 'o', 'u', 'aa', 'ee', 'oo', 'uu', 'oe', 'ui', 'eu', 'ie', 'ij'];
