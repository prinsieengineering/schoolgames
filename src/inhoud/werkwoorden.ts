// Zinnen voor d/t in de tegenwoordige tijd (4e leerjaar).

export interface WwZin {
  zin: string;
  ww: string;
  antwoord: string;
  fout: string[];
}

export const DT_ZINNEN: WwZin[][] = [
  // Niveau 1: ik = stam, jij/hij/zij = stam + t
  [
    { zin: 'Ik ___ elke dag naar school.', ww: 'fietsen', antwoord: 'fiets', fout: ['fietst', 'fietsd'] },
    { zin: 'Hij ___ een spannend boek.', ww: 'lezen', antwoord: 'leest', fout: ['lees', 'leesd'] },
    { zin: 'Jij ___ heel snel.', ww: 'lopen', antwoord: 'loopt', fout: ['loop', 'loopd'] },
    { zin: 'Mama ___ een taart.', ww: 'bakken', antwoord: 'bakt', fout: ['bak', 'bakd'] },
    { zin: 'De hond ___ in de tuin.', ww: 'spelen', antwoord: 'speelt', fout: ['speel', 'speeld'] },
    { zin: 'Ik ___ mijn tanden.', ww: 'poetsen', antwoord: 'poets', fout: ['poetst', 'poetsd'] },
    { zin: 'Zij ___ een liedje.', ww: 'zingen', antwoord: 'zingt', fout: ['zing', 'zingd'] },
    { zin: 'Jij ___ een mooie tekening.', ww: 'maken', antwoord: 'maakt', fout: ['maak', 'maakd'] },
    { zin: 'Opa ___ in de zetel.', ww: 'slapen', antwoord: 'slaapt', fout: ['slaap', 'slaapd'] },
    { zin: 'Ik ___ een brief.', ww: 'schrijven', antwoord: 'schrijf', fout: ['schrijft', 'schrijv'] },
  ],
  // Niveau 2: stam eindigt op d of t
  [
    { zin: 'Ik ___ later astronaut.', ww: 'worden', antwoord: 'word', fout: ['wordt', 'wort'] },
    { zin: 'Hij ___ zijn sleutels niet.', ww: 'vinden', antwoord: 'vindt', fout: ['vind', 'vint'] },
    { zin: 'Jij ___ heel goed paard.', ww: 'rijden', antwoord: 'rijdt', fout: ['rijd', 'rijt'] },
    { zin: 'Ik ___ op de bus.', ww: 'wachten', antwoord: 'wacht', fout: ['wachtt', 'wachd'] },
    { zin: 'Het ___ al donker.', ww: 'worden', antwoord: 'wordt', fout: ['word', 'wort'] },
    { zin: 'Ik ___ dat een leuk spel.', ww: 'vinden', antwoord: 'vind', fout: ['vindt', 'vint'] },
    { zin: 'Zij ___ op mijn vraag.', ww: 'antwoorden', antwoord: 'antwoordt', fout: ['antwoord', 'antwoort'] },
    { zin: 'Hij ___ de bal vast.', ww: 'houden', antwoord: 'houdt', fout: ['houd', 'hout'] },
    { zin: 'Ik ___ niet van spinnen.', ww: 'houden', antwoord: 'houd', fout: ['houdt', 'hout'] },
    { zin: 'De juf ___ een verhaal.', ww: 'vertellen', antwoord: 'vertelt', fout: ['vertel', 'verteld'] },
  ],
  // Niveau 3: inversie (staat jij achter het werkwoord? dan geen t) en gemengd
  [
    { zin: '___ jij ook mee?', ww: 'komen', antwoord: 'Kom', fout: ['Komt', 'Komd'] },
    { zin: '___ jij later dokter?', ww: 'worden', antwoord: 'Word', fout: ['Wordt', 'Wort'] },
    { zin: 'Wat ___ jij van dit boek?', ww: 'vinden', antwoord: 'vind', fout: ['vindt', 'vint'] },
    { zin: 'Morgen ___ hij naar zee.', ww: 'gaan', antwoord: 'gaat', fout: ['ga', 'gaad'] },
    { zin: 'Waarom ___ jij zo hard?', ww: 'lopen', antwoord: 'loop', fout: ['loopt', 'loopd'] },
    { zin: 'Jij ___ al groot.', ww: 'worden', antwoord: 'wordt', fout: ['word', 'wort'] },
    { zin: 'Hoe ___ jouw zus?', ww: 'heten', antwoord: 'heet', fout: ['heett', 'heed'] },
    { zin: 'Wanneer ___ de film?', ww: 'beginnen', antwoord: 'begint', fout: ['begin', 'begind'] },
    { zin: '___ jij je fiets niet meer?', ww: 'vinden', antwoord: 'Vind', fout: ['Vindt', 'Vint'] },
    { zin: 'Volgend jaar ___ mijn broer tien.', ww: 'worden', antwoord: 'wordt', fout: ['word', 'wort'] },
  ],
];

export const DT_UITLEG = [
  'Ik → enkel de stam (ik fiets). Jij, hij, zij → stam + t (hij leest).',
  'Eindigt de stam op d? Hij/jij: stam + t → hij wordt, hij vindt. Ik: alleen de stam → ik word.',
  'Staat jij ACHTER het werkwoord? Dan valt de t weg: word jij, vind jij, loop jij.',
];
