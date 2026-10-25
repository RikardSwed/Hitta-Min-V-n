"""Extract actual painted stone and lawn details from APPROVED Stadsparken illustration.
No rectangular procedural grass noise; tile bases are painted pixels authored
in the first approved park concept. Repeat variants keep the same top baseline.
"""
from pathlib import Path
from PIL import Image,ImageEnhance,ImageDraw,ImageFilter
import math
P=Path(__file__).resolve().parent.parent
src=Image.open(P/'assets/backgrounds/approved-park.png').convert('RGB')
out=P/'assets/tiles/variants';out.mkdir(parents=True,exist_ok=True)
for i in range(8):
    # First low garden wall: consistent stone blocks, moss and painterly grassy top.
    x=7+i*10
    wall=src.crop((x,330,x+256,474))
    if i%2:
        # Only subtle handpainted tonal changes, preserving the original artwork's palette.
        wall=ImageEnhance.Color(wall).enhance(1.018)
    if i in (3,6):wall=ImageEnhance.Brightness(wall).enhance(.975)
    wall.save(out/f'wall-{i}.png',optimize=True)
    # Original garden ledge near the fountain; natural trailing greenery and real masonry.
    lx=374+i*9
    ledge=src.crop((lx,409,lx+256,467))
    if i in (2,5):ledge=ImageEnhance.Brightness(ledge).enhance(.976)
    ledge.save(out/f'ledge-{i}.png',optimize=True)
print('Created 16 tiles directly from the approved park painting (no new art style).')
