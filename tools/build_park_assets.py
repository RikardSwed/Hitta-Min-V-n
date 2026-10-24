"""Deterministic illustrated foreground assets in the palette of the approved park art."""
from PIL import Image, ImageDraw, ImageFilter
from pathlib import Path
import random,math
R=random.Random(1709)
P=Path(__file__).resolve().parent.parent
D=P/'assets/decor';D.mkdir(exist_ok=True,parents=True)

def poly(d,p,fill,edge='#1b3540',ew=2):
 d.polygon(p,fill=fill);d.line(list(p)+[p[0]],fill=edge,width=ew,joint='curve')

# Modular stone block with hand-painted moss/grass; color scheme from approved park screenshot.
W,H=256,144
im=Image.new('RGBA',(W,H),(0,0,0,0));d=ImageDraw.Draw(im)
d.rectangle((0,0,W,H),fill='#263e45')
# Offset stone courses line up at repeated tile boundaries.
for row,y in enumerate([18,49,81,114]):
 height=[32,32,33,32][row]
 shift=(0 if row%2==0 else -38)
 x=shift
 while x<W:
  wd=76+R.randint(-14,13)
  xy=[(x+2,y+1),(x+wd-4,y+R.randint(1,4)),(x+wd-1,y+height-4),(x+wd-5,y+height),(x+3,y+height-1)]
  base=R.choice(['#56636a','#67736f','#54626b','#78827a','#596e70'])
  poly(d,xy,base,'#243944',2)
  d.line((x+7,y+5,x+wd-13,y+4),fill='#a4aea1',width=2)
  d.line((x+wd-8,y+8,x+wd-9,y+height-9),fill='#303d4c',width=2)
  # lichen and speckle rather than repeating rectangular solids.
  for j in range(6):
   xx=x+R.randint(6,max(6,wd-7));yy=y+R.randint(8,height-4)
   d.ellipse((xx,yy,xx+2,yy+1),fill=R.choice(['#8e988e','#394e4d','#9aa28f','#475b5b']))
  x+=wd
# Border ridge and sunny foliage top.
d.line([(0,19),(30,17),(63,21),(90,19),(127,18),(162,19),(193,17),(224,20),(256,18)],fill='#162f37',width=5)
d.rounded_rectangle((0,0,256,18),radius=5,fill='#485a50',outline='#1a363f',width=3)
d.line([(0,2),(256,2)],fill='#8eaa78',width=3)
for i in range(155):
 x=R.randint(-8,W+8); h=R.randint(2,14)
 color=R.choice(['#6ba94b','#8ec257','#bce273','#9acc54','#518d4e','#cde584'])
 d.line((x,12,x+R.randint(-4,5),12-h),fill=color,width=R.randint(1,3))
for x in [23,76,135,190,231]:
 y=R.randint(17,29)
 d.line([(x,y),(x+R.randint(-12,9),y+20),(x+R.randint(-17,10),y+38)],fill='#326749',width=3)
 for k in range(5):
  tx=x+R.randint(-12,12);ty=y+R.randint(10,42)
  poly(d,[(tx,ty),(tx+R.randint(3,8),ty-4),(tx+R.randint(8,12),ty+2),(tx+3,ty+8)],R.choice(['#518c51','#4d865b','#75a95e']), '#2d5b48',1)
im.save(D/'mossy-wall.png',optimize=True)

# Small decorative grass shelf - alpha shape extends below collision surface.
im=Image.new('RGBA',(256,58));d=ImageDraw.Draw(im)
d.rounded_rectangle((0,9,257,57),radius=8,fill='#354a53',outline='#213840',width=4)
for y in (25,42):
 for x in range(-40,265,70):
  poly(d,[(x,y),(x+66,y+1),(x+67,y+16),(x-3,y+16)],R.choice(['#697b76','#5b6d72','#6f7e74']), '#293f48',2)
d.line([(0,12),(256,12)],fill='#b9c1a6',width=5)
for i in range(133):
 x=R.randint(-8,263);y=R.randint(0,10)
 d.line((x,y+8,x+R.randint(-5,5),y-R.randint(3,15)),fill=R.choice(['#8cbe5c','#b6da6c','#588f58','#c5e482']),width=R.randint(1,3))
for x in [48,177]:
 d.line([(x,12),(x-6,28),(x-3,42)],fill='#41704d',width=3)
 for y in [20,30,35]:d.ellipse((x-13,y,x,y+7),fill='#5f9758',outline='#375e49',width=1)
im.save(D/'grass-ledge.png',optimize=True)

# Ornate lamp with warm lantern light; separate alpha sprite, no axis-aligned boxes.
im=Image.new('RGBA',(92,230));d=ImageDraw.Draw(im)
# subtle halo made of layered translucent strokes
for rad in range(53,13,-6):d.ellipse((46-rad,50-rad*.62,46+rad,50+rad*.62),fill=(251,206,100,4))
d.line([(46,216),(46,64)],fill='#192b3a',width=14)
d.line([(46,216),(46,64)],fill='#596573',width=7)
for y,w in [(214,19),(201,9),(74,9),(67,17)]:d.rounded_rectangle((46-w,y,46+w,y+5),radius=2,fill='#263944',outline='#a2a17c',width=1)
poly(d,[(29,40),(63,40),(59,66),(34,66)],'#ffd38a','#1e3241',4)
poly(d,[(36,44),(56,44),(55,62),(37,62)],'#fff5c8','#886b50',2)
d.line((30,40,38,27,55,27,63,40),fill='#263642',width=6,joint='curve')
d.ellipse((42,20,49,28),fill='#e1bc6b',outline='#263642',width=2)
d.line((25,66,68,66),fill='#263642',width=5)
im.save(D/'park-lamp.png',optimize=True)

