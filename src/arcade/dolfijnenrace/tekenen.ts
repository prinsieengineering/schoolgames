// Tekeningen voor de Dolfijnenrace: de onderwaterwereld in vier stukken,
// de dolfijn, de zeemeermin, het gezonken schip en de finish. Alles is met
// canvas getekend (of met emoji van het toestel), er zijn geen bestanden nodig.

import { B, H } from '../kern/engine';
import { tekst } from '../kern/teken';

export interface Zone {
  naam: string;
  icoon: string;
  boven: string;
  onder: string;
  bodem: string;
  /** Kleur van dit stuk in de racebalk. */
  balk: string;
  decor: string[];
  dier: string;
}

export const ZONES: Zone[] = [
  { naam: 'Koraalrif', icoon: '🪸', boven: '#62d4f2', onder: '#1a8cc2', bodem: '#f0d29a', balk: '#ff8fab', decor: ['🪸', '🐚', '🦀', '🪸', '⭐', '🪸'], dier: '🐢' },
  { naam: 'Kelpwoud', icoon: '🌿', boven: '#33b3a0', onder: '#0b6668', bodem: '#8b7b4b', balk: '#52b788', decor: ['🌿', '🐙', '🦞', '🐚', '🌿'], dier: '🐟' },
  { naam: 'Gezonken schip', icoon: '🚢', boven: '#2b78a8', onder: '#123a63', bodem: '#6a5945', balk: '#c08552', decor: ['⚓', '🪙', '💰', '🐚', '🏺', '🦀'], dier: '🐠' },
  { naam: 'Diepzee', icoon: '✨', boven: '#16295a', onder: '#040822', bodem: '#1b2140', balk: '#7b61ff', decor: ['🐡', '🐚', '✨', '🦑'], dier: '🪼' },
];

/** In welk stuk van de wereld zit je (afstand 0..1)? */
export const zoneVan = (a: number) => Math.max(0, Math.min(ZONES.length - 1, Math.floor(a * ZONES.length)));

