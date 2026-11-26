import { getalbeeld, hoeveelheid } from '../core/getalbeeld';
import type { Visual } from '../core/types';

/** Toont "3/4" als echte breuk, andere tekst gewoon. */
export function AntwoordTekst({ tekst }: { tekst: string }) {
  const h = hoeveelheid(tekst);
  if (h) return <Getalbeeld emoji={h.emoji} aantal={h.aantal} klein />;
  const m = /^(\d+)\/(\d+)$/.exec(tekst);
  if (!m) return <>{tekst}</>;
  return (
    <span className="breuk">
      <span>{m[1]}</span>
      <span>{m[2]}</span>
    </span>
  );
}

/** Tekst met breuken ("1/2 = ?/8") mooi weergegeven. */
export function RijkeTekst({ tekst }: { tekst: string }) {
  const delen = tekst.split(/(\d+\/\d+|\?\/\d+)/g);
  return (
    <>
      {delen.map((d, i) => {
        const m = /^(\d+|\?)\/(\d+)$/.exec(d);
        return m ? (
          <span key={i} className="breuk">
            <span>{m[1]}</span>
            <span>{m[2]}</span>
          </span>
        ) : (
          <span key={i}>{d}</span>
        );
      })}
    </>
  );
}

export function VisualBeeld({ visual }: { visual: Visual }) {
  switch (visual.type) {
    case 'tel':
      return <Tel emoji={visual.emoji} aantal={visual.aantal} />;
    case 'klok':
      return <Klok uur={visual.uur} minuut={visual.minuut} />;
    case 'breuk':
      return visual.vorm === 'taart' ? <Taart teller={visual.teller} noemer={visual.noemer} /> : <Strook teller={visual.teller} noemer={visual.noemer} />;
    case 'emoji':
      return <div className="visual-emoji">{visual.tekst}</div>;
    case 'kleur':
      return <div className="visual-kleur" style={{ background: visual.kleur }} />;
    case 'munten':
      return <Munten centen={visual.centen} />;
    case 'rechthoek':
      return <Rechthoek breedte={visual.breedte} hoogte={visual.hoogte} eenheid={visual.eenheid} />;
  }
}

const MUNTKLEUR: Record<number, [string, string]> = {
  // [vulling, rand] — koper (1-5 c), goud (10-50 c), tweekleurig (1-2 €)
  1: ['#d98a4a', '#9c5a26'], 2: ['#d98a4a', '#9c5a26'], 5: ['#d98a4a', '#9c5a26'],
  10: ['#f2c94c', '#b8902a'], 20: ['#f2c94c', '#b8902a'], 50: ['#f2c94c', '#b8902a'],
  100: ['#e8e8e8', '#f2c94c'], 200: ['#f2c94c', '#e0e0e0'],
};
const BRIEFKLEUR: Record<number, string> = { 500: '#b8b8b8', 1000: '#e8857a', 2000: '#7aa6e8', 5000: '#f0a860' };

function Munten({ centen }: { centen: number[] }) {
  return (
    <div className="visual-munten">
      {centen.map((c, i) =>
        c >= 500 ? (
          <svg key={i} viewBox="0 0 120 64" className="briefje" style={{ animationDelay: `${i * 60}ms` }}>
            <rect x="2" y="2" width="116" height="60" rx="6" fill={BRIEFKLEUR[c] ?? '#ccc'} stroke="rgba(0,0,0,.3)" strokeWidth="2" />
            <circle cx="92" cy="32" r="16" fill="rgba(255,255,255,.35)" />
            <text x="34" y="42" textAnchor="middle" fontSize="28" fontWeight="900" fill="#fff" stroke="rgba(0,0,0,.35)" strokeWidth="1">
              {c / 100}
            </text>
            <text x="92" y="38" textAnchor="middle" fontSize="16" fontWeight="900" fill="#fff">€</text>
          </svg>
        ) : (
          <svg key={i} viewBox="0 0 64 64" className={`munt ${c >= 100 ? 'groot' : c >= 10 ? 'middel' : 'klein'}`} style={{ animationDelay: `${i * 60}ms` }}>
            <circle cx="32" cy="32" r="30" fill={MUNTKLEUR[c]?.[1] ?? '#ccc'} />
            <circle cx="32" cy="32" r={c >= 100 ? 21 : 26} fill={MUNTKLEUR[c]?.[0] ?? '#ddd'} />
            <text x="32" y="38" textAnchor="middle" fontSize={c >= 100 ? 18 : 17} fontWeight="900" fill="#5a4100">
              {c >= 100 ? `${c / 100}€` : `${c}c`}
            </text>
          </svg>
        ),
      )}
    </div>
  );
}

