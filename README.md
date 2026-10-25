# Stadens Hemlighet – Stadsparken v0.15.0

**Spelbar, fristående 2D-plattformspelprototyp för GitHub Pages**. Vi fokuserar på att förbättra samma Stadspark och samma godkända skolpojke innan fler Metroidvania-områden utvecklas.

## Vad är nytt i v0.13?

- **Mer varierade gång- och sprintsteg:** 12 bilder vardera skapas från pojkens **godkända sidoprofil**; de två benen roteras nu oberoende kring höfterna, i stället för att deformera hela figuren på samma sätt. Samma vita/röda tröja, blonda hår, svärd och sneakers. Den stående fullfiguren och övriga sju animationer är kvar.
- **Stabil fotkontakt:** gång- och sprintbilderna är förankrade på samma fotlinje (pixel 278 i PNG). Steg uppdateras utifrån faktiskt förflyttad sträcka i spelvärlden, inte enbart antalet filmrutor. Lätta dammpuffar markerar steg och landningar.
- **Målade parkplattformar:** 16 färdiga bildtexturer kommer nu direkt från **den tidigare godkända parkillustrationen**, snarare än grön datorritad textur. Väggar och hängande stenhyllor ligger kvar på oförändrade kollisionsytor.
- **Ingen ny bana eller omfattande spelomläggning:** 99 maxenergi, svärd, volt, hopp, fiender, sparpunkt, minikarta och skolan som mål finns kvar.
- **Tester:** Node-syntax, spel-logiksimulering, 69 bildfiler och Chromium-skärmbilder; inget webbläsarfel upptäckt i de körningarna. GitHub Pages hos användaren återstår att prova.

**Konstnärlig begränsning:** Det här är en bättre, bildbaserad tvåbensrigg av den ursprungliga godkända pojken – **inte 24 nya handmålade illustrationer**. Särskilt armpendling och övergång mellan framåtvänd stillastående pose och sidovänd gång behöver framtida nytt originalbildmaterial. Miljön är närmare godkänd stil, men inte identisk med målbilden.

## Installera och testa

1. Packa upp ZIP-filen och lägg **innehållet** (inte en överordnad extra mapp) i ditt GitHub-repository.
2. Behåll `index.html` i roten, CSS i `css/`, JavaScript i `js/`, resurser i `assets/` och dokumentation i `docs/`.
3. Aktivera GitHub Pages: **Settings → Pages → Deploy from a branch → main / (root)**.
4. Ladda om hårt om en tidigare version visas. Sidans båda versionsetiketter ska nu visa **0.15.0**.

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

`feat: v0.15.0 - tydligare gångsteg och målade parkplattformar`


## Nytt i v0.15.0

- Den gamla hjulningen är borttagen.
- Framåtvolten triggas nu genom att hoppa medan du håller framåt, mer som i Metroid.
- Förbättrade övergångar mellan markrörelser, hopp och landning.
