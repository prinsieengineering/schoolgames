// Kleine hulpfuncties voor willekeur en antwoordopties.

export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

export const kies = <T,>(lijst: readonly T[]): T => lijst[Math.floor(Math.random() * lijst.length)];

export function schud<T>(lijst: readonly T[]): T[] {
  const a = [...lijst];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Neem n verschillende elementen. */
export const neem = <T,>(lijst: readonly T[], n: number): T[] => schud(lijst).slice(0, n);

/** Opties = juist antwoord + unieke afleiders, geschud, standaard 4 stuks. */
export function opties(antwoord: string, afleiders: string[], aantal = 4): string[] {
  const set = new Set<string>([antwoord]);
  for (const a of schud(afleiders)) {
    if (set.size >= aantal) break;
    set.add(a);
  }
  return schud([...set]);
}

/** Getalopties dicht bij het antwoord (geen negatieve getallen). */
export function getalOpties(antwoord: number, spreiding = 3, aantal = 4, extra: number[] = []): string[] {
  const kandidaten = new Set<number>(extra.filter((x) => x !== antwoord && x >= 0));
  let pogingen = 0;
  while (kandidaten.size < aantal + 3 && pogingen < 100) {
    pogingen++;
    const x = antwoord + rand(-spreiding, spreiding);
    if (x !== antwoord && x >= 0) kandidaten.add(x);
  }
  return opties(String(antwoord), [...kandidaten].map(String), aantal);
}

export const ggd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : ggd(b, a % b));

export function vereenvoudig(t: number, n: number): [number, number] {
  const g = ggd(t, n) || 1;
  return [t / g, n / g];
}

export const breukTekst = (t: number, n: number) => (n === 1 ? String(t) : `${t}/${n}`);

/** Kommagetal in Vlaamse notatie (komma), zonder overbodige nullen. */
export const komma = (x: number) =>
  String(Math.round(x * 1000) / 1000).replace('.', ',');

export const vandaag = () => new Date().toISOString().slice(0, 10);

export const maakId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
