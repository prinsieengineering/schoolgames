// Tekenfuncties voor de arcade: monsters, sterretjes, bellen, "ploef"-wolkjes.

import { B, H } from './engine';

export const MONSTERKLEUREN = ['#9b5de5', '#f15bb5', '#00bbf9', '#00f5d4', '#fb5607', '#8ac926'];

export function lucht(ctx: CanvasRenderingContext2D, boven: string, onder: string) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, boven);
  g.addColorStop(1, onder);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, B, H);
}

/** Vaste sterrenhemel (pseudo-willekeurig maar stabiel). */
export function sterrenhemel(ctx: CanvasRenderingContext2D, t: number) {
  ctx.save();
  for (let i = 0; i < 50; i++) {
    const x = (i * 97) % B;
    const y = (i * 53 + t * (8 + (i % 3) * 6)) % H;
    ctx.globalAlpha = 0.3 + ((i * 7) % 10) / 20;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x, y, 1 + (i % 3) * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function monster(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, kleur: string, t: number, bevroren = false) {
  ctx.save();
  ctx.translate(x, y);
  const wiebel = Math.sin(t * 6 + x) * 0.06;
  ctx.scale(1 + wiebel, 1 - wiebel);
  // hoorntjes
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath();
  ctx.moveTo(-r * 0.6, -r * 0.6);
  ctx.lineTo(-r * 0.35, -r * 1.25);
  ctx.lineTo(-r * 0.1, -r * 0.8);
  ctx.moveTo(r * 0.6, -r * 0.6);
  ctx.lineTo(r * 0.35, -r * 1.25);
  ctx.lineTo(r * 0.1, -r * 0.8);
  ctx.fill();
  // lijf met golvende onderkant
  ctx.fillStyle = bevroren ? '#b8e6ff' : kleur;
  ctx.beginPath();
  ctx.arc(0, 0, r, Math.PI, 0);
  const n = 4;
  for (let i = 0; i <= n; i++) {
    const px = r - (2 * r * i) / n;
    ctx.lineTo(px, r * 0.75 + (i % 2 === 0 ? 0 : r * 0.25));
  }
  ctx.closePath();
  ctx.fill();
  // ogen
  for (const s of [-1, 1]) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(s * r * 0.38, -r * 0.1, r * 0.26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(s * r * 0.33, -r * 0.04, r * 0.12, 0, Math.PI * 2);
    ctx.fill();
    // boze wenkbrauw
    ctx.strokeStyle = '#222';
    ctx.lineWidth = r * 0.12;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(s * r * 0.62, -r * 0.48);
    ctx.lineTo(s * r * 0.15, -r * 0.3);
    ctx.stroke();
  }
  // mond met tandjes
  ctx.fillStyle = '#5a1a3a';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.38, r * 0.32, r * 0.16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(-r * 0.16, r * 0.24, r * 0.12, r * 0.1);
  ctx.fillRect(r * 0.04, r * 0.24, r * 0.12, r * 0.1);
  ctx.restore();
}

export function ster(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, kleur = '#ffd23f', draai = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(draai);
  ctx.fillStyle = kleur;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i * Math.PI) / 5 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function bel(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.fillStyle = 'rgba(160,220,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function hartje(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, vol: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s / 20, s / 20);
  ctx.fillStyle = vol ? '#ef476f' : 'rgba(255,255,255,0.35)';
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-12, -4, -6, -14, 0, -6);
  ctx.bezierCurveTo(6, -14, 12, -4, 0, 6);
  ctx.fill();
  ctx.restore();
}

/**
 * Lettergrootte voor een antwoordlabel: zo groot mogelijk (tot `max`) binnen `ruimte` pixels.
 * Een emoji is ongeveer twee keer zo breed als een cijfer of letter.
 */
export function labelGrootte(t: string, max: number, ruimte: number) {
  let eenheden = 0;
  for (const c of t) {
    if (/\p{Extended_Pictographic}/u.test(c)) eenheden += 2;
    else if (c.codePointAt(0) !== 0x200d && c.codePointAt(0) !== 0xfe0f) eenheden += 1; // geen ZWJ of variatieteken
  }
  return Math.min(max, ruimte / Math.max(1, eenheden));
}

export function tekst(ctx: CanvasRenderingContext2D, t: string, x: number, y: number, grootte: number, kleur = '#fff', rand = 'rgba(0,0,0,0.45)') {
  ctx.save();
  ctx.font = `800 ${grootte}px "Nunito", "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (rand) {
    ctx.lineWidth = Math.max(3, grootte / 6);
    ctx.strokeStyle = rand;
    ctx.strokeText(t, x, y);
  }
  ctx.fillStyle = kleur;
  ctx.fillText(t, x, y);
  ctx.restore();
}

// ---------- Deeltjes ("ploef!") ----------

export interface Deeltje {
  x: number;
  y: number;
  vx: number;
  vy: number;
  leven: number;
  kleur: string;
  r: number;
  emoji?: string;
}

export function ploef(lijst: Deeltje[], x: number, y: number, kleur = '#fff', aantal = 10, emoji?: string) {
  for (let i = 0; i < aantal; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 120;
    lijst.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, leven: 0.6 + Math.random() * 0.4, kleur, r: 6 + Math.random() * 10 });
  }
  if (emoji) lijst.push({ x, y, vx: (Math.random() - 0.5) * 40, vy: 60, leven: 1.2, kleur, r: 26, emoji });
}

export function updateDeeltjes(lijst: Deeltje[], dt: number) {
  for (const d of lijst) {
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.vx *= 0.94;
    d.vy *= 0.94;
    if (d.emoji) d.vy += 160 * dt;
    d.leven -= dt;
  }
  for (let i = lijst.length - 1; i >= 0; i--) if (lijst[i].leven <= 0) lijst.splice(i, 1);
}

export function tekenDeeltjes(ctx: CanvasRenderingContext2D, lijst: Deeltje[]) {
  ctx.save();
  for (const d of lijst) {
    ctx.globalAlpha = Math.max(0, Math.min(1, d.leven * 1.5));
    if (d.emoji) {
      ctx.font = `${d.r}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(d.emoji, d.x, d.y);
    } else {
      ctx.fillStyle = d.kleur;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * (0.5 + d.leven / 2), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** "Zwevende" tekst zoals +10. */
export interface Zweef {
  x: number;
  y: number;
  tekst: string;
  leven: number;
  kleur: string;
}

export function tekenZweef(ctx: CanvasRenderingContext2D, lijst: Zweef[], dt: number) {
  for (const z of lijst) {
    z.y -= 40 * dt;
    z.leven -= dt;
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, z.leven));
    tekst(ctx, z.tekst, z.x, z.y, 22, z.kleur);
    ctx.restore();
  }
  for (let i = lijst.length - 1; i >= 0; i--) if (lijst[i].leven <= 0) lijst.splice(i, 1);
}

export function laadBeeld(src: string) {
  const img = new Image();
  img.src = src;
  return img;
}
