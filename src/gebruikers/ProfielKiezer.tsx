import { useState } from 'react';
import type { Avatar, Leerjaar } from '../core/types';
import { useProfielen } from './ProfielContext';
import { AvatarBeeld } from './AvatarBeeld';
import { KLEUREN } from './avatar';
import { WINKEL } from './winkelItems';
import { geluid } from '../core/geluid';

const GRATIS_DIEREN = WINKEL.filter((i) => i.soort === 'dier' && i.prijs === 0).map((i) => i.waarde);
const GRATIS_KLEUREN = WINKEL.filter((i) => i.soort === 'kleur' && i.prijs === 0).map((i) => i.waarde);

export function ProfielKiezer({ onOuders }: { onOuders: () => void }) {
  const { profielen, kies } = useProfielen();
  const [nieuw, setNieuw] = useState(profielen.length === 0);

  if (nieuw) return <NieuwProfiel onKlaar={() => setNieuw(false)} kanAnnuleren={profielen.length > 0} />;

  return (
    <div className="scherm centreer profielen">
      <h1 className="titel-groot">⭐ Schoolgames ⭐</h1>
      <p className="ondertitel">Wie gaat er spelen?</p>
      <div className="profiel-rooster">
        {profielen.map((p) => (
          <button
            key={p.id}
            className="profiel-kaart"
            onClick={() => {
              geluid.klik();
              kies(p.id);
            }}
          >
            <AvatarBeeld avatar={p.avatar} grootte={96} />
            <strong>{p.naam}</strong>
            <span className="klein">{p.leerjaar}e leerjaar</span>
          </button>
        ))}
        <button className="profiel-kaart nieuw" onClick={() => setNieuw(true)}>
          <span className="plus">＋</span>
          <strong>Nieuwe speler</strong>
        </button>
      </div>
      <button className="knop link" onClick={onOuders}>
        🔒 Voor ouders
      </button>
    </div>
  );
}

function NieuwProfiel({ onKlaar, kanAnnuleren }: { onKlaar: () => void; kanAnnuleren: boolean }) {
  const { maak, kies } = useProfielen();
  const [naam, setNaam] = useState('');
  const [leerjaar, setLeerjaar] = useState<Leerjaar>(1);
  const [avatar, setAvatar] = useState<Avatar>({ dier: 'vos', kleur: 'oranje', hoed: null, bril: null, extra: null });

  const klaar = naam.trim().length > 0;

  return (
    <div className="scherm centreer">
      <h1>Maak je personage</h1>
      <div className="nieuw-profiel">
        <div className="paneel avatar-voorbeeld">
          <AvatarBeeld avatar={avatar} grootte={160} className="huppel" />
        </div>
        <div className="paneel">
          <label className="veld">
            <span>Hoe heet je?</span>
            <input value={naam} maxLength={16} onChange={(e) => setNaam(e.target.value)} placeholder="Je naam of bijnaam" autoFocus />
          </label>
          <div className="veld">
            <span>In welk leerjaar zit je?</span>
            <div className="keuzerij">
              {([1, 2, 3, 4, 5, 6] as Leerjaar[]).map((lj) => (
                <button key={lj} className={`chip ${lj === leerjaar ? 'aan' : ''}`} onClick={() => setLeerjaar(lj)}>
                  {lj}e
                </button>
              ))}
            </div>
          </div>
          <div className="veld">
            <span>Kies een dier</span>
            <div className="keuzerij">
              {GRATIS_DIEREN.map((d) => (
                <button key={d} className={`chip beeld ${avatar.dier === d ? 'aan' : ''}`} onClick={() => setAvatar({ ...avatar, dier: d })}>
                  <AvatarBeeld avatar={{ ...avatar, dier: d, hoed: null, bril: null, extra: null }} grootte={44} />
                </button>
              ))}
            </div>
            <p className="klein">Meer dieren, hoedjes en brillen kan je later kopen in de winkel met muntjes!</p>
          </div>
          <div className="veld">
            <span>Kies een kleur</span>
            <div className="keuzerij">
              {GRATIS_KLEUREN.map((k) => (
                <button
                  key={k}
                  className={`kleurbol ${avatar.kleur === k ? 'aan' : ''}`}
                  style={{ background: KLEUREN[k] }}
                  onClick={() => setAvatar({ ...avatar, kleur: k })}
                  aria-label={k}
                />
              ))}
            </div>
          </div>
          <div className="knoppenrij">
            {kanAnnuleren && (
              <button className="knop grijs" onClick={onKlaar}>
                Terug
              </button>
            )}
            <button
              className="knop groot"
              disabled={!klaar}
              onClick={() => {
                const p = maak(naam.trim(), leerjaar, avatar);
                geluid.fanfare();
                kies(p.id);
              }}
            >
              Klaar! 🎉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
