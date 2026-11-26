# Meebouwen aan Schoolgames 🛠️

Welkom! Fijn dat je mee wil bouwen aan leerspelletjes voor het 1e tot het 6e leerjaar.
Deze handleiding legt uit hoe je meedoet: met of zonder programmeren.

- **Spelen:** https://schoolgames-1vr.pages.dev
- **Achtergrond en keuzes:** [VOORSTEL.md](VOORSTEL.md)
- **Technische uitleg:** [README.md](README.md)

---

## 1. Ideeën en wensen (zonder programmeren)

Heb je een idee voor een spelletje, een badge of een verbetering? Of zag je een fout?

1. Ga naar het tabblad **Issues** op GitHub en klik op **New issue**.
2. Geef een duidelijke titel, bijvoorbeeld *"Spel: rekenen met euro's (2e leerjaar)"*.
3. Beschrijf kort voor welk leerjaar het is, wat het kind moet doen en waarom het leuk of nuttig is.

Zo staan alle ideeën op één plek en kunnen we ze samen bespreken en afvinken.

## 2. Inhoud aanpassen in de browser (zonder iets te installeren)

Woordenlijsten en zinnen staan in gewone bestanden in [`src/inhoud/`](src/inhoud/):

| Bestand | Wat staat erin |
|---|---|
| [`woorden.ts`](src/inhoud/woorden.ts) | Leeswoorden met plaatjes (1e leerjaar) |
| [`frans.ts`](src/inhoud/frans.ts) | Franse woordjes, begroetingen, être/avoir |
| [`werkwoorden.ts`](src/inhoud/werkwoorden.ts) | Zinnen voor d/t |

Zo pas je er een aan:
1. Open het bestand op GitHub en klik rechtsboven op het **potloodje ✏️**.
2. Voeg een regel toe op dezelfde manier als de andere regels, bijvoorbeeld
   `{ woord: 'roos', emoji: '🌹' },`
   Let op de komma's en de aanhalingstekens.
3. Klik op **Commit changes…** en kies **Create a new branch … and start a pull request**.
4. Klik op **Propose changes**. Iemand kijkt het na en voegt het toe.

## 3. Programmeren in de browser met GitHub Codespaces

Je hoeft niets te installeren.

1. Klik op de groene knop **Code → Codespaces → Create codespace on main**.
2. Wacht tot de editor geladen is. `npm install` loopt vanzelf.
3. Typ in de terminal onderaan:
   ```
   npm run dev
   ```
4. Klik op **Open in Browser** als die melding verschijnt. Of open het tabblad **Ports** en klik op poort 5173.

Gratis is ongeveer 60 uur per maand. Stop je codespace als je klaar bent: **Code → Codespaces → ⋯ → Stop codespace**.

## 4. Samen met Claude bouwen (Claude Code)

Heb je een Claude-abonnement? Dan kan je Claude het werk laten doen, in gewone taal.

- **In de cloud:** ga naar [claude.ai/code](https://claude.ai/code), koppel je GitHub-account en kies de repository `schoolgames`.
- **Op je eigen computer:** gebruik de Claude-desktopapp of `claude` in een terminal, in je lokale kopie van het project.

Vraag dan bijvoorbeeld:
> *"Voeg in het 2e leerjaar een spelletje toe waarbij je euromunten optelt, met 3 niveaus."*

Claude leest automatisch [`CLAUDE.md`](CLAUDE.md) met de afspraken van dit project. Vraag Claude om op een **eigen branch** te werken en een **pull request** te maken. Dan kunnen we alles nakijken voor het online gaat.

## 5. Op je eigen computer

Je hebt [Node.js](https://nodejs.org) nodig (versie 22 of nieuwer) en [Git](https://git-scm.com).

```
git clone https://github.com/prinsieengineering/schoolgames.git
cd schoolgames
npm install
npm run dev
```

Open daarna http://localhost:5173.

---

## Werkwijze (afspraken)

1. **Werk nooit rechtstreeks op `main`.** Maak een branch met een duidelijke naam:
   ```
   git checkout -b spel/euro-tellen
   ```
2. Controleer voor je iets voorstelt dat alles werkt:
   ```
   npm run typecheck
   ```
   en speel je spelletje minstens één keer zelf.
3. Push je branch en maak een **pull request** op GitHub. Beschrijf kort wat je deed.
4. Iemand anders kijkt het na. Daarna wordt het samengevoegd in `main`.
5. **Online zetten** (`npm run deploy`) gebeurt door de beheerder, na het samenvoegen.

## Een nieuw spelletje toevoegen

1. Open `src/spelletjes/leerjaarX/index.ts` voor het juiste leerjaar.
2. Maak een `SpelDef`: een titel, icoon, vak, 3 niveaus en een functie `maak(niveau)` die een vraag teruggeeft. Kopieer gerust een bestaand spel als voorbeeld.
3. Elke vraag heeft **altijd** `opties` (het juiste antwoord + foute antwoorden), ook als het een invulvraag is. De arcadespelletjes zetten die opties op ballonnen, waterlelies, …
4. Zet het spel in de lijst onderaan het bestand.

Klaar: het spel verschijnt in de wereld van dat leerjaar **én** als vak in alle arcadespelletjes.

**Werkt je spel met de maal- of deeltafels?** Schrijf dan geen eigen sommen, maar gebruik `tafelVraag()` uit `src/core/tafels.ts` en zet `tafelkeuze: true` in je `SpelDef`. Dan kan het kind (of de ouder in het ouderzicht) aanvinken welke tafels het oefent, bv. de tafels van 2, 5 en 10, en kiezen tussen maal, delen of allebei. Tafelschelpen (2e leerjaar) is een goed voorbeeld.

## Goed om te weten

- **Taal:** alles in het Vlaams-Nederlands (*leerjaar*, *kommagetal*, *half vier*, *juf*).
- **Leerlijn:** we volgen de algemene Vlaamse leerlijn. Zie de tabel in [VOORSTEL.md](VOORSTEL.md) §1.2.
- **Beloningen:** beloon inzet en vooruitgang, niet alleen perfectie. Nooit straffen, wel uitleggen.
- **Privacy:** er gaan geen gegevens van kinderen naar een server. Alles blijft in de browser. Voeg geen tracking, advertenties of externe diensten toe.
- **Tekeningen en geluiden:** gebruik enkel materiaal dat je vrij mag gebruiken (bv. CC0) en vermeld de bron in de README.
