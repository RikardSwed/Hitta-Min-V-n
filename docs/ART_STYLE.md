# ART_STYLE — låst grafisk riktning

## Godkänd karaktär

Tonårspojke med blont, spretigt hår, blå ögon, VIT huvtröja med RÖD huva/insida, mörka byxor, sneakers, ett lätt äventyrssvärd. Vänlig, uttrycksfull, färgrik 2D-illustrationsstil med varma färger, tydlig konturlinje och mjuka skuggor. **Använd inte en annan hjälte i generisk anime-, pixel- eller vektorstil.**

Exakt godkänd karaktär finns i `assets/references/approved-original-character-and-areas.png`. Illustrerad målbild med pojken i parken och en minikarta finns i `assets/references/approved-gameplay-visual-target.png`. Flera godkända miljöer finns i `assets/references/approved-initial-concepts.png`.

## Godkänd park

En stadspark med ljus himmel, fjärran höghus, lövträd, parkbänkar, fontän, blomsterplanteringar, gamla gatlyktor och grönt mossbevuxna stenplattformar. Hög detaljgrad och enhetligt ljus. Lika färgrik som originallandskapet; inte grå lådor eller mörka abstrakta former.

## Faktisk implementation

`assets/source/approved-fullbody.png` är källan till riggade animationer. Sprites är 240×300 PNG och ankras vid `(120,278)`. 65 separata animationstillståndsrutor genereras i `tools/build_sprites.py` genom 2D-ledrotationer, inte genom att varje ruta målas manuellt. Sprites ses i 125×157 pixlar i spelet. Färdig konst kan senare ersätta enskilda rutor utan att ändra dessa mått och ankare.

`assets/backgrounds/approved-park-panorama.jpg` bygger på två godkända målningar. `assets/decor/` har tile- och rekvisitabilder för plattformar, blommor, lyktor, en kontrollpunkt och små blob-fiender. Dessa är separata grafikobjekt och inte delar av en skärmbild med HUD.

## Fortsatt visuell kvalitetsribba

1. Tydlig, oförändrad identitet i varje animation.
2. Naturliga, profilvända gång-/löpsteg och verkliga förändringar av ben, armar och huvud (inte samma stillbild för varje ruta).
3. Exakt gemensam fothöjd på marken när figuren står eller går, kontrollerad per animation.
4. Kontinuerlig parallax, ljus och skuggor utan uppenbart repetitiva eller stretchade bakgrunder.
5. Samma textur- och kontrastnivå i plattformar och föremål som i målbilden.