function Rechthoek({ breedte, hoogte, eenheid }: { breedte: number; hoogte: number; eenheid: string }) {
  // schaal zodat de verhouding klopt maar alles in het vak past
  const max = Math.max(breedte, hoogte);
  const w = (breedte / max) * 170;
  const h = Math.max(30, (hoogte / max) * 130);
  // links iets minder plaats, rechts ruimte voor het label van de hoogte
  const x = (200 - w) / 2;
  const y = (190 - h) / 2;
  const tegels = breedte * hoogte <= 60 && Number.isInteger(breedte) && Number.isInteger(hoogte);
  return (
    <svg className="visual-rechthoek" viewBox="0 0 260 190" role="img" aria-label="rechthoek">
      <rect x={x} y={y} width={w} height={h} fill="#d6f1ff" stroke="#1f5fc9" strokeWidth="4" rx="2" />
      {tegels &&
        Array.from({ length: breedte - 1 }, (_, i) => (
          <line key={`v${i}`} x1={x + ((i + 1) * w) / breedte} y1={y} x2={x + ((i + 1) * w) / breedte} y2={y + h} stroke="#9cc7ef" strokeWidth="1.5" />
        ))}
      {tegels &&
        Array.from({ length: hoogte - 1 }, (_, i) => (
          <line key={`h${i}`} x1={x} y1={y + ((i + 1) * h) / hoogte} x2={x + w} y2={y + ((i + 1) * h) / hoogte} stroke="#9cc7ef" strokeWidth="1.5" />
        ))}
      <text x={x + w / 2} y={y + h + 22} textAnchor="middle" fontSize="18" fontWeight="800" fill="#333">
        {String(breedte).replace('.', ',')} {eenheid}
      </text>
      <text x={x + w + 8} y={y + h / 2 + 6} fontSize="18" fontWeight="800" fill="#333">
        {String(hoogte).replace('.', ',')} {eenheid}
      </text>
    </svg>
  );
}

/** Een hoeveelheid als getalbeeld: dobbelsteen tot 6, daarna tienvelden. */
export function Getalbeeld({ emoji, aantal, klein = false }: { emoji: string; aantal: number; klein?: boolean }) {
  const velden = getalbeeld(aantal);
  return (
    <span className={`getalbeeld ${klein ? 'klein' : ''}`} role="img" aria-label={`${aantal}`}>
      {velden.map((v, i) => (
        <span
          key={i}
          className={`getalveld ${v.kader ? 'tienveld' : 'dobbelsteen'}`}
          style={{ gridTemplateColumns: `repeat(${v.kolommen}, 1fr)`, gridTemplateRows: `repeat(${v.rijen}, 1fr)` }}
        >
          {v.vakjes.map((vk, j) => (
            <span key={j} className={`vakje ${vk.vol ? 'vol' : ''}`} style={{ gridColumn: vk.x + 1, gridRow: vk.y + 1, animationDelay: `${(i * 10 + j) * 40}ms` }}>
              {vk.vol ? emoji : ''}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

function Tel({ emoji, aantal }: { emoji: string; aantal: number }) {
  return (
    <div className={`visual-tel ${aantal > 10 ? 'veel' : ''}`}>
      <Getalbeeld emoji={emoji} aantal={aantal} />
    </div>
  );
}

function Klok({ uur, minuut }: { uur: number; minuut: number }) {
  const uurHoek = ((uur % 12) + minuut / 60) * 30;
  const minHoek = minuut * 6;
  return (
    <svg className="visual-klok" viewBox="0 0 200 200" role="img" aria-label="klok">
      <circle cx="100" cy="100" r="94" fill="#fff" stroke="#4b3fb5" strokeWidth="8" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i * 6 * Math.PI) / 180;
        const r1 = i % 5 === 0 ? 76 : 82;
        return (
          <line key={i} x1={100 + Math.sin(a) * r1} y1={100 - Math.cos(a) * r1} x2={100 + Math.sin(a) * 86} y2={100 - Math.cos(a) * 86} stroke="#999" strokeWidth={i % 5 === 0 ? 3 : 1} />
        );
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const n = i + 1;
        const a = (n * 30 * Math.PI) / 180;
        return (
          <text key={n} x={100 + Math.sin(a) * 62} y={100 - Math.cos(a) * 62 + 7} textAnchor="middle" fontSize="20" fontWeight="700" fill="#333">
            {n}
          </text>
        );
      })}
      <line x1="100" y1="100" x2="100" y2="52" stroke="#ef476f" strokeWidth="8" strokeLinecap="round" transform={`rotate(${uurHoek} 100 100)`} />
      <line x1="100" y1="100" x2="100" y2="26" stroke="#4b3fb5" strokeWidth="5" strokeLinecap="round" transform={`rotate(${minHoek} 100 100)`} />
      <circle cx="100" cy="100" r="7" fill="#333" />
    </svg>
  );
}

function Taart({ teller, noemer }: { teller: number; noemer: number }) {
  const r = 80;
  const stukken = Array.from({ length: noemer }, (_, i) => {
    const a0 = (i / noemer) * 2 * Math.PI - Math.PI / 2;
    const a1 = ((i + 1) / noemer) * 2 * Math.PI - Math.PI / 2;
    const groot = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 ${groot} 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} Z`;
    return <path key={i} d={d} fill={i < teller ? '#ffb703' : '#fff4dc'} stroke="#c47f00" strokeWidth="3" />;
  });
  return (
    <svg className="visual-breuk" viewBox="0 0 200 200" role="img" aria-label="breuk">
      {noemer === 1 ? <circle cx="100" cy="100" r={r} fill="#ffb703" stroke="#c47f00" strokeWidth="3" /> : stukken}
    </svg>
  );
}

function Strook({ teller, noemer }: { teller: number; noemer: number }) {
  const b = 260 / noemer;
  return (
    <svg className="visual-strook" viewBox="0 0 280 70" role="img" aria-label="breuk">
      {Array.from({ length: noemer }, (_, i) => (
        <rect key={i} x={10 + i * b} y={10} width={b} height={50} fill={i < teller ? '#4d96ff' : '#e6f0ff'} stroke="#1f5fc9" strokeWidth="3" rx="3" />
      ))}
    </svg>
  );
}
