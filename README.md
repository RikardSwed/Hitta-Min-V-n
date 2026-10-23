# Stadens Hemlighet – Stadsparken v0.8.0

Statisk HTML/CSS/JavaScript-webapp för GitHub Pages. Öppna `index.html` via en lokal webbserver eller publicera med GitHub Pages.

## Nytt i v0.8.0
- Rensade utsnitt ur godkända konceptbilder för de 13 befintliga karaktärsposerna; källbilderna sparas under `assets/source-poses/`.
- Enhetligare ritstorlekar för pojken och mindre påträngande svärdseffekt.
- Illustrerade parkbänkar i stället för enkla ritade bänkar.
- Färre enkla Canvas-former ovanpå de godkända parkillustrationerna.
- Minikarta och spelmekanik från v0.6.0 bevaras.

## Begränsningar
De godkända bilderna är konceptark, inte kompletta animationssprites. Därför är detta fortfarande en mellanversion, inte en exakt reproduktion av referensbilden. Ett komplett nytt konsekvent spritesheet och separata sömlösa bakgrundslager återstår. Webbläsartest är inte genomfört.

## Kontroller
Pilar/A-D: rörelse · Mellanslag/W/upp: hoppa · J/X: svärd · ned/S: ducka · K/C: volt · P/Esc: pausa.

## Publicering
Ladda upp hela ZIP-filens innehåll till repository-roten med bibehållna mappar. `index.html` pekar på `css/style.css` och `js/game.js`.


### v0.8.0
Nya konsekventa spriteanimationer (50 bildrutor, 9 rörelser) i `assets/characters/animated/`. Den synliga figuren har förstorats och står på en gemensam fotlinje. Behåll hela mappstrukturen vid GitHub-uppladdning.
