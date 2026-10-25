# Versionshistorik — Stadens Hemlighet

## v0.12.0 — Profilvända rörelser och mer varierad stadspark

- En separat, **godkänd sidovy av skolpojken** har frilagts från det ursprungliga karaktärsarket. Den används till promenad och sprint, i samma kläder/utseende som övriga bilder.
- **12 gångrutor + 12 sprintrutor**, med kontinuerlig mjuk bilddeformation för benens pendling i stället för att styckvis rotera framsidans hela ben. De är inte individuellt handmålade. Övriga sju animationstillstånd behåller v0.11-riggen.
- Totalt **69 RGBA-sprites i nio tillstånd**, fortfarande med 240×300 bildyta och fotankare 278.
- **16 nya texturvarianter** (åtta mossiga väggblock + åtta gräsplattformar), med skilda sprickor, gräs, murgröna och enstaka blommor. Varianten väljs deterministiskt per plattform/tile.
- Vatten med svaga vågor i världens fyra verkliga markluckor och dekorativa stenvalv under vissa solida promenadytor. **Kollisionsplattformarna har inte flyttats**.
- Versionsnummer i spel, sidhuvud, sidfot och cachefrågor uppdaterat till v0.12.0.
- `tools/extract_side.py`, `tools/build_side_walk.py`, `tools/build_tile_variants.py`, `tools/rebuild_assets.py`, `tools/test_game_logic.cjs`, `tools/visual_test_embedded.py` dokumenterar och testar grafiken.
- **QA:** JS-syntaxkontroll, simulerad spelloop (99 HP, gång, sprint, hopp, svärd, volt, omstart), Chromium med inbäddade resurser; skärmbilder från gång, sprint, hopp och hugg. Inga browser pageerrors noterade. **Live GitHub Pages ej testad.**
- Grafiska begränsningar: sidorörelsen bygger fortfarande på förvrängning av originalteckningen, kan ge något glidande steg eller sakna den fulla illustrerade mellananimeringen. Miljödekorationer enklare än referensbilden.

# Versionshistorik — Stadens Hemlighet

## v0.11.0 — Grafik- och animationsombyggnad

- 65 RGBA-sprites från den **kompletta godkända skolpojken**, rigganimerade i 9 tillstånd; inga klippta delkroppar används i spelet.
- Gemensam bildyta (240×300), fotankare och stabil karaktärsstorlek.
- Tillagt Shift-sprint och separat gång/löpval i animationssystemet.
- Ny 4000×540 pixel panoramabakgrund av tidigare godkända parkmålningar utan upprepade överlagrade fontäner.
- Illustrerade modulära stenväggar, gräsplattformar, lyktor, blommor, flaggor, kontrollpunkt, skolport och vänliga gröna fiender.
- Omarbetat HUD med porträtt, HP max 99, kapselräknare och minikarta.
- Cacheversionsnummer på CSS, JS och grafiktillgångar.
- Godkända fullständiga referensbilder inkluderade under `assets/references/`.
- Grafikkällor och reproducerbara generatorskript sparade i `tools/`.
- Skärmbildstest genomfört i Chromium av start/animationer, utan observerade JS-fel. Live-GitHub-publicering ej testad.

## v0.10.0 — Stabilare fotankare

- 50 befintliga sprites centrerade efter synligt innehåll och normaliserade till gemensam baslinje.
- Anpassad bildrutstakt för promenad/löpning och större figur.

## v0.9.0 — Tillbaka till godkänd karaktär

- Återställde skolpojkens vita/röda utseende i stället för en generisk stiliserad vektorfigur.
- Rörelsebilder i 240×300-format, med delvis approximativa cykler.

## v0.8.0 — Animationsteknisk prototyp

- 50 bildrutor i 9 lägen, mer konsekvent skala och gångtempo, men karaktärsdesignen stämde inte med det godkända utseendet.

## v0.7.0

- Rensade poseutskärningar, illustrerad bänk och mindre överritning av bakgrunden.

## v0.6.0

- Ny minikarta, flyttad kapselräknare, justeringar av omstart och attack under duckning.

## v0.5.0

- Förbättrad fotplacering, hoppkänsla och spelomstart.

## v0.4.0 och tidigare

- Första spriteutskärningar, godkända parkillustrationer, en fungerande Canvas-bana och ursprunglig spelmekanik.