/** Vaste "willekeur" per index, zodat het decor niet verspringt. */
const hash = (k: number) => {
  const x = Math.sin(k * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function hexNaarRgb(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function meng(a: string, b: string, f: number) {
  const x = hexNaarRgb(a);
  const y = hexNaarRgb(b);
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * f)).join(',')})`;
}

/** Kleuren van water en bodem op afstand a, met een zachte overgang tussen de stukken. */
export function mengKleur(a: number) {
  const z = Math.max(0, Math.min(0.9999, a)) * ZONES.length;
  const i = Math.floor(z);
  const binnen = z - i;
  const f = i < ZONES.length - 1 && binnen > 0.8 ? (binnen - 0.8) / 0.2 : 0;
  const nu = ZONES[i];
  const volgend = ZONES[Math.min(ZONES.length - 1, i + 1)];
  return { boven: meng(nu.boven, volgend.boven, f), onder: meng(nu.onder, volgend.onder, f), bodem: meng(nu.bodem, volgend.bodem, f) };
}

function kelp(ctx: CanvasRenderingContext2D, x: number, voet: number, hoogte: number, t: number, kleur: string, dikte: number) {
  ctx.save();
  ctx.strokeStyle = kleur;
  ctx.lineWidth = dikte;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x, voet);
  const stappen = 6;
  for (let i = 1; i <= stappen; i++) {
    const y = voet - (hoogte * i) / stappen;
    ctx.lineTo(x + Math.sin(t * 1.5 + i * 0.9 + x * 0.01) * (6 + i * 3), y);
  }
  ctx.stroke();
  // blaadjes
  ctx.fillStyle = kleur;
  for (let i = 1; i < stappen; i++) {
    const y = voet - (hoogte * i) / stappen;
    const bx = x + Math.sin(t * 1.5 + i * 0.9 + x * 0.01) * (6 + i * 3);
    ctx.beginPath();
    ctx.ellipse(bx + (i % 2 ? 10 : -10), y, 12, 5, i % 2 ? 0.5 : -0.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export const DIEPTE = {
  /** Verre laag: rotsen, kelp en lichtjes, schuift trager voorbij (parallax). */
  verre(ctx: CanvasRenderingContext2D, scroll: number, t: number, baanPx: number) {
    const stap = 150;
    const eerste = Math.floor(scroll / stap) - 2;
    for (let k = eerste; k < eerste + B / stap + 4; k++) {
      const sx = k * stap - scroll;
      const zone = zoneVan((k * stap) / (0.35 * baanPx));
      const h = hash(k);
      ctx.save();
      if (zone === 0) {
        ctx.fillStyle = 'rgba(10,60,110,0.25)';
        ctx.beginPath();
        ctx.ellipse(sx, H - 70, 60 + h * 40, 50 + h * 50, 0, Math.PI, 0);
        ctx.fill();
        // koraaltakken
        ctx.strokeStyle = 'rgba(10,60,110,0.25)';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        for (let j = -1; j <= 1; j++) {
          ctx.beginPath();
          ctx.moveTo(sx + j * 20, H - 110 - h * 30);
          ctx.lineTo(sx + j * 34, H - 170 - h * 50);
          ctx.stroke();
        }
      } else if (zone === 1) {
        kelp(ctx, sx, H - 30, 300 + h * 200, t * 0.7, 'rgba(8,70,55,0.45)', 10);
        if (h > 0.5) kelp(ctx, sx + 60, H - 30, 250 + h * 150, t * 0.7 + 1, 'rgba(8,70,55,0.35)', 8);
      } else if (zone === 2) {
        ctx.fillStyle = 'rgba(5,30,60,0.35)';
        ctx.beginPath();
        ctx.moveTo(sx - 70, H - 40);
        ctx.lineTo(sx - 30, H - 120 - h * 60);
        ctx.lineTo(sx + 20, H - 90 - h * 40);
        ctx.lineTo(sx + 70, H - 40);
        ctx.fill();
      } else {
        // lichtgevende puntjes in de diepzee
        for (let j = 0; j < 3; j++) {
          const hh = hash(k * 7 + j);
          const y = 120 + hh * (H - 220);
          const puls = 0.4 + 0.6 * Math.abs(Math.sin(t * 1.5 + hh * 10));
          ctx.globalAlpha = puls;
          ctx.fillStyle = j % 2 ? '#7ef9ff' : '#ff8bd1';
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(sx + hh * stap, y, 2.5 + hh * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  },

  /** Bodem met decor en zwemmende diertjes. */
  bodem(ctx: CanvasRenderingContext2D, scroll: number, t: number, baanPx: number, dolX: number) {
    const kleur = mengKleur(scroll / baanPx).bodem;
    ctx.fillStyle = kleur;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= B; x += 20) ctx.lineTo(x, H - 36 + Math.sin((x + scroll) * 0.02) * 6);
    ctx.lineTo(B, H);
    ctx.fill();

    const stap = 64;
    const eerste = Math.floor((scroll - dolX) / stap) - 1;
    for (let k = eerste; k < eerste + B / stap + 3; k++) {
      const wx = k * stap;
      const sx = wx - scroll + dolX;
      const zone = ZONES[zoneVan(wx / baanPx)];
      const h = hash(k + 1000);
      if (zone.naam === 'Kelpwoud' && h > 0.45) kelp(ctx, sx, H - 30, 90 + h * 120, t, '#2d9a5f', 6);
      if (h < 0.55) {
        const emoji = zone.decor[Math.floor(hash(k + 2000) * zone.decor.length)];
        tekst(ctx, emoji, sx, H - 34 - h * 12, 24 + h * 18, '#000', '');
      }
    }

    // zwemmende diertjes (zwemmen zelf ook een beetje)
    const dstap = 380;
    const deerste = Math.floor((scroll * 0.8 - dolX) / dstap) - 1;
    for (let k = deerste; k < deerste + B / dstap + 3; k++) {
      const wx = k * dstap;
      const zone = ZONES[zoneVan(wx / (0.8 * baanPx))];
      const h = hash(k + 3000);
      const sx = wx - scroll * 0.8 + dolX - ((t * 18) % dstap);
      const y = 170 + h * 380 + Math.sin(t * 2 + k) * 10;
      ctx.save();
      ctx.globalAlpha = 0.85;
      if (zone.dier === '🪼') {
        ctx.shadowColor = '#ff8bd1';
        ctx.shadowBlur = 16;
      }
      // emoji van dieren kijken meestal naar links: dat past, ze zwemmen tegen de stroom in
      tekst(ctx, zone.dier, sx, y, 26 + h * 10, '#000', '');
      if (zone.dier === '🐟' || zone.dier === '🐠') tekst(ctx, zone.dier, sx + 26, y + 16, 20, '#000', '');
      ctx.restore();
    }
  },
};

/** Een gezonken schip op de bodem. */
export function schip(ctx: CanvasRenderingContext2D, x: number, bodem: number, gekanteld: boolean) {
  if (x < -320 || x > B + 320) return;
  ctx.save();
  ctx.translate(x, bodem);
  ctx.rotate(gekanteld ? -0.18 : 0.12);
  // romp
  ctx.fillStyle = '#5b3d26';
  ctx.beginPath();
  ctx.moveTo(-140, -70);
  ctx.lineTo(130, -70);
  ctx.lineTo(160, -110);
  ctx.lineTo(100, 0);
  ctx.lineTo(-120, 0);
  ctx.closePath();
  ctx.fill();
  // planken
  ctx.strokeStyle = '#3f2a1a';
  ctx.lineWidth = 3;
  for (const y of [-50, -30, -12]) {
    ctx.beginPath();
    ctx.moveTo(-132, y);
    ctx.lineTo(118 - (y + 50) * 0.3, y);
    ctx.stroke();
  }
  // patrijspoortjes
  ctx.fillStyle = '#1d4a6b';
  ctx.strokeStyle = '#c9a227';
  for (const px of [-80, -30, 20, 70]) {
    ctx.beginPath();
    ctx.arc(px, -44, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  // gebroken mast met gescheurd zeil
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(-20, -190, 10, 120);
  ctx.fillStyle = 'rgba(240,230,200,0.7)';
  ctx.beginPath();
  ctx.moveTo(-10, -185);
  ctx.lineTo(60, -160);
  ctx.lineTo(40, -130);
  ctx.lineTo(55, -105);
  ctx.lineTo(-10, -100);
  ctx.fill();
  // zeewier op de romp
  ctx.strokeStyle = '#2d9a5f';
  ctx.lineWidth = 4;
  for (const wx of [-110, 40, 90]) {
    ctx.beginPath();
    ctx.moveTo(wx, -70);
    ctx.quadraticCurveTo(wx + 10, -90, wx - 4, -110);
    ctx.stroke();
  }
  ctx.restore();
  // schatkist ernaast
  if (!gekanteld) tekst(ctx, '🧰', x + 150, bodem - 18, 30, '#000', '');
}

/** De finish: een geblokte paal van boven tot onder. */
export function finish(ctx: CanvasRenderingContext2D, x: number, t: number) {
  const vak = 16;
  for (let y = 80, i = 0; y < H - 36; y += vak, i++) {
    for (let j = 0; j < 2; j++) {
      ctx.fillStyle = (i + j) % 2 ? '#222' : '#fff';
      ctx.fillRect(x + j * vak, y, vak, vak);
    }
  }
  tekst(ctx, '🏁', x + vak, 86 + Math.sin(t * 3) * 3, 34, '#000', '');
}

/** De dolfijn (kijkt naar rechts). */
export function dolfijn(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, kantel: number, turbo: boolean, traag: boolean) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(kantel);
  const slag = Math.sin(t * (turbo ? 18 : traag ? 6 : 10)) * 0.28;

  if (turbo) {
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    for (const [dy, l] of [[-14, 50], [0, 70], [14, 45]]) {
      const o = (t * 300) % 30;
      ctx.beginPath();
      ctx.moveTo(-70 - o, dy);
      ctx.lineTo(-70 - o - l, dy);
      ctx.stroke();
    }
  }

  // staart (wiebelt)
  ctx.save();
  ctx.translate(-46, 2);
  ctx.rotate(slag);
  ctx.fillStyle = '#4a9bd8';
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.quadraticCurveTo(-14, -6, -26, -24);
  ctx.quadraticCurveTo(-20, -4, -16, 0);
  ctx.quadraticCurveTo(-20, 4, -26, 24);
  ctx.quadraticCurveTo(-14, 6, 4, 0);
  ctx.fill();
  ctx.restore();

  // rugvin (gebogen naar achter, zoals bij een echte dolfijn)
  ctx.fillStyle = '#4a9bd8';
  ctx.beginPath();
  ctx.moveTo(2, -22);
  ctx.quadraticCurveTo(-2, -36, -16, -40);
  ctx.quadraticCurveTo(-10, -30, -20, -20);
  ctx.fill();

  // lijf: ronde kop ("meloen") en een kort snuitje
  const g = ctx.createLinearGradient(0, -28, 0, 24);
  g.addColorStop(0, '#6cbcf5');
  g.addColorStop(1, '#4a9bd8');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-50, 2);
  ctx.bezierCurveTo(-34, -30, 22, -36, 40, -14);
  ctx.quadraticCurveTo(46, -6, 58, -3);
  ctx.quadraticCurveTo(64, 1, 58, 5);
  ctx.quadraticCurveTo(50, 8, 42, 9);
  ctx.bezierCurveTo(26, 26, -30, 22, -50, 2);
  ctx.fill();

  // lichte buik
  ctx.fillStyle = '#d8f0ff';
  ctx.beginPath();
  ctx.moveTo(-36, 8);
  ctx.bezierCurveTo(-10, 22, 30, 20, 46, 6);
  ctx.bezierCurveTo(20, 10, -10, 12, -36, 8);
  ctx.fill();

  // borstvin
  ctx.fillStyle = '#3f8cc9';
  ctx.beginPath();
  ctx.moveTo(6, 10);
  ctx.quadraticCurveTo(-4, 30 + slag * 10, -14, 28 + slag * 10);
  ctx.quadraticCurveTo(-6, 18, -4, 10);
  ctx.fill();

  // oog, blosje en glimlach
  ctx.fillStyle = '#1b1b2f';
  ctx.beginPath();
  ctx.arc(30, -8, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(32, -10, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,140,170,0.55)';
  ctx.beginPath();
  ctx.ellipse(34, 2, 5, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1b1b2f';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(44, 4);
  ctx.quadraticCurveTo(52, 9, 59, 3);
  ctx.stroke();
  ctx.restore();
}

/** De zeemeermin (kijkt naar rechts). */
export function zeemeermin(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, wacht: boolean) {
  ctx.save();
  ctx.translate(x, y);
  const slag = Math.sin(t * (wacht ? 3 : 8)) * 0.3;

  // haar dat naar achter wappert
  ctx.fillStyle = '#ff7b39';
  ctx.beginPath();
  ctx.moveTo(18, -34);
  ctx.quadraticCurveTo(-10, -40 + slag * 6, -30, -18 + slag * 8);
  ctx.quadraticCurveTo(-8, -20, 6, -12);
  ctx.fill();

  // staart
  ctx.save();
  ctx.translate(-6, 6);
  ctx.rotate(slag * 0.6);
  const g = ctx.createLinearGradient(-50, 0, 0, 0);
  g.addColorStop(0, '#13a89e');
  g.addColorStop(1, '#2ec4b6');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(4, -8);
  ctx.quadraticCurveTo(-24, -10, -42, 0);
  ctx.quadraticCurveTo(-24, 12, 4, 10);
  ctx.fill();
  // staartvin
  ctx.fillStyle = '#7ae0d6';
  ctx.beginPath();
  ctx.moveTo(-40, 0);
  ctx.quadraticCurveTo(-56, -18, -62, -14);
  ctx.quadraticCurveTo(-54, 0, -62, 14);
  ctx.quadraticCurveTo(-56, 18, -40, 0);
  ctx.fill();
  // schubben
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1.5;
  for (const sx of [-6, -16, -26]) {
    ctx.beginPath();
    ctx.arc(sx, 0, 4, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
  }
  ctx.restore();

  // lijfje
  ctx.fillStyle = '#f6c9a8';
  ctx.beginPath();
  ctx.ellipse(10, -6, 9, 13, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // schelpentopje
  ctx.fillStyle = '#b86bff';
  ctx.beginPath();
  ctx.ellipse(12, -6, 7, 5, 0.4, 0, Math.PI * 2);
  ctx.fill();
  // arm (zwaait als ze wacht)
  ctx.strokeStyle = '#f6c9a8';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(14, -12);
  if (wacht) ctx.lineTo(26 + Math.sin(t * 8) * 4, -32);
  else ctx.lineTo(30, -4);
  ctx.stroke();

  // hoofd
  ctx.fillStyle = '#f6c9a8';
  ctx.beginPath();
  ctx.arc(20, -26, 10, 0, Math.PI * 2);
  ctx.fill();
  // pony
  ctx.fillStyle = '#ff7b39';
  ctx.beginPath();
  ctx.arc(18, -29, 10.5, Math.PI * 1.05, Math.PI * 1.95);
  ctx.fill();
  // oog + lach
  ctx.fillStyle = '#1b1b2f';
  ctx.beginPath();
  ctx.arc(24, -26, 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#c0392b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(24, -22, 3, 0.2, Math.PI - 0.6);
  ctx.stroke();
  // zeesterretje in het haar
  ctx.fillStyle = '#ffd23f';
  ctx.beginPath();
  ctx.arc(12, -36, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
