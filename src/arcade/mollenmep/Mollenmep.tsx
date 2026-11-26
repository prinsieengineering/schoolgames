// 🔨 Mollenmep (soort B): mollen steken hun kop op met een bordje.
// Tik snel op de mol met het juiste antwoord! Ideaal op een tablet.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Vraag } from '../../core/types';
import { B, H, bereidCanvas, canvasPunt, tempo, useSpellus, useToetsen } from '../kern/engine';
import { ploef, ster, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, label } from '../kern/teken';
import { Hud, VraagBalk, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import { isJuist } from '../../spelmotor/antwoord';
import { schud } from '../../core/random';

const SPEELTIJD = 120;
const KOLOMMEN = [B * 0.2, B * 0.5, B * 0.8];
const RIJEN = [215, 365, 515];
/** Gaten 0..8, van links boven naar rechts onder. Toetsen zoals op een numeriek klavier. */
const GATEN = RIJEN.flatMap((y) => KOLOMMEN.map((x) => ({ x, y })));
const TOETS_VOOR_GAT = ['7', '8', '9', '4', '5', '6', '1', '2', '3'];

interface Mol {
  gat: number;
  tekst: string;
  /** 0 = onder de grond, 1 = helemaal boven. */
  hoogte: number;
  fase: 'wacht' | 'omhoog' | 'boven' | 'omlaag';
  timer: number;
  geraakt: null | 'goed' | 'fout';
  weg: boolean;
}

export function Mollenmep({ spel, bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [melding, setMelding] = useState('');
  const [hud, setHud] = useState({ punten: 0, tijd: SPEELTIJD, juist: 0 });

  const blijfBoven = 1.6 + (1 - factor) * 3.2;
  const s = useRef({
    mollen: [] as Mol[],
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
    punten: 0,
    juist: 0,
    t: 0,
    tijd: 0,
    verwerkt: false,
    wissel: -1,
    klaar: false,
  }).current;
  const vraagRef = useRef(vraag);
  vraagRef.current = vraag;

  useEffect(() => {
    const gaten = schud(GATEN.map((_, i) => i));
    s.mollen = vraag.opties.map((o, i) => ({ gat: gaten[i], tekst: o, hoogte: 0, fase: 'wacht', timer: 0.3 + i * 0.45 + Math.random() * 0.5, geraakt: null, weg: false }));
    s.verwerkt = false;
    if (spel.voorlezen) spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vraag]);

  function tik(gat: number) {
    if (s.klaar || s.wissel > 0) return;
    const m = s.mollen.find((x) => x.gat === gat && !x.weg && !x.geraakt && x.hoogte > 0.45);
    if (!m) return;
    const v = vraagRef.current;
    const ok = isJuist(v, m.tekst);
    if (!s.verwerkt) {
      bron.verwerk(v, m.tekst);
      s.verwerkt = true;
    }
    const { x, y } = GATEN[m.gat];
    if (ok) {
      m.geraakt = 'goed';
      const p = 10 + 5 * Math.min(bron.reeks, 4);
      s.punten += p;
      s.juist++;
      geluid.juist();
      if (v.uitspraak) spreek(v.uitspraak.tekst, v.uitspraak.taal);
      ploef(s.deeltjes, x, y - 60, '#ffd23f', 14, '⭐');
      s.zweef.push({ x, y: y - 110, tekst: `+${p}`, leven: 1, kleur: '#ffd23f' });
      for (const o of s.mollen) if (o !== m && o.fase !== 'wacht') o.fase = 'omlaag';
      s.wissel = 0.9;
      setMelding('');
    } else {
      m.geraakt = 'fout';
      m.fase = 'boven';
      m.timer = 0.7;
      geluid.fout();
      s.zweef.push({ x, y: y - 110, tekst: 'Boing!', leven: 0.8, kleur: '#fff' });
      setMelding('Oeps, die mol had het fout. Zoek de juiste!');
    }
  }

  useToetsen((k) => {
    const i = TOETS_VOOR_GAT.indexOf(k);
    if (i >= 0) tik(i);
  });

  function stoppen() {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { mollen: s.juist }, 'De tijd is om!'), 900);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;

    // --- mollen ---
    for (const m of s.mollen) {
      if (m.weg) continue;
      m.timer -= dt;
      if (m.fase === 'wacht' && m.timer <= 0 && s.wissel <= 0) {
        m.fase = 'omhoog';
        // nooit twee mollen in hetzelfde gat: kies een vrij gat
        const bezet = new Set(s.mollen.filter((o) => o !== m && !o.weg && o.fase !== 'wacht').map((o) => o.gat));
        if (bezet.has(m.gat)) m.gat = schud(GATEN.map((_, i) => i)).find((g) => !bezet.has(g)) ?? m.gat;
      } else if (m.fase === 'omhoog') {
        m.hoogte = Math.min(1, m.hoogte + dt * 4);
        if (m.hoogte >= 1) {
          m.fase = 'boven';
          m.timer = m.geraakt ? 0.7 : blijfBoven;
        }
      } else if (m.fase === 'boven' && m.timer <= 0) m.fase = 'omlaag';
      else if (m.fase === 'omlaag') {
        m.hoogte = Math.max(0, m.hoogte - dt * 4);
        if (m.hoogte <= 0) {
          if (m.geraakt) m.weg = true;
          else {
            m.fase = 'wacht';
            m.timer = 0.4 + Math.random() * 1.2;
          }
        }
      }
    }
    if (s.wissel > 0) {
      s.wissel -= dt;
      if (s.wissel <= 0 && !s.klaar) setVraag(bron.volgende());
    }
    updateDeeltjes(s.deeltjes, dt);
    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen();

    // --- tekenen ---
    ctx.fillStyle = '#8fd16a';
    ctx.fillRect(0, 0, B, H);
    ctx.fillStyle = '#7cc45a';
    for (let i = 0; i < 40; i++) {
      const gx = (i * 73) % B;
      const gy = (i * 151) % H;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 18, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (avatarImg.complete) ctx.drawImage(avatarImg, 12, 18, 84, 84);
    tekst(ctx, 'Tik de juiste mol!', B / 2 + 40, 62, 24, '#fff', 'rgba(0,0,0,0.35)');

    GATEN.forEach((g, i) => {
      // gat
      ctx.fillStyle = '#5b3a1e';
      ctx.beginPath();
      ctx.ellipse(g.x, g.y, 62, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#3a2412';
      ctx.beginPath();
      ctx.ellipse(g.x, g.y + 3, 52, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      tekst(ctx, TOETS_VOOR_GAT[i], g.x + 58, g.y + 18, 13, 'rgba(255,255,255,0.7)', '');
    });

    for (const m of s.mollen) {
      if (m.weg || m.hoogte <= 0) continue;
      const g = GATEN[m.gat];
      const top = g.y - m.hoogte * 95;
      ctx.save();
      // alleen boven het gat tekenen
      ctx.beginPath();
      ctx.rect(g.x - 80, g.y - 200, 160, 200);
      ctx.ellipse(g.x, g.y, 62, 22, 0, 0, Math.PI);
      ctx.clip();
      // lijfje
      ctx.fillStyle = m.geraakt === 'fout' ? '#9b7b63' : '#8b5a3c';
      ctx.beginPath();
      ctx.ellipse(g.x, top + 60, 40, 60, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8c4a0';
      ctx.beginPath();
      ctx.ellipse(g.x, top + 52, 24, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      // ogen
      if (m.geraakt === 'fout') {
        tekst(ctx, '😵', g.x, top + 30, 26, '#000', '');
      } else {
        for (const z of [-1, 1]) {
          ctx.fillStyle = '#222';
          ctx.beginPath();
          ctx.arc(g.x + z * 13, top + 30, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(g.x + z * 13 + 1.5, top + 28.5, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.fillStyle = '#ff8fab';
      ctx.beginPath();
      ctx.ellipse(g.x, top + 44, 8, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // bordjes pas na alle mollen tekenen, zodat ze nooit achter een andere mol verdwijnen
    for (const m of s.mollen) {
      if (m.weg || m.hoogte <= 0.4) continue;
      const g = GATEN[m.gat];
      const top = g.y - m.hoogte * 95;
      {
        const by = top - 34;
        const breedte = Math.max(76, Math.min(150, [...m.tekst].length * 14 + 30));
        ctx.fillStyle = '#a0703c';
        ctx.fillRect(g.x - 3, by + 20, 6, 30);
        ctx.fillStyle = m.geraakt === 'goed' ? '#d9f7e6' : m.geraakt === 'fout' ? '#ffe0e7' : '#fffbea';
        ctx.strokeStyle = '#7a5229';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(g.x - breedte / 2, by - 22, breedte, 44, 10);
        ctx.fill();
        ctx.stroke();
        label(ctx, m.tekst, g.x, by, 26, 120, '#2d2a4a', '');
        if (m.geraakt === 'goed') ster(ctx, g.x + breedte / 2, by - 20, 12, '#ffd23f', s.t * 4);
      }
    }
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    if (s.klaar) tekst(ctx, 'Tijd!', B / 2, H / 2, 54, '#ffd23f');

    const nieuw = { punten: s.punten, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), juist: s.juist };
    if (nieuw.punten !== hud.punten || nieuw.tijd !== hud.tijd || nieuw.juist !== hud.juist) setHud(nieuw);
  }, true);

  return (
    <div className="arcade-layout kolom">
      <VraagBalk vraag={vraag} melding={melding} />
      <div className="speelveld-kolom">
        <Hud items={[`🔨 ${hud.juist}`, `🏅 ${hud.punten}`, `⏱️ ${tijdTekst(hud.tijd)}`]} />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              // tik op een zichtbare mol (lijfje of bordje); bij twijfel de dichtstbijzijnde
              const zichtbaar = s.mollen.filter((m) => !m.weg && !m.geraakt && m.hoogte > 0.45);
              const raak = zichtbaar
                .map((m) => {
                  const g = GATEN[m.gat];
                  const top = g.y - m.hoogte * 95;
                  const binnen = Math.abs(p.x - g.x) < 78 && p.y > top - 64 && p.y < g.y + 28;
                  return { m, binnen, afstand: Math.hypot(p.x - g.x, p.y - (top + 10)) };
                })
                .filter((x) => x.binnen)
                .sort((a, b) => a.afstand - b.afstand)[0];
              if (raak) tik(raak.m.gat);
            }}
          />
        </div>
        <p className="klein bediening-hulp">Tik op de mol met het juiste antwoord · pc: cijfers 1-9 zoals op het numeriek klavier</p>
      </div>
    </div>
  );
}
