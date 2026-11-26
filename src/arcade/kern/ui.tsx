// Gedeelde schermonderdelen voor de arcade: opdrachtpaneel, aanraakknoppen, HUD.

import { useEffect, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import type { Avatar, Leerjaar, SpelDef, Vraag } from '../../core/types';
import { VraagKaart } from '../../spelmotor/VraagKaart';
import { geluid } from '../../core/geluid';
import { spreek } from '../../core/spraak';
import type { Vraagbron } from './vraagbron';
import { RijkeTekst, VisualBeeld } from '../../spelmotor/Visuals';
import { kanVoorlezen } from '../../core/spraak';

/** Wat elk arcadespel van de Speelhal meekrijgt. */
export interface ArcadeProps {
  spel: SpelDef;
  bron: Vraagbron;
  avatar: Avatar;
  leerjaar: Leerjaar;
  /** Het spel is gedaan. */
  onEinde: (punten: number, tellers: Record<string, number>, reden: string) => void;
}

/** Soort A: vraag in een paneel; juist antwoord = beloning in het spel. */
export function Opdrachtpaneel({
  bron,
  onAntwoord,
  toetsen,
  gepauzeerd,
  titel = 'Opdracht',
  beloningTekst,
}: {
  bron: Vraagbron;
  onAntwoord: (juist: boolean) => void;
  toetsen?: string[] | null;
  gepauzeerd?: boolean;
  titel?: ReactNode;
  beloningTekst?: string;
}) {
  const [vraag, setVraag] = useState<Vraag>(() => bron.volgende());
  const [fb, setFb] = useState<{ gegeven: string; ok: boolean } | null>(null);
  const levend = useRef(true);
  useEffect(() => {
    levend.current = true;
    return () => {
      levend.current = false;
    };
  }, []);

  function antwoord(gegeven: string) {
    if (fb || gepauzeerd) return;
    const ok = bron.verwerk(vraag, gegeven);
    setFb({ gegeven, ok });
    if (ok) geluid.juist();
    else geluid.fout();
    if (vraag.uitspraak) spreek(vraag.uitspraak.tekst, vraag.uitspraak.taal);
    onAntwoord(ok);
    setTimeout(
      () => {
        if (!levend.current) return;
        setFb(null);
        setVraag(bron.volgende());
      },
      ok ? 500 : 1700,
    );
  }

  return (
    <div className={`opdrachtpaneel ${fb ? (fb.ok ? 'goed' : 'fout') : ''}`}>
      <div className="paneel-titel">
        <span>{titel}</span>
        {bron.reeks >= 2 && <span className="reeks heet">🔥 {bron.reeks}</span>}
      </div>
      <VraagKaart
        vraag={vraag}
        onAntwoord={antwoord}
        invoerToegestaan={false}
        geblokkeerd={!!fb || gepauzeerd}
        compact
        markeer={fb ? { gegeven: fb.gegeven, juist: vraag.antwoord } : null}
        autoVoorlezen={bron.spel.voorlezen}
        toetsen={toetsen}
      />
      <div className="paneel-voet">
        {fb ? (fb.ok ? <strong className="pop">{beloningTekst ?? 'Juist!'}</strong> : <span>Het was: <strong>{vraag.antwoord}</strong></span>) : <span className="klein">Antwoord juist om te verdienen!</span>}
      </div>
    </div>
  );
}

/** Soort B: enkel de vraag tonen (de antwoorden zitten in het spel). */
export function VraagBalk({ vraag, melding }: { vraag: Vraag; melding?: ReactNode }) {
  return (
    <div className="vraagbalk">
      {vraag.visual && (
        <div className="vraagbalk-visual">
          <VisualBeeld visual={vraag.visual} />
        </div>
      )}
      <div className="vraagbalk-tekst">
        <RijkeTekst tekst={vraag.prompt} />
        {melding && <div className="klein">{melding}</div>}
      </div>
      {kanVoorlezen() && (
        <button className="luister" onClick={() => spreek(vraag.voorlezen ?? vraag.prompt, vraag.taal ?? 'nl-BE')} aria-label="Lees voor">
          🔊
        </button>
      )}
    </div>
  );
}

/** Knop die "ingedrukt" blijft zolang je hem vasthoudt (voor bewegen op tablet). */
export function HoudKnop({ toets, ingedrukt, children, className = '' }: { toets: string; ingedrukt: MutableRefObject<Set<string>>; children: ReactNode; className?: string }) {
  const los = () => ingedrukt.current.delete(toets);
  return (
    <button
      className={`aanraakknop ${className}`}
      onPointerDown={(e) => {
        e.preventDefault();
        ingedrukt.current.add(toets);
      }}
      onPointerUp={los}
      onPointerLeave={los}
      onPointerCancel={los}
      onContextMenu={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

export function Hud({ items }: { items: ReactNode[] }) {
  return (
    <div className="hud">
      {items.map((it, i) => (
        <span key={i} className="hud-item">
          {it}
        </span>
      ))}
    </div>
  );
}

export const hartjesTekst = (n: number, max = 3) => '❤️'.repeat(Math.max(0, n)) + '🤍'.repeat(Math.max(0, max - n));

export const tijdTekst = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
