# TECHNICAL — v0.11.0

## Arkitektur

Statisk klientapp utan bundler eller externa bibliotek. `index.html` hänvisar till `css/style.css?v=0.11.0` och `js/game.js?v=0.11.0`. **Spelvyn är HTML5 Canvas**, 960×540. Koden körs via requestAnimationFrame och ett tidssteg klippt till maximalt 2 bildrutsekvivalenter. Världen är 3 900 bred, grundlinje 462.

Spellogik och rendering finns i `js/game.js`. Översikt: `update()` (input, rörelsefysik, kollision, fiender, plockbara kapslar, checkpoint), `background()`, `drawPlatforms()`, `scenery()`, `hero()`, `hud()`, `minimap()`, `render()`.

## Kontroller och mekanik

- Pilar / A D = förflyttning (3,6 px/frame vid konstant framerate); Shift + rörelse = sprint (5,8). Duckning bromsar till 1,35.
- Space/W/upp = hopp; hoppbuffert 8, coyote time 7. Kortare hopp vid tidigt knappsläpp.
- J/X = svärd; K/C = framåtvolt med kort osårbarhet; ned/S = ducka.
- P/Esc = paus; fokusförlust pausar.
- Max HP 99, fiendeskada 18, fall 25, energikapslar +15 upp till 99. Ingen inbyggd betalning eller backend.
- Kontrollpunkt vid x≈1930 sparas i localStorage med nyckeln `stadsparken-checkpoint`. Starta om-knappen rensar den.

## Assetstruktur

- `assets/references/`: Godkända hela designreferenser (sparas för kontinuitet, laddas inte av spelet).
- `assets/source/approved-fullbody.png`: Kanonisk, komplett godkänd poserad pojke som används i riggbilder.
- `assets/characters/animated/`: **65 st 240×300 RGBA-PNG**, tillstånd: idle8, walk10, run10, jump6, fall5, crouch4, slash8, roll10, hurt4.
- `assets/backgrounds/approved-park-panorama.jpg`: Sammanfogad bild av två godkända parkmålningar, 4000×540.
- `assets/decor/`: Illustrerade marker, plattformshyllor, lyktor, blommor, banner, checkpoint, skolport, fiende. Bakgrunds- och legacyresurser sparas separat.
- `tools/build_sprites.py`, `tools/build_panorama.py`, `tools/build_park_assets.py`: Reproducerbar grafikgenerering från lokala källfiler (Pillow, NumPy, OpenCV). Körs **inte** i webbläsaren.

## Renderingsregler

Karaktärens fotankare ligger på pixel 278 av varje 300 pixlar hög bild. Den ritas centrerad ovanför spelens fotpunkt (`player.y + player.h`). Fysiskt spelarkollider är 31×54 och är **separat** från tecknad figur; förändring av sprites får inte ändra kollisionsfysiken. Gång/running laddas som separata bilder, fps är rörelseberoende; `hero()` väljer aktivt tillstånd och bildindex.

`panorama` rör sig med 0,90× kameraposition. Förgrundsplattformar är sammansatta av modulara grafikbilder på kollisionsplattformarnas toppkoordinater. Minikartan beräknar spelarposition och plattformar från faktiska världskoordinater.

## Cacheversion och deployment

`?v=0.11.0` används på JS/CSS och runtime-bilder för att undvika att en gammal kopia visas från webbläsarcachen efter GitHub-uppdatering. `index.html` och kataloger ska ligga vid GitHub Pages-publiceringsroten. Inga absoluta sökvägar används.

## Verifiering

`node --check js/game.js` för JavaScript-syntax. Bilder kan verifieras med Pillow och ZIP med `unzip -t`. Spelet har även öppnats i Chromium i en isolerad HTML-testmiljö med lokalt inlinade bilder, och gameplay-skärmbilder för olika animationer har inspekterats; det testade INTE en livepublicering på GitHub Pages. Se `docs/QA.md` för manuell checklista.
