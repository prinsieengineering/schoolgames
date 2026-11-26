// 🎈 Ballonnen prikken (soort B): de antwoorden zweven omhoog op ballonnen.
// Prik de ballon met het juiste antwoord!

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Vraag } from '../../core/types';
import { B, H, bereidCanvas, canvasPunt, klem, tempo, useSpellus, useToetsen } from '../kern/engine';
import { lucht, ploef, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, labelGrootte } from '../kern/teken';
import { Hud, HoudKnop, VraagBalk, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import { isJuist } from '../../spelmotor/antwoord';
import { schud } from '../../core/random';

const SPEELTIJD = 150;
const BODEM = H - 60;
const KLEUREN = ['#ef476f', '#4d96ff', '#ffd23f', '#06d6a0', '#9b5de5', '#ff8c42'];

interface Ballon {
  x: number;
  y: number;
  vy: number;
  tekst: string;
  kleur: string;
  fase: number;
  weg: boolean;
}

export function Ballonnen({ spel, bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [melding, setMelding] = useState('');
  const [hud, setHud] = useState({ punten: 0, tijd: SPEELTIJD, juist: 0 });
  const [pauze, setPauze] = useState(false);

  const s = useRef({
    x: B / 2,
    doelX: null as number | null,
    schietBijDoel: false,
    ballonnen: [] as Ballon[],
    pijlen: [] as { x: number; y: number }[],
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
    punten: 0,
    juisteBallonnen: 0,
    tijd: 0,
    t: 0,
    verwerkt: false,
    wissel: -1,
    cooldown: 0,
    klaar: false,
  }).current;
  const vraagRef = useRef(vraag);
  vraagRef.current = vraag;

  function laatOpstijgen(v: Vraag) {
    const n = v.opties.length;
    const breedte = (B - 40) / n;
    const posities = schud(Array.from({ length: n }, (_, i) => 20 + breedte * (i + 0.5)));
    s.ballonnen = v.opties.map((o, i) => ({
      x: posities[i],
      y: BODEM - 80 + i * 45,
      vy: (38 + Math.random() * 14) * factor,
      tekst: o,
      kleur: KLEUREN[(i + s.juisteBallonnen) % KLEUREN.length],
      fase: Math.random() * 6,
      weg: false,
    }));
  }

  useEffect(() => {
    laatOpstijgen(vraag);
    s.verwerkt = false;
    if (spel.voorlezen) spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vraag]);

  function schiet() {
    if (s.klaar || pauze || s.cooldown > 0) return;
    s.cooldown = 0.3;
    s.pijlen.push({ x: s.x, y: BODEM - 40 });
    geluid.schiet();
  }

  const toetsen = useToetsen((k) => {
    if (k === ' ' || k === 'ArrowUp') schiet();
    if (k === 'p' || k === 'Escape') setPauze((p) => !p);
  });

  function geraakt(b: Ballon) {
    const v = vraagRef.current;
    b.weg = true;
    ploef(s.deeltjes, b.x, b.y, b.kleur, 14);
    if (isJuist(v, b.tekst)) {
      if (!s.verwerkt) bron.verwerk(v, b.tekst);
      s.verwerkt = true;
      const bonus = 10 + 5 * Math.min(bron.reeks, 4);
      s.punten += bonus;
      s.juisteBallonnen++;
      geluid.juist();
      if (v.uitspraak) spreek(v.uitspraak.tekst, v.uitspraak.taal);
      s.zweef.push({ x: b.x, y: b.y, tekst: `+${bonus}`, leven: 1, kleur: '#ffd23f' });
      for (const o of s.ballonnen) if (!o.weg) o.vy = 400;
      setMelding('');
      s.wissel = 0.8;
    } else {
      geluid.fout();
      if (!s.verwerkt) {
        bron.verwerk(v, b.tekst);
        s.verwerkt = true;
      }
      setMelding('Oeps, dat was niet juist. Probeer nog eens!');
    }
  }

  function stoppen() {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { ballonnen: s.juisteBallonnen }, 'De tijd is om!'), 900);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;
    s.cooldown -= dt;

    // bewegen
    const k = toetsen.current;
    let dx = 0;
    if (k.has('ArrowLeft') || k.has('a')) dx -= 1;
    if (k.has('ArrowRight') || k.has('d')) dx += 1;
    if (dx) {
      s.doelX = null;
      s.schietBijDoel = false;
    }
    if (s.doelX !== null) {
      const d = s.doelX - s.x;
      s.x += klem(d, -420 * dt, 420 * dt);
      if (Math.abs(d) < 4 && s.schietBijDoel) {
        s.schietBijDoel = false;
        schiet();
      }
    } else s.x += dx * 320 * dt;
    s.x = klem(s.x, 30, B - 30);

    // ballonnen
    for (const b of s.ballonnen) {
      if (b.weg) continue;
      b.y -= b.vy * dt;
      b.x += Math.sin(s.t * 1.6 + b.fase) * 12 * dt;
    }
    const zichtbaar = s.ballonnen.filter((b) => !b.weg && b.y > -60);
    if (s.wissel > 0) {
      s.wissel -= dt;
      if (s.wissel <= 0 && !s.klaar) setVraag(bron.volgende());
    } else if (zichtbaar.length === 0 && !s.klaar) {
      s.zweef.push({ x: B / 2, y: H / 2, tekst: 'Nog eens!', leven: 1.2, kleur: '#fff' });
      laatOpstijgen(vraagRef.current);
    }

    // pijlen
    for (let i = s.pijlen.length - 1; i >= 0; i--) {
      const p = s.pijlen[i];
      p.y -= 640 * dt;
      let raak = false;
      for (const b of s.ballonnen) {
        if (b.weg || s.wissel > 0) continue;
        if (Math.abs(p.x - b.x) < 40 && Math.abs(p.y - b.y) < 44) {
          raak = true;
          geraakt(b);
          break;
        }
      }
      if (raak || p.y < -20) s.pijlen.splice(i, 1);
    }
    updateDeeltjes(s.deeltjes, dt);
    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen();

    // tekenen
    lucht(ctx, '#8ad7ff', '#e9f8ff');
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 150 + s.t * 12) % (B + 160)) - 80;
      const cy = 80 + i * 110;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI * 2);
      ctx.arc(cx + 28, cy - 10, 30, 0, Math.PI * 2);
      ctx.arc(cx + 58, cy, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#7ccf6a';
    ctx.fillRect(0, BODEM + 20, B, H - BODEM);
    for (const b of s.ballonnen) {
      if (b.weg) continue;
      // touwtje
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + 42);
      ctx.quadraticCurveTo(b.x + Math.sin(s.t * 3 + b.fase) * 8, b.y + 62, b.x, b.y + 82);
      ctx.stroke();
      ctx.fillStyle = b.kleur;
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, 44, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(b.x - 6, b.y + 44);
      ctx.lineTo(b.x + 6, b.y + 44);
      ctx.lineTo(b.x, b.y + 36);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.ellipse(b.x - 16, b.y - 16, 9, 13, -0.5, 0, Math.PI * 2);
      ctx.fill();
      const grootte = labelGrootte(b.tekst, 30, 150);
      tekst(ctx, b.tekst, b.x, b.y + 2, grootte, '#fff', 'rgba(0,0,0,0.5)');
    }
    for (const p of s.pijlen) {
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 22);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      ctx.fillStyle = '#ef476f';
      ctx.beginPath();
      ctx.moveTo(p.x - 6, p.y + 4);
      ctx.lineTo(p.x, p.y - 8);
      ctx.lineTo(p.x + 6, p.y + 4);
      ctx.fill();
    }
    if (avatarImg.complete) ctx.drawImage(avatarImg, s.x - 36, BODEM - 50, 72, 72);
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    if (s.klaar) tekst(ctx, 'Tijd!', B / 2, H / 2, 54, '#ffd23f');

    const nieuw = { punten: s.punten, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), juist: s.juisteBallonnen };
    if (nieuw.punten !== hud.punten || nieuw.tijd !== hud.tijd || nieuw.juist !== hud.juist) setHud(nieuw);
  }, !pauze);

  return (
    <div className="arcade-layout kolom">
      <VraagBalk vraag={vraag} melding={melding} />
      <div className="speelveld-kolom">
        <Hud items={[`🎈 ${hud.juist}`, `🏅 ${hud.punten}`, `⏱️ ${tijdTekst(hud.tijd)}`]} />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              // kindvriendelijk: tikken in de "kolom" van een ballon is genoeg
              const kandidaten = s.ballonnen.filter((x) => !x.weg && x.y > -40 && Math.abs(x.x - p.x) < 50);
              const b = kandidaten.sort((a, c) => Math.abs(a.x - p.x) - Math.abs(c.x - p.x))[0];
              s.doelX = b ? b.x : p.x;
              s.schietBijDoel = !!b;
              if (!b && Math.abs(p.x - s.x) < 10) schiet();
            }}
          />
          {pauze && (
            <div className="pauze-laag">
              <h2>Pauze</h2>
              <button className="knop groot" onClick={() => setPauze(false)}>
                ▶ Verder spelen
              </button>
              <button className="knop grijs" onClick={stoppen}>
                Stoppen
              </button>
            </div>
          )}
        </div>
        <div className="bediening">
          <HoudKnop toets="ArrowLeft" ingedrukt={toetsen}>
            ◀
          </HoudKnop>
          <button className="aanraakknop" onClick={() => setPauze(true)}>
            ⏸
          </button>
          <button className="aanraakknop schiet" onPointerDown={(e) => { e.preventDefault(); schiet(); }}>
            🎯 Prik
          </button>
          <HoudKnop toets="ArrowRight" ingedrukt={toetsen}>
            ▶
          </HoudKnop>
        </div>
        <p className="klein bediening-hulp">Tik op een ballon, of: ← → bewegen en spatie om te prikken</p>
      </div>
    </div>
  );
}
