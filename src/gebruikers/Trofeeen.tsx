import { BADGES } from '../core/badges';
import { useActief } from './ProfielContext';

export function Trofeeen({ terug }: { terug: () => void }) {
  const { profiel } = useActief();
  const aantal = profiel.badges.length;
  return (
    <div className="scherm">
      <div className="kopbalk">
        <button className="knop grijs" onClick={terug}>
          ← Terug
        </button>
        <h1>🏆 Trofeeënkast</h1>
        <span className="muntjes">
          {aantal} / {BADGES.length}
        </span>
      </div>
      <div className="badge-rooster">
        {BADGES.map((b) => {
          const heeft = profiel.badges.includes(b.id);
          return (
            <div key={b.id} className={`badge ${heeft ? 'heeft' : ''}`}>
              <span className="badge-icoon">{heeft ? b.icoon : '❔'}</span>
              <strong>{b.titel}</strong>
              <span className="klein">{b.uitleg}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
