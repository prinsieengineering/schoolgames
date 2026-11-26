import { useState } from 'react';
import type { Avatar, Leerjaar } from '../core/types';
import { useProfielen } from './ProfielContext';
import { AvatarBeeld } from './AvatarBeeld';
import { verrasAvatar } from './avatar';
import { isGratis } from './winkelItems';
import { AvatarMaker } from './AvatarMaker';
import { geluid } from '../core/geluid';

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
            <AvatarBeeld avatar={p.avatar} grootte={110} className="rond" />
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
  const [avatar, setAvatar] = useState<Avatar>(() => verrasAvatar(Math.random() < 0.5 ? 'kat' : 'hond', isGratis));

  const klaar = naam.trim().length > 0;

  return (
    <div className="scherm">
      <h1 style={{ textAlign: 'center' }}>Maak je personage</h1>
      <div className="paneel nieuw-gegevens">
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
      </div>
      <AvatarMaker modus="nieuw" avatar={avatar} onWijzig={setAvatar} />
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
          {klaar ? 'Klaar! 🎉' : 'Vul eerst je naam in'}
        </button>
      </div>
    </div>
  );
}