"""Eight variants of approved moss-stone wall and small ledge tile.
Deterministic details reduce the mechanically repeated stone look on a long park level.
"""
from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import random,math
P=Path(__file__).resolve().parent.parent
D=P/'assets/tiles/variants';D.mkdir(exist_ok=True,parents=True)
for family,src in [('wall','assets/decor/mossy-wall.png'),('ledge','assets/decor/grass-ledge.png')]:
 base=Image.open(P/src).convert('RGBA')
 for variant in range(8):
  r=random.Random(202601+variant+(0 if family=='wall' else 177))
  im=base.copy();d=ImageDraw.Draw(im)
  w,h=im.size
  if family=='wall':
   # Moss drips running down multiple courses, with nonrepeating ivy clusters.
   for j in range(2+variant%4):
    cx=r.randint(18,w-17); cy=r.randint(35,105)
    d.line([(cx,cy),(cx+r.randint(-5,5),cy+15),(cx+r.randint(-11,9),min(h-5,cy+35))],fill=r.choice(['#4d805b','#467154','#5d9267']),width=r.randint(2,4))
    for k in range(r.randint(2,5)):
     x=cx+r.randint(-13,12);y=min(h-5,cy+r.randint(7,32))
     col=r.choice(['#477f5d','#69a16c','#7baa65','#47674d'])
     d.ellipse((x-6,y-3,x+6,y+5),fill=col,outline='#2b5949',width=1)
   # Hand-sketched mortar cracks, tiny ochre lichens, not rectangular fill cells.
   for j in range(6):
    x=r.randint(8,w-9);y=r.randint(32,h-8)
    d.line([(x,y),(x+r.randint(-6,7),y+7),(x+r.randint(-6,9),y+11)],fill=r.choice(['#3b4f50','#45545a','#87938b']),width=1)
   if variant in (0,3,6):
    for i in range(15):
     x=r.randint(10,w-10);y=r.randint(65,140);d.ellipse((x-1,y-1,x+2,y+2),fill=r.choice(['#a4a589','#8e9e8a','#3d6a60']))
  else:
   # Small stone chips, hanging vines, flowers on the upper grass line.
   for j in range(3+variant%3):
    x=r.randint(9,w-10); y=r.randint(20,53)
    d.line((x,y,x+r.randint(-8,8),min(h-3,y+11)),fill=r.choice(['#344b52','#8b9383','#4f665f']),width=2)
   for i in range(5 if variant in (2,5,7) else 2):
    x=r.randint(9,w-10);y=r.randint(0,14)
    color=r.choice(['#f8e9c5','#f6cad0','#f9d7a6'])
    for a in range(0,360,90):
     xx=x+4*math.cos(math.radians(a));yy=y+4*math.sin(math.radians(a))
     d.ellipse((xx-3,yy-2,xx+3,yy+2),fill=color)
    d.ellipse((x-2,y-2,x+2,y+2),fill='#ecc071')
  im.save(D/f'{family}-{variant}.png',optimize=True)
print('Built',len(list(D.glob('*.png'))),'distinct foreground tiles')
