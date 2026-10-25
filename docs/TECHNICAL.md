# TECHNICAL — v0.15.0

## Arkitektur och filstruktur

Spelbar statisk webbapp utan ramverk: `index.html` → `css/style.css?v=0.15.0` + `js/game.js?v=0.15.0`. Canvas 960×540, värld 3900 px bred, markens topp y=462. Alla spelresurser ligger lokalt och fungerar på GitHub Pages. Inga externt laddade fonter eller bibliotek.

Koden ligger i `js/game.js`: `update()` ansvarar för input, acceleration, gravitation, kollision, fiender, kapslar, kontrollpunkt och mål; `background()`, `water()`, `drawPlatforms()`, `gardenArches()`, `scenery()`, `hero()`, `hud()` och `minimap()` målar spelet. Tid normaliseras mot 60 fps via `requestAnimationFrame`, max 2 steg/frame.

## Animationer — 69 filer

`assets/characters/animated/`: RGBA PNG 240×300, baslinje **y=278**, stilla8, gå12, sprint12, hopp6, fall5, ducka4, hugg8, volt10, skada4.

- `assets/source/approved-fullbody.png`: godkänd fullfigur framifrån; källa för sju animeringslägen, genererad med `tools/build_sprites.py`.
- `assets/source/approved-side-profile.png`: noggrant frilagd originalgodkänd **sidovy** med samma skolvita/röda kläder; extraherad med `tools/extract_side.py` från `assets/references/approved-original-character-and-areas.png`.
- `tools/build_walk_rig.py`: genererar 12+12 gång/löpbilder med separata benrotationer från sidovyn. Det är **inte 24 separata handteckningar**. Sidovyn ser mot vänster och spelets PNG spegelvänds en gång mot höger. `hero()` spegelvänder till vänsterrörelse via `player.face`.
- Fysikkollidern är 31×54 px och **separat från de större bilderna**. Lägre/högre bildstorlekar får inte ändra kollision eller `player.y + player.h` som visuellt fotankare.

## Miljön

`assets/backgrounds/approved-park-panorama.jpg` är byggd från två tidigare godkända parkmålningar. `assets/decor/` innehåller föremål, lyktor, blommor och fiender. `assets/tiles/variants/` innehåller **8 vägg- och 8 hyllvarianter** för att undvika mekanisk upprepning; `tools/build_illustrated_tiles.py` beskär varianterna från den tidigare godkända målningen `assets/backgrounds/approved-park.png`. Rörligt vatten visas bara mellan verkliga marksegment: `[670,735]`, `[1425,1500]`, `[2170,2250]`, `[2950,3040]`. Stenvalv ligger helt **under** solida plattformars kollisionsyta.

Minikartan översätter positionskoordinater och plattformar till en 12-sektionsskiss. Framsteg, kapslar och kontrollpunkt påverkar HUD. Maximal energi är 99, fiendeträff kostar 18, fall kostar 25, kapsel ger +15 till max 99. Kontrollpunkt x≈1930 sparas till `localStorage` (`stadsparken-checkpoint`).

## Bygga grafik igen

Spelaren behöver inga Python-paket; färdiga PNG/JPG följer med. För den som behöver generera om resurserna:

```bash
pip install pillow numpy opencv-python scipy
python tools/rebuild_assets.py
```

Rätt ordning: `build_sprites.py` först, därefter `extract_side.py`, `build_walk_rig.py` som **ersätter gång/sprint**, därefter `build_park_assets.py`, `build_illustrated_tiles.py`, `build_panorama.py`. Kör inte `build_sprites.py` ensam efter sidogånggeneratorn utan att sedan regenerera sidogången. Källorna och referenserna ingår i ZIP.

## QA

```bash
node --check js/game.js
node tools/test_game_logic.cjs
```

Valfritt grafiskt Chromium-test kräver Playwright, via `python tools/visual_test_embedded.py`. Testet bäddar in alla lokala bildfiler i en minnessida eftersom testmiljön blockerar lokala navigations-URL:er. Browser-testet har alltså **inte kontrollerat publicering via GitHub**. Se `docs/QA.md`.

## Uppdatering och cache

Ändra VERSION i `js/game.js`, `?v` i JS och HTML, header/footer i `index.html`, dokumentation och `COMMIT_MESSAGE.txt` vid varje release. `index.html` ligger i repo-root och `css`, `js`, `assets`, `docs` behåller underkataloger.

## Förändringar i v0.13

- `stepDistance`: faktisk horisontell förflyttning på mark driver walk/run-index, med 110 px per hel gångcykel och 140 px per sprintercykel. Möjliggör stopp utan att fötterna fortsätter gå.
- `lastDustStep`: animerade mjuka partiklar vid fotkontakt. Landningspartiklar beror på övergång från luft till mark och ändrar inte träffytorna.
- Skapande av sidobilder: `python tools/build_walk_rig.py`; målade tiles: `python tools/build_illustrated_tiles.py` (Pillow/NumPy/OpenCV krävs endast för generering). Ordningen ingår i `tools/rebuild_assets.py`.
