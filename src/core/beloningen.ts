// XP, niveaus, sterren en muntjes. Pure functies: profiel in -> nieuw profiel uit.

import type { Beloning, Profiel, RondeResultaat, Vak } from './types';
import { vandaag } from './random';
import { nieuweBadges } from './badges';
import { vindSpel } from '../spelletjes/register';

/** XP nodig om van niveau n naar n+1 te gaan. */
export const xpVoorNiveau = (n: number) => 100 + (n - 1) * 50;

export function niveauInfo(xp: number) {
  let niveau = 1;
  let rest = xp;
  while (rest >= xpVoorNiveau(niveau)) {
    rest -= xpVoorNiveau(niveau);
    niveau++;
  }
  return { niveau, binnen: rest, nodig: xpVoorNiveau(niveau) };
}

/** 1 ster vanaf 60%, 2 sterren vanaf 80%, 3 sterren bij 100%. */
export function sterrenVoor(juist: number, totaal: number) {
  if (totaal === 0) return 0;
  const p = juist / totaal;
  if (p >= 1) return 3;
  if (p >= 0.8) return 2;
  if (p >= 0.6) return 1;
  return 0;
}

/** Een niveau is open als het eerste is, of het vorige minstens 2 sterren heeft. */
export const niveauOpen = (p: Profiel, spelId: string, niveau: number) =>
  niveau === 0 || (p.spellen[spelId]?.sterren[niveau - 1] ?? 0) >= 2;

/** Hoogste open niveau (voor arcade: start daar). */
export function hoogsteOpenNiveau(p: Profiel, spelId: string, aantal: number) {
  let n = 0;
  while (n + 1 < aantal && niveauOpen(p, spelId, n + 1)) n++;
  return n;
}

export function verwerkRonde(p: Profiel, r: RondeResultaat): { profiel: Profiel; beloning: Beloning } {
  const oud = structuredClone(p);
  const nieuw = structuredClone(p);
  const bron = vindSpel(r.bronSpelId);
  const sterren = sterrenVoor(r.juist, r.totaal);
  let nieuwRecord = false;

  // Statistieken
  nieuw.stats.juist += r.juist;
  nieuw.stats.totaal += r.totaal;
  nieuw.stats.besteReeks = Math.max(nieuw.stats.besteReeks, r.besteReeks);
  const dag = vandaag();
  if (!nieuw.stats.dagen.includes(dag)) nieuw.stats.dagen.push(dag);
  for (const s of r.foutSleutels) {
    const k = `${r.bronSpelId}:${s}`;
    nieuw.stats.fouten[k] = (nieuw.stats.fouten[k] ?? 0) + 1;
  }
  if (bron) {
    const vak: Vak = bron.vak;
    const v = (nieuw.stats.perVak[vak] ??= { juist: 0, totaal: 0 });
    v.juist += r.juist;
    v.totaal += r.totaal;
  }
  for (const [k, w] of Object.entries(r.tellers ?? {})) {
    nieuw.stats.tellers[k] = (nieuw.stats.tellers[k] ?? 0) + w;
  }

  if (r.soort === 'quiz' && bron) {
    const sv = (nieuw.spellen[r.id] ??= {
      sterren: bron.niveaus.map(() => 0),
      gespeeld: 0,
      juist: 0,
      totaal: 0,
    });
    sv.sterren[r.niveau] = Math.max(sv.sterren[r.niveau] ?? 0, sterren);
    sv.gespeeld++;
    sv.juist += r.juist;
    sv.totaal += r.totaal;
    // Doorzetter: vorige keer < 2 sterren op dit niveau, nu wel ≥ 2
    if ((oud.spellen[r.id]?.sterren[r.niveau] ?? 0) < 2 && (oud.spellen[r.id]?.gespeeld ?? 0) > 0 && sterren >= 2) {
      nieuw.stats.tellers.doorzetter = (nieuw.stats.tellers.doorzetter ?? 0) + 1;
    }
  }
  if (r.soort === 'arcade') {
    const av = (nieuw.arcade[r.id] ??= { record: 0, gespeeld: 0 });
    av.gespeeld++;
    if ((r.punten ?? 0) > av.record) {
      nieuwRecord = av.gespeeld > 1;
      av.record = r.punten ?? 0;
      if (nieuwRecord) nieuw.stats.tellers.records = (nieuw.stats.tellers.records ?? 0) + 1;
    }
  }

  // XP en muntjes
  const xp = r.juist * 10 + sterren * 10;
  const muntjes = r.juist + sterren * 5 + (nieuwRecord ? 10 : 0);
  const niveauVoor = niveauInfo(nieuw.xp).niveau;
  nieuw.xp += xp;
  nieuw.muntjes += muntjes;
  const niveauOmhoog = niveauInfo(nieuw.xp).niveau > niveauVoor;

  // Badges
  const badges = nieuweBadges(nieuw, { sterren, resultaat: r });
  nieuw.badges.push(...badges);
  if (badges.length) nieuw.muntjes += badges.length * 10;

  return {
    profiel: nieuw,
    beloning: { sterren, xp, muntjes: muntjes + badges.length * 10, nieuweBadges: badges, nieuwRecord, niveauOmhoog },
  };
}
