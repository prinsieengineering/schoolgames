import type { Vraag } from '../core/types';

const normaal = (s: string) =>
  s
    .trim()
    .toLowerCase()
    .replace(/\./g, ',')
    .replace(/\s+/g, ' ')
    .replace(/^0+(?=\d)/, '');

export const isJuist = (v: Vraag, gegeven: string) => normaal(gegeven) === normaal(v.antwoord);

/** Maak een vraag die nog niet in `gehad` zit (max. een paar pogingen). */
export function nieuweVraag(maak: () => Vraag, gehad: Set<string>): Vraag {
  let v = maak();
  for (let i = 0; i < 12 && gehad.has(v.sleutel); i++) v = maak();
  gehad.add(v.sleutel);
  return v;
}
