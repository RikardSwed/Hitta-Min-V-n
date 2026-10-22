# Teknisk dokumentation

## Plattform
HTML5 Canvas 960 × 540, JavaScript ES module, vanlig CSS. Inga externa paket, ingen byggprocess, fungerar på GitHub Pages. För lokal testning använd lokal HTTP-server eller VS Code Live Server.

## Struktur
- `index.html`: canvas, overlay, knappar, instruktioner; länkar till `css/style.css` och `js/game.js`.
- `css/style.css`: layout och responsiv skalning.
- `js/game.js`: uppdateringsloop, spelarfysik, kollisioner, renderingsfunktioner, input, HUD, ljud och localStorage.
- `assets/characters/`: karaktärsgrafik.
- `assets/backgrounds/`: miljögrafik.
- `docs/`: projektdokumentation.

## Spelvärden
Canvas 960×540, världens bredd 3900, marknivå 462. Spelarens kollisionsbox 31×54. Maxenergi 99. `requestAnimationFrame` driver loopen och tidssteget begränsas till 2 frames.

## Grafik v0.2
Två PNG-filer laddas via `new Image()` och ritas med `drawImage()` när de är tillgängliga. Figurens spelgrafik är en tillfällig stillbild med enklare rörelsetransformationer; fallback är procedurritad figur om bilden saknas.

## Sparning
`localStorage` nyckel `stadsparken-checkpoint`, värde `1930` vid kontrollpunkt. Detta sparar endast kontrollpunkt, inte fiender/kapslar/energi. Starta om-knappen rensar sparningen.

## Ljud
Små oscillatorljud via Web Audio API, ingen musik ännu.

## Kända begränsningar
Inte fullständigt speltestad i webbläsare efter v0.2-uppdateringen. En enda bana, inga sammanlänkade Metroidvania-områden ännu. Tillfällig sprite är inte en komplett animationsuppsättning. Fysiken har enkla plattformskollisioner, saknar avancerad väggkollision. Tangentbord primärt; inget mobilkontrollsystem.
