// 🚂 5e leerjaar: De Franse Trein
import type { SpelDef } from '../../core/types';
import { getalOpties, kies, neem, opties, rand } from '../../core/random';
import { FRANS, type FransWoord } from '../../inhoud/frans';
import { KOFSCHIP } from '../../inhoud/spelling';

const motsMagiques: SpelDef = {
  id: 'mots-magiques',
  titel: 'Mots magiques',
  beschrijving: 'Franse woordjes: kleuren, getallen, dieren, familie, school en eten.',
  icoon: '🇫🇷',
  leerjaar: 5,
  vak: 'frans',
  niveaus: ['kleuren en getallen', 'dieren en familie', 'school en eten'],
  doelen: ['Frans: woordenschat uit de thema’s van de woordenlijst bij de minimumdoelen'],
  maak(n) {
    const themas: FransWoord[][] = [
      [FRANS.kleuren, FRANS.getallen],
      [FRANS.dieren, FRANS.familie],
      [FRANS.school, FRANS.eten],
    ][n];
    const lijst = kies(themas);
    const w = kies(lijst);
    const andere = neem(lijst.filter((x) => x.fr !== w.fr), 3).map((x) => x.fr);
    const omgekeerd = n > 0 && Math.random() < 0.3;
    if (omgekeerd) {
      // Frans woord → betekenis kiezen
      const nlAndere = neem(lijst.filter((x) => x.fr !== w.fr), 3).map((x) => x.nl);
      return {
        sleutel: `${w.fr}>nl`,
        prompt: `Wat betekent « ${w.fr} »?`,
        voorlezen: w.fr,
        taal: 'fr-FR',
        antwoord: w.nl,
        opties: opties(w.nl, nlAndere),
      };
    }
    return {
      sleutel: w.fr,
      prompt: 'Hoe zeg je dit in het Frans?',
      visual: w.kleur ? { type: 'kleur', kleur: w.kleur } : { type: 'emoji', tekst: w.beeld },
      antwoord: w.fr,
      opties: opties(w.fr, andere),
      uitspraak: { tekst: w.fr, taal: 'fr-FR' },
    };
  },
};

const procentenmarkt: SpelDef = {
  id: 'procentenmarkt',
  titel: 'Procentenmarkt',
  beschrijving: 'Reken procenten uit: 50%, 10%, 25% en meer.',
  icoon: '🛒',
  leerjaar: 5,
  vak: 'procenten',
  niveaus: ['50% en 10%', '25% en 20%', 'gemengd'],
  doelen: ['Procenten als deel van 100; eenvoudige percentages berekenen'],
  maak(n) {
    const pct = kies([[50, 10], [25, 20, 50], [5, 10, 20, 25, 30, 50, 75]][n]);
    // basisgetal zo kiezen dat de uitkomst een geheel getal is
    const stap = ({ 5: 20, 10: 10, 20: 5, 25: 4, 30: 10, 50: 2, 75: 4 } as Record<number, number>)[pct] ?? 10;
    const basis = stap * rand(2, n === 0 ? 10 : 25);
    const uitkomst = (basis * pct) / 100;
    const ding = kies(['🍎 appels', '🎈 ballonnen', '🍬 snoepjes', '⚽ ballen', '🌻 bloemen']);
    return {
      sleutel: `${pct}%van${basis}`,
      prompt: `Hoeveel is ${pct}% van ${basis}?`,
      voorlezen: `Hoeveel is ${pct} procent van ${basis}?`,
      visual: { type: 'emoji', tekst: ding.split(' ')[0] },
      antwoord: String(uitkomst),
      opties: getalOpties(uitkomst, Math.max(3, Math.round(uitkomst / 3)), 4, [basis / 10, basis / 2, basis - uitkomst].filter(Number.isInteger)),
      invoer: 'getal',
      uitleg:
        pct === 50 ? '50% is de helft.' : pct === 25 ? '25% is een kwart: deel door 4.' : pct === 10 ? '10% = deel door 10.' : `Eerst 10% (= ${basis / 10}), daarna verder rekenen.`,
    };
  },
};

