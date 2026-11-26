import { useState, type CSSProperties } from 'react';
import type { Leerjaar, Profiel, SpelDef } from '../core/types';
import { useActief, useProfielen } from '../gebruikers/ProfielContext';
import { AvatarBeeld } from '../gebruikers/AvatarBeeld';
import { niveauInfo } from '../core/beloningen';
import { spelletjesVoor } from '../spelletjes/register';
import { VAKKEN, WERELDEN, wereldVan } from './werelden';
import { geluid } from '../core/geluid';

/** Facultatief Frans (3e/4e) enkel tonen als de ouder het aanzette. */
export const spelZichtbaar = (s: SpelDef, p: Profiel) => !s.facultatief || p.instellingen.frans;

export type Bestemming = 'speelhal' | 'winkel' | 'trofeeen';

export function Thuis({ onSpel, onGa }: { onSpel: (id: string) => void; onGa: (b: Bestemming) => void }) {
  const { profiel } = useActief();
  const { kies } = useProfielen();
  const [lj, setLj] = useState<Leerjaar>(profiel.leerjaar);
  const niv = niveauInfo(profiel.xp);
  const wereld = wereldVan(lj);
  const spellen = spelletjesVoor(lj).filter((s) => spelZichtbaar(s, profiel));

  return (
    <div className="scherm thuis" style={{ background: wereld.lucht }}>
      <header className="speler-kop">
        <AvatarBeeld avatar={profiel.avatar} grootte={72} className="huppel" />
        <div className="speler-info">
          <strong className="speler-naam">{profiel.naam}</strong>
          <div className="xp-rij">
            <span className="niveau-badge">Niv. {niv.niveau}</span>
            <div className="xp-balk" title={`${niv.binnen} / ${niv.nodig} XP`}>
              <div style={{ width: `${(niv.binnen / niv.nodig) * 100}%` }} />
            </div>
          </div>
        </div>
        <span className="muntjes">🪙 {profiel.muntjes}</span>
        <nav className="hoofdknoppen">
          <button className="knop speelhal-knop" onClick={() => onGa('speelhal')}>
            🕹️ Speelhal
          </button>
          <button className="knop" onClick={() => onGa('winkel')}>
            🛍️ Winkel
          </button>
          <button className="knop" onClick={() => onGa('trofeeen')}>
            🏆 {profiel.badges.length}
          </button>
          <button className="knop grijs" onClick={() => kies(null)} title="Andere speler">
            👥
          </button>
        </nav>
      </header>

      <div className="wereld-tabs">
        {WERELDEN.map((w) => (
          <button
            key={w.leerjaar}
            className={`wereld-tab ${w.leerjaar === lj ? 'aan' : ''}`}
            style={{ '--wkleur': w.kleur } as CSSProperties}
            onClick={() => {
              geluid.klik();
              setLj(w.leerjaar);
            }}
          >
            <span className="wereld-icoon">{w.icoon}</span>
            <span>{w.leerjaar}e</span>
            {w.leerjaar === profiel.leerjaar && <span className="jij">jij</span>}
          </button>
        ))}
      </div>

      <h2 className="wereld-naam" style={{ color: wereld.kleur }}>
        {wereld.icoon} {wereld.naam} <span className="klein">· {lj}e leerjaar</span>
      </h2>

      <div className="spel-rooster">
        {spellen.map((s) => {
          const v = profiel.spellen[s.id];
          const sterren = v?.sterren.reduce((a, b) => a + b, 0) ?? 0;
          return (
            <button
              key={s.id}
              className="spel-kaart"
              style={{ '--wkleur': wereld.kleur } as CSSProperties}
              onClick={() => {
                geluid.klik();
                onSpel(s.id);
              }}
            >
              <span className="spel-icoon">{s.icoon}</span>
              <strong>{s.titel}</strong>
              <span className="klein">{s.beschrijving}</span>
              <span className="vak-label">
                {VAKKEN[s.vak].icoon} {VAKKEN[s.vak].naam}
                {s.facultatief && ' · extra'}
              </span>
              <span className="sterren">
                ★ {sterren}/{s.niveaus.length * 3}
              </span>
            </button>
          );
        })}
        {spellen.length === 0 && <p>Hier komen binnenkort spelletjes!</p>}
      </div>
    </div>
  );
}
