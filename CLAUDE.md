# Schoolgames: afspraken voor Claude

Leerspelletjes voor kinderen van de 3e kleuterklas (`leerjaar: 0`) tot het 6e leerjaar (Vlaanderen), met een personage, beloningen en een Speelhal met arcadespelletjes. Meerdere ouders bouwen mee. Lees eerst [VOORSTEL.md](VOORSTEL.md) (keuzes en leerlijn) en [CONTRIBUTING.md](CONTRIBUTING.md) (werkwijze).

## Taal en toon
- Antwoord de ouders in het **Nederlands (Vlaams)**. Alle teksten in de app zijn Vlaams-Nederlands: *leerjaar*, *kommagetal*, *half vier*, *juf*.
- Code: namen in het Nederlands, zoals in de rest van het project (`maak`, `vraag`, `antwoord`, `niveau`).

## Stack
- TypeScript + React 19 + Vite. Geen router, geen state-bibliotheek: navigatie in `src/App.tsx`, profielen via `ProfielContext`.
- Arcadespelletjes: eigen kleine canvasmotor in `src/arcade/kern/` (geen Phaser), zodat alles in één HTML-bestand past.
- Avatars: DiceBear 11 (`@dicebear/core/lite` + `@dicebear/styles`: cats, dogs, voxel-bot, CC0). Alleen `src/gebruikers/avatar.ts` spreekt DiceBear aan.
- Opslag: lokaal in de browser (`src/core/opslag.ts`, adapter-interface). Geen server, geen tracking, geen externe diensten.

## Blokken
- `src/core/`: types, opslag, beloningen (XP, sterren, muntjes), badges, spraak, geluid, tafels (gedeelde tafelgenerator)
- `src/gebruikers/`: profielen, avatar en AvatarMaker, winkel, trofeeën, ouderzicht
- `src/spelmotor/`: quizscherm, vraagkaart, visuals, resultaat
- `src/spelletjes/kleuter/` en `leerjaar1..6/`: de spelletjes (kleuters lezen nog niet: `voorlezen: true` en plaatjes als antwoord); `register.ts` bundelt ze
- `src/inhoud/`: woordenlijsten en zinnen (gewone data)
- `src/arcade/`: Speelhal, `kern/` en één map per arcadespel
- `src/wereld/`: startscherm met de 6 werelden

## Regels bij wijzigingen
- Een spelletje is een `SpelDef` met `maak(niveau)`. Elke `Vraag` heeft **altijd** `opties` met het juiste antwoord erin, uniek, minstens 2 opties. Die worden gebruikt door de arcade.
- `maak(niveau, keuze?)`: het tweede argument is optioneel en dient voor eigen keuzes van het kind, zoals de tafelkeuze. Spelletjes zonder keuze negeren het gewoon.
- **Tafelspelletjes** (maal- en deeltafels) gebruiken altijd `tafelVraag()` uit `src/core/tafels.ts` en zetten `tafelkeuze: true` in hun `SpelDef`. Dan krijgt het kind vanzelf de **tafelkeuze**: aanvinken welke tafels (bv. 2, 5 en 10) en kiezen tussen *maal*, *delen* of *allebei*. Die keuze wordt per kind bewaard (`profiel.instellingen.tafels`) en geldt in het quizscherm, in de Speelhal en in het ouderzicht. Schrijf geen eigen tafelgenerator meer.
- Een ronde met een eigen tafelkeuze geeft XP, muntjes en badges, maar telt niet mee voor de sterren van een niveau (die horen bij de vaste niveaus).
- Nieuw spel = toevoegen aan de lijst van zijn leerjaar. Het verschijnt dan automatisch in de wereld én als vak in de Speelhal.
- Nieuw arcadespel = map in `src/arcade/`, component met `ArcadeProps` (`kern/ui.tsx`), toevoegen aan `ARCADE` in `Speelhal.tsx`. Speltoestand in `useRef`, HUD-state enkel bijwerken als iets verandert. Test ook met React StrictMode (effects lopen dubbel in dev).
- Arcadespel meteen klaarzetten in een wereld (vast spelletje, eventueel vaste tafels): een object toevoegen in `src/wereld/snelstart.ts`.
- Badges: een object toevoegen in `src/core/badges.ts`. Beloon inzet en vooruitgang, nooit straffen.
- Toon een leerjaar altijd met `leerjaarNaam()` / `leerjaarKort()` uit `src/wereld/werelden.ts` (0 = 3e kleuterklas), nooit met `${lj}e leerjaar`.
- **Hoeveelheden** toon je altijd als getalbeeld (twee rijen, van links naar rechts en eerst boven aangevuld: 3 = ●● boven ●, 10 = 2×5; per tiental een nieuw blok), via `src/core/getalbeeld.ts`. Gebruik `visual: { type: 'tel' }` of een antwoord met hetzelfde plaatje herhaald (bv. `'🐟'.repeat(4)`): quizknoppen en arcadelabels (`label()` in `kern/teken.ts`) tekenen dat dan vanzelf als getalbeeld. Nooit een los rijtje.
- Bediening altijd met aanraken én toetsenbord (tablet en pc).
- Enkel vrij bruikbare tekeningen en geluiden (bij voorkeur CC0); vermeld de bron in de README.

## Controleren
- `npm run typecheck` moet slagen.
- Start `npm run dev` en speel de wijziging zelf in de browser.
- Voor generatoren: controleer veel vragen per niveau (antwoord staat in de opties, geen dubbele opties, geen NaN of negatieve getallen waar dat niet hoort).

## Git
- Werk op een eigen branch (bv. `spel/euro-tellen`) en maak een pull request naar `main`. Push nooit rechtstreeks naar `main`.
- `npm run deploy` (Cloudflare Pages) doet alleen de beheerder, na het samenvoegen.
