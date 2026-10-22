# AI-överlämning – läs denna först

## Uppdrag
Fortsätt utveckla `Stadens Hemlighet`, ett vänligt handritat 2D-Metroidvania för webben/GitHub Pages. Användaren vill kunna ladda ner en ZIP och själv publicera på GitHub. Inga externa beroenden önskas för första versionerna.

## Viktiga låsta beslut
- Huvudperson: blond tonårspojke, skolstil (vit huvtröja/röd huva, mörka byxor, sneakers, ryggsäck), svärd.
- Värld: modern storstad med park, skola, stadshus, parkeringsgarage, höghus, tunnelbana m.m.
- Grafik: varm, detaljerad, tecknad 2D; inspiration från klassiska handritade plattformsspel, men eget formspråk.
- Maxenergi **99**, inte 99 separata liv. Behåll spelkänslan från v0.1 om inte användaren ber om ändring.
- CSS ska ligga i `css/`, JavaScript i `js/`.

## Nuvarande status
Senaste projektversion v0.2. v0.1 testades och fungerade enligt användaren. v0.2 integrerar en tillfällig karaktärsbild från konceptskissen och ett parkutsnitt som parallax, plus dokumentation. v0.2 behöver testas av användaren. Det är **inte** färdiga spritesheet-animationer.

## Återupptagning
1. Läs `README.md`, detta dokument, `GAME_DESIGN.md`, `ART_STYLE.md`, `TECHNICAL.md`, `ROADMAP.md` och `CHANGELOG.md`.
2. Läs faktiska filer, särskilt `js/game.js`; lita inte bara på dokumentationen.
3. Fråga hur senaste versionen fungerade innan större ändringar.
4. Behåll fungerande mekanik; leverera nya kompletta ZIP-versioner, med korrekt relativa sökvägar.
5. Uppdatera alla relevanta dokument efter varje version.

## Kända risker
Tillfällig PNG-friläggning kan ge ljusa kanter eller bakgrundsrester. Animerad rörelse är än så länge transformation av stillbild. Se ROADMAP för nästa steg.
