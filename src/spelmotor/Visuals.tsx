import type { Visual } from '../core/types';

/** Toont "3/4" als echte breuk, andere tekst gewoon. */
export function AntwoordTekst({ tekst }: { tekst: string }) {
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
  }
}

function Tel({ emoji, aantal }: { emoji: string; aantal: number }) {
  // in groepjes van 5 zodat tellen makkelijker wordt
  const groepen: number[] = [];
  for (let i = 0; i < aantal; i += 5) groepen.push(Math.min(5, aantal - i));
  return (
    <div className={`visual-tel ${aantal > 10 ? 'veel' : ''}`}>
      {groepen.map((g, i) => (
        <div key={i} className="tel-groep">
          {Array.from({ length: g }, (_, j) => (
            <span key={j} style={{ animationDelay: `${(i * 5 + j) * 40}ms` }}>
              {emoji}
            </span>
          ))}
        </div>
      ))}
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
