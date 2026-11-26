import { useRef, useState } from 'react';
import type { Leerjaar, Profiel, Vak } from '../core/types';
import { hashPin, opslag } from '../core/opslag';
import { useProfielen } from './ProfielContext';
import { AvatarBeeld } from './AvatarBeeld';
import { Cijferklavier } from '../spelmotor/Cijferklavier';
import { alleSpelletjes, vindSpel } from '../spelletjes/register';
import { VAKKEN } from '../wereld/werelden';
import { niveauInfo } from '../core/beloningen';
import { vindBadge } from '../core/badges';

export function Ouderzicht({ terug }: { terug: () => void }) {
  const { instellingen } = useProfielen();
  const [open, setOpen] = useState(false);
  if (!open) return <PinScherm nieuw={!instellingen.pinHash} onOk={() => setOpen(true)} terug={terug} />;
  return <Overzicht terug={terug} />;
}

function PinScherm({ nieuw, onOk, terug }: { nieuw: boolean; onOk: () => void; terug: () => void }) {
  const { instellingen, zetInstellingen } = useProfielen();
  const [pin, setPin] = useState('');
  const [eerste, setEerste] = useState<string | null>(null);
  const [fout, setFout] = useState('');

  function toets(t: string) {
    setFout('');
    const volgende = t === '⌫' ? pin.slice(0, -1) : (pin + t).slice(0, 4);
    setPin(volgende);
    if (volgende.length < 4) return;
    setTimeout(() => {
      setPin('');
      if (nieuw) {
        if (!eerste) return setEerste(volgende);
        if (eerste !== volgende) {
          setEerste(null);
          return setFout('De twee codes waren niet hetzelfde. Probeer opnieuw.');
        }
        zetInstellingen({ ...instellingen, pinHash: hashPin(volgende) });
        onOk();
      } else if (hashPin(volgende) === instellingen.pinHash) onOk();
      else setFout('Verkeerde code.');
    }, 150);
  }

  return (
    <div className="scherm centreer">
      <h1>🔒 Voor ouders</h1>
      <p>{nieuw ? (eerste ? 'Typ dezelfde code nog eens.' : 'Kies een pincode van 4 cijfers.') : 'Typ je pincode.'}</p>
      <div className="pin-bolletjes">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={i < pin.length ? 'vol' : ''} />
        ))}
      </div>
      {fout && <p className="fouttekst">{fout}</p>}
      <Cijferklavier onToets={toets} />
      <button className="knop grijs" onClick={terug}>
        ← Terug
      </button>
    </div>
  );
}

const pct = (j: number, t: number) => (t ? Math.round((j / t) * 100) : 0);

