from pathlib import Path
P=Path(__file__).resolve().parent.parent
D=P/'docs'
commit='feat: v0.13.0 - tydligare gångsteg och målade parkplattformar'
(P/'COMMIT_MESSAGE.txt').write_text(commit+'\n')
readme=(P/'README.md').read_text()
readme=readme.replace('v0.12.0','v0.13.0').replace('v0.12?','v0.13?').replace('0.12.0','0.13.0').replace('v0.12','v0.13')
start=readme.index('## Vad är nytt')
end=readme.index('## Installera')
readme=readme[:start]+'''## Vad är nytt i v0.13?

- **Mer varierade gång- och sprintsteg:** 12 bilder vardera skapas från pojkens **godkända sidoprofil**; de två benen roteras nu oberoende kring höfterna, i stället för att deformera hela figuren på samma sätt. Samma vita/röda tröja, blonda hår, svärd och sneakers. Den stående fullfiguren och övriga sju animationer är kvar.
- **Stabil fotkontakt:** gång- och sprintbilderna är förankrade på samma fotlinje (pixel 278 i PNG). Steg uppdateras utifrån faktiskt förflyttad sträcka i spelvärlden, inte enbart antalet filmrutor. Lätta dammpuffar markerar steg och landningar.
- **Målade parkplattformar:** 16 färdiga bildtexturer kommer nu direkt från **den tidigare godkända parkillustrationen**, snarare än grön datorritad textur. Väggar och hängande stenhyllor ligger kvar på oförändrade kollisionsytor.
- **Ingen ny bana eller omfattande spelomläggning:** 99 maxenergi, svärd, volt, hopp, fiender, sparpunkt, minikarta och skolan som mål finns kvar.
- **Tester:** Node-syntax, spel-logiksimulering, 69 bildfiler och Chromium-skärmbilder; inget webbläsarfel upptäckt i de körningarna. GitHub Pages hos användaren återstår att prova.

**Konstnärlig begränsning:** Det här är en bättre, bildbaserad tvåbensrigg av den ursprungliga godkända pojken – **inte 24 nya handmålade illustrationer**. Särskilt armpendling och övergång mellan framåtvänd stillastående pose och sidovänd gång behöver framtida nytt originalbildmaterial. Miljön är närmare godkänd stil, men inte identisk med målbilden.

''' +readme[end:]
readme=readme.replace('`python tools/rebuild_assets.py`','`python tools/rebuild_assets.py`').replace('`feat: v0.12.0 - godkänd sidovy för gång och sprint samt rikare stadspark`',f'`{commit}`')
# Commit line after global version replace produces "feat: v0.13.0 - godkänd ..."
start=readme.index('## GitHub commit message')
readme=readme[:start]+f'## GitHub commit message\n\n`{commit}`\n'
(P/'README.md').write_text(readme)
old=(D/'CHANGELOG.md').read_text()
(D/'CHANGELOG.md').write_text(f'''# Versionshistorik — Stadens Hemlighet

## v0.13.0 — Tydligare steg och målade plattformar

- Gång och sprint: 24 nya PNG-rutor i godkänd sidoprofil med var för sig roterade ben i stället för tidigare helt sammanhängande mesh-deformation. Skor kalibrerade till exakt samma baslinje (278 px). Ansikte, kläder, färger och svärd hämtas från den godkända originalteckningen.
- Bildrutorna följer verkligt förflyttad sträcka, inte enbart klocktid; mjuka dammpuffar vid fotsteg och fall.
- 8+8 gräs- och stenvarianter är nu utsnitt ur den ursprungligt godkända parken (`approved-park.png`), i stället för den förenklade datorritade texturen. Oförändrade plattformskollisioner.
- Reproducerbar byggning: `tools/build_walk_rig.py`, `tools/build_illustrated_tiles.py`, och uppdaterat `tools/rebuild_assets.py`. Äldre skript sparas enbart som historik.
- Node-kodkontroll, logiktest och Chromium-test med skärmbilder är körda. GitHub Pages live-test återstår.
- **Begränsning:** Rörelserna är källillustrations-baserad riggning, inte individuellt nymålade animationer; handsving och viktförskjutning behöver ytterligare bildarbete. Målbildens hela detaljnivå är inte uppnådd.

''' +old.replace('# Versionshistorik — Stadens Hemlighet\n','',1))
files=['AI_CONTEXT.md','ART_STYLE.md','TECHNICAL.md','ROADMAP.md','QA.md']
for filename in files:
 p=D/filename;s=p.read_text();s=s.replace('v0.12.0','v0.13.0').replace('v0.12','v0.13').replace('0.12.0','0.13.0');p.write_text(s)
