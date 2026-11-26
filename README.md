# ⭐ Schoolgames

Leerspelletjes voor het 1e tot het 6e leerjaar (Vlaamse leerlijn), met een eigen personage, sterren, XP, muntjes, een winkel, badges, een ouderzicht en een Speelhal met arcadespelletjes.

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

## Structuur (blokken)

```
src/
├── core/            Basis: types, opslag (lokaal), beloningen, badges, spraak, geluid
├── gebruikers/      Profielen, avatar (SVG-lagen), winkel, trofeeënkast, ouderzicht (pincode)
├── spelmotor/       Quizscherm, vraagkaart, cijferklavier, visuals (klok, breuken, tellen), resultaat
├── spelletjes/      leerjaar1/ ... leerjaar6/ + register.ts
├── inhoud/          Woordenlijsten, Franse woordenschat, werkwoordzinnen (gewone data)
├── arcade/          Speelhal + kern/ (spelmotor, vraagbron, paneel) + één map per arcadespel
└── wereld/          Startscherm met de 6 werelden
```

### Een nieuw spelletje toevoegen
1. Open `src/spelletjes/leerjaarX/index.ts`.
2. Maak een object van het type `SpelDef` met een functie `maak(niveau)` die een `Vraag` teruggeeft (prompt, antwoord en **altijd** `opties`).
3. Zet het in de lijst onderaan dat bestand.

Het spel verschijnt dan vanzelf in de wereld van dat leerjaar, **en** het is meteen bruikbaar als vak in alle arcadespelletjes.

### Een nieuw arcadespel toevoegen
Maak een map in `src/arcade/`, schrijf een component met de `ArcadeProps` uit `kern/ui.tsx`, en voeg het toe aan de lijst `ARCADE` in `Speelhal.tsx`.

## Wat zit erin (versie 0.1)

| Leerjaar | Spelletjes |
|---|---|
| 1e 🌳 | Tel de diertjes · Plus- en minbos · Woord en plaatje |
| 2e 🏖️ | Tafelschelpen · Hoe laat is het? |
| 3e ⛰️ | Tafelklim · Pizza-breuken · Petit français (facultatief) |
| 4e 🏰 | Breukenduel · d of t? |
| 5e 🚂 | Mots magiques · Procentenmarkt |
| 6e 🚀 | Kortingsjager · Être ou avoir ? |

**Speelhal:** 👾 Monsterjacht · 🎈 Ballonnen prikken · 🐸 Kikkersprong · 🏗️ Torenbouwer · 🪢 Touwtrekken (2 spelers)
