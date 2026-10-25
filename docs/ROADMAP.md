# ROADMAP — efter v0.15.0

## Färdigt och verifierat

- Spelbar Stadspark med 99 maxenergi, fiender, svärd, hopp, duckning, sprint, volt, kapslar, lokal kontrollpunkt och mål.
- Godkända referensillustrationer arkiverade i `assets/references/`, utan generiskt utbytt karaktär.
- 69 sprites: sidovy för gång/sprint i 12+12 benriggade rutor, övriga animerade helfigursposer. Samma fotankare och kollider.
- 16 direkt av godkänd parkmålning hämtade plattformstiles, vatten i markluckor och illustrerade stenvalv.
- Minikarta, porträtt, versionsnummer och CSS i `css/`.
- Teknisk testning och inbäddad Chromium-skärmbildsgranskning av flera rörelser.

## Nästa viktiga etapper, INTE nya banor ännu

1. **Riktigt ritad gångcykel:** Illustrera och granska profilsteg ett i taget med samma godkända pojke; fotkontakt (ingen glidning), tydliga arm-/benpendlingar och sömlös övergång till idle/sprint. v0.13 använder ännu en ritad benrigg med begränsad armpendling och inte nymålade keyframes.
2. **Miljöns konstnärliga kvalitet:** Ytterligare djup i murverk, fontän, brosidor, terrasser och trädkronornas förgrund. Minska skillnaden mellan högupplöst målning och procedurillustrerade plattformar. Kontrollera skärm för skärm.
3. **Speltest efter feedback:** GitHub Pages-test på användarens riktiga webbplats och åtgärd av det som faktiskt sticker ut. Inga nya mekaniker innan den här banan känns och ser rätt ut.
4. **Senare:** Kort eget soundtrack, miljöljud, framtida stadsdelar, mer Metroidvania-återbesök.

## Releasepolicy

**Färre, mer genomarbetade versioner.** Ny version ska ha verkliga ändringar, verifierade lokala tillgångar, Node-syntax/logic-test, verkliga visuella skärmbilder när möjligt, aktuell README/TECHNICAL/ART_STYLE/ROADMAP/QA/AI_CONTEXT/CHANGELOG, versionsnummer, en komplett ZIP och GitHub-commit.
