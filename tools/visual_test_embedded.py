"""Chromium visual QA without localhost navigation: runs the unmodified game script
in a single in-memory HTML document whose images are embedded as data URIs.
Requires playwright Chromium; site itself needs NO packages.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,re,time
R=Path(__file__).resolve().parent.parent
html=(R/'index.html').read_text()
css=(R/'css/style.css').read_text()
script=(R/'js/game.js').read_text()
resources={}
for f in (R/'assets/characters/animated').glob('*.png'):resources[f.relative_to(R).as_posix()]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()
for f in (R/'assets/decor').glob('*.png'):resources[f.relative_to(R).as_posix()]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()
for f in (R/'assets/tiles/variants').glob('*.png'):resources[f.relative_to(R).as_posix()]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()
f=R/'assets/backgrounds/approved-park-panorama.jpg';resources[f.relative_to(R).as_posix()]='data:image/jpeg;base64,'+base64.b64encode(f.read_bytes()).decode()
f=R/'assets/backgrounds/illustrated-bench.png';resources[f.relative_to(R).as_posix()]='data:image/png;base64,'+base64.b64encode(f.read_bytes()).decode()
html=re.sub(r'<link rel="stylesheet"[^>]*>',f'<style>{css}</style>',html)
html=re.sub(r'<script type="module"[^>]*></script>','',html)
loader='''<script>const RESOURCES=__DATA__;const NativeImage=window.Image;
window.Image=class extends NativeImage{set src(s){let p=s.split('?')[0];const q=[];for(const seg of p.split('/')){if(seg==='..')q.pop();else q.push(seg)};super.src=RESOURCES[q.join('/')]||s}get src(){return super.src}};
</script>'''.replace('__DATA__',json.dumps(resources,separators=(',',':')))
html=html.replace('</body>',loader+'<script>'+script+'</script></body>')
print('embedded HTML bytes',len(html),'resources',len(resources),flush=True)
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1120,'height':790},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.set_content(html,wait_until='domcontentloaded',timeout=90000)
 page.wait_for_timeout(700)
 page.locator('#play').click()
 page.wait_for_timeout(1000)
 d=R/'test';d.mkdir(exist_ok=True)
 c=page.locator('#game')
 c.screenshot(path=str(d/'v013-idle.png'))
 page.keyboard.down('ArrowRight');page.wait_for_timeout(680)
 c.screenshot(path=str(d/'v013-walk.png'))
 page.keyboard.down('ShiftLeft');page.wait_for_timeout(920)
 c.screenshot(path=str(d/'v013-run.png'))
 page.keyboard.up('ArrowRight');page.keyboard.up('ShiftLeft');page.keyboard.press('KeyX');page.wait_for_timeout(80)
 c.screenshot(path=str(d/'v013-slash.png'))
 page.keyboard.press('Space');page.wait_for_timeout(130)
 c.screenshot(path=str(d/'v013-jump.png'))
 print('page errors',errors,'screenshots',len(list(d.glob('v013-*.png'))),flush=True)
 browser.close()
 assert not errors,errors
