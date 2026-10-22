# Stadens Hemlighet – Stadsparken (prototyp 0.1)

Ett fristående 2D-plattformsspel byggt med HTML5 Canvas, CSS och ren JavaScript. Ingen byggprocess eller externa bibliotek behövs.

## Spela
Öppna `index.html` via en lokal webbserver (exempelvis VS Code Live Server eller `python -m http.server 8000`) och besök http://localhost:8000. På GitHub Pages fungerar spelet direkt.

## Kontroller
- A/D eller vänster/höger: spring
- W/upp/mellanslag: hoppa
- S/ned: ducka
- J/X: svärd
- K/C: framåtvolt (kortvarigt skydd)
- P/Escape: paus

## Spelmekanik
- Maxenergi 99, startenergi 99.
- Fiender gör 18 skada, fall kostar 25 energi.
- Energikapslar ger 15 energi (max 99).
- Kontrollpunkt vid ungefär halva banan lagras i `localStorage`.
- Nå skolporten i slutet för att klara banan.

## GitHub Pages
1. Skapa ett nytt GitHub-repository.
2. Ladda upp `index.html`, `style.css` och hela mappen `js/` i repositoryts rot.
3. Öppna Settings → Pages, välj `Deploy from a branch`, `main` och `/ (root)`.
4. Öppna länken GitHub visar när publiceringen är klar.

## Nästa steg
Separata transparenta spritesheets med konsekventa animationsrutor, fler banor, karta, musik och mer avancerad kollisionshantering. Denna prototyp använder ritad Canvas-grafik för att vara fullt spelbar redan nu.