# Flower bank with deep foliage and variety of flowers; transparent below.
im=Image.new('RGBA',(290,130));d=ImageDraw.Draw(im)
for i in range(42):
 x=R.randint(-18,300);y=R.randint(75,120);r=R.randint(15,38)
 color=R.choice(['#3b7759','#457c56','#5e975d','#729e63','#386c54'])
 d.ellipse((x-r,y-r,x+r,y+r),fill=color)
for i in range(90):
 x=R.randint(5,285); y=R.randint(18,99)
 d.line((x,y+15,x+R.randint(-6,6),y),fill='#4d7d4f',width=2)
 for angle in range(0,360,72):
  rad=math.radians(angle);xx=x+math.cos(rad)*5;yy=y+math.sin(rad)*5
  col=R.choice(['#fff7d7','#f8e2d9','#f1c3cd','#ffdda7','#f5f5de'])
  d.ellipse((xx-4,yy-3,xx+4,yy+3),fill=col)
 d.ellipse((x-2,y-2,x+2,y+2),fill=R.choice(['#e7b54d','#eebd60']))
im.save(D/'flowers.png',optimize=True)

# Banner on small signpost. Signposts and lamps are placed to complement existing painted background.
im=Image.new('RGBA',(110,170));d=ImageDraw.Draw(im)
d.line([(55,167),(55,12)],fill='#253b44',width=10)
d.line([(55,166),(55,12)],fill='#75807a',width=3)
d.line([(20,25),(88,25)],fill='#283d44',width=6)
d.polygon([(30,29),(78,29),(78,112),(54,96),(30,112)],fill='#b54f58')
d.line([(30,29),(78,29),(78,112),(54,96),(30,112),(30,29)],fill='#f1c578',width=3)
d.line([(54,52),(54,79)],fill='#f6d584',width=6)
d.line([(54,52),(42,64)],fill='#f6d584',width=4)
d.line([(54,58),(65,68)],fill='#f6d584',width=4)
im.save(D/'park-banner.png',optimize=True)

# Golden checkpoint with a glowing star and readable marker.
im=Image.new('RGBA',(144,195));d=ImageDraw.Draw(im)
for r in range(70,5,-5):d.ellipse((72-r,56-r,72+r,56+r),fill=(255,218,104,4))
d.line([(72,190),(72,75)],fill='#283b49',width=10)
d.line([(72,190),(72,75)],fill='#bd9d6c',width=4)
d.ellipse((52,34,92,74),fill='#f2d78f',outline='#263b4a',width=6)
pts=[]
for i in range(10):
 a=math.pi*i/5-math.pi/2;r=17 if i%2==0 else 8
 pts.append((72+r*math.cos(a),54+r*math.sin(a)))
poly(d,pts,'#fff9d1','#b77d3b',2)
d.rounded_rectangle((42,104,103,128),radius=6,fill='#e9d1a0',outline='#334554',width=4)
d.text((47,111),'SPARA',fill='#405463')
im.save(D/'checkpoint.png',optimize=True)

# Destination sign with school silhouette and flowering vine.
im=Image.new('RGBA',(200,195));d=ImageDraw.Draw(im)
d.rounded_rectangle((37,56,172,188),radius=13,fill='#536b77',outline='#283d4b',width=7)
d.polygon([(29,63),(103,13),(184,63)],fill='#aa6957',outline='#283d4b')
d.polygon([(44,61),(103,28),(171,61)],fill='#f6d5a1')
d.rounded_rectangle((63,93,144,181),radius=7,fill='#e2c18a',outline='#293f4b',width=4)
d.rounded_rectangle((83,106,125,186),radius=4,fill='#5d7a88',outline='#293f4b',width=4)
d.text((61,74),'SKOLAN',fill='#fffae6')
for k in range(7):
 x=34+k*22; y=168+R.randint(-2,8)
 d.ellipse((x,y,x+10,y+13),fill='#57925a')
im.save(D/'school-gate.png',optimize=True)
print('Created painted foreground tiles and props',len(list(D.glob('*.png'))))
# Friendly, illustrated park blob, not a hard-edged placeholder robot.
im=Image.new('RGBA',(120,90));d=ImageDraw.Draw(im)
d.ellipse((18,73,105,83),fill=(21,51,60,68))
d.pieslice((18,13,105,78),180,360,fill='#7fd65c',outline='#28534c',width=4)
d.rounded_rectangle((18,43,105,77),radius=25,fill='#79c959',outline='#28534c',width=4)
d.ellipse((30,24,90,66),fill='#93df6a')
d.ellipse((39,28,62,40),fill='#d7f7a1')
d.ellipse((46,49,53,60),fill='#233c51')
d.ellipse((76,49,83,60),fill='#233c51')
d.ellipse((48,50,50,53),fill='#fffbea')
d.ellipse((77,50,79,53),fill='#fffbea')
d.arc((55,53,76,69),15,155,fill='#3b6755',width=2)
d.ellipse((36,60,45,66),fill='#f4ac95')
d.ellipse((85,60,94,66),fill='#f4ac95')
im.save(D/'friendly-blob.png',optimize=True)
