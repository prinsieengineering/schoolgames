// Eenvoudige navigatie tussen de schermen (geen router nodig).

import { useState } from 'react';
import { useProfielen } from './gebruikers/ProfielContext';
import { ProfielKiezer } from './gebruikers/ProfielKiezer';
import { Winkel } from './gebruikers/Winkel';
import { Trofeeen } from './gebruikers/Trofeeen';
import { Ouderzicht } from './gebruikers/Ouderzicht';
import { Thuis } from './wereld/Thuis';
import { SpelScherm } from './spelmotor/SpelScherm';
import { vindSpel } from './spelletjes/register';
import { Speelhal, type DirecteStart } from './arcade/Speelhal';

type Scherm =
  | { naam: 'thuis' }
  | { naam: 'spel'; spelId: string }
  | { naam: 'speelhal'; direct?: DirecteStart }
  | { naam: 'winkel' }
  | { naam: 'trofeeen' }
  | { naam: 'ouders' };

export function App() {
  const { actief } = useProfielen();
  const [scherm, setScherm] = useState<Scherm>({ naam: 'thuis' });
  const naarThuis = () => setScherm({ naam: 'thuis' });

  if (scherm.naam === 'ouders') return <Ouderzicht terug={naarThuis} />;
  if (!actief) return <ProfielKiezer onOuders={() => setScherm({ naam: 'ouders' })} />;

  switch (scherm.naam) {
    case 'spel': {
      const spel = vindSpel(scherm.spelId);
      return spel ? <SpelScherm spel={spel} terug={naarThuis} /> : null;
    }
    case 'speelhal':
      return <Speelhal key={scherm.direct?.arcadeId ?? 'lijst'} terug={naarThuis} direct={scherm.direct} />;
    case 'winkel':
      return <Winkel terug={naarThuis} />;
    case 'trofeeen':
      return <Trofeeen terug={naarThuis} />;
    default:
      return (
        <Thuis
          onSpel={(id) => setScherm({ naam: 'spel', spelId: id })}
          onArcade={(s) => setScherm({ naam: 'speelhal', direct: { arcadeId: s.arcadeId, spelId: s.spelId, keuze: s.keuze } })}
          onGa={(b) => setScherm({ naam: b })}
        />
      );
  }
}
