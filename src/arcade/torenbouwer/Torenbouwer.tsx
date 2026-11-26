// 🏗️ Torenbouwer (soort A): elk juist antwoord geeft een blok aan de kraan.
// Laat het op het goede moment vallen en bouw een zo hoog mogelijke toren.

import { useMemo, useRef, useState } from 'react';
import { B, H, bereidCanvas, tempo, useSpellus, useToetsen } from '../kern/engine';
import { lucht, ploef, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef } from '../kern/teken';
import { Hud, Opdrachtpaneel, hartjesTekst, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';

const SPEELTIJD = 240;
const BLOK_H = 34;
const BLOK_B = 110;
const GROND = H - 40;
const KLEUREN = ['#ef476f', '#ffd23f', '#06d6a0', '#4d96ff', '#9b5de5', '#ff8c42'];

interface Blok {
  x: number;
  kleur: string;
}

export function Torenbouwer({ bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [hud, setHud] = useState({ hartjes: 3, punten: 0, hoogte: 0, tijd: SPEELTIJD, klaarVoorBlok: false });

  const s = useRef({
    toren: [] as Blok[],
    haak: null as null | { kleur: string },
    vallend: null as null | { x: number; y: number; vy: number; kleur: string },
    tuimel: [] as { x: number; y: number; vy: number; draai: number; kleur: string }[],
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
    hartjes: 3,
    punten: 0,
    t: 0,
    tijd: 0,
    camera: 0,
    klaar: false,
    nr: 0,
  }).current;

  const kraanX = () => B / 2 + Math.sin(s.t * (1.4 + s.toren.length * 0.06) * (0.6 + factor * 0.5)) * 150;
  const torenTop = () => GROND - s.toren.length * BLOK_H;

  function laatVallen() {
    if (!s.haak || s.vallend || s.klaar) return;
    s.vallend = { x: kraanX(), y: haakY(), vy: 0, kleur: s.haak.kleur };
    s.haak = null;
    geluid.klik();
  }

  const haakY = () => Math.min(torenTop() - 200, GROND - 260);

  useToetsen((k) => {
    if (k === ' ' || k === 'ArrowDown' || k === 'Enter') laatVallen();
  });

  /** Een hartje kwijt: bij een fout antwoord of een blok dat naast de toren valt. */
  function verliesHartje(x: number, y: number, tekstje: string) {
    if (s.klaar) return;
    s.hartjes--;
    geluid.au();
    s.zweef.push({ x, y, tekst: tekstje, leven: 1.2, kleur: '#ef476f' });
    if (s.hartjes <= 0) stoppen('Oei, je hartjes zijn op!');
  }

  function stoppen(reden: string) {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { blokken: s.toren.length }, reden), 1000);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;

    // vallend blok
    if (s.vallend) {
      s.vallend.vy += 900 * dt;
      s.vallend.y += s.vallend.vy * dt;
      const doelY = torenTop() - BLOK_H;
      if (s.vallend.y >= doelY) {
        const onder = s.toren.length ? s.toren[s.toren.length - 1].x : B / 2;
        const verschil = Math.abs(s.vallend.x - onder);
        // Zoals in het echt: steekt het midden van het blok voorbij de rand van het
        // blok eronder, dan tuimelt het eraf (en kost het een hartje).
        if (s.toren.length === 0 || verschil <= BLOK_B / 2) {
          s.toren.push({ x: s.vallend.x, kleur: s.vallend.kleur });
          const perfect = verschil < 8;
          const p = 10 + (perfect ? 10 : 0) + s.toren.length;
          s.punten += p;
          geluid.ploef();
          ploef(s.deeltjes, s.vallend.x, doelY + BLOK_H, '#fff', 6);
          s.zweef.push({ x: s.vallend.x, y: doelY - 10, tekst: perfect ? `PERFECT! +${p}` : `+${p}`, leven: 1, kleur: perfect ? '#ffd23f' : '#fff' });
        } else {
          s.tuimel.push({ x: s.vallend.x, y: doelY, vy: 0, draai: 0, kleur: s.vallend.kleur });
          verliesHartje(s.vallend.x, doelY, 'Oeps! −❤️');
        }
        s.vallend = null;
      }
    }
    for (const tb of s.tuimel) {
      tb.vy += 900 * dt;
      tb.y += tb.vy * dt;
      tb.x += (tb.x > B / 2 ? 120 : -120) * dt;
      tb.draai += 4 * dt;
    }
    s.tuimel = s.tuimel.filter((tb) => tb.y < H + 200 + s.camera);
    updateDeeltjes(s.deeltjes, dt);

    // camera volgt de top van de toren
    const doelCamera = Math.max(0, s.toren.length * BLOK_H - 280);
    s.camera += (doelCamera - s.camera) * Math.min(1, dt * 3);

    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen('De tijd is om!');

    // tekenen
    const hoogteKleur = Math.min(1, s.camera / 1500);
    lucht(ctx, hoogteKleur > 0.5 ? '#1b1046' : '#6ec6ff', hoogteKleur > 0.5 ? '#6ec6ff' : '#dff4ff');
    ctx.save();
    ctx.translate(0, s.camera);
    // grond
    ctx.fillStyle = '#7ccf6a';
    ctx.fillRect(0, GROND, B, 400);
    // toren
    s.toren.forEach((b, i) => {
      const y = GROND - (i + 1) * BLOK_H;
      ctx.fillStyle = b.kleur;
      ctx.fillRect(b.x - BLOK_B / 2, y, BLOK_B, BLOK_H - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(b.x - BLOK_B / 2, y, BLOK_B, 6);
      if ((i + 1) % 5 === 0) tekst(ctx, String(i + 1), b.x, y + BLOK_H / 2, 16);
    });
    // avatar op de toren
    const top = s.toren.length ? s.toren[s.toren.length - 1].x : B / 2;
    if (avatarImg.complete) ctx.drawImage(avatarImg, top - 32, torenTop() - 62, 64, 64);
    // kraan
    const hy = haakY();
    const kx = kraanX();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(kx, hy - 400);
    ctx.lineTo(kx, hy - 4);
    ctx.stroke();
    if (s.haak) {
      ctx.fillStyle = s.haak.kleur;
      ctx.fillRect(kx - BLOK_B / 2, hy, BLOK_B, BLOK_H - 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fillRect(kx - BLOK_B / 2, hy, BLOK_B, 6);
    } else if (!s.vallend && !s.klaar) {
      tekst(ctx, 'Los een opdracht op voor een blok!', B / 2, hy + 20, 20, '#fff');
    }
    if (s.vallend) {
      ctx.fillStyle = s.vallend.kleur;
      ctx.fillRect(s.vallend.x - BLOK_B / 2, s.vallend.y, BLOK_B, BLOK_H - 2);
    }
    for (const tb of s.tuimel) {
      ctx.save();
      ctx.translate(tb.x, tb.y);
      ctx.rotate(tb.draai);
      ctx.fillStyle = tb.kleur;
      ctx.fillRect(-BLOK_B / 2, -BLOK_H / 2, BLOK_B, BLOK_H);
      ctx.restore();
    }
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    ctx.restore();
    if (s.klaar) tekst(ctx, `${s.toren.length} blokken!`, B / 2, H / 2, 44, '#ffd23f');

    const nieuw = { hartjes: s.hartjes, punten: s.punten, hoogte: s.toren.length, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), klaarVoorBlok: !!s.haak };
    if (Object.entries(nieuw).some(([key, v]) => hud[key as keyof typeof hud] !== v)) setHud(nieuw);
  }, true);

  return (
    <div className="arcade-layout">
      <div className="speelveld-kolom">
        <Hud items={[hartjesTekst(hud.hartjes), `🧱 ${hud.hoogte}`, `🏅 ${hud.punten}`, `⏱️ ${tijdTekst(hud.tijd)}`]} />
        <div className="canvas-houder">
          <canvas ref={canvasRef} className="speelveld" onPointerDown={laatVallen} />
        </div>
        <div className="bediening">
          <button className="aanraakknop schiet breed" onPointerDown={(e) => { e.preventDefault(); laatVallen(); }} disabled={!hud.klaarVoorBlok}>
            ⬇️ Laat vallen
          </button>
        </div>
        <p className="klein bediening-hulp">Tik op het speelveld of druk op spatie om het blok te laten vallen. Een fout antwoord of een blok naast de toren kost een hartje.</p>
      </div>
      <Opdrachtpaneel
        bron={bron}
        titel="🧱 Verdien een blok"
        beloningTekst="Je krijgt een blok!"
        gepauzeerd={hud.klaarVoorBlok}
        onAntwoord={(ok) => {
          if (s.klaar) return;
          if (!ok) return verliesHartje(B / 2, haakY() + 60, 'Fout antwoord −❤️');
          s.nr++;
          s.haak = { kleur: KLEUREN[s.nr % KLEUREN.length] };
        }}
      />
    </div>
  );
}
