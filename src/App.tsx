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
import { Speelhal } from './arcade/Speelhal';

type Scherm =
  | { naam: 'thuis' }
  | { naam: 'spel'; spelId: string }
  | { naam: 'speelhal' }
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
      return <Speelhal terug={naarThuis} />;
    case 'winkel':
      return <Winkel terug={naarThuis} />;
    case 'trofeeen':
      return <Trofeeen terug={naarThuis} />;
    default:
      return <Thuis onSpel={(id) => setScherm({ naam: 'spel', spelId: id })} onGa={(b) => setScherm({ naam: b })} />;
  }
}
