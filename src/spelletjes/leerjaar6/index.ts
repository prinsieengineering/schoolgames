// 🚀 6e leerjaar: Het Ruimtestation
import type { SpelDef } from '../../core/types';
import { getalOpties, kies, komma, neem, opties, rand } from '../../core/random';
import { AVOIR, AVOIR_ZINNEN, BEGROETINGEN, ETRE, ETRE_ZINNEN } from '../../inhoud/frans';

const kortingsjager: SpelDef = {
  id: 'kortingsjager',
  titel: 'Kortingsjager',
  beschrijving: 'Procenten, kortingen en omzetten tussen breuk, kommagetal en %.',
  icoon: '🏷️',
  leerjaar: 6,
  vak: 'procenten',
  niveaus: ['% van een getal', 'korting', 'breuk ↔ komma ↔ %'],
  doelen: ['Procenten toepassen (korting); verband breuk – kommagetal – procent'],
  maak(n) {
    if (n === 2) {
      const paren: [string, string, string][] = [
        ['1/2', '0,5', '50%'], ['1/4', '0,25', '25%'], ['3/4', '0,75', '75%'], ['1/5', '0,2', '20%'],
        ['1/10', '0,1', '10%'], ['2/5', '0,4', '40%'], ['3/10', '0,3', '30%'], ['1/100', '0,01', '1%'],
      ];
      const p = kies(paren);
      const van = rand(0, 2);
      let naar = rand(0, 2);
      if (naar === van) naar = (naar + 1) % 3;
      const namen = ['breuk', 'kommagetal', 'procent'];
      const antwoord = p[naar];
      return {
        sleutel: `${p[van]}>${namen[naar]}`,
        prompt: `Schrijf ${p[van]} als ${namen[naar]}.`,
        antwoord,
        opties: opties(antwoord, paren.filter((q) => q !== p).map((q) => q[naar])),
      };
    }
    const pct = kies([10, 20, 25, 50, 15, 30, 75]);
    const stap = ({ 10: 10, 20: 5, 25: 4, 50: 2, 15: 20, 30: 10, 75: 4 } as Record<number, number>)[pct] ?? 10;
    const prijs = stap * rand(2, 30);
    const korting = (prijs * pct) / 100;
    if (n === 0) {
      return {
        sleutel: `${pct}%van${prijs}`,
        prompt: `Hoeveel is ${pct}% van ${prijs}?`,
        antwoord: String(korting),
        opties: getalOpties(korting, Math.max(3, Math.round(korting / 4)), 4, [prijs - korting, prijs / 10]),
        invoer: 'getal',
      };
    }
    const ding = kies(['🚲 fiets', '🎮 spelcomputer', '👟 paar sportschoenen', '🎸 gitaar', '🛹 skateboard']);
    const nieuw = prijs - korting;
    return {
      sleutel: `korting${pct}%op${prijs}`,
      prompt: `Een ${ding.slice(ding.indexOf(' ') + 1)} kost € ${prijs}. Je krijgt ${pct}% korting. Hoeveel betaal je nog?`,
      visual: { type: 'emoji', tekst: ding.split(' ')[0] },
      antwoord: String(nieuw),
      opties: getalOpties(nieuw, Math.max(3, Math.round(nieuw / 5)), 4, [korting, prijs - pct]),
      invoer: 'getal',
      uitleg: `${pct}% van ${prijs} = ${komma(korting)}. Dan ${prijs} − ${komma(korting)} = ${komma(nieuw)}.`,
    };
  },
};

const etreAvoir: SpelDef = {
  id: 'etre-ou-avoir',
  titel: 'Être ou avoir ?',
  beschrijving: 'Begroetingen en de werkwoorden être (zijn) en avoir (hebben).',
  icoon: '🗼',
  leerjaar: 6,
  vak: 'frans',
  niveaus: ['begroetingen', 'avoir (hebben)', 'être (zijn)'],
  doelen: ['Frans: begroeten; être en avoir vervoegen in eenvoudige zinnen'],
  maak(n) {
    if (n === 0) {
      const b = kies(BEGROETINGEN);
      return {
        sleutel: b.fr,
        prompt: `Wat betekent « ${b.fr} »?`,
        voorlezen: b.fr,
        taal: 'fr-FR',
        antwoord: b.nl,
        opties: opties(b.nl, neem(BEGROETINGEN.filter((x) => x !== b), 3).map((x) => x.nl)),
      };
    }
    const tabel = n === 1 ? AVOIR : ETRE;
    const vn = kies(Object.keys(tabel));
    const rest = kies(n === 1 ? AVOIR_ZINNEN : ETRE_ZINNEN);
    const vorm = tabel[vn];
    const elisie = vn === 'je' && n === 1; // j'ai
    const begin = elisie ? "J'" : vn.charAt(0).toUpperCase() + vn.slice(1) + ' ';
    const volledig = `${begin}${vorm} ${rest}.`;
    return {
      sleutel: `${n === 1 ? 'avoir' : 'etre'}-${vn}`,
      prompt: `${begin}___ ${rest}.`,
      antwoord: vorm,
      opties: opties(vorm, [...new Set(Object.values(tabel))]),
      uitspraak: { tekst: volledig, taal: 'fr-FR' },
      uitleg: Object.entries(tabel).map(([k, v]) => `${k} ${v}`).join(' · '),
    };
  },
};

export const LEERJAAR6: SpelDef[] = [kortingsjager, etreAvoir];