p=D/'AI_CONTEXT.md';s=p.read_text();i=s.index('## Designer');s=s[:i]+'''## Versionsspecifik leverans v0.13

- Bygger direkt på användarens v0.12-arkiv; alla godkända originalreferenser är kvar.
- 12+12 sidovy-gång/sprint med oberoende benrotation från `tools/build_walk_rig.py`. Fotbaslinje 278. `stepDistance` i `js/game.js` kopplar animationsfas till faktisk marksträcka; dammpuffar vid löpning/landning.
- 16 `assets/tiles/variants/*.png` är utsnitt av **godkänd parkmålning** skapade av `tools/build_illustrated_tiles.py`, utan nya stilar; 19 kollisionsplattformar orörda.
- `tools/rebuild_assets.py` använder de NYA byggskripten. Starta inte tidigare gamla skript separat om du vill behålla v0.13-illustrationerna.
- VIKTIGT: v0.13 är ännu inte nya individuellt tecknade frame-illustrationer. Ansikte/huvtröja bevarat, men viss styvhet i armar och kontakt kvarstår. Nästa steg: rita verkliga mellanposer i samma stil; ytterligare miljöförbättring och användarens GitHub-feedback.

'''+s[i:];(p).write_text(s)
p=D/'ART_STYLE.md';s=p.read_text();i=s.index('## Stadsparken');s=s[:i]+'''## Förfining v0.13

Den godkända **sidovyn** är fortsättningsvis källan till gång/sprint. Nu lyfts/svängs benen som separata, varsamt frilagda målade delar. 12 rutor per tillstånd och exakt y278 som fotankare. Detta är illustrerad rigganimation, inte nya handritade sprites. Behåll figurens exakta kläd- och ansiktsdesign. Den långa bakgrunden är oförändrad; 16 nya markytor är utsnitt av `assets/backgrounds/approved-park.png`, vilket bättre matchar dess penselstil.

'''+s[i:];(p).write_text(s)
p=D/'TECHNICAL.md';s=p.read_text();s=s.replace('`tools/build_side_walk.py`: genererar 12+12 gång/löpbilder med kontinuerligt deformationsfält från sidovyn.', '`tools/build_walk_rig.py`: genererar 12+12 gång/löpbilder med separata benrotationer från sidovyn.').replace('`tools/build_tile_variants.py` skapar dem från basgrafik.', '`tools/build_illustrated_tiles.py` beskär varianterna från den tidigare godkända målningen `assets/backgrounds/approved-park.png`.')
s += '''\n## Förändringar i v0.13

- `stepDistance`: faktisk horisontell förflyttning på mark driver walk/run-index, med 110 px per hel gångcykel och 140 px per sprintercykel. Möjliggör stopp utan att fötterna fortsätter gå.
- `lastDustStep`: animerade mjuka partiklar vid fotkontakt. Landningspartiklar beror på övergång från luft till mark och ändrar inte träffytorna.
- Skapande av sidobilder: `python tools/build_walk_rig.py`; målade tiles: `python tools/build_illustrated_tiles.py` (Pillow/NumPy/OpenCV krävs endast för generering). Ordningen ingår i `tools/rebuild_assets.py`.
'''
(p).write_text(s)
p=D/'ROADMAP.md';s=p.read_text();s=s.replace('12+12 rutor, övriga', '12+12 benriggade rutor, övriga').replace('v0.13 använder ännu varsam deformation av sidovyn.', 'v0.13 använder ännu en ritad benrigg med begränsad armpendling och inte nymålade keyframes.').replace('16 variationsrikare plattformstiles', '16 direkt av godkänd parkmålning hämtade plattformstiles');(p).write_text(s)
p=D/'QA.md';s=p.read_text();s=s.replace('sidovyn', 'sidovyn')
s+='''\n## Tilläggstester v0.13\n\n- [x] Ny 24-rutors gång-/sprint-rigg där fötter ligger på y278 (bildstorlek 240×300).\n- [x] 16 PNG-plattformar från godkänd målning (8+8).\n- [x] Stegdistansen ökar när spelaren går, Node-simuleringen passerar.\n- [x] Chromium rendering av spelvyn med inbäddade lokala assets, inga JS `pageerror`.\n- [ ] GitHub Pages-manualtest i användarens repo och subjektiv värdering av rörelser.\n''';(p).write_text(s)
print('Updated README, 6 docs, commit message')
