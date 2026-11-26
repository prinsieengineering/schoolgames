import { useState } from 'react';
import type { Avatar } from '../core/types';
import { useActief } from './ProfielContext';
import { AvatarBeeld } from './AvatarBeeld';
import { KLEUREN } from './avatar';
import { heeftItem, WINKEL, type ItemSoort, type WinkelItem } from './winkelItems';
import { geluid } from '../core/geluid';

const TABS: { soort: ItemSoort; naam: string }[] = [
  { soort: 'dier', naam: '🐾 Dieren' },
  { soort: 'kleur', naam: '🎨 Kleuren' },
  { soort: 'hoed', naam: '🎩 Hoedjes' },
  { soort: 'bril', naam: '👓 Brillen' },
  { soort: 'extra', naam: '🧣 Extra' },
];

const veld = (s: ItemSoort): keyof Avatar => (s === 'dier' ? 'dier' : s);

export function Winkel({ terug }: { terug: () => void }) {
  const { profiel, bewaar } = useActief();
  const [tab, setTab] = useState<ItemSoort>('dier');
  const [melding, setMelding] = useState('');

  const items = WINKEL.filter((i) => i.soort === tab);
  const draagt = (i: WinkelItem) => profiel.avatar[veld(i.soort)] === i.waarde;

  function kiesItem(i: WinkelItem) {
    const bezit = heeftItem(profiel.bezit, i.soort, i.waarde);
    if (!bezit) {
      if (profiel.muntjes < i.prijs) {
        geluid.fout();
        setMelding(`Je hebt nog ${i.prijs - profiel.muntjes} muntjes te weinig. Speel nog wat!`);
        return;
      }
      geluid.munt();
      setMelding(`Gekocht: ${i.naam}! 🎉`);
      bewaar({ ...profiel, muntjes: profiel.muntjes - i.prijs, bezit: [...profiel.bezit, i.id], avatar: { ...profiel.avatar, [veld(i.soort)]: i.waarde } });
      return;
    }
    geluid.klik();
    const uitzetten = draagt(i) && i.soort !== 'dier' && i.soort !== 'kleur';
    bewaar({ ...profiel, avatar: { ...profiel.avatar, [veld(i.soort)]: uitzetten ? null : i.waarde } });
    setMelding('');
  }

  return (
    <div className="scherm">
      <div className="kopbalk">
        <button className="knop grijs" onClick={terug}>
          ← Terug
        </button>
        <h1>🛍️ Winkel</h1>
        <span className="muntjes">🪙 {profiel.muntjes}</span>
      </div>
      <div className="winkel">
        <div className="paneel avatar-voorbeeld">
          <AvatarBeeld avatar={profiel.avatar} grootte={170} className="huppel" />
          <p className="klein">{melding || 'Tik op iets om het te kopen of aan te trekken.'}</p>
        </div>
        <div className="paneel">
          <div className="keuzerij tabs">
            {TABS.map((t) => (
              <button key={t.soort} className={`chip ${tab === t.soort ? 'aan' : ''}`} onClick={() => setTab(t.soort)}>
                {t.naam}
              </button>
            ))}
          </div>
          <div className="item-rooster">
            {items.map((i) => {
              const bezit = heeftItem(profiel.bezit, i.soort, i.waarde);
              const voorbeeld: Avatar =
                i.soort === 'kleur' ? profiel.avatar : { ...profiel.avatar, [veld(i.soort)]: i.waarde };
              return (
                <button key={i.id} className={`item ${draagt(i) ? 'aan' : ''} ${!bezit && profiel.muntjes < i.prijs ? 'te-duur' : ''}`} onClick={() => kiesItem(i)}>
                  {i.soort === 'kleur' ? (
                    <span className="kleurbol groot" style={{ background: KLEUREN[i.waarde] }} />
                  ) : (
                    <AvatarBeeld avatar={voorbeeld} grootte={64} />
                  )}
                  <span>{i.naam}</span>
                  <span className="prijs">{bezit ? (draagt(i) ? '✔ aan' : 'van jou') : `🪙 ${i.prijs}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
