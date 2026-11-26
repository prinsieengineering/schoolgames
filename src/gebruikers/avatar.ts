// Avatars: katten, honden en voxelrobots van DiceBear (stijlen "cats", "dogs"
// en "voxel-bot", allemaal CC0 1.0: vrij te gebruiken, ook online).
// De rest van de app gebruikt alleen `avatarSvg`, `avatarUrl` en de
// beschrijvingen hieronder; wil je ooit een andere stijl, dan pas je enkel dit bestand aan.

import { Avatar as DbAvatar, Style } from '@dicebear/core/lite';
import catsDef from '@dicebear/styles/cats.json';
import dogsDef from '@dicebear/styles/dogs.json';
import botDef from '@dicebear/styles/voxel-bot.json';
import type { Avatar, Soort } from '../core/types';

export type { Soort };

export interface Onderdeel {
  id: string;
  naam: string;
  icoon: string;
  /** Mag op "geen" staan. */
  optioneel: boolean;
  varianten: string[];
}

export interface KleurDeel {
  id: string;
  naam: string;
  waarden: string[];
}

interface SoortInfo {
  naam: string;
  icoon: string;
  style: Style;
  onderdelen: Onderdeel[];
  kleuren: KleurDeel[];
}

const NAMEN: Record<string, [string, string]> = {
  eyes: ['Ogen', '👀'],
  mouth: ['Mond', '👄'],
  head: ['Kop', '🐱'],
  ears: ['Oren', '👂'],
  muzzle: ['Snuit', '🐶'],
  hair: ['Kuifje', '💇'],
  blaze: ['Bles', '⭐'],
  pattern: ['Vlekken', '🐾'],
  body: ['Lijf', '🧸'],
  tail: ['Staart', '〰️'],
  collar: ['Halsband', '🎀'],
  toy: ['Speeltje', '🧶'],
  cheeks: ['Wangetjes', '😊'],
  scene: ['Achtergrond', '🏞️'],
  top: ['Hoofd', '📡'],
  chest: ['Borst', '💟'],
};

const KLEURNAMEN: Record<string, string> = {
  fur: 'Vachtkleur',
  collar: 'Halsbandkleur',
  body: 'Kleur',
  glow: 'Lichtjes',
  accent: 'Details',
  screen: 'Scherm',
  background: 'Achtergrond',
};

/** Nederlandse namen voor varianten (wat niet in de lijst staat, krijgt een nummer). */
const VARIANTNAMEN: Record<string, string> = {
  happy: 'blij', wink: 'knipoog', sleepy: 'slaperig', round: 'rond', wide: 'groot', squint: 'knijp', up: 'omhoog', down: 'omlaag',
  sideeye: 'zijkant', relaxed: 'relax', dilated: 'grote pupillen', slit: 'spleetjes', puppy: 'puppyogen', button: 'knoopjes',
  cyclops: 'één oog', plus: 'plusjes', square: 'vierkant', visor: 'vizier',
  smile: 'lach', grin: 'grijns', ooh: 'ooh', open: 'open', yawn: 'gaap', blep: 'tongetje', cat: 'kattensnoet', line: 'streepje',
  lolling: 'tong uit', pant: 'hijgen', tongue: 'tong', grill: 'rooster', speaker: 'luidspreker', zigzag: 'zigzag',
  kitten: 'kitten', pointed: 'puntig', tall: 'hoog', bat: 'vleermuis', drop: 'hangend', half: 'half', long: 'lang',
  pompon: 'pompon', prick: 'rechtop', small: 'klein', beard: 'baardje', fluffy: 'pluizig', short: 'kort',
  bangs: 'pony', topknot: 'staartje', tuft: 'plukje', bib: 'slab', brows: 'wenkbrauwen', star: 'ster', stripe: 'streep',
  patch: 'vlek', spots: 'stippen', stripes: 'strepen', stripesCheeks: 'wangstrepen', tabbyM: 'tijgerkop', cap: 'kapje', sides: 'zijkanten',
  chest: 'witte borst', sitting: 'zittend', chestSocks: 'borst en sokjes', plain: 'effen', socks: 'sokjes',
  bell: 'belletje', tag: 'naamplaatje', bandana: 'bandana', bone: 'botje',
  mouse: 'muisje', yarn: 'bolletje wol', ball: 'bal', frisbee: 'frisbee', stick: 'stok',
  blush: 'blosjes',
  bedroom: 'slaapkamer', forest: 'bos', livingRoom: 'woonkamer', meadow: 'weide', nursery: 'kinderkamer', playground: 'speeltuin',
  beach: 'strand', kitchen: 'keuken', street: 'straat', yard: 'tuin',
  antenna: 'antenne', dish: 'schotel', fin: 'vin', lightbar: 'lichtbalk', siren: 'sirene', studs: 'noppen', twin: 'dubbele antenne',
  buttons: 'knopjes', dial: 'draaiknop', heart: 'hartje', screen: 'schermpje', slot: 'gleuf', vents: 'roostertjes',
};

export const variantNaam = (deel: string, v: string, i: number) =>
  v === 'geen' ? 'geen' : VARIANTNAMEN[v] ?? `${NAMEN[deel]?.[0] ?? deel} ${i + 1}`;

type Def = {
  components: Record<string, { probability?: number; variants: Record<string, unknown> }>;
  colors: Record<string, { values: string[] }>;
};

