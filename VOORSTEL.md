# Schoolgames: research en voorstel

*Versie 1, 26 november 2026.*

> **Status (26/11/2026):** versie 0.1 is gebouwd: 14 spelletjes, de Speelhal met 5 arcadespelletjes, profielen, winkel, badges en ouderzicht. Zie [README.md](README.md).
> **Update (26/11/2026):** er kwam een **tafelkeuze** bij voor alle tafelspelletjes (zie §8b) en een nieuw arcadespel, **🐬 Dolfijnenrace** (zie §4c). De Speelhal heeft nu 8 arcadespelletjes.
>
> **Afwijking van dit voorstel:** de arcadespelletjes gebruiken een kleine eigen canvasmotor (`src/arcade/kern/`) in plaats van Phaser. Zo blijft de app klein (ongeveer 350 KB) en past alles in één HTML-bestand dat je aan andere ouders kan doorgeven. Phaser kan later nog, als er zwaardere spelletjes bij komen. Ook de avatar is voorlopig zelf getekend in SVG (zonder Kenney-bestanden), zodat er niets gedownload moest worden. De tekenfunctie zit in één bestand en is later makkelijk te vervangen.

---

## 1. Wat zegt het onderwijs? (Vlaanderen)

### 1.1 Officieel kader
- Vlaanderen werkt met **minimumdoelen**, die de oude eindtermen vervangen. Ze worden **niet per leerjaar** vastgelegd, alleen voor drie ijkpunten: **einde kleuter, einde 4e leerjaar en einde 6e leerjaar**. Wat er in elk leerjaar gebeurt, bepalen de leerplannen van de koepels (Katholiek Onderwijs Vlaanderen/ZILL, GO!, OVSG) en de methodes.
- De nieuwe minimumdoelen voor **Nederlands, wiskunde en wetenschap & techniek** gelden vanaf **1 september 2026**, die voor **Frans** vanaf **1 september 2027**.
- **Frans** is verplicht vanaf het **5e leerjaar**. Scholen mogen al vanaf het 3e leerjaar starten (in Brussel vanaf het 1e). Voor Frans hoort er bij de minimumdoelen een **woordenlijst** van woorden die leerlingen op het einde van het basisonderwijs actief moeten kunnen gebruiken. Die lijst is een goede bron voor onze woordjesspellen.
- De Vlaamse toetsen in het 4e leerjaar meten bij wiskunde onder andere: getalbegrip (plaatswaarde, +/- 10, 100, 1000, reeksen), bewerkingen (maaltafels, schatten) en veelvouden.

### 1.2 Wat er per leerjaar meestal aan bod komt
Omdat er geen officiële doelen per leerjaar bestaan, volgt hieronder de **gangbare leerlijn** van de grote Vlaamse methodes. Ik stel voor om dit per school of methode te laten bijstellen. Het is een richtlijn, geen wet.

