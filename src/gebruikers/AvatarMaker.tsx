// Samenstellen van je personage: kies kat, hond of robot en daarna elk onderdeel.
// Gebruikt bij "Maak je personage" (enkel gratis onderdelen) en in de winkel (kopen met muntjes).

import { useState } from 'react';
import type { Avatar, Soort } from '../core/types';
import { AvatarBeeld } from './AvatarBeeld';
import { SOORTEN, kleurSleutel, variantNaam, verrasAvatar } from './avatar';
import { heeftItem, isGratis, itemId, prijs } from './winkelItems';
import { geluid } from '../core/geluid';

interface Props {
  avatar: Avatar;
  /** Nieuwe avatar; bij een aankoop ook het item en de prijs. */
  onWijzig: (a: Avatar, aankoop?: { id: string; kost: number }) => void;
  /** 'nieuw' = enkel gratis; 'winkel' = kopen met muntjes. */
  modus: 'nieuw' | 'winkel';
  bezit?: string[];
  muntjes?: number;
}

export function AvatarMaker({ avatar, onWijzig, modus, bezit = [], muntjes = 0 }: Props) {
  const info = SOORTEN[avatar.soort];
  const tabs = [...info.onderdelen.map((o) => ({ id: o.id, naam: o.naam, icoon: o.icoon })), ...info.kleuren.map((k) => ({ id: kleurSleutel(k.id), naam: k.naam, icoon: '🎨' }))];
  const [tab, setTab] = useState(tabs[0].id);
  const huidigeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0].id;

  const kleur = info.kleuren.find((k) => kleurSleutel(k.id) === huidigeTab);
  const onderdeel = info.onderdelen.find((o) => o.id === huidigeTab);
  const keuzes: string[] = kleur ? kleur.waarden : onderdeel ? [...(onderdeel.optioneel ? ['geen'] : []), ...onderdeel.varianten] : [];

  function wisselSoort(s: Soort) {
    if (s === avatar.soort) return;
    geluid.klik();
    onWijzig(verrasAvatar(s, isGratis));
  }

  function kies(waarde: string) {
    const nieuw = { ...avatar, delen: { ...avatar.delen, [huidigeTab]: waarde } };
    if (heeftItem(bezit, avatar.soort, huidigeTab, waarde)) {
      geluid.klik();
      onWijzig(nieuw);
    } else if (modus === 'nieuw') geluid.fout();
    else onWijzig(nieuw, { id: itemId(avatar.soort, huidigeTab, waarde), kost: prijs(avatar.soort, huidigeTab, waarde) });
  }

  return (
    <div className="avatar-maker">
      <div className="paneel avatar-voorbeeld">
        <AvatarBeeld avatar={avatar} grootte={190} className="huppel rond" />
        <div className="keuzerij">
          {(Object.keys(SOORTEN) as Soort[]).map((s) => (
            <button key={s} className={`chip ${avatar.soort === s ? 'aan' : ''}`} onClick={() => wisselSoort(s)}>
              {SOORTEN[s].icoon} {SOORTEN[s].naam}
            </button>
          ))}
        </div>
        <button
          className="knop"
          onClick={() => {
            geluid.klik();
            onWijzig(verrasAvatar(avatar.soort, (so, d, w) => heeftItem(bezit, so, d, w)));
          }}
        >
          🎲 Verras me
        </button>
        {modus === 'winkel' && avatar.soort && <p className="klein">Wissel je van dier? Je gekochte spulletjes blijven van jou.</p>}
      </div>

      <div className="paneel">
        <div className="keuzerij tabs">
          {tabs.map((t) => (
            <button key={t.id} className={`chip ${huidigeTab === t.id ? 'aan' : ''}`} onClick={() => setTab(t.id)}>
              {t.icoon} {t.naam}
            </button>
          ))}
        </div>
        <div className="item-rooster">
          {keuzes.map((waarde, i) => {
            const heeft = heeftItem(bezit, avatar.soort, huidigeTab, waarde);
            const kost = prijs(avatar.soort, huidigeTab, waarde);
            const aan = avatar.delen[huidigeTab] === waarde;
            const voorbeeld: Avatar = { ...avatar, delen: { ...avatar.delen, [huidigeTab]: waarde } };
            return (
              <button
                key={waarde}
                className={`item ${aan ? 'aan' : ''} ${!heeft && (modus === 'nieuw' || muntjes < kost) ? 'te-duur' : ''}`}
                onClick={() => kies(waarde)}
                title={variantNaam(huidigeTab, waarde, onderdeel?.optioneel ? i - 1 : i)}
              >
                {kleur ? (
                  <span className="kleurbol groot" style={{ background: waarde }} />
                ) : (
                  <AvatarBeeld avatar={voorbeeld} grootte={72} achtergrond={huidigeTab === 'scene'} className="rond" />
                )}
                <span>{kleur ? '' : variantNaam(huidigeTab, waarde, onderdeel?.optioneel ? i - 1 : i)}</span>
                <span className="prijs">{heeft ? (aan ? '✔ aan' : modus === 'winkel' && kost > 0 ? 'van jou' : 'gratis') : `${modus === 'nieuw' ? '🔒' : '🪙'} ${kost}`}</span>
              </button>
            );
          })}
        </div>
        {modus === 'nieuw' && <p className="klein">🔒 Spulletjes met een slotje kan je later kopen in de winkel met muntjes!</p>}
      </div>
    </div>
  );
}
