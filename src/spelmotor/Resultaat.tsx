import { useEffect } from 'react';
import type { Beloning } from '../core/types';
import { vindBadge } from '../core/badges';
import { geluid } from '../core/geluid';
import { Confetti } from './Confetti';

interface Props {
  titel: string;
  juist: number;
  totaal: number;
  beloning: Beloning;
  punten?: number;
  record?: number;
  knoppen: { label: string; actie: () => void; hoofd?: boolean }[];
}

export function Resultaat({ titel, juist, totaal, beloning, punten, record, knoppen }: Props) {
  useEffect(() => {
    if (beloning.sterren >= 2 || beloning.nieuweBadges.length || beloning.nieuwRecord) geluid.fanfare();
    else geluid.munt();
  }, [beloning]);

  const boodschap =
    beloning.sterren === 3 ? 'Perfect! Wauw!' : beloning.sterren === 2 ? 'Super goed gedaan!' : beloning.sterren === 1 ? 'Goed bezig!' : 'Blijven oefenen, je kan het!';

  return (
    <div className="resultaat">
      {(beloning.sterren >= 2 || beloning.nieuweBadges.length > 0) && <Confetti />}
      <h2>{titel}</h2>
      <div className="sterren-groot">
        {[1, 2, 3].map((s) => (
          <span key={s} className={s <= beloning.sterren ? 'aan' : ''} style={{ animationDelay: `${s * 200}ms` }}>
            ★
          </span>
        ))}
      </div>
      <p className="boodschap">{boodschap}</p>
      <p>
        <strong>
          {juist} van {totaal}
        </strong>{' '}
        juist
      </p>
      {punten !== undefined && (
        <p className="punten">
          {punten} punten {beloning.nieuwRecord ? '🏆 NIEUW RECORD!' : record ? `(record: ${record})` : ''}
        </p>
      )}
      <div className="beloningen">
        <span className="pil">✨ +{beloning.xp} XP</span>
        <span className="pil">🪙 +{beloning.muntjes}</span>
        {beloning.niveauOmhoog && <span className="pil goud">⬆️ Niveau omhoog!</span>}
      </div>
      {beloning.nieuweBadges.length > 0 && (
        <div className="nieuwe-badges">
          <h3>Nieuwe badge{beloning.nieuweBadges.length > 1 ? 's' : ''}!</h3>
          {beloning.nieuweBadges.map((id) => {
            const b = vindBadge(id);
            return b ? (
              <div key={id} className="badge heeft pop">
                <span className="badge-icoon">{b.icoon}</span>
                <strong>{b.titel}</strong>
              </div>
            ) : null;
          })}
        </div>
      )}
      <div className="knoppenrij">
        {knoppen.map((k) => (
          <button key={k.label} className={`knop ${k.hoofd ? 'groot' : 'grijs'}`} onClick={k.actie}>
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
