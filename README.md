# ⭐ Schoolgames

Leerspelletjes voor de 3e kleuterklas en het 1e tot het 6e leerjaar (Vlaamse leerlijn), met een eigen personage, sterren, XP, muntjes, een winkel, badges, een ouderzicht en een Speelhal met arcadespelletjes.

Achtergrond en keuzes: zie [VOORSTEL.md](VOORSTEL.md).

## Starten (voor jezelf, om aan te werken)

Nodig: [Node.js](https://nodejs.org) (versie 20 of nieuwer).

```powershell
npm install
npm run dev
```

Open daarna http://localhost:5173.

## Doorgeven aan andere ouders

**Optie 1: één bestand (geen installatie nodig)**

```powershell
npm run build:deel
```

Dat maakt `deel/Schoolgames.html` (ongeveer 350 KB). Stuur dat bestand door (mail, USB-stick, WhatsApp, ...). Ouders dubbelklikken erop en het spel opent in hun browser. Het werkt ook offline.

**Optie 2: de online versie (Cloudflare Pages)**

Het spel staat online op **https://schoolgames-1vr.pages.dev**. Die link kan je gewoon doorsturen.

Een nieuwe versie online zetten:

```powershell
$env:CLOUDFLARE_ACCOUNT_ID = '6ad1cc1591646ca4366e1534d62ea0d1'
npm run deploy
```

(De eerste keer op een nieuwe pc: eerst `npx wrangler login`.)

**Optie 3: zelf ergens anders online zetten**

```powershell
npm run build
```

Zet de map `dist/` op een gratis statische host, zoals Netlify (map erop slepen), GitHub Pages of Cloudflare Pages. Daarna stuur je gewoon de link door.

**Goed om te weten**
- Alle gegevens (profielen, voortgang) blijven **in de browser van dat toestel**. Er gaat niets naar een server en elk gezin heeft zijn eigen gegevens.
- Wil je een kind verhuizen naar een ander toestel of een andere browser? Ga naar *Ouderzicht → Back-up maken*, en op het andere toestel naar *Back-up inladen*.
- Ruimt iemand de browsergegevens op (cookies/sitegegevens wissen), dan verdwijnt de voortgang. Maak dus af en toe een back-up.
- Voorlezen gebruikt de stemmen van het toestel. Op Windows en Android zit er meestal een Nederlandse en een Franse stem bij. Anders werkt alles gewoon, maar zonder stem.

## Avatars

De personages zijn de stijlen **Cats**, **Dogs** en **Voxel Bot** van [DiceBear](https://www.dicebear.com) (`@dicebear/core` en `@dicebear/styles`, versie 11). De tekeningen hebben de licentie CC0 1.0: vrij te gebruiken, ook online, zonder naamsvermelding. De code van DiceBear valt onder de MIT-licentie. Alles zit mee in de app, dus het werkt offline en er worden geen gegevens naar DiceBear gestuurd.

Wil je een andere stijl? Pas dan enkel `src/gebruikers/avatar.ts` aan. De prijzen in de winkel staan in `src/gebruikers/winkelItems.ts`.

## Licentie

De code van Schoolgames valt onder de [MIT-licentie](LICENSE): iedereen (ouders, scholen, ...) mag ze vrij gebruiken, aanpassen en verder verspreiden, zolang de licentietekst erbij blijft. Er wordt geen garantie gegeven.

Materiaal van anderen houdt zijn eigen licentie: de avatartekeningen van DiceBear zijn CC0 1.0, de code van DiceBear en React is MIT. Wie bijdraagt, gaat ermee akkoord dat zijn bijdrage ook onder de MIT-licentie valt.

## Structuur (blokken)

```
src/
├── core/            Basis: types, opslag (lokaal), beloningen, badges, spraak, geluid, tafels (tafelgenerator + tafelkeuze)
├── gebruikers/      Profielen, avatar (SVG-lagen), winkel, trofeeënkast, ouderzicht (pincode)
├── spelmotor/       Quizscherm, vraagkaart, cijferklavier, visuals (klok, breuken, tellen), resultaat
├── spelletjes/      kleuter/, leerjaar1/ ... leerjaar6/ + register.ts
├── inhoud/          Woordenlijsten, Franse woordenschat, werkwoordzinnen (gewone data)
├── arcade/          Speelhal + kern/ (spelmotor, vraagbron, paneel) + één map per arcadespel
└── wereld/          Startscherm met de 6 werelden
```

### Een nieuw spelletje toevoegen
1. Open `src/spelletjes/leerjaarX/index.ts`.
2. Maak een object van het type `SpelDef` met een functie `maak(niveau)` die een `Vraag` teruggeeft (prompt, antwoord en **altijd** `opties`).
3. Zet het in de lijst onderaan dat bestand.

Het spel verschijnt dan vanzelf in de wereld van dat leerjaar, **en** het is meteen bruikbaar als vak in alle arcadespelletjes.

**Een tafelspel?** Gebruik dan `tafelVraag()` uit `src/core/tafels.ts` en zet `tafelkeuze: true` in je `SpelDef`. Je spel krijgt dan vanzelf de tafelkeuze (welke tafels, maal of delen). Kijk naar Tafelschelpen als voorbeeld.

### Een nieuw arcadespel toevoegen
Maak een map in `src/arcade/`, schrijf een component met de `ArcadeProps` uit `kern/ui.tsx`, en voeg het toe aan de lijst `ARCADE` in `Speelhal.tsx`.

## Wat zit erin

| Leerjaar | Spelletjes |
|---|---|
| 3e kleuterklas 🧸 | Tel mee! · Kleurenpot · Vormenjacht · Wat komt erna? · Meer of minder? · Rijmen maar! (alles wordt voorgelezen, antwoorden zijn plaatjes) |
| 1e 🌳 | Tel de diertjes · Plus- en minbos · Woord en plaatje · Klankenjacht |
| 2e 🏖️ | Tafelschelpen · Hoe laat is het? · Strandwinkel |
| 3e ⛰️ | Tafelklim · Pizza-breuken · Ei of ij? Au of ou? · Petit français (facultatief) |
| 4e 🏰 | Breukenduel · Kommakompas · d of t? |
| 5e 🚂 | Mots magiques · Procentenmarkt · 't Kofschip |
| 6e 🚀 | Kortingsjager · Oppervlakte-ontdekker · Être ou avoir ? |

**Speelhal:** 👾 Monsterjacht · 🎈 Ballonnen prikken · 🐸 Kikkersprong · 🔨 Mollenmep · 🏎️ Rekenrace · 🐬 Dolfijnenrace · 🏗️ Torenbouwer · 🪢 Touwtrekken (2 spelers)

### 🐬 Dolfijnenrace
Je bent een dolfijn en je zwemt een race tegen een zeemeermin. Er komen poorten van bellen aan met een antwoord in elke baan: zwem door het juiste antwoord voor een turbo en haal de zeemeermin in. Bij een fout antwoord zwem je gewoon wat trager verder en zie je het juiste antwoord. Er is geen klok: de race duurt tot de finish, en de zeemeermin wacht op je als je achterop raakt. Onderweg zwem je door vier stukken wereld: het koraalrif, het kelpwoud, het gezonken schip en de lichtgevende diepzee. Besturing: tik op een baan, gebruik de knoppen ▲ ▼ of de pijltjes ↑ ↓. Werkt met elk vak, maar is gemaakt voor de tafels van het 2e leerjaar.

### ✖️ Tafelkeuze
Bij alle tafelspelletjes (Tafelschelpen, Tafelklim, en elk nieuw tafelspel) kan je kiezen **welke tafels** je oefent: vink bijvoorbeeld de tafels van 2, 5 en 10 aan. Kies daarnaast **maal**, **delen** of **allebei**. De keuze wordt per kind onthouden en werkt overal:
- in het spelletje zelf: de kaart *🎯 Mijn tafels* naast de gewone niveaus;
- in de Speelhal: na het kiezen van een tafelspel als vak;
- in het ouderzicht: zo kan je als ouder de tafels van deze week klaarzetten.

Een ronde met eigen tafels geeft XP, muntjes en badges. De sterren van de niveaus verdien je met de gewone niveaus.