function maakInfo(naam: string, icoon: string, def: Def, volgorde: string[], kleuren: string[]): SoortInfo {
  return {
    naam,
    icoon,
    style: new Style(def as never),
    onderdelen: volgorde
      .filter((id) => def.components[id])
      .map((id) => ({
        id,
        naam: NAMEN[id]?.[0] ?? id,
        icoon: NAMEN[id]?.[1] ?? '•',
        optioneel: def.components[id].probability !== undefined || id === 'scene',
        varianten: Object.keys(def.components[id].variants),
      })),
    kleuren: kleuren.filter((id) => def.colors[id]).map((id) => ({ id, naam: KLEURNAMEN[id] ?? id, waarden: def.colors[id].values })),
  };
}

export const SOORTEN: Record<Soort, SoortInfo> = {
  kat: maakInfo('Kat', '🐱', catsDef as unknown as Def, ['eyes', 'mouth', 'head', 'pattern', 'body', 'tail', 'cheeks', 'collar', 'toy', 'scene'], ['fur', 'collar']),
  hond: maakInfo('Hond', '🐶', dogsDef as unknown as Def, ['eyes', 'mouth', 'ears', 'muzzle', 'hair', 'blaze', 'pattern', 'body', 'tail', 'cheeks', 'collar', 'toy', 'scene'], ['fur', 'collar']),
  robot: maakInfo('Robot', '🤖', botDef as unknown as Def, ['eyes', 'mouth', 'top', 'chest'], ['body', 'glow', 'accent', 'screen', 'background']),
};

const kleurSleutel = (id: string) => `kleur:${id}`;

/** Standaard: eerste variant van elk verplicht onderdeel, optionele onderdelen uit. */
export function standaardAvatar(soort: Soort): Avatar {
  const info = SOORTEN[soort];
  const delen: Record<string, string> = {};
  for (const o of info.onderdelen) delen[o.id] = o.optioneel ? 'geen' : o.varianten[0];
  for (const k of info.kleuren) delen[kleurSleutel(k.id)] = k.waarden[0];
  return { soort, delen };
}

/** Oude avatars (zelfgetekende dieren) omzetten naar het nieuwe formaat. */
export function normaliseerAvatar(a: unknown): Avatar {
  const x = a as Partial<Avatar> & { dier?: string };
  if (x && x.soort && SOORTEN[x.soort as Soort]) return { soort: x.soort as Soort, delen: { ...standaardAvatar(x.soort as Soort).delen, ...(x.delen ?? {}) } };
  const soort: Soort = x?.dier === 'robot' ? 'robot' : x?.dier === 'beer' || x?.dier === 'panda' ? 'hond' : 'kat';
  return standaardAvatar(soort);
}

function opties(a: Avatar, achtergrond: boolean): Record<string, unknown> {
  const info = SOORTEN[a.soort];
  const o: Record<string, unknown> = { seed: 'schoolgames' };
  for (const d of info.onderdelen) {
    const v = d.id === 'scene' && !achtergrond ? 'geen' : a.delen[d.id];
    if (!v || v === 'geen') {
      if (d.optioneel) o[`${d.id}Probability`] = 0;
    } else if (d.varianten.includes(v)) {
      o[`${d.id}Variant`] = v;
      o[`${d.id}Probability`] = 100;
    }
  }
  for (const k of info.kleuren) {
    const v = a.delen[kleurSleutel(k.id)];
    if (v && k.waarden.includes(v)) o[`${k.id}Color`] = [v];
  }
  return o;
}

const cache = new Map<string, string>();

/** Geeft de avatar terug als SVG-tekst. `achtergrond: false` voor de arcade. */
export function avatarSvg(a: Avatar, achtergrond = true): string {
  const sleutel = JSON.stringify([a, achtergrond]);
  let svg = cache.get(sleutel);
  if (!svg) {
    svg = new DbAvatar(SOORTEN[a.soort].style, opties(a, achtergrond) as never).toString();
    // De robots tekenen een gekleurd vierkant als achtergrond: weglaten in de arcade.
    if (!achtergrond) svg = svg.replace(/<rect width="128" height="128" fill="#[0-9a-fA-F]{6}"\/>/, '');
    if (cache.size > 300) cache.clear();
    cache.set(sleutel, svg);
  }
  return svg;
}

export const avatarUrl = (a: Avatar, achtergrond = true) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(avatarSvg(a, achtergrond));

export { kleurSleutel };

/** Willekeurige avatar, enkel met gratis onderdelen. */
export function verrasAvatar(soort: Soort, isGratisFn: (soort: Soort, deel: string, waarde: string) => boolean): Avatar {
  const info = SOORTEN[soort];
  const delen: Record<string, string> = {};
  const kies = <T,>(l: T[]) => l[Math.floor(Math.random() * l.length)];
  for (const d of info.onderdelen) {
    const opties = [...(d.optioneel ? ['geen'] : []), ...d.varianten].filter((v) => isGratisFn(soort, d.id, v));
    delen[d.id] = kies(opties.length ? opties : [d.optioneel ? 'geen' : d.varianten[0]]);
  }
  for (const k of info.kleuren) {
    const opties = k.waarden.filter((v) => isGratisFn(soort, kleurSleutel(k.id), v));
    delen[kleurSleutel(k.id)] = kies(opties.length ? opties : [k.waarden[0]]);
  }
  return { soort, delen };
}
