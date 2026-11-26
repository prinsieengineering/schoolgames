// Franse woordenschat. Afgestemd op de thema's van de woordenlijst bij de
// minimumdoelen Frans (begroeten, getallen, kleuren, dieren, familie, school, eten).

export interface FransWoord {
  fr: string;
  nl: string;
  beeld: string;
  /** Optioneel: echte kleur, getoond als bolletje. */
  kleur?: string;
}

export const FRANS = {
  kleuren: [
    { fr: 'rouge', nl: 'rood', beeld: '🔴', kleur: '#e63946' },
    { fr: 'bleu', nl: 'blauw', beeld: '🔵', kleur: '#1d6fe0' },
    { fr: 'vert', nl: 'groen', beeld: '🟢', kleur: '#2a9d4f' },
    { fr: 'jaune', nl: 'geel', beeld: '🟡', kleur: '#ffd000' },
    { fr: 'orange', nl: 'oranje', beeld: '🟠', kleur: '#ff8c00' },
    { fr: 'violet', nl: 'paars', beeld: '🟣', kleur: '#8e44ad' },
    { fr: 'noir', nl: 'zwart', beeld: '⚫', kleur: '#111111' },
    { fr: 'blanc', nl: 'wit', beeld: '⚪', kleur: '#ffffff' },
    { fr: 'marron', nl: 'bruin', beeld: '🟤', kleur: '#8b5a2b' },
    { fr: 'rose', nl: 'roze', beeld: '🩷', kleur: '#ff8fab' },
  ],
  getallen: [
    'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix',
    'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt',
  ].map((fr, i) => ({ fr, nl: String(i), beeld: String(i) })),
  dieren: [
    { fr: 'le chat', nl: 'de kat', beeld: '🐱' },
    { fr: 'le chien', nl: 'de hond', beeld: '🐶' },
    { fr: 'le cheval', nl: 'het paard', beeld: '🐴' },
    { fr: 'la vache', nl: 'de koe', beeld: '🐮' },
    { fr: 'le cochon', nl: 'het varken', beeld: '🐷' },
    { fr: 'le lapin', nl: 'het konijn', beeld: '🐰' },
    { fr: "l'oiseau", nl: 'de vogel', beeld: '🐦' },
    { fr: 'le poisson', nl: 'de vis', beeld: '🐟' },
    { fr: 'la souris', nl: 'de muis', beeld: '🐭' },
    { fr: 'le canard', nl: 'de eend', beeld: '🦆' },
  ],
  familie: [
    { fr: 'la mère', nl: 'de mama', beeld: '👩' },
    { fr: 'le père', nl: 'de papa', beeld: '👨' },
    { fr: 'le frère', nl: 'de broer', beeld: '👦' },
    { fr: 'la sœur', nl: 'de zus', beeld: '👧' },
    { fr: 'le bébé', nl: 'de baby', beeld: '👶' },
    { fr: 'la grand-mère', nl: 'de oma', beeld: '👵' },
    { fr: 'le grand-père', nl: 'de opa', beeld: '👴' },
  ],
  school: [
    { fr: 'le livre', nl: 'het boek', beeld: '📖' },
    { fr: 'le crayon', nl: 'het potlood', beeld: '✏️' },
    { fr: 'le cartable', nl: 'de boekentas', beeld: '🎒' },
    { fr: 'les ciseaux', nl: 'de schaar', beeld: '✂️' },
    { fr: 'la règle', nl: 'de lat', beeld: '📏' },
    { fr: "l'école", nl: 'de school', beeld: '🏫' },
    { fr: 'la chaise', nl: 'de stoel', beeld: '🪑' },
    { fr: "l'ordinateur", nl: 'de computer', beeld: '💻' },
  ],
  eten: [
    { fr: 'le pain', nl: 'het brood', beeld: '🍞' },
    { fr: 'la pomme', nl: 'de appel', beeld: '🍎' },
    { fr: 'le fromage', nl: 'de kaas', beeld: '🧀' },
    { fr: "l'eau", nl: 'het water', beeld: '💧' },
    { fr: 'le lait', nl: 'de melk', beeld: '🥛' },
    { fr: 'la banane', nl: 'de banaan', beeld: '🍌' },
    { fr: 'le gâteau', nl: 'de taart', beeld: '🎂' },
    { fr: 'la fraise', nl: 'de aardbei', beeld: '🍓' },
    { fr: "l'œuf", nl: 'het ei', beeld: '🥚' },
  ],
} satisfies Record<string, FransWoord[]>;

export const BEGROETINGEN = [
  { fr: 'Bonjour !', nl: 'Goeiedag!' },
  { fr: 'Au revoir !', nl: 'Tot ziens!' },
  { fr: 'Merci !', nl: 'Dank je!' },
  { fr: "S'il vous plaît", nl: 'Alsjeblieft' },
  { fr: 'Comment ça va ?', nl: 'Hoe gaat het?' },
  { fr: "Je m'appelle Lien.", nl: 'Ik heet Lien.' },
  { fr: 'Bonne nuit !', nl: 'Slaapwel!' },
  { fr: 'Oui', nl: 'Ja' },
  { fr: 'Non', nl: 'Nee' },
  { fr: "J'ai dix ans.", nl: 'Ik ben tien jaar.' },
];

export const AVOIR: Record<string, string> = { je: 'ai', tu: 'as', il: 'a', elle: 'a', nous: 'avons', vous: 'avez', ils: 'ont', elles: 'ont' };
export const ETRE: Record<string, string> = { je: 'suis', tu: 'es', il: 'est', elle: 'est', nous: 'sommes', vous: 'êtes', ils: 'sont', elles: 'sont' };

export const AVOIR_ZINNEN = ['un chien', 'faim', 'une sœur', 'un vélo', 'soif', 'un livre', 'deux chats'];
export const ETRE_ZINNEN = ['à l’école', 'en classe', 'à la maison', 'fatigués', 'contents', 'dans le jardin'];
