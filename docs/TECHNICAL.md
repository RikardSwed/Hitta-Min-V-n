# Teknisk översikt (v0.5.0)

- Start: index.html; stilar: css/style.css; all spellogik: js/game.js.
- Canvas 960 × 540, WORLD=3900, GROUND=462. requestAnimationFrame, tidssteg begränsat till 2.
- Sprites: assets/characters/{idle,walk1,walk2,run1,run2,jump,fall,crouch,slash1,slash2,roll1,roll2,hurt}.png.
- Bakgrunder: assets/backgrounds/approved-park.png, approved-fountain.png. Texturer i assets/tiles/.
- Hjältebilden förankras vid fotnivå och har tillståndsberoende, normaliserad visningsstorlek; grafiken är ännu inte fullvärdiga animationer.
- Hopp: coyote time 7 frame units, buffert 8; variabel hopphöjd vid släppt knapp.
- Kontrollpunkt i localStorage med nyckeln stadsparken-checkpoint. Omstart-knappen nollställer banan.
- Inga externa beroenden, statiska relativa resurssökvägar. Kan publiceras på GitHub Pages.
- Kontroll: node --check js/game.js; zipfile test. Fullständigt webbläsarspeltest återstår.

## Minikarta v0.6.0
`minimap()` i `js/game.js` ritar en schematisk översikt av hela WORLD (3900 px) i Canvas. `visitedSections` spårar upptäckta tolfte-delar under aktuell spelsession. Detta är inte en separat HTML-widget och kräver inga externa bibliotek.

## v0.8.0
Källposer sparas under `assets/source-poses/`; spelet laddar bearbetade poser från `assets/characters/`. Minikarta i `js/game.js`.
