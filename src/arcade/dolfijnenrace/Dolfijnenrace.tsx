// 🐬 Dolfijnenrace (soort B): je bent een dolfijn en zwemt een race tegen een
// zeemeermin. Er komen poorten van bellen aan met een antwoord in elke baan:
// zwem door het juiste antwoord voor een turbo. Geen klok: de race duurt tot
// de finish, en de zeemeermin wacht op je als je achterop raakt.

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Vraag } from '../../core/types';
import { B, H, bereidCanvas, canvasPunt, klem, tempo, useSpellus, useToetsen } from '../kern/engine';
import { ploef, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, label } from '../kern/teken';
import { Hud, VraagBalk, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import { isJuist } from '../../spelmotor/antwoord';
import { schud } from '../../core/random';
import { DIEPTE, ZONES, dolfijn, finish, mengKleur, schip, zeemeermin, zoneVan } from './tekenen';

const DOLFIJN_X = 120;
const BAAN_Y = [228, 370, 512];
const MEERMIN_Y = 132;
/** Lengte van de race in pixels (voor het decor). */
const BAAN_PX = 14000;
/** Ongeveer zoveel poorten als je niets juist hebt; met alles juist zijn het er ongeveer 15. */
const POORTEN_ZONDER_TURBO = 22;

interface Poort {
  x: number;
  labels: (string | null)[];
  klaar: boolean;
  /** Baan waar de dolfijn door zwom (na het passeren). */
  gekozen?: number;
}

export function Dolfijnenrace({ spel, bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [melding, setMelding] = useState('');
  const [hud, setHud] = useState({ juist: 0, punten: 0, zone: 0, stand: 'naast' as 'voor' | 'achter' | 'naast' });

  // Tijd om een poort te lezen (in seconden): jonge kinderen krijgen meer tijd.
  const leestijd = 4.2 / (0.6 + factor * 0.5);
  const cyclus = 0.9 + leestijd + 0.4;
  const basis = 1 / (POORTEN_ZONDER_TURBO * cyclus);
  const TURBO_TIJD = 2;
  // Een juist antwoord is ongeveer een halve poort extra vooruit.
  const turboMaal = 1 + (0.45 * cyclus) / TURBO_TIJD;

  const s = useRef({
    baan: 1,
    y: BAAN_Y[1],
    vy: 0,
    poort: null as Poort | null,
    wachtOpPoort: 1.2,
    extraLeestijd: 0,
    afstand: 0,
    meermin: 0.02,
    meerminWacht: false,
    meerminWachtteAanFinish: false,
    turbo: 0,
    traag: 0,
    punten: 0,
    juist: 0,
    t: 0,
    zone: 0,
    banner: { tekst: `${ZONES[0].icoon} ${ZONES[0].naam}`, leven: 2.5 },
    klaar: false,
    eindX: 0,
    bellen: Array.from({ length: 18 }, (_, i) => ({ x: (i * 137) % B, y: (i * 251) % H, r: 2 + (i % 4), v: 20 + (i % 5) * 8 })),
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
    return { x: B + 60, labels, klaar: false };
  }

  function zwem(r: number) {
    if (s.klaar) return;
    const nieuw = klem(s.baan + r, 0, 2);
    if (nieuw !== s.baan) {
      s.baan = nieuw;
      geluid.klik();
    }
  }
  const naarBaan = (b: number) => zwem(b - s.baan);

  useToetsen((k) => {
    if (k === 'ArrowUp' || k === 'w') zwem(-1);
    if (k === 'ArrowDown' || k === 's') zwem(1);
    if (k === '1' || k === '2' || k === '3') naarBaan(Number(k) - 1);
  });

  function doorPoort(p: Poort) {
    p.klaar = true;
    p.gekozen = s.baan;
    const v = vraagRef.current;
    const label = p.labels[s.baan];
    const ok = label !== null && isJuist(v, label);
    bron.verwerk(v, label ?? '');
    if (ok) {
      const pnt = 10 + 5 * Math.min(bron.reeks, 4);
      s.punten += pnt;
      s.juist++;
      s.turbo = TURBO_TIJD;
      s.extraLeestijd = Math.max(0, s.extraLeestijd - 0.2);
      geluid.juist();
      if (v.uitspraak) spreek(v.uitspraak.tekst, v.uitspraak.taal);
      ploef(s.deeltjes, DOLFIJN_X + 30, s.y, '#bff4ff', 14, '💨');
      s.zweef.push({ x: DOLFIJN_X + 40, y: s.y - 50, tekst: `TURBO +${pnt}`, leven: 1.1, kleur: '#ffd23f' });
      setMelding('');
    } else {
      // Geen straf: even wat trager, en de volgende poorten komen iets trager aan.
      s.traag = 1.5;
      s.extraLeestijd = Math.min(2, s.extraLeestijd + 0.6);
      geluid.fout();
      s.zweef.push({ x: DOLFIJN_X + 40, y: s.y - 50, tekst: 'Bijna!', leven: 1, kleur: '#ffffff' });
      setMelding(`Het juiste antwoord was: ${v.antwoord}`);
    }
    setTimeout(
      () => {
        if (s.klaar) return;
        setMelding('');
        setVraag(bron.volgende());
      },
      ok ? 700 : 1900,
    );
  }

  function finishBereikt() {
    s.klaar = true;
    s.poort = null;
    const echt = !s.meerminWachtteAanFinish && s.meermin < 1;
    s.punten += echt ? 30 : 15;
    geluid.juist();
    ploef(s.deeltjes, B / 2, H / 2, '#ffd23f', 24, '🏆');
    const reden = echt ? 'Je wint de race! 🏆' : 'Samen over de finish! 🤝';
    s.banner = { tekst: reden, leven: 99 };
    setTimeout(() => onEinde(s.punten, { dolfijn: s.juist, dolfijnwinst: echt ? 1 : 0 }, reden), 1800);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    s.turbo = Math.max(0, s.turbo - dt);
    s.traag = Math.max(0, s.traag - dt);

    // ---- race ----
    if (!s.klaar) {
      const snel = basis * (s.turbo > 0 ? turboMaal : 1) * (s.traag > 0 ? 0.6 : 1);
      s.afstand = Math.min(1, s.afstand + snel * dt);
      // De zeemeermin zwemt iets sneller dan "niets juist", maar wacht als ze te ver voor is.
      const voorsprong = s.meermin - s.afstand;
      let zm = basis * 1.3;
      if (voorsprong > 0.1) zm *= 0.2;
      else if (voorsprong > 0.06) zm *= 0.6;
      else if (voorsprong < -0.12) zm *= 1.6;
      s.meerminWacht = voorsprong > 0.1;
      s.meermin += zm * dt;
      // Aan de finish wacht ze op de dolfijn.
      if (s.meermin >= 0.985 && s.afstand < 0.985) {
        s.meermin = 0.985;
        s.meerminWachtteAanFinish = true;
        s.meerminWacht = true;
      }
      if (s.afstand >= 1) finishBereikt();
    } else {
      s.eindX += 220 * dt;
      s.meermin += basis * 1.3 * dt;
    }

    const zone = zoneVan(s.afstand);
    if (zone !== s.zone) {
      s.zone = zone;
      s.banner = { tekst: `${ZONES[zone].icoon} ${ZONES[zone].naam}`, leven: 2.5 };
    }
    s.banner.leven -= dt;

    // ---- dolfijn ----
    const doelY = BAAN_Y[s.baan];
    const vorigeY = s.y;
    s.y += (doelY - s.y) * Math.min(1, dt * 8);
    s.vy = (s.y - vorigeY) / Math.max(dt, 0.001);

    // ---- poorten ----
    if (!s.poort && !s.klaar) {
      s.wachtOpPoort -= dt;
      if (s.wachtOpPoort <= 0) s.poort = maakPoort(vraagRef.current);
    }
    if (s.poort) {
      s.poort.x -= ((B + 60 - DOLFIJN_X) / (leestijd + s.extraLeestijd)) * dt;
      if (!s.poort.klaar && s.poort.x <= DOLFIJN_X + 8) doorPoort(s.poort);
      if (s.poort.x < -80) s.poort = null;
    }
    updateDeeltjes(s.deeltjes, dt);

    // ---- tekenen ----
    const scroll = s.afstand * BAAN_PX + s.eindX;
    const kleur = mengKleur(s.afstand);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, kleur.boven);
    g.addColorStop(1, kleur.onder);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, B, H);

    // zonnestralen (verdwijnen in de diepte)
    const licht = Math.max(0, 1 - s.afstand * 1.6);
    if (licht > 0) {
      ctx.save();
      ctx.globalAlpha = 0.12 * licht;
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 5; i++) {
        const x = ((i * 130 - scroll * 0.1) % (B + 200) + B + 200) % (B + 200) - 100;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 50, 0);
        ctx.lineTo(x + 140, H);
        ctx.lineTo(x + 70, H);
        ctx.fill();
      }
      ctx.restore();
    }

    // verre laag: silhouetten (parallax)
    DIEPTE.verre(ctx, scroll * 0.35, s.t, BAAN_PX);
    // gezonken schip ligt op de bodem in het derde stuk
    for (const wx of [0.57, 0.68]) schip(ctx, wx * BAAN_PX - scroll + DOLFIJN_X, H - 40, wx === 0.68);
    // bodem + decor
    DIEPTE.bodem(ctx, scroll, s.t, BAAN_PX, DOLFIJN_X);
    // finish
    const finishX = BAAN_PX - scroll + DOLFIJN_X + 40;
    if (finishX > -60 && finishX < B + 80) finish(ctx, finishX, s.t);

    // bellen die opstijgen
    ctx.save();
    for (const b of s.bellen) {
      b.y -= b.v * dt;
      if (b.y < -10) {
        b.y = H + 10;
        b.x = Math.random() * B;
      }
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(b.x + Math.sin(s.t * 2 + b.y / 40) * 4, b.y, b.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // zeemeermin
    const mx = DOLFIJN_X + 40 + (s.meermin - s.afstand) * 2400 + s.eindX;
    const my = MEERMIN_Y + Math.sin(s.t * 2.2) * 8;
    if (mx > -40 && mx < B + 40) {
      zeemeermin(ctx, mx, my, s.t, s.meerminWacht);
      if (s.meerminWacht && !s.klaar) tekst(ctx, '👋', mx + 34, my - 30, 22, '#000', '');
    } else if (!s.klaar) {
      const rechts = mx >= B + 40;
      const ax = rechts ? B - 46 : 46;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.beginPath();
      ctx.roundRect(ax - 40, my - 20, 80, 40, 20);
      ctx.fill();
      tekst(ctx, rechts ? '🧜‍♀️ ▶' : '◀ 🧜‍♀️', ax, my, 20, '#2d2a4a', '');
    }

    // poort van bellen
    if (s.poort) {
      const p = s.poort;
      const v = vraagRef.current;
      p.labels.forEach((lab, i) => {
        const y = BAAN_Y[i];
        const goed = p.klaar && lab !== null && isJuist(v, lab);
        // ring van belletjes
        ctx.save();
        for (let k = 0; k < 14; k++) {
          const a = (k / 14) * Math.PI * 2 + s.t * 0.8;
          ctx.globalAlpha = lab === null ? 0.35 : 0.9;
          ctx.fillStyle = goed ? '#9ef0b8' : 'rgba(200,240,255,0.7)';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x + Math.cos(a) * 30, y + Math.sin(a) * 56, 6 + (k % 3), 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
        if (lab !== null) {
          ctx.fillStyle = goed ? '#d9f7e6' : '#fffbea';
          ctx.strokeStyle = goed ? '#2e9e5b' : '#2d2a4a';
          ctx.lineWidth = 3;
          const breed = Math.max(64, Math.min(120, [...lab].length * 16 + 24));
          ctx.beginPath();
          ctx.roundRect(p.x - breed / 2, y - 24, breed, 48, 14);
          ctx.fill();
          ctx.stroke();
          label(ctx, lab, p.x, y, 28, 150, '#2d2a4a', '');
        }
      });
    }

    // dolfijn
    const kantel = klem(s.vy / 600, -0.35, 0.35);
    dolfijn(ctx, DOLFIJN_X + s.eindX, s.y + Math.sin(s.t * 3) * 3, s.t, kantel, s.turbo > 0, s.traag > 0);

    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);

    // racebalk bovenaan
    raceBalk(ctx, s.afstand, s.meermin, avatarImg);

    if (s.banner.leven > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, s.banner.leven);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect(B / 2 - 150, 290 - 30, 300, 60, 30);
      ctx.fill();
      tekst(ctx, s.banner.tekst, B / 2, 290, 28, '#fff');
      ctx.restore();
    }

    const voorsprong = s.afstand - s.meermin;
    const nieuw = { juist: s.juist, punten: s.punten, zone: s.zone, stand: (voorsprong > 0.01 ? 'voor' : voorsprong < -0.01 ? 'achter' : 'naast') as 'voor' | 'achter' | 'naast' };
    if (Object.entries(nieuw).some(([key, w]) => hud[key as keyof typeof hud] !== w)) setHud(nieuw);
  }, true);

  const standTekst = { voor: '🐬 Jij ligt voor!', achter: '🧜‍♀️ Haal haar in!', naast: '🐬🧜‍♀️ Nek aan nek!' }[hud.stand];

  return (
    <div className="arcade-layout kolom">
      <VraagBalk vraag={vraag} melding={melding} />
      <div className="speelveld-kolom">
        <Hud items={[`✅ ${hud.juist}`, `🏅 ${hud.punten}`, `${ZONES[hud.zone].icoon} ${ZONES[hud.zone].naam}`, standTekst]} />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              // tik op een baan: de dichtstbijzijnde baan
              let beste = 0;
              BAAN_Y.forEach((y, i) => {
                if (Math.abs(p.y - y) < Math.abs(p.y - BAAN_Y[beste])) beste = i;
              });
              naarBaan(beste);
            }}
          />
        </div>
        <div className="bediening">
          <button className="aanraakknop breed" onPointerDown={(e) => { e.preventDefault(); zwem(-1); }}>
            ▲ Omhoog
          </button>
          <button className="aanraakknop breed" onPointerDown={(e) => { e.preventDefault(); zwem(1); }}>
            ▼ Omlaag
          </button>
        </div>
        <p className="klein bediening-hulp">Tik op een baan of gebruik ↑ ↓ om te zwemmen</p>
      </div>
    </div>
  );
}

