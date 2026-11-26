// Het gewone quizscherm: kies een niveau, beantwoord 10 vragen, krijg je beloning.

import { useCallback, useRef, useState } from 'react';
import type { Beloning, SpelDef, SpelKeuze, Vraag } from '../core/types';
import { useActief } from '../gebruikers/ProfielContext';
import { niveauOpen, verwerkRonde } from '../core/beloningen';
import { geluid } from '../core/geluid';
import { spreek, stopSpreken } from '../core/spraak';
import { isJuist, nieuweVraag } from './antwoord';
import { VraagKaart } from './VraagKaart';
import { Resultaat } from './Resultaat';
import { AntwoordTekst } from './Visuals';
import { wereldVan } from '../wereld/werelden';
import { TafelKiezer } from './TafelKiezer';
import { bewaarTafelKeuze, tafelKeuzeTekst, tafelKeuzeVan } from '../core/tafels';

const VRAGEN_PER_RONDE = 10;

type Fase =
  | { naam: 'niveau' }
  | { naam: 'spelen'; niveau: number; keuze?: SpelKeuze; poging: number }
  | { naam: 'klaar'; niveau: number; keuze?: SpelKeuze; juist: number; beloning: Beloning };

export function SpelScherm({ spel, terug }: { spel: SpelDef; terug: () => void }) {
  const { profiel } = useActief();
  const [fase, setFase] = useState<Fase>({ naam: 'niveau' });
  const wereld = wereldVan(spel.leerjaar);

  return (
    <div className="scherm spel-scherm" style={{ background: wereld.lucht }}>
      <div className="kopbalk">
        <button
          className="knop grijs"
          onClick={() => {
            stopSpreken();
            terug();
          }}
        >
          ← Terug
        </button>
        <h1>
          {spel.icoon} {spel.titel}
        </h1>
        <span className="muntjes">🪙 {profiel.muntjes}</span>
      </div>

      {fase.naam === 'niveau' && <NiveauKeuze spel={spel} onKies={(n, keuze) => setFase({ naam: 'spelen', niveau: n, keuze, poging: Date.now() })} />}
      {fase.naam === 'spelen' && (
        <Ronde
          key={fase.poging}
          spel={spel}
          niveau={fase.niveau}
          keuze={fase.keuze}
          onKlaar={(juist, beloning) => setFase({ naam: 'klaar', niveau: fase.niveau, keuze: fase.keuze, juist, beloning })}
        />
      )}
      {fase.naam === 'klaar' && (
        <Resultaat
          titel={`${spel.titel} · ${fase.keuze?.tafels ? `🎯 ${tafelKeuzeTekst(fase.keuze.tafels)}` : spel.niveaus[fase.niveau]}`}
          juist={fase.juist}
          totaal={VRAGEN_PER_RONDE}
          beloning={fase.beloning}
          knoppen={[
            ...(!fase.keuze && fase.niveau + 1 < spel.niveaus.length && fase.beloning.sterren >= 2
              ? [{ label: 'Volgend niveau ➜', actie: () => setFase({ naam: 'spelen', niveau: fase.niveau + 1, poging: Date.now() }), hoofd: true }]
              : []),
            { label: '🔁 Nog eens', actie: () => setFase({ naam: 'spelen', niveau: fase.niveau, keuze: fase.keuze, poging: Date.now() }), hoofd: !!fase.keuze || fase.beloning.sterren < 2 },
            { label: 'Niveaus', actie: () => setFase({ naam: 'niveau' }) },
            { label: 'Naar de wereld', actie: terug },
          ]}
        />
      )}
    </div>
  );
}

function NiveauKeuze({ spel, onKies }: { spel: SpelDef; onKies: (n: number, keuze?: SpelKeuze) => void }) {
  const { profiel, bewaar } = useActief();
  const v = profiel.spellen[spel.id];
  return (
    <div className="niveau-keuze">
      <p className="ondertitel">{spel.beschrijving}</p>
      <div className="niveau-rooster">
        {spel.niveaus.map((naam, i) => {
          const open = niveauOpen(profiel, spel.id, i);
          const st = v?.sterren[i] ?? 0;
          return (
            <button
              key={i}
              className={`niveau-kaart ${open ? '' : 'slot'}`}
              disabled={!open}
              onClick={() => {
                geluid.klik();
                onKies(i);
              }}
            >
              <span className="niveau-nr">{open ? i + 1 : '🔒'}</span>
              <strong>{naam}</strong>
              <span className="sterren">{'★'.repeat(st) + '☆'.repeat(3 - st)}</span>
              {!open && <span className="klein">Haal 2 sterren op niveau {i}</span>}
            </button>
          );
        })}
      </div>
      {spel.tafelkeuze && (
        <div className="paneel mijn-tafels">
          <h3>🎯 Mijn tafels</h3>
          <p className="klein">Vink zelf aan welke tafels je wil oefenen.</p>
          <TafelKiezer waarde={tafelKeuzeVan(profiel)} onWijzig={(k) => bewaar(bewaarTafelKeuze(profiel, k))} />
          <button
            className="knop groot"
            onClick={() => {
              geluid.klik();
              onKies(0, { tafels: tafelKeuzeVan(profiel) });
            }}
          >
            Oefen {tafelKeuzeTekst(tafelKeuzeVan(profiel))} ➜
          </button>
        </div>
      )}
    </div>
  );
}

