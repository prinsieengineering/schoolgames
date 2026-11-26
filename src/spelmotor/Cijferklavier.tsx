// Groot cijferklavier op het scherm (tablet). Het gewone toetsenbord werkt ook.

export function Cijferklavier({
  onToets,
  komma = false,
}: {
  onToets: (t: string) => void;
  komma?: boolean;
}) {
  const toetsen = ['7', '8', '9', '4', '5', '6', '1', '2', '3', komma ? ',' : '', '0', '⌫'];
  return (
    <div className="cijferklavier">
      {toetsen.map((t, i) =>
        t ? (
          <button key={i} type="button" className={`toets ${t === '⌫' ? 'wis' : ''}`} onClick={() => onToets(t)}>
            {t}
          </button>
        ) : (
          <span key={i} />
        ),
      )}
    </div>
  );
}
