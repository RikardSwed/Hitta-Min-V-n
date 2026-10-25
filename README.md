# Stadens Hemlighet – Stadsparken v0.12.0

**Spelbar, fristående 2D-plattformspelprototyp för GitHub Pages**. Vi fokuserar på att förbättra samma Stadspark och samma godkända skolpojke innan fler Metroidvania-områden utvecklas.

## Vad är nytt i v0.12?

- **Den riktiga sidovända skolpojken från det ursprungliga godkända karaktärsarket** används för gång och sprint. Det är fortfarande samma blonda pojke med vit huvtröja, röd huva, mörka byxor, sneakers och svärd.
- Gång och sprint har nu **12 bildrutor vardera**, med mjuk kontinuerlig deformation av sidovyn för en konsekvent karaktär. Övriga animationer behåller v0.11-riggen. Totalt **69 transparenta sprites** i nio tillstånd.
- **16 illustrerade sten/gräs-varianter** gör markytorna mindre upprepade. Skuggade **stenvalv** syns under vissa gångvägar; **animerat vatten** ligger i verkliga luckor mellan marksegmenten.
- Fysik och spelbana bibehållna: 99 maxenergi, energi från kapslar, snälla fiender, fontänbakgrund, svärd, duckning, volt, hopp, sparpunkt, skolan som mål, minikarta och Shift-sprint.
- Versionsnummer **v0.12.0** i spel, header och footer; dokumentation och projektets grafikkällor uppdaterade.

**Viktigt om kvaliteten:** Det här är fortfarande inte exakt den rika, handritade referensbilden. Sidostegen är deformerade från en godkänd sidovy – inte 24 separat illustrerade keyframes – och förgrundens plattformar är ännu mindre detaljrika än bakgrunden. Referensbilder finns i `assets/references/` och ska styra fortsatt arbete.

## Installera och testa

1. Packa upp ZIP-filen och lägg **innehållet** (inte en överordnad extra mapp) i ditt GitHub-repository.
2. Behåll `index.html` i roten, CSS i `css/`, JavaScript i `js/`, resurser i `assets/` och dokumentation i `docs/`.
3. Aktivera GitHub Pages: **Settings → Pages → Deploy from a branch → main / (root)**.
4. Ladda om hårt om en tidigare version visas. Sidans båda versionsetiketter ska nu visa **0.12.0**.

Vill du köra lokalt via en liten webbserver: `python -m http.server 8000` och öppna `http://localhost:8000` i din webbläsare. **Inga ramverk, CDN eller Python-paket behövs för att spela.**

## Kontroller

| Handling | Tangent |
|---|---|
| Gå | `←` / `→` eller `A` / `D` |
| Sprinta | Håll `Shift` och gå |
| Hoppa | `Mellanslag`, `W`, `↑` |
| Ducka | `↓` eller `S` |
| Hugg med svärd | `J` eller `X` |
| Framåtvolt | `K` eller `C` |
| Paus | `P` eller `Esc` |
| Börja om | Knappen ”Starta om” |

## Dokument och byggning

Läs `docs/AI_CONTEXT.md` när projektet återupptas i en ny konversation. `docs/ART_STYLE.md` definierar låst karaktärsdesign; `docs/TECHNICAL.md` beskriver arkitekturen; `docs/QA.md` har tester och kända begränsningar. `docs/ROADMAP.md` har nästa etapper. `docs/CHANGELOG.md` sparar versionerna. Alla godkända karaktärs- och parkreferenser finns i `assets/references/`.

Befintliga sprites och bakgrunder följer med. För den som vill **generera om illustrationerna** behövs Pillow, NumPy, OpenCV och SciPy och kommandot `python tools/rebuild_assets.py`. För källkodstest: `node --check js/game.js` och `node tools/test_game_logic.cjs`. De här verktygen behövs **inte** för själva spelet.

## GitHub commit message

`feat: v0.12.0 - godkänd sidovy för gång och sprint samt rikare stadspark`
