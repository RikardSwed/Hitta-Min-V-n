# Stadens Hemlighet – Stadsparken v0.2

Spelbar 2D-plattformsspelprototyp för GitHub Pages. Användaren har bekräftat att v0.1 fungerade. Version 0.2 introducerar konceptgrafik och projektunderlag; behöver testas.

## Starta
Öppna via GitHub Pages eller en lokal webbserver (`python -m http.server 8000` i projektmappen). Ingen installation eller byggprocess.

## Filstruktur
- `index.html` – startsida
- `css/style.css` – styling
- `js/game.js` – spelets kod
- `assets/characters/hero-school-concept.png` – tillfällig karaktärsbild
- `assets/backgrounds/park-concept.png` – parkillustration
- `docs/` – alla projektdokument, börja med `docs/AI_CONTEXT.md`

## Kontroller
A/D eller ←/→: gå. W/↑/mellanslag: hoppa. S/↓: ducka. J/X: svärd. K/C: framåtvolt. P/Esc: pausa.

## GitHub Pages
Ladda upp **innehållet** i ZIP-filen i repositoryts rot, med mappstrukturen intakt. I Settings → Pages välj Deploy from a branch → main → / (root). `index.html` måste ligga i repositoryts rot.

## Status
Maxenergi 99, robotfiender, kapslar, kontrollpunkt och skolutgång. Musiken återstår. Karaktären använder en frilagd konceptbild, ännu inte fullständiga handritade animationssprites. Läs `docs/ROADMAP.md`.
