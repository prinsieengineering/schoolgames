import { useEffect, useRef, useState } from 'react';
import type { Vraag } from '../core/types';
import { kanVoorlezen, spreek } from '../core/spraak';
import { AntwoordTekst, RijkeTekst, VisualBeeld } from './Visuals';
import { Cijferklavier } from './Cijferklavier';

interface Props {
  vraag: Vraag;
  onAntwoord: (gegeven: string) => void;
  /** Automatisch voorlezen bij een nieuwe vraag. */
  autoVoorlezen?: boolean;
  /** Invulveld toestaan (quiz). In de arcade altijd knoppen. */
  invoerToegestaan?: boolean;
  /** Knoppen tijdelijk uitschakelen (bv. tijdens feedback). */
  geblokkeerd?: boolean;
  compact?: boolean;
  /** Antwoordknoppen markeren na het antwoorden. */
  markeer?: { gegeven: string; juist: string } | null;
  /** Sneltoetsen voor de antwoordknoppen (null = geen). */
  toetsen?: string[] | null;
}

export function VraagKaart({ vraag, onAntwoord, autoVoorlezen, invoerToegestaan = true, geblokkeerd, compact, markeer, toetsen = ['1', '2', '3', '4'] }: Props) {
  const [invoer, setInvoer] = useState('');
  const invoerRef = useRef<HTMLInputElement>(null);
  const metInvoer = invoerToegestaan && !!vraag.invoer;

  const leesVoor = () => spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE');

  useEffect(() => {
    setInvoer('');
    if (autoVoorlezen) leesVoor();
    if (metInvoer) invoerRef.current?.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vraag]);

  // Sneltoetsen 1-4 voor meerkeuze
  useEffect(() => {
    if (metInvoer || !toetsen) return;
    const h = (e: KeyboardEvent) => {
      if (geblokkeerd) return;
      const i = toetsen.indexOf(e.key);
      if (i >= 0 && i < vraag.opties.length) onAntwoord(vraag.opties[i]);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [vraag, metInvoer, geblokkeerd, onAntwoord, toetsen]);

  function toets(t: string) {
    if (geblokkeerd) return;
    setInvoer((x) => (t === '⌫' ? x.slice(0, -1) : (x + t).slice(0, 8)));
  }

  function verstuur() {
    if (!geblokkeerd && invoer.trim()) onAntwoord(invoer);
  }

  const knopKlasse = (o: string) => {
    if (!markeer) return '';
    if (o === markeer.juist) return 'juist';
    if (o === markeer.gegeven) return 'fout';
    return 'dof';
  };

  return (
    <div className={`vraagkaart ${compact ? 'compact' : ''}`}>
      <div className="vraag-kop">
        <div className={`prompt ${vraag.prompt.length <= 12 && !vraag.visual ? 'reuze' : ''}`}>
          <RijkeTekst tekst={vraag.prompt} />
        </div>
        {kanVoorlezen() && (
          <button className="luister" onClick={leesVoor} aria-label="Lees voor" type="button">
            🔊
          </button>
        )}
      </div>
      {vraag.visual && (
        <div className="visual">
          <VisualBeeld visual={vraag.visual} />
        </div>
      )}
      {metInvoer ? (
        <div className="invoer-zone">
          <div className="invoer-rij">
            <input
              ref={invoerRef}
              className="invoer"
              value={invoer}
              inputMode="none"
              autoComplete="off"
              onChange={(e) => setInvoer(e.target.value.replace(/[^0-9,.\-a-zA-Zàâçéèêëîïôûùüÿœæ' ]/g, '').slice(0, 12))}
              onKeyDown={(e) => e.key === 'Enter' && verstuur()}
              disabled={geblokkeerd}
              placeholder="?"
            />
            <button className="knop groot" onClick={verstuur} disabled={geblokkeerd || !invoer.trim()} type="button">
              OK ✔
            </button>
          </div>
          <Cijferklavier onToets={toets} komma={/,/.test(vraag.antwoord)} />
        </div>
      ) : (
        <div className={`opties n${vraag.opties.length}`}>
          {vraag.opties.map((o, i) => (
            <button key={o} type="button" className={`optie ${knopKlasse(o)}`} disabled={geblokkeerd} onClick={() => onAntwoord(o)}>
              {toetsen?.[i] && <span className="sneltoets">{toetsen[i]}</span>}
              <AntwoordTekst tekst={o} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
