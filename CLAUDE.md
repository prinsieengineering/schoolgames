# Schoolgames: afspraken voor Claude

Leerspelletjes voor kinderen van het 1e tot het 6e leerjaar (Vlaanderen), met een personage, beloningen en een Speelhal met arcadespelletjes. Meerdere ouders bouwen mee. Lees eerst [VOORSTEL.md](VOORSTEL.md) (keuzes en leerlijn) en [CONTRIBUTING.md](CONTRIBUTING.md) (werkwijze).

## Taal en toon
- Antwoord de ouders in het **Nederlands (Vlaams)**. Alle teksten in de app zijn Vlaams-Nederlands: *leerjaar*, *kommagetal*, *half vier*, *juf*.
- Code: namen in het Nederlands, zoals in de rest van het project (`maak`, `vraag`, `antwoord`, `niveau`).

## Stack
- TypeScript + React 19 + Vite. Geen router, geen state-bibliotheek: navigatie in `src/App.tsx`, profielen via `ProfielContext`.
- Arcadespelletjes: eigen kleine canvasmotor in `src/arcade/kern/` (geen Phaser), zodat alles in één HTML-bestand past.
- Avatars: DiceBear 11 (`@dicebear/core/lite` + `@dicebear/styles`: cats, dogs, voxel-bot, CC0). Alleen `src/gebruikers/avatar.ts` spreekt DiceBear aan.
- Opslag: lokaal in de browser (`src/core/opslag.ts`, adapter-interface). Geen server, geen tracking, geen externe diensten.

## Blokken
- `src/core/`: types, opslag, beloningen (XP, sterren, muntjes), badges, spraak, geluid
- `src/gebruikers/`: profielen, avatar en AvatarMaker, winkel, trofeeën, ouderzicht
- `src/spelmotor/`: quizscherm, vraagkaart, visuals, resultaat
- `src/spelletjes/leerjaar1..6/`: de spelletjes; `register.ts` bundelt ze
- `src/inhoud/`: woordenlijsten en zinnen (gewone data)
- `src/arcade/`: Speelhal, `kern/` en één map per arcadespel
- `src/wereld/`: startscherm met de 6 werelden

## Regels bij wijzigingen
- Een spelletje is een `SpelDef` met `maak(niveau)`. Elke `Vraag` heeft **altijd** `opties` met het juiste antwoord erin, uniek, minstens 2 opties. Die worden gebruikt door de arcade.
- Nieuw spel = toevoegen aan de lijst van zijn leerjaar. Het verschijnt dan automatisch in de wereld én als vak in de Speelhal.
- Nieuw arcadespel = map in `src/arcade/`, component met `ArcadeProps` (`kern/ui.tsx`), toevoegen aan `ARCADE` in `Speelhal.tsx`. Speltoestand in `useRef`, HUD-state enkel bijwerken als iets verandert. Test ook met React StrictMode (effects lopen dubbel in dev).
- Badges: een object toevoegen in `src/core/badges.ts`. Beloon inzet en vooruitgang, nooit straffen.
- Bediening altijd met aanraken én toetsenbord (tablet en pc).
- Enkel vrij bruikbare tekeningen en geluiden (bij voorkeur CC0); vermeld de bron in de README.

## Controleren
- `npm run typecheck` moet slagen.
- Start `npm run dev` en speel de wijziging zelf in de browser.
- Voor generatoren: controleer veel vragen per niveau (antwoord staat in de opties, geen dubbele opties, geen NaN of negatieve getallen waar dat niet hoort).

## Git
- Werk op een eigen branch (bv. `spel/euro-tellen`) en maak een pull request naar `main`. Push nooit rechtstreeks naar `main`.
- `npm run deploy` (Cloudflare Pages) doet alleen de beheerder, na het samenvoegen.
