// 🕹️ De Speelhal: alle arcadespelletjes. Het kind kiest eerst een vak; de
// vragen komen uit de gewone spelletjes, op het niveau van het kind.

import { useMemo, useState, type ComponentType } from 'react';
import type { Beloning, Leerjaar, Profiel, SpelDef } from '../core/types';
import { useActief, useProfielen } from '../gebruikers/ProfielContext';
import { alleSpelletjes } from '../spelletjes/register';
import { hoogsteOpenNiveau, verwerkRonde } from '../core/beloningen';
import { spelZichtbaar } from '../wereld/Thuis';
import { VAKKEN, wereldVan } from '../wereld/werelden';
import { Vraagbron } from './kern/vraagbron';
import type { ArcadeProps } from './kern/ui';
import { Resultaat } from '../spelmotor/Resultaat';
import { AvatarBeeld } from '../gebruikers/AvatarBeeld';
import { Monsterjacht } from './monsterjacht/Monsterjacht';
import { Ballonnen } from './ballonnen/Ballonnen';
import { Torenbouwer } from './torenbouwer/Torenbouwer';
import { Kikkersprong } from './kikkersprong/Kikkersprong';
import { Touwtrekken, type DuoSpeler } from './touwtrekken/Touwtrekken';
import { geluid } from '../core/geluid';
import { stopSpreken } from '../core/spraak';

interface ArcadeDef {
  id: string;
  titel: string;
  icoon: string;
  beschrijving: string;
  soort: string;
  kleur: string;
  Component?: ComponentType<ArcadeProps>;
}

export const ARCADE: ArcadeDef[] = [
  { id: 'monsterjacht', titel: 'Monsterjacht', icoon: '👾', soort: 'Verdien & speel', kleur: '#4b3fb5', beschrijving: 'Verdien sterretjes met juiste antwoorden en schiet de boze monsterjes weg!', Component: Monsterjacht },
  { id: 'ballonnen', titel: 'Ballonnen prikken', icoon: '🎈', soort: 'Antwoord = doelwit', kleur: '#ef476f', beschrijving: 'Prik de ballon met het juiste antwoord.', Component: Ballonnen },
  { id: 'kikkersprong', titel: 'Kikkersprong', icoon: '🐸', soort: 'Antwoord = doelwit', kleur: '#2a9fd6', beschrijving: 'Spring op de juiste waterlelie en steek de rivier over.', Component: Kikkersprong },
  { id: 'torenbouwer', titel: 'Torenbouwer', icoon: '🏗️', soort: 'Verdien & speel', kleur: '#ff8c42', beschrijving: 'Elk juist antwoord geeft een blok. Bouw de hoogste toren!', Component: Torenbouwer },
  { id: 'touwtrekken', titel: 'Touwtrekken', icoon: '🪢', soort: 'Samen spelen', kleur: '#2e9e5b', beschrijving: 'Met z’n tweeën op één toestel. Elk op zijn eigen niveau!' },
];

type Fase =
  | { naam: 'lijst' }
  | { naam: 'vak'; arcade: ArcadeDef }
  | { naam: 'spelen'; arcade: ArcadeDef; spel: SpelDef; bron: Vraagbron; poging: number }
  | { naam: 'klaar'; arcade: ArcadeDef; spel: SpelDef; juist: number; totaal: number; punten: number; record: number; beloning: Beloning; reden: string }
  | { naam: 'duo-setup' }
  | { naam: 'duo-spelen'; spelers: [DuoSpeler, DuoSpeler] }
  | { naam: 'duo-klaar'; spelers: [DuoSpeler, DuoSpeler]; winnaar: 0 | 1 | null; beloningen: (Beloning | null)[] };

