// 👾 Monsterjacht (soort A): beantwoord opdrachten om sterretjes te verdienen,
// en schiet daarmee de boze monsterjes weg voor ze de grond bereiken.

import { useEffect, useMemo, useRef, useState } from 'react';
import { B, H, bereidCanvas, canvasPunt, klem, tempo, useSpellus, useToetsen, afstand } from '../kern/engine';
import { lucht, monster, MONSTERKLEUREN, ploef, ster, sterrenhemel, tekenDeeltjes, tekenZweef, tekst, updateDeeltjes, laadBeeld, type Deeltje, type Zweef, bel } from '../kern/teken';
import { Hud, HoudKnop, Opdrachtpaneel, hartjesTekst, tijdTekst, type ArcadeProps } from '../kern/ui';
import { avatarUrl } from '../../gebruikers/avatar';
import { geluid } from '../../core/geluid';

const SPEELTIJD = 240;
const GROND = H - 70;

interface Monster {
  x: number;
  y: number;
  basisX: number;
  r: number;
  kleur: string;
  hp: number;
  waarde: number;
  fase: number;
}
interface Kogel {
  x: number;
  y: number;
  vx: number;
  soort: 'ster' | 'bel';
}

export function Monsterjacht({ bron, avatar, leerjaar, onEinde }: ArcadeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const factor = tempo(leerjaar);
  const avatarImg = useMemo(() => laadBeeld(avatarUrl(avatar, false)), [avatar]);
  const [pauze, setPauze] = useState(false);
  const [hud, setHud] = useState({ hartjes: 3, punten: 0, munitie: 3, tijd: SPEELTIJD, ijs: 3, superschot: 0 });

  const s = useRef({
    x: B / 2,
    doelX: null as number | null,
    munitie: 3,
    superschot: 0,
    kogels: [] as Kogel[],
    monsters: [] as Monster[],
    deeltjes: [] as Deeltje[],
    zweef: [] as Zweef[],
    hartjes: 3,
    punten: 0,
    geraakt: 0,
    golf: 1,
    spawn: 1.5,
    tijd: 0,
    t: 0,
    ijsTot: 0,
    ijs: 3,
    cooldown: 0,
    klaar: false,
    flits: 0,
  }).current;

  function schiet() {
    if (s.klaar || pauze) return;
    if (s.cooldown > 0) return;
    if (s.munitie <= 0) {
      s.zweef.push({ x: s.x, y: GROND - 50, tekst: 'Geen sterretjes! Los een opdracht op', leven: 1.2, kleur: '#ffd23f' });
      return;
    }
    s.munitie--;
    s.cooldown = 0.22;
    geluid.schiet();
    const soort = s.munitie % 2 === 0 ? 'ster' : 'bel';
    if (s.superschot > 0) {
      s.superschot--;
      for (const vx of [-90, 0, 90]) s.kogels.push({ x: s.x, y: GROND - 30, vx, soort });
    } else s.kogels.push({ x: s.x, y: GROND - 30, vx: 0, soort });
  }

  const toetsen = useToetsen((k) => {
    if (k === ' ' || k === 'ArrowUp' || k === 'w') schiet();
    if (k === 'p' || k === 'Escape') setPauze((p) => !p);
  });

  function bevries() {
    if (s.ijs <= 0 || s.klaar) return;
    s.ijs--;
    s.ijsTot = s.tijd + 4;
    geluid.klik();
  }

  // pauze als het tabblad verborgen wordt
  useEffect(() => {
    const h = () => document.hidden && setPauze(true);
    document.addEventListener('visibilitychange', h);
    return () => document.removeEventListener('visibilitychange', h);
  }, []);

  function stoppen(reden: string) {
    if (s.klaar) return;
    s.klaar = true;
    setTimeout(() => onEinde(s.punten, { monsters: s.geraakt }, reden), 900);
  }

  useSpellus((dt) => {
    const ctx = canvasRef.current && bereidCanvas(canvasRef.current);
    if (!ctx) return;
    s.t += dt;
    if (!s.klaar) s.tijd += dt;
    const bevroren = s.tijd < s.ijsTot;

    // --- bewegen ---
    const k = toetsen.current;
    let dx = 0;
    if (k.has('ArrowLeft') || k.has('a')) dx -= 1;
    if (k.has('ArrowRight') || k.has('d')) dx += 1;
    if (dx !== 0) s.doelX = null;
    if (s.doelX !== null) {
      const d = s.doelX - s.x;
      s.x += klem(d, -360 * dt, 360 * dt);
    } else s.x += dx * 320 * dt;
    s.x = klem(s.x, 30, B - 30);
    s.cooldown -= dt;

    // --- monsters maken ---
    if (!s.klaar && !bevroren) {
      s.spawn -= dt;
      if (s.spawn <= 0) {
        const groot = s.golf % 4 === 0 && Math.random() < 0.35;
        const r = groot ? 36 : 22 + Math.random() * 6;
        const x = 40 + Math.random() * (B - 80);
        s.monsters.push({ x, y: -r, basisX: x, r, kleur: MONSTERKLEUREN[Math.floor(Math.random() * MONSTERKLEUREN.length)], hp: groot ? 3 : 1, waarde: groot ? 30 : 10, fase: Math.random() * 6 });
        s.spawn = Math.max(1.1, 3.2 - s.golf * 0.18) / factor;
      }
    }

    // --- monsters bewegen ---
    for (const m of s.monsters) {
      if (!bevroren && !s.klaar) {
        m.y += (18 + s.golf * 3) * factor * (m.hp > 1 ? 0.7 : 1) * dt;
        m.x = klem(m.basisX + Math.sin(s.t * 1.5 + m.fase) * 30, m.r, B - m.r);
      }
    }
    // monster bereikt de grond
    for (let i = s.monsters.length - 1; i >= 0; i--) {
      const m = s.monsters[i];
      if (m.y + m.r * 0.8 >= GROND) {
        s.monsters.splice(i, 1);
        s.hartjes--;
        s.flits = 0.4;
        geluid.au();
        ploef(s.deeltjes, m.x, GROND, '#ef476f', 12);
        if (s.hartjes <= 0) stoppen('Oei, de monsters zijn geland!');
      }
    }

    // --- kogels ---
    for (const kg of s.kogels) {
      kg.y -= 520 * dt;
      kg.x += kg.vx * dt;
    }
    for (let i = s.kogels.length - 1; i >= 0; i--) {
      const kg = s.kogels[i];
      let weg = kg.y < -20;
      for (let j = s.monsters.length - 1; j >= 0 && !weg; j--) {
        const m = s.monsters[j];
        if (afstand(kg.x, kg.y, m.x, m.y) < m.r + 8) {
          weg = true;
          m.hp--;
          if (m.hp <= 0) {
            s.monsters.splice(j, 1);
            s.punten += m.waarde;
            s.geraakt++;
            geluid.ploef();
            ploef(s.deeltjes, m.x, m.y, '#ffffff', 12, ['🍬', '🍭', '⭐', '☁️'][s.geraakt % 4]);
            s.zweef.push({ x: m.x, y: m.y, tekst: `+${m.waarde}`, leven: 1, kleur: '#ffd23f' });
            if (s.geraakt % 6 === 0) {
              s.golf++;
              s.zweef.push({ x: B / 2, y: H / 2, tekst: `Golf ${s.golf}!`, leven: 1.5, kleur: '#fff' });
            }
          } else {
            ploef(s.deeltjes, kg.x, kg.y, m.kleur, 5);
          }
        }
      }
      if (weg) s.kogels.splice(i, 1);
    }
    updateDeeltjes(s.deeltjes, dt);

    if (!s.klaar && s.tijd >= SPEELTIJD) stoppen('De tijd is om!');

    // --- tekenen ---
    lucht(ctx, '#1b1046', '#5b4fd0');
    sterrenhemel(ctx, s.t);
    ctx.fillStyle = '#2e9e5b';
    ctx.fillRect(0, GROND + 10, B, H - GROND);
    ctx.fillStyle = '#5cc96e';
    ctx.fillRect(0, GROND + 10, B, 8);
    for (const m of s.monsters) monster(ctx, m.x, m.y, m.r, m.kleur, s.t, bevroren);
    for (const kg of s.kogels) kg.soort === 'ster' ? ster(ctx, kg.x, kg.y, 11, '#ffd23f', s.t * 8) : bel(ctx, kg.x, kg.y, 10);
    if (avatarImg.complete) ctx.drawImage(avatarImg, s.x - 38, GROND - 64, 76, 76);
    tekenDeeltjes(ctx, s.deeltjes);
    tekenZweef(ctx, s.zweef, dt);
    if (bevroren) {
      ctx.fillStyle = 'rgba(180,230,255,0.18)';
      ctx.fillRect(0, 0, B, H);
      tekst(ctx, '❄️ bevroren ❄️', B / 2, 40, 22);
    }
    if (s.flits > 0) {
      s.flits -= dt;
      ctx.fillStyle = `rgba(239,71,111,${s.flits})`;
      ctx.fillRect(0, 0, B, H);
    }
    if (s.klaar) tekst(ctx, s.hartjes <= 0 ? 'Oei!' : 'Tijd!', B / 2, H / 2 - 40, 54, '#ffd23f');

    // --- HUD bijwerken (alleen bij verandering) ---
    const nieuw = { hartjes: s.hartjes, punten: s.punten, munitie: s.munitie, tijd: Math.max(0, Math.ceil(SPEELTIJD - s.tijd)), ijs: s.ijs, superschot: s.superschot };
    if (Object.entries(nieuw).some(([key, v]) => hud[key as keyof typeof hud] !== v)) setHud(nieuw);
  }, !pauze);

  return (
    <div className="arcade-layout">
      <div className="speelveld-kolom">
        <Hud
          items={[
            hartjesTekst(hud.hartjes),
            `⭐ ${hud.munitie}${hud.superschot ? ` (+${hud.superschot} super)` : ''}`,
            `🏅 ${hud.punten}`,
            `⏱️ ${tijdTekst(hud.tijd)}`,
          ]}
        />
        <div className="canvas-houder">
          <canvas
            ref={canvasRef}
            className="speelveld"
            onPointerDown={(e) => {
              const p = canvasPunt(e.currentTarget, e);
              s.doelX = p.x;
              schiet();
            }}
            onPointerMove={(e) => {
              if (e.buttons) s.doelX = canvasPunt(e.currentTarget, e).x;
            }}
          />
          {pauze && (
            <div className="pauze-laag">
              <h2>Pauze</h2>
              <button className="knop groot" onClick={() => setPauze(false)}>
                ▶ Verder spelen
              </button>
              <button className="knop grijs" onClick={() => stoppen('Gestopt')}>
                Stoppen
              </button>
            </div>
          )}
        </div>
        <div className="bediening">
          <HoudKnop toets="ArrowLeft" ingedrukt={toetsen}>
            ◀
          </HoudKnop>
          <button className="aanraakknop ijs" onClick={bevries} disabled={hud.ijs <= 0} title="Bevries de monsters even">
            ❄️ {hud.ijs}
          </button>
          <button className="aanraakknop" onClick={() => setPauze(true)} title="Pauze (P)">
            ⏸
          </button>
          <button className="aanraakknop schiet" onPointerDown={(e) => { e.preventDefault(); schiet(); }}>
            ⭐ Schiet
          </button>
          <HoudKnop toets="ArrowRight" ingedrukt={toetsen}>
            ▶
          </HoudKnop>
        </div>
        <p className="klein bediening-hulp">Pc: ← → bewegen · spatie schieten · 1-4 antwoorden · P pauze</p>
      </div>
      <Opdrachtpaneel
        bron={bron}
        gepauzeerd={pauze}
        titel="🎯 Verdien sterretjes"
        beloningTekst={bron.reeks > 0 && bron.reeks % 5 === 0 ? '+3 ⭐ en SUPERSCHOT!' : '+3 ⭐'}
        onAntwoord={(ok) => {
          if (!ok) return;
          s.munitie += 3;
          geluid.munt();
          if (bron.reeks > 0 && bron.reeks % 5 === 0) s.superschot += 2;
        }}
      />
    </div>
  );
}