| Leerjaar | Rekenen & getallen | Meten, klok & geld | Breuken & kommagetallen | Lezen & schrijven / spelling | Frans |
|---|---|---|---|---|---|
| **1e** | tellen en getallen tot 20, splitsen, + en − tot 10 en daarna tot 20 | hele en halve uren, euromunten herkennen | "de helft" | letters en klanken, MKM-woorden (*vis, maan*), technisch lezen, schrijven van letters | – |
| **2e** | getallen tot 100, + en − tot 100 met en zonder brug, tafels van 1, 2, 5 en 10, delen als verdelen | kwartier, geld tot 100 €, cm en m | ½, ¼ (in context) | ei/ij, au/ou, dictee van eenvoudige woorden, zinnen lezen | – |
| **3e** | getallen tot 1000, **alle maaltafels en deeltafels**, hoofdrekenen | klok op de minuut, digitale klok, kg/g, l | stambreuken (½, ⅓, ¼, ⅕), breuken herkennen | woordsoorten, werkwoorden (tegenwoordige tijd), meervoud, begrijpend lezen | (facultatief starten) |
| **4e** | getallen tot 100 000, cijferen (+, −, ×), delen met rest | omtrek, tijdsduur, kalender | breuken vergelijken, gelijkwaardige breuken, **eerste kommagetallen** (tienden, honderdsten) | d/t in de tegenwoordige tijd, onderwerp en persoonsvorm | (facultatief) |
| **5e** | getallen tot 1 000 000, cijferend delen, deelbaarheid | oppervlakte, schaal, inhoud | breuken vereenvoudigen, optellen met gelijke noemer, breuk van een getal, **procenten (intro)** | verleden tijd ('t kofschip), samengestelde zinnen | **start verplicht**: begroeten, getallen, kleuren, dieren, familie, school |
| **6e** | grote getallen, negatieve getallen (intro), gemiddelde | volume, snelheid, grafieken | breuken met verschillende noemers, ×/: met breuken, procenten en korting, breuk ↔ kommagetal ↔ % | voltooid deelwoord, bijzondere werkwoordsvormen, studerend lezen | être/avoir, eenvoudige zinnen, lezen en luisteren |

**Bronnen:** [Nieuwe minimumdoelen basisonderwijs (vlaanderen.be)](https://www.vlaanderen.be/onderwijs-en-vorming/leerstof/onderwijsdoelen/nieuwe-minimumdoelen-in-het-basisonderwijs), [Minimumdoelen voor onderwijsprofessionals](https://www.vlaanderen.be/onderwijsprofessionals/lesgeven-en-begeleiden/opleidingsinhouden/opleidingsinhouden-basisonderwijs/nieuwe-minimumdoelen-basisonderwijs), [Vragen en antwoorden over de minimumdoelen (pdf)](https://data-onderwijs.vlaanderen.be/documenten/bestanden/nieuwe-minimumdoelen-vraag-antwoord.pdf), [Factsheet Vlaamse toets 4LO bewerkingen](https://data-onderwijs.vlaanderen.be/documenten/bestanden/factsheet-2025-4LO-bewerkingen.pdf), [Factsheet 4LO getalbegrip](https://data-onderwijs.vlaanderen.be/documenten/bestanden/factsheet-2025-4LO-getalbegrip.pdf), [UCLL leerlijn breuken](https://research-expertise.ucll.be/sites/default/files/2026-05/leerlijn%20breuken.pdf), [UCLL leerlijn hoofdrekenen](https://research-expertise.ucll.be/sites/default/files/2026-05/leerlijn%20hoofdrekenen.pdf), [AP-cursus Frans vakdidactiek lager onderwijs](https://www.ap.be/sites/default/files/Cursus%20Frans%20A%20vakdidactiek%20%28lager%20onderwijs%20flex%29_0.pdf).

> **Volgende stap voor de research:** de officiële doelenlijsten (pdf's van AHOVOKS) en de Franse woordenlijst één voor één overlopen en elk spelletje koppelen aan concrete doelcodes. Zo kan je later aan ouders of leerkrachten tonen *welk doel* een kind oefent.

---

## 2. Wat bestaat er al?

| Platform | Wat het goed doet | Wat wij ervan leren |
|---|---|---|
| **Rekentuin / Taalzee** (Prowise Learn, oorspronkelijk UvA) | Volledig **adaptief** met een Elo-systeem: elk kind krijgt vragen op zijn niveau. Je tuin groeit als je oefent. | Adaptieve moeilijkheid is de belangrijkste factor. Een "wereld die groeit" is een sterke beloning. |
| **Bingel** (VAN IN, gekoppeld aan methodes) | Sluit aan bij wat in de klas gezien wordt, met een avatar en een eigen eiland. | Een koppeling met de leerstof van de klas is waardevol, net als een avatar. |
| **Prodigy, Mathletics** | Een rpg-wereld, punten en certificaten. | Sterke motivatie, maar ook kritiek: kinderen jagen soms op beloningen in plaats van op leren. |
| **GCompris** (open source, 2–10 jaar) | Meer dan 100 kleine activiteiten, offline, vertaald naar het Nederlands. | Veel korte minispelletjes werken goed bij jonge kinderen. Er is wel geen profiel of progressie. |
| **Super Dooltocht** ([GitHub](https://github.com/antwanvdm/super-dooltocht)) | Nederlandstalig, open source, rekenen, klok en taal. Gebouwd met React, Vite, Tailwind en Express/MongoDB. Privacyvriendelijk. | Bijna dezelfde technische keuze als die ik voorstel. Interessant om de broncode te bekijken. |
| **LearnCity** ([ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Feinguterwaran%2Flearncity)) | Brons-, zilver- en goudbadges naargelang de score (70/80/90 %). | Een eenvoudig, duidelijk badgesysteem. |
| **Tica Math** ([ecosyste.ms](https://awesome.ecosyste.ms/projects/github.com%2Fcarton%2Ftica-math)) | Wiskundespel met Phaser en TypeScript. | Phaser is een optie voor "echte" actiespelletjes. |

Verder: [GitHub-topic educational-game](https://www.github.com/topics/educational-game), [GCompris](https://apps.kde.org/nl/gcompris), [onderzoek naar Rekentuin (Oefenweb, pdf)](https://panamaconferentie.sites.uu.nl/wp-content/uploads/sites/22/2015/05/Wat-kunnen-we-leren-van-rekentuin.pdf), [waarschuwing over gamification](https://screenwiseapp.com/guides/when-learning-apps-feel-like-games).

**Conclusie:** er bestaat geen open, **Vlaams** platform dat alle vakken van het 1e tot het 6e leerjaar combineert met een personage en beloningen. Dat gat kan dit project vullen, met de Vlaamse leerlijn, Vlaamse woorden (*leerjaar*, *kommagetal*, *half vier*) en Frans vanaf het 5e leerjaar.

---

## 3. Het concept

### 3.1 Het verhaal
Elk kind maakt een **personage** (een dier of figuurtje met een kleur en accessoires). Er zijn **zes werelden**, één per leerjaar:

| Leerjaar | Wereld (voorstel) |
|---|---|
| 1e | 🌳 Het Letterbos |
| 2e | 🏖️ Het Rekenstrand |
| 3e | ⛰️ De Tafelberg |
| 4e | 🏰 Het Breukenkasteel |
| 5e | 🚂 De Franse Trein |
| 6e | 🚀 Het Ruimtestation |

Het kind start in de wereld van zijn eigen leerjaar, maar mag ook vroegere werelden herhalen en latere werelden verkennen.

### 3.2 Beloningen (motiverend, zonder dat ze het leren overschaduwen)
| Element | Hoe het werkt |
|---|---|
| ⭐ **Sterren** | 1 tot 3 sterren per ronde (bv. 6/10, 8/10, 10/10). Met 2 sterren open je het volgende niveau. |
| ✨ **XP en niveau** | Elk juist antwoord levert XP op. Het personage gaat zo naar niveau 2, 3, ... |
| 🪙 **Muntjes** | Te besteden in de **winkel**: hoedjes, brillen, kleuren, nieuwe dieren en versiering van een eigen kamer of eiland. |
| 🏅 **Badges** | Voor mijlpalen, niet alleen voor topscores. Bijvoorbeeld: *Eerste stap*, *Tafelkampioen van 7*, *10 juist op rij* 🔥, *5 dagen na elkaar geoefend*, *Doorzetter* (een ronde opnieuw gespeeld na een slechte score), *Wereld voltooid*. |
| 🗺️ **Groeiende wereld** | Zoals de tuin van Rekentuin: elk voltooid spelletje laat iets groeien in de wereld. |

**Ontwerpregels** (naar aanleiding van de kritiek op gamification):
- Beloon **inspanning en vooruitgang**, niet alleen perfectie.
- Bij een fout antwoord: **geen straf**, wel een korte uitleg met het juiste antwoord.
- **Geen tijdsdruk** als standaard. Een "snelheidsmodus" is optioneel, bijvoorbeeld voor de tafels.
- Geen advertenties, geen aankopen met echt geld, geen tracking.

### 3.3 Didactische principes
1. **Adaptief:** elk spelletje heeft 3 tot 5 niveaus. Later kan er een Elo-achtig systeem komen dat automatisch bijstuurt, zoals bij Rekentuin.
2. **Voorlezen (🔊):** voor het 1e en 2e leerjaar wordt elke vraag voorgelezen in het Vlaams-Nederlands. Bij Frans spreekt een Franse stem. Dit kan met de spraak die in de browser zit, zonder extra kosten.
3. **Visueel:** blokjes, taartdiagrammen voor breuken, een klok, munten en plaatjes.
4. **Korte rondes:** 10 vragen, ongeveer 3 tot 5 minuten.
5. **Herhaling:** vaak fout beantwoorde vragen komen later terug (spaced repetition).

---

## 4. Voorstel van spelletjes per leerjaar

*Elk spelletje heeft 3 niveaus. In totaal zijn het er ongeveer 27. Voor een eerste versie stel ik voor om er een selectie van te bouwen (zie §7).*

### 🌳 1e leerjaar: Het Letterbos
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Tel de diertjes** | getallen | tot 5, tot 10, tot 20 |
| **Plus- en minbos** | rekenen | + tot 10, +/− tot 10, +/− tot 20 |
| **Klankenjacht** 🔊 | lezen | beginklank, eindklank, middenklank (*m-aa-n*) |
| **Woord en plaatje** | lezen | MKM-woorden, lange klanken, medeklinkerclusters |
| **Letters schrijven** ✍️ | schrijven | letter natekenen op het scherm met vinger of muis |

### 🏖️ 2e leerjaar: Het Rekenstrand
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Rekenen tot 100** | rekenen | tientallen, zonder brug, met brug |
| **Tafelschelpen** | rekenen | ×2 en ×10, ×5 en ×1, gemengd met delen, of 🎯 eigen tafelkeuze (§8b) |
| **Hoe laat is het?** 🕐 | klok | hele uren, halve uren, kwartier |
| **Strandwinkel** 💶 | geld | munten tellen, betalen, wisselgeld |
| **Luisterdictee** 🔊 | spelling | het woord horen en schrijven |

### ⛰️ 3e leerjaar: De Tafelberg
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Tafelklim** | rekenen | alle maaltafels, deeltafels, gemengd met optionele snelheid, of 🎯 eigen tafelkeuze (§8b) |
| **Getallen tot 1000** | getallen | plaatswaarde (H-T-E), +/− met honderdtallen, HTE +/− |
| **Pizza-breuken** 🍕 | breuken | ½ en ¼, stambreuken, niet-stambreuken |
| **Ei of ij? Au of ou?** | spelling | ei/ij, au/ou, gemengd |
| **Klok op de minuut** | klok | analoog naar digitaal |

### 🏰 4e leerjaar: Het Breukenkasteel
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Breukenduel** | breuken | vergelijken met gelijke noemer, met gelijke teller, gelijkwaardige breuken |
| **Delen met rest** | rekenen | – |
| **Kommakompas** | kommagetallen | tienden, honderdsten, vergelijken en optellen |
| **d of t?** | werkwoorden | tegenwoordige tijd, inversie (*word jij*), gemengd |
| **Omtrek-ridder** 📏 | meten | omtrek van rechthoeken en vierkanten |

### 🚂 5e leerjaar: De Franse Trein
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Mots magiques** 🇫🇷🔊 | Frans | kleuren en getallen, dieren en familie, school en eten (op basis van de officiële woordenlijst) |
| **Les nombres** 🔊 | Frans | 0–10, 11–20, tientallen tot 100 |
| **Breukenbakker** | breuken | vereenvoudigen, optellen met gelijke noemer, breuk van een getal |
| **Procentenmarkt** | procenten | 50 %, 10 % en 25 %, gemengd |
| **'t Kofschip** | werkwoorden | verleden tijd *-te/-de* |

### 🚀 6e leerjaar: Het Ruimtestation
| Spel | Vak | Niveau 1 → 3 |
|---|---|---|
| **Être ou avoir?** 🇫🇷 | Frans | begroetingen, avoir, être |
| **Kortingsjager** 🏷️ | procenten | % van, korting, breuk ↔ komma ↔ % |
| **Breukenraket** | breuken | ongelijke noemers, breuk × getal, breuk × breuk |
| **Oppervlakte-ontdekker** | meten | omtrek, oppervlakte, omzetten van eenheden |
| **Voltooid deelwoord** | werkwoorden | *gefietst/gefietsd*, sterke werkwoorden, gemengd |

Een aantal **algemene spelvormen** maakt dit haalbaar. De meeste spelletjes zijn één van deze vormen met andere inhoud:
- **Meerkeuze** (eventueel met plaatjes of een visual)
- **Invullen** met een groot cijferklavier op het scherm, handig voor tablets
- **Luister en typ** (dictee)
- **Slepen en ordenen** (getallen rangschikken, zinnen bouwen)
- **Tekenen** (letters schrijven)
- Later ook **actiespelletjes**: een vallend-antwoord-spel, een memory, een race

---

## 4b. Arcade-spel: "Monsterjacht" (schietspel)

### Idee
Een klein schietspel waarbij de **eigen avatar onderaan het scherm** staat. Het kind beweegt links en rechts en schiet recht omhoog op **boze monsterjes** die van boven komen. **Kogels verdien je met opdrachten**: een rekensom, een breuk, een Frans woordje, enzovoort. Een geraakt monster levert **punten** op.

Het spel is **geen apart spel per leerjaar** maar een **spelvorm** die vragen uit elk ander spelletje kan gebruiken. Zo kan een kind van het 1e leerjaar kogels verdienen met "tel de diertjes" en een kind van het 6e met procenten, met precies hetzelfde schietspel.

### Speelverloop (één ronde van ongeveer 3 à 4 minuten)
```
 ┌──────────────────────────────────────────┐
 │  👾      👾        👾     punten: 120  │
 │        👾      👾                         │
 │                ↑                          │
 │                ↑    kogels: ●●●○○         │
 │                                           │
 │ ┌───────────────┐                         │
 │ │  7 × 6 = ?    │  ← opdrachtpaneel       │
 │ │ [40][42][48]  │                         │
 │ └───────────────┘                         │
 │              🦊  ← avatar                 │
 │ [◀]                               [▶] [🔫]│
 └──────────────────────────────────────────┘
```
1. De monsters dalen langzaam af, in golven.
2. In een **opdrachtpaneel** staat steeds een vraag. Een **juist antwoord** levert kogels op, bv. **3 kogels**, en met een reeks juiste antwoorden een **bonus** (5 juist op rij is een supershot). Een **fout antwoord** geeft geen kogels, maar wel kort het juiste antwoord. Er is nooit strafverlies.
3. Met de kogels schiet het kind de monsters neer: **10 punten** per monster, meer voor snellere of grotere monsters.
4. Raakt een monster de grond, dan verliest het kind **een hartje of schild**. Bij 0 hartjes eindigt de ronde. De **punten blijven behouden** en het kind krijgt de melding "Goed gedaan, probeer je record te verbeteren!".
5. **Einde ronde:** punten en sterren (op basis van het aantal juiste opdrachten, niet de schietscore), XP, muntjes en eventueel een badge.

### Twee manieren om vragen te tonen (een keuze voor jou)
| Optie | Hoe | Voor | Tegen |
|---|---|---|---|
| **A. Pauze-vraag** | Het spel bevriest, de vraag verschijnt groot en na het antwoord gaat het verder. | Rustig, ook voor het 1e leerjaar, en het kind kan nadenken zonder stress. | Minder "flow" |
| **B. Paneel naast het spel** | Het spel loopt door en het kind beantwoordt vragen in een paneel opzij, terwijl de monsters dalen. | Spannend, voor het 5e en 6e leerjaar | Tijdsdruk, en het kan rommelig worden op een kleine tablet |

**Beslist: B, het paneel naast het spel.** Om dit ook voor jonge kinderen haalbaar te houden:
- De **snelheid van de monsters hangt af van het leerjaar**. In het 1e en 2e leerjaar dalen ze heel traag en komen er weinig tegelijk.
- Het kind mag de monsters altijd even **"bevriezen"** met een ❄️-knop, een paar keer per ronde, om rustig na te denken.
- **Schermindeling:** op een pc of liggende tablet staat het paneel *rechts* van het speelveld. Op een staande tablet of een klein scherm staat het *onder* het speelveld, boven de bedieningsknoppen.
- Vragen die voorgelezen worden (1e en 2e leerjaar, Frans) krijgen een 🔊-knop in het paneel.

### Andere beslissingen voor Monsterjacht
| Vraag | Beslissing |
|---|---|
| Monster bereikt de grond | Het kind verliest **1 hartje (3 levens)**. Bij 0 eindigt de ronde en de punten blijven behouden. |
| Waarmee schieten? | **Sterretjes en zeepbellen.** Een geraakt monster wordt een wolkje of snoepje ("ploef!"). |
| Welke opdrachten? | **Het kind kiest het vak** voor de start, bv. tafels, breuken of Frans, uit de spelletjes van zijn leerjaar en de leerjaren ervoor. Het niveau past zich vanzelf aan. |

### Besturing (tablet én pc)
| | Pc | Tablet |
|---|---|---|
| Bewegen | ← → of A/D | knoppen ◀ ▶ onderaan, of de avatar met de vinger slepen |
| Schieten | spatiebalk | 🔫-knop rechts |
| Antwoorden | toetsenbord (cijfers, Enter) of muis | tikken op een antwoordknop of het cijferklavier |

### Evenwicht tussen leren en spelen
Dit is het belangrijkste ontwerppunt. Het spel mag de vragen niet overschaduwen.
- **Kogels zijn schaars**: met 1 vraag kan je maar een paar monsters raken. Een kind moet dus vaak antwoorden, ongeveer 15 à 25 vragen per ronde.
- **Sterren en XP** komen van de **juiste antwoorden**. De schietscore is alleen voor de fun en het record.
- **Monsters worden langzaam sneller** binnen een ronde, en de **vragen passen zich aan het niveau van het kind aan**, met dezelfde aanpassing als in de gewone spelletjes.
- **Geen geweld:** de monsters zijn grappig en "boos", geen echte vijanden. Geraakt worden ze een **wolkje of snoepje** ("ploef!"). De avatar schiet **sterretjes en zeepbellen**.
- **Tijdslimiet** van bv. 20 minuten arcade per dag, instelbaar in het ouderzicht (optioneel).

### Extra's voor later
- **Power-ups** te verdienen met een reeks juiste antwoorden: dubbel schot, schild, slow motion.
- **Eindbaas** na 3 golven: een groot monster waarvoor je een moeilijkere vraag oplost.
- **Avatar-items uit de winkel** zijn ook zichtbaar in het schietspel, en je kan andere soorten kogels kopen (alleen het uiterlijk verandert).
- **Monsters met getallen**: varianten waarbij je het monster met het *juiste antwoord* moet raken (bv. "schiet op 42"). Dan wordt het schieten zelf een opdracht. Dat is een tweede arcadespel met dezelfde motor.

### Badges die erbij horen
*Monsterjager* (eerste ronde), *Scherpschutter* (50 monsters), *Rekenregen* (10 juist op rij in de arcade), *Record!* (je eigen record verbeterd), *Eindbaas verslagen*.

---

## 4c. Meer arcadespelletjes ("Speelhal")

Alle arcadespelletjes samen vormen een **Speelhal** die je vanuit elke wereld kan openen. Ze werken zoals Monsterjacht: het kind **kiest eerst een vak**, en de vragen komen uit de bestaande vraaggeneratoren, op het niveau van het kind. Elk spel gebruikt de eigen avatar.

Er zijn **twee soorten** arcadespelletjes. Dat onderscheid is belangrijk voor de bouw:

- **Soort A, "verdien en speel":** de vraag staat in het opdrachtpaneel en een juist antwoord geeft *iets* (kogels, blokken, brandstof). Monsterjacht is van deze soort.
- **Soort B, "het antwoord is het doelwit":** de antwoordmogelijkheden zitten *in* het spel, op ballonnen, waterlelies of rijstroken. Spelen en antwoorden vallen dan samen. Daarvoor moet elke vraaggenerator ook **foute antwoordopties** kunnen leveren. Dat wordt een vaste regel voor alle spelletjes.

### Soort A: verdien en speel
| Spel | Hoe het werkt | Besturing | Vooral voor | Bouw |
|---|---|---|---|---|
| 👾 **Monsterjacht** | (zie §4b) juist antwoord = sterretjes om op monsters te schieten | ◀ ▶ + schieten | alle leerjaren | M |
| 🏗️ **Torenbouwer** | Een juist antwoord laat een blok aan een slingerende kraan hangen. Het kind tikt op het goede moment om het blok te laten vallen. Hoe hoger de toren, hoe meer punten. Bij een wankele toren valt hij om, de hoogte blijft je record. | 1 knop of tik | 1e–4e, rustig en met weinig stress | S |
| 🚀 **Raketlancering** | Juiste antwoorden vullen de brandstoftank. Daarna vliegt het kind met de raket door een veld met meteorieten en sterren. Meer brandstof = verder vliegen = een nieuwe planeet op je sterrenkaart. | ◀ ▶ of kantelen/slepen | 3e–6e | M |
| 🏝️ **Mijn Eiland** | Een rustig bouwspel: elk juist antwoord levert materiaal op (hout, steen, zaadjes). Daarmee bouwt het kind huisjes, bomen en dieren op een eigen eiland. Het eiland blijft bewaard en groeit over weken. | tikken en slepen | alle leerjaren, als "groeiende wereld" (§3.2) | L |

### Soort B: het antwoord is het doelwit
| Spel | Hoe het werkt | Besturing | Vooral voor | Bouw |
|---|---|---|---|---|
| 🎈 **Ballonnen prikken** | Ballonnen met antwoorden zweven omhoog. Het kind prikt de juiste ballon met een pijltje van de avatar onderaan. Bij een foute ballon gebeurt er niets: die zweeft gewoon weg. | ◀ ▶ + schieten, of tikken | 1e–3e (getallen, letters, klok) | S |
| 🐸 **Kikkersprong** | De avatar moet een rivier oversteken. Op elke rij waterlelies staan antwoorden en het kind springt naar de juiste. Op een foute lelie zakt hij zachtjes weg en probeert hij het opnieuw. Een juiste rij opent de volgende. | tik of ← ↑ → | 2e–5e (tafels, spelling ei/ij, Frans) | S |
| 🏎️ **Rekenrace** | De avatar rijdt in een kart op 3 rijstroken. Er komen poorten aan met een antwoord per rijstrook, en het kind stuurt naar de juiste poort voor een turbo. Een foute poort kost snelheid. De snelheid loopt op. | ◀ ▶ of vegen | 3e–6e (snel hoofdrekenen, d/t) | M |
| 🐬 **Dolfijnenrace** | De avatar is een dolfijn die een race zwemt tegen een zeemeermin. Poorten van bellen komen aan met een antwoord in elk van de 3 banen. Door het juiste antwoord zwemmen geeft een turbo, een fout antwoord maakt je even trager (geen straf, wel het juiste antwoord). Geen klok: de race duurt tot de finish en de zeemeermin wacht als je achterop raakt. De wereld verandert onderweg: koraalrif, kelpwoud, gezonken schip, lichtgevende diepzee. | tik op een baan, ▲ ▼ of ↑ ↓ | 1e–3e (tafels!) | M |
| 🧺 **Vangmand** | Dingen vallen uit de lucht en het kind vangt de juiste met een mand. De opdracht geldt voor een hele golf, bv. "vang alle veelvouden van 4", "vang de breuken groter dan ½", "vang de woorden met *ou*". | ◀ ▶ of slepen | alle leerjaren, goed voor categoriseren | S |
| 🔨 **Mollenmep** | Mollen steken hun kop op met een antwoord op een bordje. Het kind tikt snel op de mollen met het juiste antwoord. | tikken of klikken | 1e–3e, ideaal op tablet | S |
| 🐛 **Rupsje Rekenhonger** | De rups kruipt over het veld en moet de blaadjes met het juiste antwoord opeten. Een juist blaadje maakt haar langer, een fout blaadje maakt haar misselijk (kortere rups). | pijltjes of vegen | 2e–6e | M |
| 🧗 **Wolkenspringer** | De avatar springt van wolk naar wolk omhoog. Op elke wolk staat een antwoord en alleen de juiste wolk draagt hem. Hoe hoger, hoe meer punten. | ◀ ▶ (automatisch springen) | 3e–6e | M |

### Samen spelen (2 kinderen, 1 toestel)
Ideaal voor broers en zussen van **verschillende leerjaren**: elk kind krijgt vragen van **zijn eigen niveau**, dus het blijft eerlijk.

| Spel | Hoe het werkt | Bouw |
|---|---|---|
| 🪢 **Touwtrekken** | Het scherm is in twee helften gesplitst. Elk juist antwoord trekt het touw een stukje naar jouw kant. Wie het touw over de lijn trekt, wint. | S |
| 🃏 **Memory-duel** | Kaartjes omdraaien en paren zoeken: som ↔ uitkomst, breuk ↔ plaatje, Frans woord ↔ tekening. De spelers zijn om de beurt aan zet. Werkt ook alleen. | S |
| 🏁 **Duo-race** | Rekenrace met twee karts naast elkaar op hetzelfde scherm. | M |

*S = klein (een paar dagen), M = middel, L = groot. Dit zijn ruwe schattingen.*

### Wat ze allemaal delen (één keer bouwen)
- **Arcade-kern:** avatar-sprite (met de items uit de winkel), bediening met toetsenbord en aanraken, hartjes en punten, pauze, ❄️-bevriesknop, eindscherm met sterren, XP en muntjes, en het eigen record per spel.
- **Vraagbron** met twee "stekkers": `volgendeVraag()` voor soort A en `vraagMetOpties(aantal)` voor soort B.
- **Moeilijkheid:** de spelsnelheid hangt af van het leerjaar, de vraagmoeilijkheid van het niveau van het kind. Die twee staan los van elkaar.

### Voorstel van volgorde
1. **Monsterjacht** (zoals beslist): bouwt de arcade-kern en soort A.
2. **Ballonnen prikken**: hergebruikt bijna alles van Monsterjacht, maar is van soort B. Zo is de tweede stekker meteen getest.
3. **Touwtrekken**: klein om te bouwen, maar heel leuk thuis met meerdere kinderen.
4. **Kikkersprong** of **Vangmand**: andere bewegingen, en zo zijn alle bedieningsvormen getest.
5. Later: Torenbouwer, Rekenrace, Rupsje, Wolkenspringer, en **Mijn Eiland** als grote afsluiter, die ook de "groeiende wereld" invult.

---

## 5. Structuur in blokken

```
schoolgames/
├── core/                 # Basis: geen spelinhoud
│   ├── types             #   gedeelde datatypes (Profiel, Vraag, Spel, Badge)
│   ├── opslag            #   opslag-"adapter": eerst lokaal, later een server
│   ├── beloningen        #   XP, niveaus, sterren, muntjes
│   ├── badges            #   badgedefinities en regels
│   ├── spraak + geluid   #   voorlezen (nl-BE / fr-FR), effectjes
│   └── adaptief          #   moeilijkheid bijsturen, foutenherhaling
│
├── gebruikers/           # BLOK GEBRUIKERS
│   ├── profielen         #   kind kiezen of aanmaken (naam, leerjaar)
│   ├── personage         #   avatar samenstellen
│   ├── winkel            #   items kopen met muntjes
│   ├── trofeeënkast      #   badges bekijken
│   └── ouderzicht        #   voortgang per vak (met pincode)
│
├── spelmotor/            # BLOK SPELMOTOR: herbruikbaar voor alle spelletjes
│   ├── spelscherm        #   ronde van 10 vragen, voortgang, feedback
│   ├── vraagtypes        #   meerkeuze, invullen, dictee, slepen, tekenen
│   ├── visuals           #   blokjes, taart/strook (breuken), klok, munten, figuren
│   └── resultaat         #   sterren, XP, nieuwe badges, confetti
│
├── arcade/               # BLOK ARCADE: actiespelletjes die vragen "lenen"
│   ├── vraagbron         #   haalt vragen uit elk spelletje of vak, op het niveau van het kind
│   ├── opdrachtpaneel    #   vraag tonen (pauze of zijpaneel) → kogels uitdelen
│   ├── kern/             #   gedeeld: avatar-sprite, bediening, hartjes, punten, records, eindscherm
│   ├── speelhal          #   menu met alle arcadespelletjes en "kies je vak"
│   ├── monsterjacht/     #   het schietspel (Phaser-scène: avatar, monsters, kogels, golven)
│   ├── ballonnen/        #   elk volgend arcadespel = eigen map (kikkersprong/, touwtrekken/, ...)
│   └── assets/           #   sprites en geluiden (Kenney, CC0)
│
├── spelletjes/           # BLOKKEN PER LEERJAAR
│   ├── leerjaar1/        #   elk spel = 1 bestand met: titel, vak, niveaus, vraaggenerator
│   ├── leerjaar2/
│   ├── leerjaar3/
│   ├── leerjaar4/
│   ├── leerjaar5/
│   ├── leerjaar6/
│   └── register          #   lijst van alle spelletjes (een nieuw spel = één regel toevoegen)
│
├── inhoud/               # Woordenlijsten, zinnen, Franse woordenschat (data, geen code)
│                         #   zodat een leerkracht dit later kan aanpassen
└── wereld/               # Startscherm: 6 werelden, kaart, spelkaartjes per vak
```

**Waarom zo?**
- Een **nieuw spelletje toevoegen** betekent één bestand in de juiste leerjaarmap en één regel in het register. Aan de motor moet je niets veranderen.
- **Inhoud en code zijn gescheiden**: woordenlijsten zijn gewone data, die je later via een beheerpagina kan laten aanpassen.
- **Vragen staan los van de spelvorm**: elk spelletje levert een *vraaggenerator*. Het gewone quizscherm en het arcadespel gebruiken diezelfde generatoren. Met één nieuw arcadespel heb je zo meteen een versie voor alle vakken en alle leerjaren.
- **Opslag zit achter een adapter**: nu slaat de browser alles lokaal op. Wil je online, dan vervang je enkel dat ene blok door een server-API. De rest van de app merkt daar niets van.

---

## 6. Technische keuze

**Voorstel: TypeScript + React + Vite** (een webapp)

| Waarom | Uitleg |
|---|---|
| Lokaal en online met dezelfde code | Lokaal start je de app met `npm run dev`. Online zet je ze als statische site op Netlify, Vercel, GitHub Pages of je eigen hosting, gratis of goedkoop. |
| Werkt op elk toestel | pc, Chromebook, iPad, Android. Later kan het ook een installeerbare app (PWA) worden die offline werkt. |
| TypeScript | Minder fouten naarmate het project groeit tot tientallen spelletjes. |
| Actiespelletjes met **Phaser 3** | Een gratis, open source 2D-spelengine in JavaScript/TypeScript. Ze regelt de spellus, sprites, botsingen, aanraak- en toetsenbordbediening en geluid. Monsterjacht wordt een Phaser-scène in een React-scherm. Het opdrachtpaneel, de avatar en de beloningen blijven React en worden gedeeld met de rest van de app. Kenney heeft kant-en-klare CC0-pakketten voor ruimteschietspellen en monsters die hier goed op aansluiten. |
| Spraak gratis in de browser | De Web Speech API heeft Nederlandse en Franse stemmen. |

**Later online, in 2 stappen:**
1. **Fase 1 (nu):** alleen een frontend, met profielen opgeslagen in de browser (localStorage of IndexedDB). Geen server, geen privacyzorgen.
2. **Fase 2 (online):** dezelfde app als statische website of installeerbare app. Alleen als je ooit wilt synchroniseren tussen toestellen, komt er een kleine backend bij, bv. **Supabase** of een eigen **Node.js-server**. Omdat het gebruik voorlopig thuis is (zie §8), hoeven accounts en klasgroepen niet.

**Alternatieven die ik heb overwogen:**
- *Godot of Unity:* mooier voor echte games, maar zwaarder, minder geschikt voor een quiz-achtige structuur en lastiger om in een browser te plaatsen.
- *Python (Flask/Django):* prima voor een backend, maar je hebt toch een webfrontend nodig. Dan is TypeScript aan beide kanten eenvoudiger.
- *Vue of Svelte:* even goed als React. React heeft het grootste aanbod aan voorbeelden en hulp.

---

## 7. Voorgestelde fasering

| Fase | Inhoud | Resultaat |
|---|---|---|
| **0. Beslissen** | dit voorstel bespreken en aanpassen | goedgekeurde structuur en spellijst |
| **1. Fundament** | core, gebruikersblok (profielen, personage), spelmotor met meerkeuze en invullen | een kind kan een profiel maken en één testspel spelen |
| **2. Eerste werelden** | 2 à 3 spelletjes per leerjaar, sterren, XP, muntjes en ongeveer 10 badges | speelbare versie voor alle leerjaren |
| **3. Beloningen uitbreiden + arcade** | winkel, groeiende wereld, trofeeënkast, ouderzicht, **Monsterjacht** (eerste versie: bewegen, schieten, golven, pauze-vragen) | de motivatielaag is af en er is een eerste actiespel |
| **4. Uitbreiden** | overige spelletjes, dictee, tekenen, slepen, adaptief systeem en foutenherhaling | volledige set |
| **5. Online** | statische hosting en een installeerbare app (PWA). Optioneel: synchronisatie tussen toestellen | bruikbaar op elk toestel thuis |

---

## 8. Genomen beslissingen (26 november 2026)

| Vraag | Beslissing | Gevolg voor het ontwerp |
|---|---|---|
| Voor wie? | **Eigen kinderen thuis** | Enkele profielen op hetzelfde toestel, zonder accounts of leerkrachtfuncties. Er is geen server nodig. "Online" betekent later: dezelfde app als statische website. Synchroniseren tussen toestellen is een optie voor later (bv. export/import van een bestand of Supabase). De gegevens blijven thuis, dus er zijn geen GDPR-complicaties. |
| Leerlijn | **Algemene Vlaamse leerlijn** | We volgen de tabel in §1.2. Elk spelletje krijgt een veld `doelen` met een verwijzing naar de minimumdoelen (einde 4e en 6e). Die koppeling werken we later concreet uit. |
| Frans | **Vanaf het 3e leerjaar, facultatief** | In het 3e en 4e leerjaar komt er een speels **"Petit français"**-spelletje (kleuren, getallen 0–10, dieren, begroeten met plaatjes en voorlezen), als bonusspel in die werelden. Vanaf het 5e start het volwaardige Frans (de Franse Trein). Ouders kunnen Frans per kind aan- of uitzetten in het ouderzicht. |
| Personage | **Gratis illustratiepakket** | We bouwen een **samenstelbare avatar** uit lagen (lichaam of dier, kleur, hoed, bril, accessoire). Kandidaten: **Kenney.nl** (CC0: vrij te gebruiken, ook online, zonder naamsvermelding, met dieren- en figuurpakketten) of **DiceBear** (open avatarstijlen, licentie per stijl verschillend). Kenney heeft de voorkeur omdat CC0 het minste licentierisico geeft. De bestanden komen in een aparte map `assets/personage/`. |
| Toestel | **Tablet en pc** | Elke spelvorm werkt met aanraken én met toetsenbord en muis: grote knoppen, een cijferklavier op het scherm plus het gewone toetsenbord, slepen met vinger of muis, en tekenen voor letters. Het ontwerp past zich aan de schermgrootte aan. |
| Eerste versie | **Alle leerjaren, 2 spelletjes per leerjaar** | Zie de lijst hieronder. |
| Ouderzicht | **Ja, met pincode** | Een apart scherm achter een pincode van 4 cijfers. Per kind: gespeelde spelletjes, % juist per vak, de moeilijkste vragen en de laatste speeldagen. Daar staan ook instellingen (Frans aan/uit, leerjaar wijzigen, profiel verwijderen, gegevens exporteren). |

### Eerste versie: 12 spelletjes

| Leerjaar | Spel 1 | Spel 2 |
|---|---|---|
| 1e | Tel de diertjes (getallen) | Woord en plaatje (lezen) 🔊 |
| 2e | Tafelschelpen (×2, ×5, ×10) | Hoe laat is het? (klok) |
| 3e | Tafelklim (alle tafels) | Pizza-breuken (breuken herkennen) |
| 4e | Breukenduel (vergelijken, gelijkwaardig) | d of t? (werkwoorden) |
| 5e | Mots magiques (Franse woordenschat) 🔊 | Procentenmarkt |
| 6e | Kortingsjager (procenten, korting) | Être ou avoir? (Frans) |

Daarmee zitten in de eerste versie de spelvormen **meerkeuze**, **invullen** (met cijferklavier), **visuals** (blokjes, klok, taart/strook) en **voorlezen** in nl-BE en fr-FR. Dictee, slepen en tekenen volgen in fase 4. *Petit français* voor het 3e en 4e kan meeliften op dezelfde code als *Mots magiques*, met eenvoudigere woordjes.

### 8b. Tafelkeuze (beslist op 26 november 2026)

| Vraag | Beslissing |
|---|---|
| Welke spelletjes? | **Alle spelletjes met maal- of deeltafels**: nu Tafelschelpen (2e) en Tafelklim (3e), en elk nieuw tafelspel. Ze gebruiken één gedeelde generator (`src/core/tafels.ts`). |
| Wat kies je? | De **tafels** die je oefent (aanvinken, bv. 2, 5 en 10) en de **soort**: *maal*, *delen* of *allebei*. Minstens één tafel. |
| Waar kies je? | In het spelletje (kaart *🎯 Mijn tafels* naast de niveaus), in de Speelhal na het kiezen van het vak, en in het ouderzicht. |
| Bewaren | **Per kind** (`profiel.instellingen.tafels`), één keuze voor alle tafelspelletjes samen: "de tafels van deze week". |
| Sterren | Een ronde met eigen tafels geeft XP, muntjes en badges, maar geen sterren voor een niveau. Zo blijven de niveaus en de wereldbadges betekenisvol. |
| Arcade | In de Speelhal gebruikt het spel de eigen tafels op elk niveau. Het niveau past zich nog aan, maar de tafels blijven die van het kind. |

### Nog open
- Komt de naam "Schoolgames" ook in het spel, of kiezen we een kindvriendelijke naam?
- Mogen kinderen latere werelden al spelen, of gaan die pas open als het kind genoeg sterren heeft?
- Mag er geluid of muziek zijn, met een knop om het uit te zetten?