function Ronde({ spel, niveau, keuze, onKlaar }: { spel: SpelDef; niveau: number; keuze?: SpelKeuze; onKlaar: (juist: number, b: Beloning) => void }) {
  const { profiel, bewaar } = useActief();
  const gehad = useRef(new Set<string>());
  const [vraag, setVraag] = useState<Vraag>(() => nieuweVraag(() => spel.maak(niveau, keuze), gehad.current));
  const [nr, setNr] = useState(1);
  const [juist, setJuist] = useState(0);
  const [reeks, setReeks] = useState(0);
  const [besteReeks, setBesteReeks] = useState(0);
  const [fouten, setFouten] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ juist: boolean; gegeven: string } | null>(null);

  const volgende = useCallback(
    (nieuwJuist: number, nieuweFouten: string[], beste: number) => {
      setFeedback(null);
      if (nr >= VRAGEN_PER_RONDE) {
        const { profiel: nieuw, beloning } = verwerkRonde(profiel, {
          soort: 'quiz',
          id: spel.id,
          bronSpelId: spel.id,
          niveau,
          juist: nieuwJuist,
          totaal: VRAGEN_PER_RONDE,
          besteReeks: beste,
          foutSleutels: nieuweFouten,
          eigenKeuze: !!keuze,
        });
        bewaar(nieuw);
        onKlaar(nieuwJuist, beloning);
        return;
      }
      setNr((n) => n + 1);
      setVraag(nieuweVraag(() => spel.maak(niveau, keuze), gehad.current));
    },
    [nr, profiel, spel, niveau, keuze, bewaar, onKlaar],
  );

  const antwoord = useCallback(
    (gegeven: string) => {
      if (feedback) return;
      const ok = isJuist(vraag, gegeven);
      const nieuwJuist = juist + (ok ? 1 : 0);
      const nieuweReeks = ok ? reeks + 1 : 0;
      const beste = Math.max(besteReeks, nieuweReeks);
      const nieuweFouten = ok ? fouten : [...fouten, vraag.sleutel];
      setJuist(nieuwJuist);
      setReeks(nieuweReeks);
      setBesteReeks(beste);
      setFouten(nieuweFouten);
      setFeedback({ juist: ok, gegeven });
      if (ok) {
        geluid.juist();
        if (vraag.uitspraak) spreek(vraag.uitspraak.tekst, vraag.uitspraak.taal);
        setTimeout(() => volgende(nieuwJuist, nieuweFouten, beste), vraag.uitspraak ? 1400 : 900);
      } else {
        geluid.fout();
        if (vraag.uitspraak) spreek(vraag.uitspraak.tekst, vraag.uitspraak.taal);
      }
    },
    [feedback, vraag, juist, reeks, besteReeks, fouten, volgende],
  );

  return (
    <div className="ronde">
      <div className="voortgang">
        <div className="voortgang-balk">
          <div style={{ width: `${((nr - (feedback ? 0 : 1)) / VRAGEN_PER_RONDE) * 100}%` }} />
        </div>
        <span>
          {nr}/{VRAGEN_PER_RONDE}
        </span>
        <span className={`reeks ${reeks >= 3 ? 'heet' : ''}`}>🔥 {reeks}</span>
      </div>

      <VraagKaart
        vraag={vraag}
        onAntwoord={antwoord}
        autoVoorlezen={spel.voorlezen}
        geblokkeerd={!!feedback}
        markeer={feedback ? { gegeven: feedback.gegeven, juist: vraag.antwoord } : null}
      />

      {feedback && (
        <div className={`feedback ${feedback.juist ? 'goed' : 'fout'}`}>
          {feedback.juist ? (
            <span className="pop">Juist! 🎉 +10 XP</span>
          ) : (
            <>
              <div>
                Bijna! Het juiste antwoord is{' '}
                <strong className="groot-antwoord">
                  <AntwoordTekst tekst={vraag.antwoord} />
                </strong>
              </div>
              {vraag.uitleg && <div className="uitleg">💡 {vraag.uitleg}</div>}
              <button className="knop groot" autoFocus onClick={() => volgende(juist, fouten, besteReeks)}>
                Verder ➜
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
