# QA — kontrollista för v0.11

## Tekniskt kontrollerat

- `node --check js/game.js`: ingen syntaxerror.
- Alla sprite-PNG-filer 240×300 med transparent alpha; totalt 65.
- HTML pekar på `css/style.css?v=0.11.0` och `js/game.js?v=0.11.0`.
- Skärmbilder från Chromium med inlinade lokala assetbilder (eftersom testmiljön blockerar lokala navigationsadresser): start, promenad, sprint, hopp, hugg och volt. Inga `pageerror` observerade. Startvyn finns i `docs/preview-v011.png`.
- Automatiska Chromium-kontroller klarade: alla 65 bildrutor laddade, start på 99 HP, normal gång, Shift-sprint, kontrollpunkt, skada till noll och återstart samt mål vid skolan.

## Manuell test på GitHub Pages (du som spelar)

- [ ] Webbsidan och spelet visar **v0.11.0** (både över och under spelvyn).
- [ ] Karaktären har vit tröja, röd huva, blont hår och jämn storlek när han står/går/springer.
- [ ] Fötterna är på plattformarna när han står, går, springer och duckar.
- [ ] Shift + höger/vänster ger snabbare löpning än vanlig promenad.
- [ ] Mellanslag hoppar; kort tryck ger kortare hopp och pojken landar på plattformarna.
- [ ] J/X visar svärd och kan besegra en grön parkfiende.
- [ ] K/C ger framåtvolt som skyddar mot en fiende.
- [ ] Energin startar på 99 och minskar vid träff; kapslar fyller på maximalt till 99.
- [ ] Minikartan visar spelarposition och öppnar besökta sektioner.
- [ ] Kontrollpunkt aktiveras ungefär halvvägs och återstart återplacerar spelaren rätt.
- [ ] Målet vid skolan visar att banan är avklarad.
- [ ] Starta om-knappen återställer från början.
- [ ] Inga avklippta figurer eller gamla bakgrunder visas efter hård omladdning.

## Kända visuella begränsningar

- Riggade ledrörelser bygger på en frontorienterad originalillustration: de är **inte** slutligt tecknade sidoposer.
- Panorama har avsiktligt återanvända delar av godkänd parkmålning och tilevariationerna är fortfarande begränsade.
- Fiender, HUD och dekor är enklare illustrerade än den detaljerade referensbilden.