/** Balk bovenaan: waar zijn de dolfijn en de zeemeermin? */
function raceBalk(ctx: CanvasRenderingContext2D, dol: number, zm: number, avatarImg: HTMLImageElement) {
  const L = 36;
  const R = B - 50;
  const Y = 34;
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.roundRect(10, 8, B - 20, 54, 27);
  ctx.fill();
  // stukken van de wereld
  ZONES.forEach((z, i) => {
    const x0 = L + ((R - L) * i) / ZONES.length;
    const x1 = L + ((R - L) * (i + 1)) / ZONES.length;
    ctx.fillStyle = z.balk;
    ctx.fillRect(x0, Y - 4, x1 - x0, 8);
  });
  tekst(ctx, '🏁', R + 18, Y, 22, '#000', '');
  // zeemeermin (boven) en dolfijn (onder)
  const zx = L + (R - L) * Math.min(1, zm);
  tekst(ctx, '🧜‍♀️', zx, Y - 12, 18, '#000', '');
  const dx = L + (R - L) * Math.min(1, dol);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(dx, Y + 10, 13, 0, Math.PI * 2);
  ctx.fill();
  if (avatarImg.complete && avatarImg.naturalWidth) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(dx, Y + 10, 12, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatarImg, dx - 12, Y - 2, 24, 24);
    ctx.restore();
  } else tekst(ctx, '🐬', dx, Y + 10, 16, '#000', '');
  ctx.restore();
}
