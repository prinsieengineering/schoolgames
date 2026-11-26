// Register van alle spelletjes. Nieuw spel? Voeg het toe aan de lijst van zijn leerjaar.

import type { Leerjaar, SpelDef } from '../core/types';
import { KLEUTER } from './kleuter';
import { LEERJAAR1 } from './leerjaar1';
import { LEERJAAR2 } from './leerjaar2';
import { LEERJAAR3 } from './leerjaar3';
import { LEERJAAR4 } from './leerjaar4';
import { LEERJAAR5 } from './leerjaar5';
import { LEERJAAR6 } from './leerjaar6';

export const alleSpelletjes: SpelDef[] = [...KLEUTER, ...LEERJAAR1, ...LEERJAAR2, ...LEERJAAR3, ...LEERJAAR4, ...LEERJAAR5, ...LEERJAAR6];

export const spelletjesVoor = (lj: Leerjaar) => alleSpelletjes.filter((s) => s.leerjaar === lj);

export const vindSpel = (id: string) => alleSpelletjes.find((s) => s.id === id);
