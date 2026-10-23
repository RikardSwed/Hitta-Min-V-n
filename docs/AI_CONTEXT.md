# AI-överlämning – Stadens Hemlighet

## Aktuell version: v0.7.0
Denna ZIP är källan till sanningen. Projektet är en statisk webapp för GitHub Pages, med index.html, css/style.css och js/game.js. Inga externa bibliotek krävs.

## Fastslagen vision
Metroidvania i en modern, vänlig storstad. Första området är Stadsparken. Blond tonårspojke i vit huvtröja med röd huva, mörka byxor och svärd. Handritad, färgstark, mjuk 2D-estetik enligt användarens **ursprungligen godkända konceptbilder**. Byt inte till generiska bilder eller en annan karaktärsdesign. Maximal energi 99.

## Nuvarande implementation
Canvas 960x540, värld 3900 bred. Plattformar, fiender, energikapslar, kontrollpunkt och mål. Bilder under assets/characters och assets/backgrounds. Bilderna är klippta från konceptark, inte professionellt framställda spritesheets; proportioner och kvalitet är ojämna.

## v0.5.0
Fokuserar på rörelse: enhetligare bildstorlekar, förbättrad hoppkänsla, bildväxling, skugga och återstart. Spelmekanik bevarad. Visuell kontroll i riktig webbläsare är ännu inte utförd; undvik att lova perfekt grafik.

## Nästa prioritet
1. Speltesta v0.6.0 och få användarens synpunkter.
2. Skapa konsekventa, separata transparenta sprites med samma figur, perspektiv, marklinje och storlek; bygg riktig animationssekvens.
3. Skapa sammanhängande park-tiles och rekvisita i samma stil, inte konceptark som direkt bakgrund.
4. Behåll synlig version, dokumentation, ZIP och commit-meddelande vid varje release.

## Kontroller
Pilar/A-D rörelse, mellanslag/W/upp hopp, ner/S ducka, J/X svärd, K/C volt, P/Esc paus.

## v0.6.0 (aktuellt)
Minikarta uppe till höger visar spelarposition, upptäckta sektioner, markavbrott och kontrollpunkt. Kapselräknare flyttad. Omstart vid 0 energi sker först när spelaren väljer att fortsätta. Fortsatt arbete: skapa äkta konsekventa animationer och sammanhängande illustrerade tiles; konceptark är inte färdiga sprites. Inga nya banor innan Stadsparken fungerar visuellt.

## v0.7.0
Rensade karaktärsutskärningar från konceptark, bevarade original under assets/source-poses, illustrerad bänk och mindre geometrisk överritning. Behåll originalstilen. Fortfarande behövs helt nya konsekventa animationer och miljötiles.
