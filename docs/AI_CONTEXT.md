# AI_CONTEXT — överlämning av Stadens Hemlighet

## Senaste version: v0.11.0

**Källa till sanning:** denna kompletta ZIP/repository, inte tidigare chattbeskrivningar. Användaren bekräftade att v0.8 fungerade, att v0.9 hade rättare karaktär och storlek, och bad om större, mer genomarbetade uppdateringar i stället för snabba små releaser. Användaren har **inte ännu återrapporterat hur v0.11 fungerar hos dem**.

## Design som användaren godkänt

- Metroidvania-plattformsspel i en *modern storstad*. Tonen ska vara vänlig och äventyrlig.
- **Blond tonårspojke med VIT huvtröja, RÖD huva, mörka byxor, sneakers och SVÄRD.** Ändra inte kläddesignen eller karaktärsstilen utan att fråga.
- Ljus, rikt illustrerad 2D-miljö i Stadsparken: vattenfontän, träd, grönska, bänkar, gatlyktor, broar, stenplattformar, storstadssiluett.
- **Designreferenserna är bundlade i `assets/references/`.** Viktigast: `approved-original-character-and-areas.png` för den exakta skolpojkens ursprungliga utseende och `approved-gameplay-visual-target.png` för det önskade spelutseendet med karta uppe till höger. `approved-initial-concepts.png` visar första områdesidéerna.
- 99 maximal **energi** (inte 99 extra liv). Minikarta uppe till höger, synlig version i spelet och under webbsidan, commit-meddelande vid varje uppdatering.
- Börja med att få **Stadsparken riktigt snygg och rörelserna naturliga** före nya banor.

## Nuvarande spelteknik

Statiskt HTML5 Canvas + CSS + JavaScript utan nätverksberoenden. `index.html`, `css/style.css`, `js/game.js`. Canvas 960×540, WORLD=3900, GROUND=462. Spring med Shift + rörelse, hopp, duckning, svärd och framåtvolt. Kapslar återställer energi, fiender och kontrollpunkt, mål vid skolan. Sparnyckel `stadsparken-checkpoint` i localStorage. Minikarta återger spelarposition, kontrollpunkt och besökta sektioner. Max energi 99.

## Grafisk implementation v0.11

**65 bildrutor (8+10+10+6+5+4+8+10+4)** i `assets/characters/animated/`. De kommer från ett **riggat utsnitt av en godkänd helfigursillustration** som lagras i `assets/source/approved-fullbody.png`. `tools/build_sprites.py` delar upp den i huvud, bål, armar, ben och återskapar poser med rotationer (Python+OpenCV+Pillow). Det är INTE nyritade illustrationsrutor och framför allt gång/löpning behöver fortsatt konstnärligt arbete i profil.

`assets/backgrounds/approved-park-panorama.jpg` är byggd från de två godkända parkmålningarna med `tools/build_panorama.py`. `assets/decor/` har illustrerade tile- och rekvisitabilder byggda med `tools/build_park_assets.py`. Fullständiga godkända referenser ligger i `assets/references/`.

GitHub-versionen finns i `VERSION` i `js/game.js`, sidans header/footer i `index.html`, query-versionen på HTML/JS/CSS-bilder samt dokumentationen. Uppdatera ALLA vid nästa release.

## Kvalitet / verifiering

v0.11 har körts i Chromium med inlinade lokala assets (miljön blockerar vanlig lokal URL-navigation); skärmbilder skapades för stillastående, gång, löpning, hopp, svärdshugg och volt. Inga JavaScript-sidfel observerades i det testet. Det är inte samma sak som ett fullständigt GitHub Pages-test eller test av alla nivåövergångar.

## Prioritet för nästa uppdatering

1. Be användaren om intryck av v0.11 i webbläsaren, särskilt hur pojkens rörelser ser ut, fötternas läge och parkens foreground.
2. Ersätt riggens ungefärliga **frontvända** steg med **riktiga individuellt illustrerade profilposer** i EXAKT samma skolpojksdesign. Gärna ett kontrollerat spritesheet uppdelat i enskilda bilder utan överlapp.
3. Fortsätt bearbeta parkens främre stenplattformar, planteringar och dekor så de är lika målade som bakgrunden, och förbättra fienders tecknade uttryck.
4. Om användaren ger en bugg ska den prioriteras före nya funktioner.
5. Leverera alltid komplett ZIP, tydligt synlig version, aktuell dokumentation, GitHub commit-message och kända begränsningar. Undvik att säga att den grafiska målbilden är uppnådd förrän den faktiskt är det.
