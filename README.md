# Stadens Hemlighet — Stadsparken v0.11.0

**Spelbar prototyp** för GitHub Pages: en vänlig 2D-Metroidvania i en modern stad. Börja i Stadsparken, samla energikapslar och nå skolan. Spelet är fortfarande under utveckling; det är INTE en färdig handritad produktion.

## Vad har ändrats i v0.11?

- **65 nya sprites** i 9 animationstillstånd (stillastående, gång, löpning, hopp, fall, duckning, hugg, framåtvolt, skada). Alla byggs genom att dela upp och artikulera **samma godkända fullständiga skolpojke**. Inga avklippta del-figurer används längre i renderingen. Rörelsebilderna är alltså *rigganimation*, inte 65 individuellt nyritade illustrationer.
- Gemensam bildyta **240 × 300** och konstant fotankare y=278. Storlek på skärmen cirka 157 px (bildyta), med samma karaktärsdesign.
- Ny sammanhängande **4 000 px panoramabakgrund**, sammansatt av de två ursprungligen godkända parkmålningarna. Inga nya dekorativa referensbilder från nätet används.
- Nya separata, lokala illustrationer för **stenplattformar, gräskanter, lyktor, blommor, flaggor, kontrollpunkt, skolport och vänliga fiender**.
- Uppdaterat gränssnitt med pojkens porträtt, **99 som maximal energi**, kapselräknare och en rumslig minikarta.
- Lugn promenad med piltangenterna och **Shift för snabbare löpning**. Befintliga hopp, sword, volt, checkpoint, fiender och sparfunktion är kvar.
- Cache-versionering på CSS, JS och PNG-filer så GitHub Pages lättare visar den aktuella versionen.
- Fullständiga godkända referensbilder sparade under `assets/references/`. Genereringsskript under `tools/` för reproducerbar grafik.

## Testa lokalt och publicera

För lokal utveckling kan du öppna `index.html` via en enkel webbserver, exempelvis:

```bash
python -m http.server 8000
```

Öppna sedan `http://localhost:8000` i din egen webbläsare. Du kan också publicera projektets **innehåll** i roten av ett GitHub-repository och aktivera **Settings → Pages → Deploy from a branch → main / (root)**.

**OBS!** Lägg INTE hela mappen `stadsparken-v011` som en underkatalog om GitHub Pages ska hitta `index.html` i roten. Behåll `css/`, `js/`, `assets/`, `docs/` och `tools/`.

## Tangenter

| Handling | Tangent |
|---|---|
| Gå / vänd | `←` `→`, eller `A` `D` |
| Spring | Håll `Shift` och rör dig |
| Hoppa | `Mellanslag`, `W` eller `↑` |
| Ducka | `↓` eller `S` |
| Svärd | `J` eller `X` |
| Framåtvolt | `K` eller `C` |
| Paus | `P` eller `Esc` |

## Teknisk information

`index.html` hämtar `css/style.css` och `js/game.js`. Canvas är 960×540 och världen 3900 spelpixlar bred. Inga externa ramverk eller fjärrresurser behövs. Grafikfilerna skapas från de incheckade källfilerna med:

```bash
python tools/build_sprites.py
python tools/build_park_assets.py
python tools/build_panorama.py
```

Skripten kräver Python med Pillow, NumPy och OpenCV. **Du behöver inte köra dem för att spela**: de färdiga PNG-/JPG-filerna finns i ZIP-filen.

## Kvarstående arbete

Det här är en större förbättring, men **ingen pixelperfekt reproduktion av den godkända målbilden**. Framför allt saknar vi individuellt illustrerade, naturliga sidoorienterade rörelsesteg och ännu mer konsekventa målade foreground-tiles. Läs `docs/ROADMAP.md` och `docs/AI_CONTEXT.md` innan du påbörjar nästa version.

## GitHub commit

`feat: v0.11.0 - ny riggad skolpojke, sammanhängande park och illustrerade miljödelar`
