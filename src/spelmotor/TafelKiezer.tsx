// Tafelkeuze: vink aan welke tafels je oefent en kies maal, delen of allebei.
// Gebruikt in het quizscherm, de Speelhal en het ouderzicht.

import type { TafelKeuze, TafelSoort } from '../core/types';
import { ALLE_TAFELS, geldigeKeuze } from '../core/tafels';
import { geluid } from '../core/geluid';

const SOORTEN: { soort: TafelSoort; label: string }[] = [
  { soort: 'maal', label: '✖️ Maal' },
  { soort: 'delen', label: '➗ Delen' },
  { soort: 'beide', label: '✖️➗ Allebei' },
];

const SNEL: { label: string; tafels: number[] }[] = [
  { label: '2, 5 en 10', tafels: [2, 5, 10] },
  { label: '1 tot 5', tafels: [1, 2, 3, 4, 5] },
  { label: 'Alle tafels', tafels: ALLE_TAFELS },
];

export function TafelKiezer({ waarde, onWijzig }: { waarde: TafelKeuze; onWijzig: (k: TafelKeuze) => void }) {
  const k = geldigeKeuze(waarde);
  const zet = (nieuw: Partial<TafelKeuze>) => {
    geluid.klik();
    onWijzig(geldigeKeuze({ ...k, ...nieuw }));
  };
  const wissel = (t: number) => {
    const aan = k.tafels.includes(t);
    // minstens één tafel blijft aangevinkt
    if (aan && k.tafels.length === 1) return;
    zet({ tafels: aan ? k.tafels.filter((x) => x !== t) : [...k.tafels, t] });
  };
  const gelijk = (a: number[]) => a.length === k.tafels.length && a.every((x) => k.tafels.includes(x));

  return (
    <div className="tafelkiezer">
      <div className="tafelkiezer-rij" role="group" aria-label="Welke tafels?">
        {ALLE_TAFELS.map((t) => {
          const aan = k.tafels.includes(t);
          return (
            <button key={t} className={`tafel-vak ${aan ? 'aan' : ''}`} aria-pressed={aan} onClick={() => wissel(t)} title={`Tafel van ${t}`}>
              <span className="klein">tafel van</span>
              <strong>{t}</strong>
              <span className="vinkje">{aan ? '✔' : ''}</span>
            </button>
          );
        })}
      </div>
      <div className="keuzerij">
        {SNEL.map((s) => (
          <button key={s.label} className={`chip ${gelijk(s.tafels) ? 'aan' : ''}`} onClick={() => zet({ tafels: s.tafels })}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="keuzerij" role="group" aria-label="Maal of delen?">
        {SOORTEN.map((s) => (
          <button key={s.soort} className={`chip groot ${k.soort === s.soort ? 'aan' : ''}`} aria-pressed={k.soort === s.soort} onClick={() => zet({ soort: s.soort })}>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
