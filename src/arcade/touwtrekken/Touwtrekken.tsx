// 🪢 Touwtrekken (samen spelen): twee kinderen op één toestel. Elk krijgt
// vragen op zijn eigen niveau; elk juist antwoord trekt het touw naar jou.

import { useMemo, useRef, useState } from 'react';
import type { Avatar } from '../../core/types';
import { B, H, bereidCanvas, useSpellus } from '../kern/engine';
import { lucht, ploef, tekenDeeltjes, tekst, updateDeeltjes, laadBeeld, type Deeltje } from '../kern/teken';
import { Opdrachtpaneel, tijdTekst } from '../kern/ui';
import type { Vraagbron } from '../kern/vraagbron';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';

const SPEELTIJD = 180;
const TREK = 14;

export interface DuoSpeler {
  naam: string;
  avatar: Avatar;
  bron: Vraagbron;
  profielId: string | null;
}

export function Touwtrekken({ spelers, onEinde }: { spelers: [DuoSpeler, DuoSpeler]; onEinde: (winnaar: 0 | 1 | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beelden = useMemo(() => spelers.map((sp) => laadBeeld(avatarUrl(sp.avatar, false))), [spelers]);
  const [tijd, setTijd] = useState(SPEELTIJD);
  const s = useRef({ pos: 0, getoond: 0, t: 0, tijd: 0, klaar: false, winnaar: null as 0 | 1 | null, deeltjes: [] as Deeltje[] }).current;

  function trek(speler: 0 | 1) {
    if (s.klaar) return;
    s.pos += speler === 0 ? -TREK : TREK;
    geluid.munt();
    ploef(s.deeltjes, B / 2 + s.pos * 1.6, H / 2, '#ffd23f', 6);
    if (Math.abs(s.pos) >= 100) einde(s.pos < 0 ? 0 : 1);
  }

  function einde(w: 0 | 1 | null) {
    if (s.klaar) return;
    s.klaar = true;
    s.winnaar = w;
    geluid.fanfare();
    setTimeout(() => onEinde(w), 1800);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;
    if (!s.klaar && s.tijd >= SPEELTIJD) einde(s.pos < 0 ? 0 : s.pos > 0 ? 1 : null);
    s.getoond += (s.pos - s.getoond) * Math.min(1, dt * 6);
    updateDeeltjes(s.deeltjes, dt);

    lucht(ctx, '#b8e8ff', '#fff7d6');
    ctx.fillStyle = '#7ccf6a';
    ctx.fillRect(0, H / 2 + 60, B, H);
    // middenlijn en doellijnen
    ctx.fillStyle = '#fff';
    ctx.fillRect(B / 2 - 3, H / 2 - 120, 6, 240);
    ctx.fillStyle = 'rgba(239,71,111,0.6)';
    ctx.fillRect(B / 2 - 160 - 3, H / 2 - 80, 6, 160);
    ctx.fillStyle = 'rgba(77,150,255,0.6)';
    ctx.fillRect(B / 2 + 160 - 3, H / 2 - 80, 6, 160);
    // touw
    const off = s.getoond * 1.6;
    ctx.strokeStyle = '#b07b3a';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(60 + off * 0.25, H / 2 + 10);
    ctx.quadraticCurveTo(B / 2 + off, H / 2 + 22 + Math.sin(s.t * 4) * 4, B - 60 + off * 0.25, H / 2 + 10);
    ctx.stroke();
    // lintje in het midden
    ctx.fillStyle = '#ef476f';
    ctx.fillRect(B / 2 + off - 6, H / 2 + 8, 12, 30);
    // spelers
    const wiebel = Math.sin(s.t * 10) * 3;
    if (beelden[0].complete) ctx.drawImage(beelden[0], 10 + off * 0.25 + wiebel, H / 2 - 78, 92, 92);
    if (beelden[1].complete) ctx.drawImage(beelden[1], B - 90 + off * 0.25 - wiebel, H / 2 - 78, 92, 92);
    tekst(ctx, spelers[0].naam, 50 + off * 0.25, H / 2 - 90, 20, '#ef476f', '#fff');
    tekst(ctx, spelers[1].naam, B - 50 + off * 0.25, H / 2 - 90, 20, '#4d96ff', '#fff');
    tekenDeeltjes(ctx, s.deeltjes);
    tekst(ctx, tijdTekst(Math.max(0, SPEELTIJD - s.tijd)), B / 2, 40, 28, '#333', '#fff');
    if (s.klaar) {
      const w = s.winnaar;
      tekst(ctx, w === null ? 'Gelijkspel!' : `${spelers[w].naam} wint! 🎉`, B / 2, H / 2 - 170, 38, '#ffd23f');
    }
    const t = Math.ceil(SPEELTIJD - s.tijd);
    if (t !== tijd) setTijd(Math.max(0, t));
  }, true);

  return (
    <div className="duo-layout">
      <div className="duo-speler links">
        <Opdrachtpaneel bron={spelers[0].bron} titel={`🔴 ${spelers[0].naam} (toetsen 1-4)`} toetsen={['1', '2', '3', '4']} beloningTekst="Trek! 💪" onAntwoord={(ok) => ok && trek(0)} />
      </div>
      <div className="canvas-houder duo">
        <canvas ref={canvasRef} className="speelveld" />
      </div>
      <div className="duo-speler rechts">
        <Opdrachtpaneel bron={spelers[1].bron} titel={`🔵 ${spelers[1].naam} (toetsen 7-0)`} toetsen={['7', '8', '9', '0']} beloningTekst="Trek! 💪" onAntwoord={(ok) => ok && trek(1)} />
      </div>
    </div>
  );
}