export function Speelhal({ terug }: { terug: () => void }) {
  const { profiel, bewaar } = useActief();
  const { profielen } = useProfielen();
  const [fase, setFase] = useState<Fase>({ naam: 'lijst' });

  function start(arcade: ArcadeDef, spel: SpelDef) {
    const bron = new Vraagbron(spel, hoogsteOpenNiveau(profiel, spel.id, spel.niveaus.length));
    setFase({ naam: 'spelen', arcade, spel, bron, poging: Date.now() });
  }

  const terugKnop = (actie: () => void, label = '← Terug') => (
    <button
      className="knop grijs"
      onClick={() => {
        stopSpreken();
        actie();
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="scherm speelhal">
      <div className="kopbalk">
        {fase.naam === 'lijst' ? terugKnop(terug) : terugKnop(() => setFase({ naam: 'lijst' }), '← Speelhal')}
        <h1>
          {fase.naam === 'lijst' || fase.naam === 'duo-setup' ? '🕹️ Speelhal' : 'arcade' in fase ? `${fase.arcade.icoon} ${fase.arcade.titel}` : '🪢 Touwtrekken'}
        </h1>
        <span className="muntjes">🪙 {profiel.muntjes}</span>
      </div>

      {fase.naam === 'lijst' && (
        <div className="arcade-rooster">
          {ARCADE.map((a) => (
            <button
              key={a.id}
              className="arcade-kaart"
              style={{ background: a.kleur }}
              onClick={() => {
                geluid.klik();
                setFase(a.id === 'touwtrekken' ? { naam: 'duo-setup' } : { naam: 'vak', arcade: a });
              }}
            >
              <span className="arcade-icoon">{a.icoon}</span>
              <strong>{a.titel}</strong>
              <span className="klein">{a.beschrijving}</span>
              <span className="pil">{a.soort}</span>
              {profiel.arcade[a.id] && <span className="record">🏆 record {profiel.arcade[a.id].record}</span>}
            </button>
          ))}
        </div>
      )}

      {fase.naam === 'vak' && <VakKiezer profiel={profiel} titel={`Waarmee wil je ${fase.arcade.titel.toLowerCase()} spelen?`} onKies={(spel) => start(fase.arcade, spel)} />}

      {fase.naam === 'spelen' && fase.arcade.Component && (
        <fase.arcade.Component
          key={fase.poging}
          spel={fase.spel}
          bron={fase.bron}
          avatar={profiel.avatar}
          leerjaar={profiel.leerjaar}
          onEinde={(punten, tellers, reden) => {
            stopSpreken();
            const recordVoor = profiel.arcade[fase.arcade.id]?.record ?? 0;
            const { profiel: nieuw, beloning } = verwerkRonde(profiel, fase.bron.resultaat(fase.arcade.id, punten, tellers));
            bewaar(nieuw);
            setFase({ naam: 'klaar', arcade: fase.arcade, spel: fase.spel, juist: fase.bron.juist, totaal: fase.bron.totaal, punten, record: Math.max(recordVoor, punten), beloning, reden });
          }}
        />
      )}

      {fase.naam === 'klaar' && (
        <Resultaat
          titel={`${fase.reden} · ${fase.spel.icoon} ${fase.spel.titel}`}
          juist={fase.juist}
          totaal={fase.totaal}
          punten={fase.punten}
          record={fase.record}
          beloning={fase.beloning}
          knoppen={[
            { label: '🔁 Nog eens', actie: () => start(fase.arcade, fase.spel), hoofd: true },
            { label: 'Ander vak', actie: () => setFase({ naam: 'vak', arcade: fase.arcade }) },
            { label: 'Speelhal', actie: () => setFase({ naam: 'lijst' }) },
          ]}
        />
      )}

      {fase.naam === 'duo-setup' && (
        <DuoSetup
          ik={profiel}
          anderen={profielen.filter((p) => p.id !== profiel.id)}
          onStart={(spelers) => setFase({ naam: 'duo-spelen', spelers })}
        />
      )}

      {fase.naam === 'duo-spelen' && (
        <Touwtrekken
          spelers={fase.spelers}
          onEinde={(winnaar) => {
            stopSpreken();
            const beloningen = fase.spelers.map((sp, i) => {
              const p = profielen.find((x) => x.id === sp.profielId);
              if (!p) return null;
              const punten = sp.bron.juist * 10 + (winnaar === i ? 30 : 0);
              const { profiel: nieuw, beloning } = verwerkRonde(p, sp.bron.resultaat('touwtrekken', punten, { touwtrekken: 1 }));
              bewaar(nieuw);
              return beloning;
            });
            setFase({ naam: 'duo-klaar', spelers: fase.spelers, winnaar, beloningen });
          }}
        />
      )}

      {fase.naam === 'duo-klaar' && (
        <div className="resultaat">
          <h2>{fase.winnaar === null ? 'Gelijkspel!' : `${fase.spelers[fase.winnaar].naam} wint! 🎉`}</h2>
          <div className="duo-uitslag">
            {fase.spelers.map((sp, i) => (
              <div key={i} className={`paneel ${fase.winnaar === i ? 'winnaar' : ''}`}>
                <AvatarBeeld avatar={sp.avatar} grootte={80} />
                <strong>{sp.naam}</strong>
                <p>
                  {sp.bron.juist} van {sp.bron.totaal} juist
                </p>
                {fase.beloningen[i] && (
                  <div className="beloningen">
                    <span className="pil">✨ +{fase.beloningen[i]!.xp} XP</span>
                    <span className="pil">🪙 +{fase.beloningen[i]!.muntjes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="klein">Iedereen die meedoet, verdient XP en muntjes — ook wie niet wint!</p>
          <div className="knoppenrij">
            <button className="knop groot" onClick={() => setFase({ naam: 'duo-setup' })}>
              🔁 Nog eens
            </button>
            <button className="knop grijs" onClick={() => setFase({ naam: 'lijst' })}>
              Speelhal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Kies uit welk spelletje de vragen komen: eigen leerjaar en de leerjaren ervoor. */
function VakKiezer({ profiel, titel, onKies }: { profiel: Profiel; titel: string; onKies: (s: SpelDef) => void }) {
  const leerjaren = useMemo(() => Array.from({ length: profiel.leerjaar }, (_, i) => (profiel.leerjaar - i) as Leerjaar), [profiel.leerjaar]);
  return (
    <div className="vak-kiezer">
      <p className="ondertitel">{titel}</p>
      {leerjaren.map((lj) => {
        const spellen = alleSpelletjes.filter((s) => s.leerjaar === lj && spelZichtbaar(s, profiel));
        if (!spellen.length) return null;
        const w = wereldVan(lj);
        return (
          <div key={lj} className="vak-groep">
            <h3 style={{ color: w.kleur }}>
              {w.icoon} {lj}e leerjaar
            </h3>
            <div className="vak-knoppen">
              {spellen.map((s) => (
                <button
                  key={s.id}
                  className="vak-knop"
                  style={{ borderColor: w.kleur }}
                  onClick={() => {
                    geluid.klik();
                    onKies(s);
                  }}
                >
                  <span className="spel-icoon">{s.icoon}</span>
                  <span>
                    <strong>{s.titel}</strong>
                    <br />
                    <span className="klein">
                      {VAKKEN[s.vak].icoon} {VAKKEN[s.vak].naam}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DuoSetup({ ik, anderen, onStart }: { ik: Profiel; anderen: Profiel[]; onStart: (s: [DuoSpeler, DuoSpeler]) => void }) {
  const [tweede, setTweede] = useState<Profiel | 'gast' | null>(null);
  const [gastLj, setGastLj] = useState<Leerjaar>(3);
  const [spel1, setSpel1] = useState<SpelDef | null>(null);

  const gastProfiel: Profiel = useMemo(
    () => ({ ...ik, id: 'gast', naam: 'Gast', leerjaar: gastLj, avatar: { dier: 'beer', kleur: 'blauw', hoed: null, bril: null, extra: null }, spellen: {}, instellingen: { frans: true } }),
    [ik, gastLj],
  );

  if (!tweede) {
    return (
      <div className="duo-setup">
        <p className="ondertitel">Met wie speel je Touwtrekken?</p>
        <div className="profiel-rooster">
          {anderen.map((p) => (
            <button key={p.id} className="profiel-kaart" onClick={() => setTweede(p)}>
              <AvatarBeeld avatar={p.avatar} grootte={80} />
              <strong>{p.naam}</strong>
              <span className="klein">{p.leerjaar}e leerjaar</span>
            </button>
          ))}
          <div className="profiel-kaart gast">
            <span className="plus">🧸</span>
            <strong>Gast</strong>
            <div className="keuzerij">
              {([1, 2, 3, 4, 5, 6] as Leerjaar[]).map((lj) => (
                <button key={lj} className={`chip ${gastLj === lj ? 'aan' : ''}`} onClick={() => setGastLj(lj)}>
                  {lj}e
                </button>
              ))}
            </div>
            <button className="knop" onClick={() => setTweede('gast')}>
              Speel als gast
            </button>
          </div>
        </div>
      </div>
    );
  }

  const p2 = tweede === 'gast' ? gastProfiel : tweede;
  const bron = (p: Profiel, s: SpelDef) => new Vraagbron(s, hoogsteOpenNiveau(p, s.id, s.niveaus.length));

  if (!spel1) return <VakKiezer profiel={ik} titel={`🔴 ${ik.naam}, kies je vak`} onKies={setSpel1} />;
  return (
    <VakKiezer
      profiel={p2}
      titel={`🔵 ${p2.naam}, kies je vak`}
      onKies={(spel2) =>
        onStart([
          { naam: ik.naam, avatar: ik.avatar, bron: bron(ik, spel1), profielId: ik.id },
          { naam: p2.naam, avatar: p2.avatar, bron: bron(p2, spel2), profielId: tweede === 'gast' ? null : p2.id },
        ])
      }
    />
  );
}