function Overzicht({ terug }: { terug: () => void }) {
  const { profielen, bewaar, verwijder, instellingen, zetInstellingen, herlaad } = useProfielen();
  const [gekozen, setGekozen] = useState<string | null>(profielen[0]?.id ?? null);
  const [melding, setMelding] = useState('');
  const bestand = useRef<HTMLInputElement>(null);
  const p = profielen.find((x) => x.id === gekozen) ?? null;

  function exporteer() {
    const blob = new Blob([opslag.exporteer()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `schoolgames-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function importeer(f: File) {
    try {
      opslag.importeer(await f.text());
      herlaad();
      setMelding('Gegevens ingeladen ✔');
    } catch (e) {
      setMelding('Inladen mislukt: ' + (e as Error).message);
    }
  }

  return (
    <div className="scherm">
      <div className="kopbalk">
        <button className="knop grijs" onClick={terug}>
          ← Terug
        </button>
        <h1>👨‍👩‍👧 Ouderzicht</h1>
        <span />
      </div>

      <div className="ouder-layout">
        <aside className="paneel">
          <h3>Kinderen</h3>
          {profielen.length === 0 && <p className="klein">Nog geen profielen.</p>}
          {profielen.map((x) => (
            <button key={x.id} className={`ouder-kind ${x.id === gekozen ? 'aan' : ''}`} onClick={() => setGekozen(x.id)}>
              <AvatarBeeld avatar={x.avatar} grootte={40} />
              <span>
                <strong>{x.naam}</strong>
                <br />
                <span className="klein">{x.leerjaar}e leerjaar</span>
              </span>
            </button>
          ))}
          <hr />
          <h3>Algemeen</h3>
          <label className="schakel">
            <input type="checkbox" checked={instellingen.geluid} onChange={(e) => zetInstellingen({ ...instellingen, geluid: e.target.checked })} />
            Geluidseffecten
          </label>
          <button className="knop klein-knop" onClick={exporteer}>
            ⬇️ Back-up maken
          </button>
          <button className="knop klein-knop" onClick={() => bestand.current?.click()}>
            ⬆️ Back-up inladen
          </button>
          <input ref={bestand} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importeer(e.target.files[0])} />
          <button
            className="knop klein-knop grijs"
            onClick={() => {
              zetInstellingen({ ...instellingen, pinHash: null });
              terug();
            }}
          >
            🔑 Pincode wijzigen
          </button>
          {melding && <p className="klein">{melding}</p>}
        </aside>

        <main className="paneel">{p ? <KindDetail p={p} bewaar={bewaar} verwijder={verwijder} /> : <p>Kies een kind.</p>}</main>
      </div>
    </div>
  );
}

function KindDetail({ p, bewaar, verwijder }: { p: Profiel; bewaar: (p: Profiel) => void; verwijder: (id: string) => void }) {
  const [bevestig, setBevestig] = useState(false);
  const niv = niveauInfo(p.xp);
  const moeilijkst = Object.entries(p.stats.fouten)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const laatsteDagen = [...p.stats.dagen].sort().slice(-7).reverse();

  return (
    <div className="kind-detail">
      <div className="kind-kop">
        <AvatarBeeld avatar={p.avatar} grootte={80} />
        <div>
          <h2>{p.naam}</h2>
          <p className="klein">
            Niveau {niv.niveau} · {p.xp} XP · 🪙 {p.muntjes} · {p.badges.length} badges · {p.stats.dagen.length} speeldagen
          </p>
          <p className="klein">
            Totaal: {p.stats.juist} van {p.stats.totaal} juist ({pct(p.stats.juist, p.stats.totaal)}%) · Langste reeks: {p.stats.besteReeks}
          </p>
        </div>
      </div>

      <h3>Per vak</h3>
      <div className="vak-balken">
        {(Object.keys(VAKKEN) as Vak[]).map((v) => {
          const s = p.stats.perVak[v];
          if (!s) return null;
          const proc = pct(s.juist, s.totaal);
          return (
            <div key={v} className="vak-balk">
              <span>
                {VAKKEN[v].icoon} {VAKKEN[v].naam}
              </span>
              <div className="balk">
                <div style={{ width: `${proc}%`, background: proc >= 80 ? '#5cc96e' : proc >= 60 ? '#ffd23f' : '#ef476f' }} />
              </div>
              <span className="klein">
                {proc}% ({s.totaal} vragen)
              </span>
            </div>
          );
        })}
        {Object.keys(p.stats.perVak).length === 0 && <p className="klein">Nog niets gespeeld.</p>}
      </div>

      <h3>Spelletjes</h3>
      <table className="tabel">
        <thead>
          <tr>
            <th>Spel</th>
            <th>Lj</th>
            <th>Sterren per niveau</th>
            <th>Gespeeld</th>
            <th>Juist</th>
          </tr>
        </thead>
        <tbody>
          {alleSpelletjes
            .filter((s) => p.spellen[s.id])
            .map((s) => {
              const v = p.spellen[s.id];
              return (
                <tr key={s.id}>
                  <td>
                    {s.icoon} {s.titel}
                  </td>
                  <td>{s.leerjaar}</td>
                  <td>{v.sterren.map((st) => '★'.repeat(st) + '☆'.repeat(3 - st)).join('  ')}</td>
                  <td>{v.gespeeld}×</td>
                  <td>{pct(v.juist, v.totaal)}%</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      <h3>Hier loopt het nog moeilijk</h3>
      {moeilijkst.length === 0 ? (
        <p className="klein">Nog geen fouten genoteerd. 👍</p>
      ) : (
        <ul className="fouten-lijst">
          {moeilijkst.map(([k, n]) => {
            const [spelId, ...rest] = k.split(':');
            return (
              <li key={k}>
                <span className="klein">{vindSpel(spelId)?.titel ?? spelId}:</span> <strong>{rest.join(':')}</strong> — {n}× fout
              </li>
            );
          })}
        </ul>
      )}

      <h3>Laatste speeldagen</h3>
      <p className="klein">{laatsteDagen.join(' · ') || '—'}</p>

      <h3>Badges</h3>
      <p>{p.badges.map((b) => vindBadge(b)?.icoon).join(' ') || '—'}</p>

      <h3>Instellingen voor {p.naam}</h3>
      <div className="veld">
        <span>Leerjaar</span>
        <div className="keuzerij">
          {([1, 2, 3, 4, 5, 6] as Leerjaar[]).map((lj) => (
            <button key={lj} className={`chip ${lj === p.leerjaar ? 'aan' : ''}`} onClick={() => bewaar({ ...p, leerjaar: lj })}>
              {lj}e
            </button>
          ))}
        </div>
      </div>
      <label className="schakel">
        <input type="checkbox" checked={p.instellingen.frans} onChange={(e) => bewaar({ ...p, instellingen: { ...p.instellingen, frans: e.target.checked } })} />
        Frans tonen in het 3e en 4e leerjaar (facultatief). Vanaf het 5e is Frans altijd zichtbaar.
      </label>
      <div className="knoppenrij">
        {!bevestig ? (
          <button className="knop rood" onClick={() => setBevestig(true)}>
            🗑️ Profiel verwijderen
          </button>
        ) : (
          <>
            <span>Zeker? Alle voortgang van {p.naam} gaat verloren.</span>
            <button className="knop rood" onClick={() => verwijder(p.id)}>
              Ja, verwijderen
            </button>
            <button className="knop grijs" onClick={() => setBevestig(false)}>
              Nee
            </button>
          </>
        )}
      </div>
    </div>
  );
}
