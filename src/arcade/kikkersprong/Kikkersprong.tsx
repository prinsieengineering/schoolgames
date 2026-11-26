// 🐸 Kikkersprong (soort B): steek de rivier over door telkens op de
// waterlelie met het juiste antwoord te springen.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Vraag } from '../../core/types';
import { B, H, bereidCanvas, canvasPunt, tempo, useSpellus, useToetsen } from '../kern/engine';
import { ploef, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, labelGrootte } from '../kern/teken';
import { Hud, VraagBalk, hartjesTekst, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import { isJuist } from '../../spelmotor/antwoord';
import { schud } from '../../core/random';

const SPEELTIJD = 240;
const RIJEN = 6;
const START_Y = H - 90;
const PAD_Y = H - 330;
const STAP = START_Y - PAD_Y;

interface Pad {
  basisX: number;
  tekst: string;
  fase: number;
  zinkt: number;
  weg: boolean;
}

type Fase = 'kiezen' | 'springen' | 'schuiven' | 'zinken';

export function Kikkersprong({ spel, bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [melding, setMelding] = useState('');
  const [hud, setHud] = useState({ hartjes: 3, punten: 0, rij: 0, tijd: SPEELTIJD, overkant: 0 });

  const s = useRef({
    fase: 'kiezen' as Fase,
    animT: 0,
    pads: [] as Pad[],
    selectie: 0,
    doel: -1,
    van: { x: B / 2, y: START_Y },
    kikker: { x: B / 2, y: START_Y },
    scroll: 0,
    rij: 0,
    overkant: 0,
    hartjes: 3,
    punten: 0,
    verwerkt: false,
    t: 0,
    tijd: 0,
    klaar: false,
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
  }).current;
  const vraagRef = useRef(vraag);
  vraagRef.current = vraag;

  useEffect(() => {
    const n = vraag.opties.length;
    const breedte = (B - 30) / n;
    const tekst = schud(vraag.opties);
    s.pads = tekst.map((t, i) => ({ basisX: 15 + breedte * (i + 0.5), tekst: t, fase: Math.random() * 6, zinkt: 0, weg: false }));
    s.selectie = Math.floor(n / 2);
    s.verwerkt = false;
    if (spel.voorlezen) spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vraag]);

  const padX = (p: Pad) => p.basisX + Math.sin(s.t * 0.9 + p.fase) * 10 * factor;

  function spring(i: number) {
    if (s.fase !== 'kiezen' || s.klaar || !s.pads[i] || s.pads[i].weg) return;
    s.doel = i;
    s.fase = 'springen';
    s.animT = 0;
    s.van = { ...s.kikker };
    geluid.klik();
  }

  function volgendePad(richting: number) {
    if (s.fase !== 'kiezen') return;
    const n = s.pads.length;
    for (let k = 1; k <= n; k++) {
      const i = (s.selectie + richting * k + n * 2) % n;
      if (!s.pads[i].weg) {
        s.selectie = i;
        return;
      }
    }
  }

  useToetsen((k) => {
    if (k === 'ArrowLeft' || k === 'a') volgendePad(-1);
    if (k === 'ArrowRight' || k === 'd') volgendePad(1);
    if (k === 'ArrowUp' || k === ' ' || k === 'w') spring(s.selectie);
  });

  function stoppen(reden: string) {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { overkant: s.overkant }, reden), 900);
  }

  function geland() {
    const pad = s.pads[s.doel];
    const v = vraagRef.current;
    const ok = isJuist(v, pad.tekst);
    if (!s.verwerkt) {
      bron.verwerk(v, pad.tekst);
      s.verwerkt = true;
    }
    if (ok) {
      geluid.juist();
      if (v.uitspraak) spreek(v.uitspraak.tekst, v.uitspraak.taal);
      const p = 10 + 5 * Math.min(bron.reeks, 4);
      s.punten += p;
      s.zweef.push({ x: s.kikker.x, y: s.kikker.y - 40, tekst: `+${p}`, leven: 1, kleur: '#ffd23f' });
      s.fase = 'schuiven';
      s.animT = 0;
      setMelding('');
    } else {
      geluid.fout();
      pad.zinkt = 0.01;
      ploef(s.deeltjes, s.kikker.x, s.kikker.y, '#bfe8ff', 14);
      s.fase = 'zinken';
      s.animT = 0;
      s.hartjes--;
      setMelding('Plons! Dat was niet juist. Kies een andere waterlelie.');
      if (s.hartjes <= 0) stoppen('Oei, drie keer in het water!');
    }
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;
    s.animT += dt;

    if (s.fase === 'springen') {
      const pad = s.pads[s.doel];
      const f = Math.min(1, s.animT / 0.45);
      const doelX = padX(pad);
      s.kikker.x = s.van.x + (doelX - s.van.x) * f;
      s.kikker.y = s.van.y + (PAD_Y - s.van.y) * f - Math.sin(f * Math.PI) * 70;
      if (f >= 1) geland();
    } else if (s.fase === 'schuiven') {
      const f = Math.min(1, s.animT / 0.6);
      s.scroll = STAP * f;
      s.kikker.y = PAD_Y + s.scroll;
      s.kikker.x += (B / 2 - s.kikker.x) * Math.min(1, dt * 4);
      if (f >= 1) {
        s.scroll = 0;
        s.kikker = { x: s.kikker.x, y: START_Y };
        s.rij++;
        if (s.rij >= RIJEN) {
          s.rij = 0;
          s.overkant++;
          s.punten += 50;
          geluid.fanfare();
          s.zweef.push({ x: B / 2, y: H / 2, tekst: 'Overkant! +50', leven: 2, kleur: '#ffd23f' });
        }
        s.fase = 'kiezen';
        if (!s.klaar) setVraag(bron.volgende());
      }
    } else if (s.fase === 'zinken') {
      const pad = s.pads[s.doel];
      pad.zinkt = Math.min(1, s.animT / 0.6);
      s.kikker.y = PAD_Y + s.animT * 60;
      if (s.animT >= 0.9) {
        pad.weg = true;
        s.kikker = { x: B / 2, y: START_Y };
        s.fase = 'kiezen';
        if (s.pads[s.selectie]?.weg) volgendePad(1);
      }
    } else {
      s.kikker.x += (B / 2 - s.kikker.x) * Math.min(1, dt * 5);
    }
    updateDeeltjes(s.deeltjes, dt);
    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen('De tijd is om!');

    // ---- tekenen ----
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#2a9fd6');
    g.addColorStop(1, '#5cc8f0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, B, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 14; i++) {
      const y = ((i * 50 + s.scroll) % (H + 50)) - 20;
      const x = (i * 83 + s.t * 20) % (B + 60) - 30;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 15, y - 6, x + 30, y);
      ctx.stroke();
    }
    // overkant in zicht bij de laatste rij
    if (s.rij === RIJEN - 1) {
      ctx.fillStyle = '#7ccf6a';
      ctx.fillRect(0, s.scroll - 40, B, PAD_Y - 110);
      tekst(ctx, '🏁 De overkant!', B / 2, s.scroll + 40, 26);
    }
    // oever onderaan
    ctx.fillStyle = '#7ccf6a';
    ctx.fillRect(0, START_Y + 30 + s.scroll, B, 200);
    // decoratieve lelies van eerdere rijen
    ctx.fillStyle = 'rgba(70,160,80,0.6)';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.ellipse(80 + i * 160, PAD_Y + STAP * 0.5 + s.scroll, 26, 14, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // waterlelies van de huidige rij
    s.pads.forEach((p, i) => {
      if (p.weg) return;
      const x = padX(p);
      const y = PAD_Y + s.scroll + p.zinkt * 30;
      ctx.save();
      ctx.globalAlpha = 1 - p.zinkt;
      if (i === s.selectie && s.fase === 'kiezen') {
        ctx.strokeStyle = '#ffd23f';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(x, y, 55, 34, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.fillStyle = '#3fae49';
      ctx.beginPath();
      ctx.ellipse(x, y, 50, 30, 0, 0.25, Math.PI * 2 - 0.25);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#5cc96e';
      ctx.beginPath();
      ctx.ellipse(x, y - 3, 41, 22, 0, 0.3, Math.PI * 2 - 0.3);
      ctx.lineTo(x, y - 3);
      ctx.closePath();
      ctx.fill();
      const grootte = labelGrootte(p.tekst, 28, 130);
      tekst(ctx, p.tekst, x, y - 2, grootte);
      ctx.restore();
    });
    // kikker (= de avatar)
    if (avatarImg.complete) ctx.drawImage(avatarImg, s.kikker.x - 36, s.kikker.y - 64, 72, 72);
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    // voortgang
    for (let i = 0; i < RIJEN; i++) {
      ctx.fillStyle = i < s.rij ? '#ffd23f' : 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.arc(B - 20, H - 30 - i * 22, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    if (s.klaar) tekst(ctx, s.hartjes <= 0 ? 'Plons!' : 'Tijd!', B / 2, H / 2, 54, '#ffd23f');

    const nieuw = { hartjes: s.hartjes, punten: s.punten, rij: s.rij, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), overkant: s.overkant };
    if (Object.entries(nieuw).some(([key, v]) => hud[key as keyof typeof hud] !== v)) setHud(nieuw);
  }, true);

  return (
    <div className="arcade-layout kolom">
      <VraagBalk vraag={vraag} melding={melding} />
      <div className="speelveld-kolom">
        <Hud items={[hartjesTekst(hud.hartjes), `🏁 ${hud.overkant}`, `🏅 ${hud.punten}`, `⏱️ ${tijdTekst(hud.tijd)}`]} />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              const i = s.pads.findIndex((pad) => !pad.weg && Math.abs(padX(pad) - p.x) < 60 && Math.abs(PAD_Y - p.y) < 50);
              if (i >= 0) spring(i);
            }}
          />
        </div>
        <div className="bediening">
          <button className="aanraakknop" onClick={() => volgendePad(-1)}>
            ◀
          </button>
          <button className="aanraakknop schiet" onClick={() => spring(s.selectie)}>
            🐸 Spring
          </button>
          <button className="aanraakknop" onClick={() => volgendePad(1)}>
            ▶
          </button>
        </div>
        <p className="klein bediening-hulp">Tik op een waterlelie, of: ← → kiezen en ↑ / spatie om te springen</p>
      </div>
    </div>
  );
}
