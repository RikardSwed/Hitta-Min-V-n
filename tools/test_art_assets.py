"""Verifies built art does not regress across versions (dev-only Pillow dependency)."""
from pathlib import Path
from PIL import Image
R=Path(__file__).resolve().parent.parent
counts={'idle':8,'walk':12,'run':12,'jump':6,'fall':5,'crouch':4,'slash':8,'roll':10,'hurt':4}
for state,num in counts.items():
 paths=sorted((R/'assets/characters/animated').glob(f'{state}_*.png'))
 assert len(paths)==num,(state,len(paths),num)
 for path in paths:
  im=Image.open(path)
  assert im.size==(240,300),(path,im.size)
  alpha=im.convert('RGBA').getchannel('A')
  bbox=alpha.getbbox()
  assert bbox and bbox[2]-bbox[0]>10,path
  if state in ('walk','run'):
   assert bbox[3]==278,(path,bbox)
for state in ('walk','run'):
 from PIL import ImageChops
 paths=sorted((R/'assets/characters/animated').glob(f'{state}_*.png'))
 first=Image.open(paths[0]).convert('RGBA')
 assert sum(ImageChops.difference(first,Image.open(p).convert('RGBA')).getbbox() is not None for p in paths[1:])>=8
for kind in ('wall','ledge'):
 for i in range(8):
  im=Image.open(R/f'assets/tiles/variants/{kind}-{i}.png')
  assert im.size==(256,144 if kind=='wall' else 58),(kind,i,im.size)
print('PASS: 69 RGBA sprites, stable walk/run footline, 16 original-painting surface tiles.')
