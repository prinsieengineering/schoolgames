// De vraagbron "leent" vragen uit een gewoon spelletje en past het niveau
// automatisch aan: 4 juist na elkaar = niveau omhoog, 2 fout na elkaar = omlaag.

import type { RondeResultaat, SpelDef, Vraag } from '../../core/types';
import { isJuist } from '../../spelmotor/antwoord';

export class Vraagbron {
  niveau: number;
  juist = 0;
  totaal = 0;
  reeks = 0;
  besteReeks = 0;
  private foutReeks = 0;
  private recent: string[] = [];
  private fouten: string[] = [];

  constructor(
    public spel: SpelDef,
    startNiveau: number,
  ) {
    this.niveau = startNiveau;
  }

  volgende(): Vraag {
    let v = this.spel.maak(this.niveau);
    for (let i = 0; i < 12 && this.recent.includes(v.sleutel); i++) v = this.spel.maak(this.niveau);
    this.recent.push(v.sleutel);
    if (this.recent.length > 6) this.recent.shift();
    return v;
  }

  /** Verwerk een antwoord; geeft terug of het juist was. */
  verwerk(v: Vraag, gegeven: string): boolean {
    const ok = isJuist(v, gegeven);
    this.totaal++;
    if (ok) {
      this.juist++;
      this.reeks++;
      this.foutReeks = 0;
      this.besteReeks = Math.max(this.besteReeks, this.reeks);
      if (this.reeks % 4 === 0 && this.niveau < this.spel.niveaus.length - 1) this.niveau++;
    } else {
      this.reeks = 0;
      this.foutReeks++;
      this.fouten.push(v.sleutel);
      if (this.foutReeks >= 2 && this.niveau > 0) {
        this.niveau--;
        this.foutReeks = 0;
      }
    }
    return ok;
  }

  resultaat(arcadeId: string, punten: number, tellers: Record<string, number>): RondeResultaat {
    return {
      soort: 'arcade',
      id: arcadeId,
      bronSpelId: this.spel.id,
      niveau: this.niveau,
      juist: this.juist,
      totaal: this.totaal,
      besteReeks: this.besteReeks,
      foutSleutels: this.fouten,
      punten,
      tellers,
    };
  }
}
