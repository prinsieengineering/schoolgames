// Alles wat je met muntjes kan kopen. Prijs 0 = gratis vanaf de start.

export type ItemSoort = 'dier' | 'kleur' | 'hoed' | 'bril' | 'extra';

export interface WinkelItem {
  id: string;
  soort: ItemSoort;
  waarde: string;
  naam: string;
  prijs: number;
}

const item = (soort: ItemSoort, waarde: string, naam: string, prijs: number): WinkelItem => ({
  id: `${soort}:${waarde}`,
  soort,
  waarde,
  naam,
  prijs,
});

export const WINKEL: WinkelItem[] = [
  item('dier', 'vos', 'Vos', 0),
  item('dier', 'beer', 'Beer', 0),
  item('dier', 'kat', 'Kat', 0),
  item('dier', 'konijn', 'Konijn', 0),
  item('dier', 'kikker', 'Kikker', 40),
  item('dier', 'panda', 'Panda', 50),
  item('dier', 'uil', 'Uil', 60),
  item('dier', 'eenhoorn', 'Eenhoorn', 120),
  item('dier', 'draak', 'Draak', 150),
  item('dier', 'robot', 'Robot', 150),

  item('kleur', 'oranje', 'Oranje', 0),
  item('kleur', 'bruin', 'Bruin', 0),
  item('kleur', 'blauw', 'Blauw', 0),
  item('kleur', 'grijs', 'Grijs', 0),
  item('kleur', 'roze', 'Roze', 0),
  item('kleur', 'groen', 'Groen', 0),
  item('kleur', 'paars', 'Paars', 20),
  item('kleur', 'geel', 'Geel', 20),
  item('kleur', 'wit', 'Wit', 20),
  item('kleur', 'rood', 'Rood', 20),
  item('kleur', 'turkoois', 'Turkoois', 30),
  item('kleur', 'zwart', 'Zwart', 30),

  item('hoed', 'pet', 'Pet', 25),
  item('hoed', 'strik', 'Strik', 25),
  item('hoed', 'bloem', 'Bloem', 30),
  item('hoed', 'feesthoed', 'Feesthoedje', 40),
  item('hoed', 'koptelefoon', 'Koptelefoon', 60),
  item('hoed', 'tovenaar', 'Tovenaarshoed', 90),
  item('hoed', 'kroon', 'Kroon', 200),

  item('bril', 'rond', 'Ronde bril', 25),
  item('bril', 'zonnebril', 'Zonnebril', 45),
  item('bril', 'sterbril', 'Sterrenbril', 70),

  item('extra', 'sjaal', 'Sjaal', 30),
  item('extra', 'vlinderdas', 'Vlinderdas', 35),
  item('extra', 'cape', 'Superheldencape', 100),
  item('extra', 'medaille', 'Gouden medaille', 250),
];

export const isGratis = (soort: ItemSoort, waarde: string) =>
  WINKEL.some((i) => i.soort === soort && i.waarde === waarde && i.prijs === 0);

export const heeftItem = (bezit: string[], soort: ItemSoort, waarde: string) =>
  isGratis(soort, waarde) || bezit.includes(`${soort}:${waarde}`);
