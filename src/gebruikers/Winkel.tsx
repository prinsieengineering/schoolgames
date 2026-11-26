import { useState } from 'react';
import { useActief } from './ProfielContext';
import { AvatarMaker } from './AvatarMaker';
import { geluid } from '../core/geluid';

export function Winkel({ terug }: { terug: () => void }) {
  const { profiel, bewaar } = useActief();
  const [melding, setMelding] = useState('Kies een onderdeel om het aan te trekken of te kopen.');

  return (
    <div className="scherm">
      <div className="kopbalk">
        <button className="knop grijs" onClick={terug}>
          ← Terug
        </button>
        <h1>🛍️ Winkel</h1>
        <span className="muntjes">🪙 {profiel.muntjes}</span>
      </div>
      <p className="ondertitel" style={{ textAlign: 'center' }}>
        {melding}
      </p>
      <AvatarMaker
        modus="winkel"
        avatar={profiel.avatar}
        bezit={profiel.bezit}
        muntjes={profiel.muntjes}
        onWijzig={(avatar, aankoop) => {
          if (!aankoop) return bewaar({ ...profiel, avatar });
          if (profiel.muntjes < aankoop.kost) {
            geluid.fout();
            setMelding(`Je hebt nog ${aankoop.kost - profiel.muntjes} muntjes te weinig. Speel nog wat! 💪`);
            return;
          }
          geluid.munt();
          setMelding(`Gekocht! 🎉 Je hebt nog ${profiel.muntjes - aankoop.kost} muntjes.`);
          bewaar({ ...profiel, avatar, muntjes: profiel.muntjes - aankoop.kost, bezit: [...profiel.bezit, aankoop.id] });
        }}
      />
    </div>
  );
}
