// Opslag-adapter. Nu: lokaal in de browser (localStorage).
// Later online? Schrijf een tweede implementatie van `Opslag` (bv. met een
// server-API of Supabase) en wissel ze hieronder om. De rest van de app
// spreekt enkel deze interface aan.

import type { AppInstellingen, Profiel } from './types';

export interface Opslag {
  profielen(): Profiel[];
  bewaarProfiel(p: Profiel): void;
  verwijderProfiel(id: string): void;
  instellingen(): AppInstellingen;
  bewaarInstellingen(i: AppInstellingen): void;
  /** Alles als JSON (voor export / overzetten naar een ander toestel). */
  exporteer(): string;
  importeer(json: string): void;
}

const SLEUTEL_PROFIELEN = 'schoolgames.profielen.v1';
const SLEUTEL_INSTELLINGEN = 'schoolgames.instellingen.v1';

const standaardInstellingen: AppInstellingen = { pinHash: null, geluid: true };

function lees<T>(sleutel: string, standaard: T): T {
  try {
    const ruw = localStorage.getItem(sleutel);
    return ruw ? (JSON.parse(ruw) as T) : standaard;
  } catch {
    return standaard;
  }
}

class LokaleOpslag implements Opslag {
  profielen(): Profiel[] {
    return lees<Profiel[]>(SLEUTEL_PROFIELEN, []);
  }
  bewaarProfiel(p: Profiel) {
    const lijst = this.profielen();
    const i = lijst.findIndex((x) => x.id === p.id);
    if (i >= 0) lijst[i] = p;
    else lijst.push(p);
    localStorage.setItem(SLEUTEL_PROFIELEN, JSON.stringify(lijst));
  }
  verwijderProfiel(id: string) {
    const lijst = this.profielen().filter((p) => p.id !== id);
    localStorage.setItem(SLEUTEL_PROFIELEN, JSON.stringify(lijst));
  }
  instellingen(): AppInstellingen {
    return { ...standaardInstellingen, ...lees<Partial<AppInstellingen>>(SLEUTEL_INSTELLINGEN, {}) };
  }
  bewaarInstellingen(i: AppInstellingen) {
    localStorage.setItem(SLEUTEL_INSTELLINGEN, JSON.stringify(i));
  }
  exporteer() {
    return JSON.stringify({ versie: 1, profielen: this.profielen(), instellingen: this.instellingen() }, null, 2);
  }
  importeer(json: string) {
    const data = JSON.parse(json);
    if (!Array.isArray(data?.profielen)) throw new Error('Dit is geen Schoolgames-bestand.');
    for (const p of data.profielen as Profiel[]) this.bewaarProfiel(p);
  }
}

export const opslag: Opslag = new LokaleOpslag();

/** Eenvoudige hash voor de pincode (enkel om hem niet leesbaar op te slaan). */
export function hashPin(pin: string): string {
  let h = 5381;
  for (const c of 'sg:' + pin) h = ((h << 5) + h + c.charCodeAt(0)) >>> 0;
  return h.toString(16);
}
