# QA — Stadsparken v0.12.0

## Automatiskt kontrollerat

- [x] `node --check js/game.js` — JS-syntax.
- [x] `node tools/test_game_logic.cjs` — simulering av faktiska spelrutiner: 99 HP, markkontakt, promenad, Shift-sprint, hopp, svärd, volt, omstart, 8 tilevarianter, 0.12.0.
- [x] Chromium via `tools/visual_test_embedded.py` — den **riktiga spelkoden** och alla lokala bilder inbäddade utan vanlig lokal nätverksnavigering. Visuella skärmbilder för stillastående/gång/sprint/hopp/hugg. Inga `pageerror` observerades.
- [x] Samtliga 69 animationer är 240×300 PNG och 16 nya variationstiles finns.
- [x] CSS i `css/`; index-filen anger cache-version `0.12.0`.
- [x] ZIP: integritet, nödvändiga resurser och dokumentation (vid release).

## Manuell speltest efter GitHub-uppladdning

- [ ] Index, spel HUD och sidfot visar v0.12.0 efter hård omladdning.
- [ ] Pojken har godkänt vitt/rött utseende och är ungefär samma storlek i idle och gång.
- [ ] Gång och sprint ser jämnare ut och skorna flyter inte under plattformens topp.
- [ ] Vatten visas i verkliga luckor, och stenvalv skymmer inte spelaren.
- [ ] Stenplattformar ser mer varierade ut och map/energi ligger på rätt ställen.
- [ ] J/X svärd, C/K volt, W/Space hopp och ↓/S duckning fungerar.
- [ ] Energikapslar maxar på 99 och fiender kan skada spelaren.
- [ ] Halvvägs aktiveras kontrollpunkt; död och återstart samt skolmålet fungerar.
- [ ] Inga saknade bilder, inga nya console-fel på publicerad GitHub Pages-adress.

## Kända begränsningar

- Sidovyns gångsteg är fortfarande en mjuk deformering av godkänd målning; inte riktiga konstnärligt nytecknade keyframes. Därför kan fotställning och byxveck bli för stilla eller glida.
- Parkens förgrund är fortfarande enklare än den rika målningen; stenvarianter och valv är en förbättring, inte en exakt reproduktion av referensbilden.
- Live GitHub-publiceringen har inte kunnat verifieras här och bör testas av användaren.