// ---------- 't Kofschip ----------
const ONDERWERPEN = [['Gisteren', 'ik'], ['Vorige week', 'hij'], ['Gisteren', 'zij'], ['Vroeger', 'mijn opa'], ['Vanmorgen', 'de juf']];
const ZINSDELEN: Record<string, string> = {
  werken: 'hard in de tuin', fietsen: 'naar school', maken: 'een mooie tekening', lachen: 'om de grap', stoppen: 'met spelen',
  koken: 'spaghetti', dansen: 'op het feest', hopen: 'op mooi weer', poetsen: 'de tanden', blaffen: 'naar de postbode',
  kloppen: 'op de deur', praten: 'met de buren', spelen: 'in het park', leren: 'de tafels', bouwen: 'een zandkasteel',
  huilen: 'om de kapotte vaas', wonen: 'in Gent', schilderen: 'de muur', zeilen: 'op de zee', regenen: 'heel hard',
  bellen: 'naar oma', noemen: 'de hond Max', wachten: 'op de bus', branden: 'de kaarsjes', leven: 'heel gezond',
  reizen: 'naar Frankrijk', verven: 'het hek', beloven: 'te helpen', verhuizen: 'naar een nieuw huis', blozen: 'van verlegenheid',
};

const kofschip: SpelDef = {
  id: 'kofschip',
  titel: "'t Kofschip",
  beschrijving: 'Verleden tijd: -te of -de?',
  icoon: '⛵',
  leerjaar: 5,
  vak: 'spelling',
  niveaus: ['-te', '-te of -de', 'valkuilen (v en z)'],
  doelen: ["Werkwoordspelling verleden tijd van zwakke werkwoorden ('t kofschip)"],
  maak(n) {
    const lijst = n === 0 ? KOFSCHIP.filter((w) => w.uitgang === 'te') : n === 1 ? KOFSCHIP.filter((w) => !w.valkuil) : KOFSCHIP;
    const w = n === 2 && Math.random() < 0.5 ? kies(KOFSCHIP.filter((x) => x.valkuil)) : kies(lijst);
    const meervoud = n === 2 && Math.random() < 0.4;
    const [tijd, wie] = meervoud ? [kies(['Gisteren', 'Vorig jaar']), 'wij'] : kies(ONDERWERPEN);
    const regen = w.inf === 'regenen';
    const onderwerp = regen ? 'het' : wie;
    const n2 = meervoud && !regen ? 'n' : '';
    const vorm = (u: string) => w.stam + u + n2;
    const antwoord = vorm(w.uitgang);
    const fout = [vorm(w.uitgang === 'te' ? 'de' : 'te'), w.stam.endsWith(w.uitgang[0]) ? vorm(w.uitgang.slice(1)) : vorm(w.uitgang[0] + w.uitgang)];
    const zin = `${tijd} ___ ${onderwerp} ${ZINSDELEN[w.inf] ?? ''}.`.replace(/\s+\./, '.');
    return {
      sleutel: `${w.inf}${n2}`,
      prompt: `${zin}  (${w.inf})`,
      voorlezen: `${zin.replace('___', 'blanco')} Werkwoord: ${w.inf}.`,
      antwoord,
      opties: opties(antwoord, fout, 3),
      uitleg: w.valkuil
        ? `Valkuil! Je hoort ${w.stam}, maar in "${w.inf}" staat een ${w.inf.includes('v') ? 'v' : 'z'}. Die zit niet in 't kofschip, dus: ${antwoord}.`
        : `De stam is "${w.stam}". Eindigt die op een letter van 't kofschip (t, k, f, s, ch, p)? Dan -te, anders -de. → ${antwoord}`,
    };
  },
};

export const LEERJAAR5: SpelDef[] = [motsMagiques, procentenmarkt, kofschip];
