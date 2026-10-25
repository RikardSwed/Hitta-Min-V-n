# AI_CONTEXT — överlämning för Stadens Hemlighet

## Senaste kompletta version: v0.12.0

Den här ZIP/repository-versionen är den kanoniska koden. Användaren bekräftade att v0.8 fungerade och att v0.9 hade rättare figurstorlek. v0.11 levererades, och användaren bad uttryckligen att vi skulle fortsätta med **färre och mer genomarbetade versioner**. Inga nya banor förrän Stadsparken och animationerna håller rätt nivå. Användaren har inte ännu lämnat detaljerad speltestfeedback på v0.12.

## Designer vi MÅSTE bevara

Originalgodkänd blond tonårspojke med **vit huvtröja, röd huva**, mörka byxor, sneakers och svärd. Vänlig, rik handillustrerad 2D-karaktär. Referensen är `assets/references/approved-original-character-and-areas.png`. Den eftersträvade spelbilden finns i `assets/references/approved-gameplay-visual-target.png`. Det är ingen fri nytolkning; användaren har flera gånger påpekat när assistenten visat fel figurer/stil.

Stadspark i modern storstad med fontän, träd, bänkar, blommor, stenplattformar, stenbroar, dagsljus, vatten och stadssiluett. Mini-karta uppe till höger. 99 = **maximal energi**. Godkända tidigare banförslag: skola, stadshus, höghus, tunnelbana, parkeringsgarage, gator, köpcentrum; ska inte utvecklas ännu.

## Teknisk bas

Statiskt HTML5/JS/CSS, GitHub Pages: `index.html`, `css/style.css`, `js/game.js`. Canvas 960×540, WORLD 3900, GROUND 462. Arrow/A,D förflyttning, Shift sprint, space/W/up hopp, X/J svärd, C/K volt, down/S ducka. Max HP99, checkpoints localStorage, energikapslar, snälla blobfiender och skolan som nivåslut.

## Grafik v0.12

`assets/characters/animated/` har **69 sprites** i 240×300 med fotankare 278: idle8 walk12 run12 jump6 fall5 crouch4 slash8 roll10 hurt4.
- `tools/build_sprites.py` bygger ursprunglig rigg från godkända framvända `assets/source/approved-fullbody.png` för övriga rörelser.
- `tools/extract_side.py` extraherar **godkänd sidovy** ur första karaktärsarket till `assets/source/approved-side-profile.png`.
- `tools/build_side_walk.py` gör 12+12 rena gang/sprintbilder som **kontinuerlig deformationsrörelse från sidovyn**, inte handritade steg.
- `assets/backgrounds/approved-park-panorama.jpg` är en panoramasammansättning av godkända parkmålningar. `assets/decor/` innehåller basillustrationer, `assets/tiles/variants/` innehåller **16 varierade tegel-/grästiles**. Fyra vattenluckor och flera stenvalv målas med Canvas under markens kollisionsyta.
- Rekommenderad reproduktion: `python tools/rebuild_assets.py` (Python kräver Pillow, NumPy, OpenCV och SciPy). Körning behövs INTE för att spela.

## QA-status

`node --check js/game.js`, `node tools/test_game_logic.cjs` och Chromium med alla bilder inbäddade i en temporär HTML-sida har fungerat utan observerade JS-fel. Browsern blockerade navigering till lokala URL:er, varför testet renderade sidans källkod utan nätverksåtkomst; detta är ingen live GitHub Pages-kontroll. Skärmbilden `docs/preview-v012.png` är från en **verklig Chromium-spelsession** med inbäddade resurser.

## Nästa prioritet

Riktigt tecknade individuella profilsteg, förbättrad förgrund som matchar samma färgrika stil som målbilden, feedback från speltest och återkommande grundlig QA. Ändra inte karaktärsidentiteten! Leverera vid varje ändring: full ZIP, version i canvas och footer, README och alla docs, commit message, QA och kända begränsningar.
