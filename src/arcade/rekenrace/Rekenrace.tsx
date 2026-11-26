// 🏎️ Rekenrace (soort B): je kart rijdt op 3 rijstroken. Er komt een poort aan
// met een antwoord per rijstrook: stuur naar het juiste antwoord voor een turbo!

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Vraag } from '../../core/types';
import { B, H, bereidCanvas, canvasPunt, klem, tempo, useSpellus, useToetsen } from '../kern/engine';
import { ploef, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, labelGrootte } from '../kern/teken';
import { Hud, VraagBalk, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import { isJuist } from '../../spelmotor/antwoord';
import { schud } from '../../core/random';

const SPEELTIJD = 120;
const WEG_L = 60;
const WEG_R = B - 60;
const STROOK = (WEG_R - WEG_L) / 3;
const strookX = (i: number) => WEG_L + STROOK * (i + 0.5);
const KART_Y = H - 120;

interface Poort {
  y: number;
  labels: (string | null)[];
  klaar: boolean;
}

export function Rekenrace({ spel, bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [melding, setMelding] = useState('');
  const [hud, setHud] = useState({ punten: 0, tijd: SPEELTIJD, km: 0, juist: 0 });

  const s = useRef({
    strook: 1,
    x: strookX(1),
    poort: null as Poort | null,
    wachtOpPoort: 0.8,
    snelheid: 150,
    turbo: 0,
    traag: 0,
    afstand: 0,
    scroll: 0,
    punten: 0,
    juist: 0,
    tijd: 0,
    t: 0,
    tol: 0,
    klaar: false,
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
  }).current;
  const vraagRef = useRef(vraag);
  vraagRef.current = vraag;

  useEffect(() => {
    s.poort = null;
    s.wachtOpPoort = 0.9;
    if (spel.voorlezen) spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vraag]);

  function maakPoort(v: Vraag): Poort {
    const fout = schud(v.opties.filter((o) => o !== v.antwoord)).slice(0, 2);
    const labels: (string | null)[] = schud([v.antwoord, ...fout]);
    while (labels.length < 3) labels.splice(Math.floor(Math.random() * (labels.length + 1)), 0, null);
    return { y: -70, labels, klaar: false };
  }

  function stuur(r: number) {
    if (s.klaar) return;
    const nieuw = klem(s.strook + r, 0, 2);
    if (nieuw !== s.strook) {
      s.strook = nieuw;
      geluid.klik();
    }
  }

  useToetsen((k) => {
    if (k === 'ArrowLeft' || k === 'a') stuur(-1);
    if (k === 'ArrowRight' || k === 'd') stuur(1);
  });

  function stoppen() {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { race: s.juist }, 'Finish! 🏁'), 1000);
  }

  function doorPoort(p: Poort) {
    p.klaar = true;
    const v = vraagRef.current;
    const label = p.labels[s.strook];
    const ok = label !== null && isJuist(v, label);
    bron.verwerk(v, label ?? '');
    if (ok) {
      const pnt = 10 + 5 * Math.min(bron.reeks, 4);
      s.punten += pnt;
      s.juist++;
      s.turbo = 2;
      geluid.juist();
      if (v.uitspraak) spreek(v.uitspraak.tekst, v.uitspraak.taal);
      ploef(s.deeltjes, s.x, KART_Y - 30, '#ffd23f', 14, '⚡');
      s.zweef.push({ x: s.x, y: KART_Y - 80, tekst: `TURBO +${pnt}`, leven: 1.1, kleur: '#ffd23f' });
      setMelding('');
    } else {
      s.traag = 1.5;
      s.tol = 1;
      geluid.fout();
      s.zweef.push({ x: s.x, y: KART_Y - 80, tekst: 'Oeps!', leven: 1, kleur: '#ef476f' });
      setMelding(`Het juiste antwoord was: ${v.antwoord}`);
    }
    setTimeout(
      () => {
        if (s.klaar) return;
        setMelding('');
        setVraag(bron.volgende());
      },
      ok ? 700 : 1800,
    );
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;
    s.turbo = Math.max(0, s.turbo - dt);
    s.traag = Math.max(0, s.traag - dt);
    s.tol = Math.max(0, s.tol - dt);

    const basis = (130 + Math.min(120, s.juist * 6)) * (0.6 + factor * 0.5);
    const doel = s.klaar ? 0 : basis * (s.turbo > 0 ? 1.7 : 1) * (s.traag > 0 ? 0.5 : 1);
    s.snelheid += (doel - s.snelheid) * Math.min(1, dt * 3);
    s.scroll = (s.scroll + s.snelheid * dt) % 80;
    s.afstand += s.snelheid * dt;
    s.x += (strookX(s.strook) - s.x) * Math.min(1, dt * 10);

    // poorten
    if (!s.poort && !s.klaar) {
      s.wachtOpPoort -= dt;
      if (s.wachtOpPoort <= 0) s.poort = maakPoort(vraagRef.current);
    }
    if (s.poort) {
      // poorten komen trager naar je toe dan de weg, zodat je tijd hebt om te lezen
      s.poort.y += s.snelheid * 0.7 * dt;
      if (!s.poort.klaar && s.poort.y >= KART_Y - 40) doorPoort(s.poort);
      if (s.poort.y > H + 60) s.poort = null;
    }
    updateDeeltjes(s.deeltjes, dt);
    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen();

    // ---- tekenen ----
    ctx.fillStyle = '#6cc35a';
    ctx.fillRect(0, 0, B, H);
    // bomen langs de weg
    for (let i = 0; i < 8; i++) {
      const y = ((i * 110 + s.afstand * 0.9) % (H + 110)) - 60;
      tekst(ctx, i % 3 === 0 ? '🌳' : i % 3 === 1 ? '🌲' : '🌼', 28, y, 34, '#000', '');
      tekst(ctx, i % 3 === 0 ? '🌲' : i % 3 === 1 ? '🌼' : '🌳', B - 28, y + 55, 34, '#000', '');
    }
    ctx.fillStyle = '#5a5f6b';
    ctx.fillRect(WEG_L, 0, WEG_R - WEG_L, H);
    ctx.fillStyle = '#fff';
    ctx.fillRect(WEG_L, 0, 5, H);
    ctx.fillRect(WEG_R - 5, 0, 5, H);
    for (let l = 1; l < 3; l++) {
      for (let y = -80 + s.scroll; y < H; y += 80) ctx.fillRect(WEG_L + STROOK * l - 3, y, 6, 40);
    }
    // poort
    if (s.poort) {
      const p = s.poort;
      ctx.fillStyle = '#ef476f';
      ctx.fillRect(WEG_L - 10, p.y - 44, 10, 70);
      ctx.fillRect(WEG_R, p.y - 44, 10, 70);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(WEG_L, p.y - 40, WEG_R - WEG_L, 60);
      p.labels.forEach((lab, i) => {
        const x = strookX(i);
        ctx.fillStyle = lab === null ? 'rgba(255,255,255,0.4)' : p.klaar && isJuist(vraagRef.current, lab) ? '#d9f7e6' : '#fffbea';
        ctx.strokeStyle = '#2d2a4a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(x - STROOK / 2 + 8, p.y - 34, STROOK - 16, 48, 10);
        ctx.fill();
        ctx.stroke();
        if (lab !== null) {
          const grootte = labelGrootte(lab, 26, 110);
          tekst(ctx, lab, x, p.y - 10, grootte, '#2d2a4a', '');
        }
      });
    }
    // kart met avatar
    ctx.save();
    ctx.translate(s.x, KART_Y);
    ctx.rotate(s.tol > 0 ? Math.sin(s.tol * 20) * 0.4 : 0);
    if (s.turbo > 0) {
      ctx.fillStyle = `rgba(255,${150 + Math.random() * 100},0,0.8)`;
      ctx.beginPath();
      ctx.moveTo(-14, 34);
      ctx.lineTo(0, 34 + 20 + Math.random() * 20);
      ctx.lineTo(14, 34);
      ctx.fill();
    }
    ctx.fillStyle = '#222';
    for (const [wx, wy] of [[-30, -14], [30, -14], [-30, 24], [30, 24]]) ctx.fillRect(wx - 7, wy - 10, 14, 20);
    ctx.fillStyle = '#ef476f';
    ctx.beginPath();
    ctx.roundRect(-28, -30, 56, 66, 14);
    ctx.fill();
    if (avatarImg.complete) ctx.drawImage(avatarImg, -34, -62, 68, 68);
    ctx.fillStyle = '#c9184a';
    ctx.beginPath();
    ctx.roundRect(-30, 4, 60, 24, 8);
    ctx.fill();
    ctx.restore();
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    if (s.klaar) tekst(ctx, 'Finish! 🏁', B / 2, H / 2, 50, '#ffd23f');

    const nieuw = { punten: s.punten, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), km: Math.floor(s.afstand / 1000), juist: s.juist };
    if (Object.entries(nieuw).some(([key, v]) => hud[key as keyof typeof hud] !== v)) setHud(nieuw);
  }, true);

  return (
    <div className="arcade-layout kolom">
      <VraagBalk vraag={vraag} melding={melding} />
      <div className="speelveld-kolom">
        <Hud items={[`🏁 ${hud.juist}`, `🏅 ${hud.punten}`, `🛣️ ${hud.km} km`, `⏱️ ${tijdTekst(hud.tijd)}`]} />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              const strook = klem(Math.floor((p.x - WEG_L) / STROOK), 0, 2);
              stuur(strook - s.strook);
            }}
          />
        </div>
        <div className="bediening">
          <button className="aanraakknop breed" onPointerDown={(e) => { e.preventDefault(); stuur(-1); }}>
            ◀ Links
          </button>
          <button className="aanraakknop breed" onPointerDown={(e) => { e.preventDefault(); stuur(1); }}>
            Rechts ▶
          </button>
        </div>
        <p className="klein bediening-hulp">Tik op een rijstrook of gebruik ← → om te sturen</p>
      </div>
    </div>
  );
}
