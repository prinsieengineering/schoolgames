import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AppInstellingen, Avatar, Leerjaar, Profiel } from '../core/types';
import { opslag } from '../core/opslag';
import { maakId } from '../core/random';
import { zetGeluid } from '../core/geluid';
import { normaliseerAvatar } from './avatar';

/** Profielen laden en oude avatars (van versie 0.1) omzetten. */
const laadProfielen = (): Profiel[] => opslag.profielen().map((p) => ({ ...p, avatar: normaliseerAvatar(p.avatar) }));

interface ProfielContextWaarde {
  profielen: Profiel[];
  actief: Profiel | null;
  kies: (id: string | null) => void;
  maak: (naam: string, leerjaar: Leerjaar, avatar: Avatar) => Profiel;
  /** Werk een profiel bij (standaard het actieve) en bewaar het meteen. */
  bewaar: (p: Profiel) => void;
  verwijder: (id: string) => void;
  herlaad: () => void;
  instellingen: AppInstellingen;
  zetInstellingen: (i: AppInstellingen) => void;
}

const Ctx = createContext<ProfielContextWaarde | null>(null);

export function nieuwProfiel(naam: string, leerjaar: Leerjaar, avatar: Avatar): Profiel {
  return {
    id: maakId(),
    naam,
    leerjaar,
    avatar,
    xp: 0,
    muntjes: 20,
    bezit: [],
    badges: [],
    spellen: {},
    arcade: {},
    stats: { juist: 0, totaal: 0, besteReeks: 0, dagen: [], fouten: {}, perVak: {}, tellers: {} },
    instellingen: { frans: leerjaar >= 5 },
    aangemaakt: Date.now(),
  };
}

export function ProfielProvider({ children }: { children: ReactNode }) {
  const [profielen, setProfielen] = useState<Profiel[]>(laadProfielen);
  const [actiefId, setActiefId] = useState<string | null>(() => sessionStorage.getItem('schoolgames.actief'));
  const [instellingen, setInst] = useState<AppInstellingen>(() => opslag.instellingen());

  useEffect(() => zetGeluid(instellingen.geluid), [instellingen.geluid]);

  const herlaad = useCallback(() => setProfielen(laadProfielen()), []);

  const kies = useCallback((id: string | null) => {
    setActiefId(id);
    if (id) sessionStorage.setItem('schoolgames.actief', id);
    else sessionStorage.removeItem('schoolgames.actief');
  }, []);

  const bewaar = useCallback((p: Profiel) => {
    opslag.bewaarProfiel(p);
    setProfielen(laadProfielen());
  }, []);

  const maak = useCallback(
    (naam: string, leerjaar: Leerjaar, avatar: Avatar) => {
      const p = nieuwProfiel(naam, leerjaar, avatar);
      bewaar(p);
      return p;
    },
    [bewaar],
  );

  const verwijder = useCallback(
    (id: string) => {
      opslag.verwijderProfiel(id);
      setProfielen(laadProfielen());
      if (actiefId === id) kies(null);
    },
    [actiefId, kies],
  );

  const zetInstellingen = useCallback((i: AppInstellingen) => {
    opslag.bewaarInstellingen(i);
    setInst(i);
  }, []);

  const waarde = useMemo<ProfielContextWaarde>(
    () => ({
      profielen,
      actief: profielen.find((p) => p.id === actiefId) ?? null,
      kies,
      maak,
      bewaar,
      verwijder,
      herlaad,
      instellingen,
      zetInstellingen,
    }),
    [profielen, actiefId, kies, maak, bewaar, verwijder, herlaad, instellingen, zetInstellingen],
  );

  return <Ctx.Provider value={waarde}>{children}</Ctx.Provider>;
}

export function useProfielen() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useProfielen buiten ProfielProvider');
  return c;
}

/** Het actieve profiel (alleen gebruiken in schermen waar er zeker één is). */
export function useActief() {
  const { actief, bewaar } = useProfielen();
  if (!actief) throw new Error('Geen actief profiel');
  return { profiel: actief, bewaar };
}
