// Gedeelde datatypes voor de hele app. Geen spelinhoud hier.

export type Leerjaar = 1 | 2 | 3 | 4 | 5 | 6;

export type Vak =
  | 'getallen'
  | 'rekenen'
  | 'klok'
  | 'breuken'
  | 'procenten'
  | 'meten'
  | 'lezen'
  | 'spelling'
  | 'frans';

export type Taal = 'nl-BE' | 'fr-FR';

/** Een plaatje of schema dat bij een vraag hoort. */
export type Visual =
  | { type: 'tel'; emoji: string; aantal: number }
  | { type: 'klok'; uur: number; minuut: number }
  | { type: 'breuk'; teller: number; noemer: number; vorm: 'taart' | 'strook' }
  | { type: 'emoji'; tekst: string }
  | { type: 'kleur'; kleur: string }
  /** Munten en briefjes, bedragen in eurocent (bv. 200 = 2 euro, 50 = 50 cent). */
  | { type: 'munten'; centen: number[] }
  /** Rechthoek met maten (omtrek / oppervlakte). */
  | { type: 'rechthoek'; breedte: number; hoogte: number; eenheid: string };

/**
 * Eén opdracht. Elke vraag heeft ALTIJD antwoordopties (ook als het quizscherm
 * een invulveld toont), zodat arcadespelletjes van "soort B" de opties op
 * ballonnen, waterlelies, ... kunnen zetten.
 */
export interface Vraag {
  /** Korte, stabiele sleutel voor statistieken (bv. "7x6"). */
  sleutel: string;
  prompt: string;
  /** Tekst die voorgelezen wordt (standaard = prompt). */
  voorlezen?: string;
  taal?: Taal;
  visual?: Visual;
  antwoord: string;
  opties: string[];
  /** Als gezet: het quizscherm toont een invulveld i.p.v. knoppen. */
  invoer?: 'getal' | 'tekst';
  uitleg?: string;
  /** Wordt uitgesproken na het antwoorden (bv. het Franse woord). */
  uitspraak?: { tekst: string; taal: Taal };
}

export interface SpelDef {
  id: string;
  titel: string;
  beschrijving: string;
  icoon: string;
  leerjaar: Leerjaar;
  vak: Vak;
  /** Namen van de niveaus, bv. ["tot 5", "tot 10", "tot 20"]. */
  niveaus: string[];
  /** Maak een nieuwe vraag op niveau 0..niveaus.length-1. */
  maak: (niveau: number) => Vraag;
  /** Vragen standaard laten voorlezen (jonge kinderen, Frans). */
  voorlezen?: boolean;
  /** Facultatief onderdeel dat ouders kunnen uitzetten. */
  facultatief?: 'frans';
  /** Verwijzing naar de leerlijn / minimumdoelen (informatief). */
  doelen?: string[];
}

// ---------- Gebruikers ----------

export type Soort = 'kat' | 'hond' | 'robot';

/** Een avatar: soort + gekozen onderdelen (bv. eyes: "happy", "kleur:fur": "#f9b379"). */
export interface Avatar {
  soort: Soort;
  delen: Record<string, string>;
}

export interface SpelVoortgang {
  /** Beste aantal sterren (0-3) per niveau. */
  sterren: number[];
  gespeeld: number;
  juist: number;
  totaal: number;
}

export interface ArcadeVoortgang {
  record: number;
  gespeeld: number;
}

export interface Profiel {
  id: string;
  naam: string;
  leerjaar: Leerjaar;
  avatar: Avatar;
  xp: number;
  muntjes: number;
  /** Gekochte winkelitems (id's). */
  bezit: string[];
  badges: string[];
  spellen: Record<string, SpelVoortgang>;
  arcade: Record<string, ArcadeVoortgang>;
  stats: {
    juist: number;
    totaal: number;
    besteReeks: number;
    /** Datums (YYYY-MM-DD) waarop gespeeld werd. */
    dagen: string[];
    /** Aantal keer fout per vraagsleutel (spelId:sleutel). */
    fouten: Record<string, number>;
    /** Juist/totaal per vak. */
    perVak: Partial<Record<Vak, { juist: number; totaal: number }>>;
    /** Vrije tellers voor badges (monsters, touwtrekken, ...). */
    tellers: Record<string, number>;
  };
  instellingen: {
    frans: boolean;
  };
  aangemaakt: number;
}

export interface AppInstellingen {
  /** Gehashte pincode voor het ouderzicht (null = nog niet ingesteld). */
  pinHash: string | null;
  geluid: boolean;
}

/** Resultaat van één ronde (quiz of arcade). */
export interface RondeResultaat {
  soort: 'quiz' | 'arcade';
  /** Spel-id (quiz) of arcade-id. */
  id: string;
  /** Het spelletje waaruit de vragen kwamen. */
  bronSpelId: string;
  niveau: number;
  juist: number;
  totaal: number;
  besteReeks: number;
  foutSleutels: string[];
  punten?: number;
  tellers?: Record<string, number>;
}

export interface Beloning {
  sterren: number;
  xp: number;
  muntjes: number;
  nieuweBadges: string[];
  nieuwRecord: boolean;
  niveauOmhoog: boolean;
}
