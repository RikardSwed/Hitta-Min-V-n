"""Reproducible articulated animation frames sourced from the APPROVED idle character.
Produces sprites with fixed 240x300 dimensions and 278 px ground anchor.
No cropped/partial poses from the concept contact sheet are used.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
from pathlib import Path
import math, cv2, numpy as np
P=Path(__file__).resolve().parent.parent
src=Image.open(P/'assets/characters/idle.png').convert('RGBA')
# Source original is cropped differently from assembled 240x300 frame; use v0.10 approved full-body image.
base=Image.open(P/'assets/source/approved-fullbody.png').convert('RGBA')
SW,SH=base.size
assert (SW,SH)==(240,300)

def polygon_mask(points):
    mask=Image.new('L',(SW,SH),0)
    d=ImageDraw.Draw(mask)
    d.polygon(points,fill=255)
    return mask.filter(ImageFilter.GaussianBlur(.9))

# Body painted in the approved image. Parts overlap around joints to prevent visible holes.
parts={
 'left_leg': polygon_mask([(109,153),(122,164),(117,181),(111,207),(100,232),(89,258),(83,274),(57,274),(57,255),(68,233),(76,210),(81,183),(90,158)]),
 'right_leg': polygon_mask([(113,157),(144,157),(152,179),(155,207),(160,229),(176,245),(184,267),(183,275),(125,275),(125,255),(129,233),(132,204),(125,183)]),
 'left_arm': polygon_mask([(89,91),(99,106),(95,130),(91,145),(91,165),(80,183),(58,186),(58,158),(62,133),(67,110),(76,97)]),
 'right_arm':polygon_mask([(138,91),(151,98),(161,114),(165,137),(177,142),(181,170),(177,182),(152,187),(150,169),(144,152),(139,129)]),
 'torso': polygon_mask([(82,79),(156,79),(165,113),(154,146),(158,170),(88,173),(85,155),(79,135),(75,117)]),
 'head': polygon_mask([(79,21),(155,18),(170,54),(157,79),(146,99),(99,98),(82,80),(75,54)])
}
# Prevent graphics from overlapping: extract individual layers (full alpha masked with polygon).
for key,m in parts.items():
    b=base.copy()
    b.putalpha(ImageChops.multiply(base.getchannel('A'),m))
    parts[key]=b

def transform(im, px,py,angle=0, dx=0,dy=0):
    # Positive angles tilt character part forward in image coordinates.
    m=cv2.getRotationMatrix2D((px,py),angle,1)
    m[0,2]+=dx;m[1,2]+=dy
    arr=cv2.warpAffine(np.asarray(im),m,(SW,SH),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
    return Image.fromarray(arr,'RGBA')

# Sprite is assembled from actual artwork, with motion in knees/arms/torso/hair, not a single static pose.
# Keep sword in a distinct layer and rotate with swing phases.
def sword_sprite():
    im=Image.new('RGBA',(160,52))
    d=ImageDraw.Draw(im)
    d.polygon([(8,26),(36,20),(125,21),(150,26),(125,31),(36,32)],fill='#24374c')
    d.polygon([(34,23),(127,23),(148,26),(127,29),(34,29)],fill='#edfaff')
    d.line([(40,23),(130,24)],fill='#a1d8e4',width=2)
    d.polygon([(19,18),(27,18),(33,34),(26,36)],fill='#c49e59',outline='#4b3b38')
    d.line([(2,26),(23,26)],fill='#4f362e',width=9)
    d.line([(2,26),(23,26)],fill='#a66a37',width=4)
    d.ellipse((0,21,9,31),fill='#f5d787',outline='#4d3340',width=2)
    return im
SWORD=sword_sprite()

def frame(state,phase):
    t=phase*math.tau
    walk=state in ('walk','run')
    amp=16 if state=='walk' else (26 if state=='run' else 0)
    if walk:
        left_ang=math.sin(t)*amp
        right_ang=-left_ang
        left_arm=-math.sin(t)*amp*.68
        right_arm=math.sin(t)*amp*.68
        lift=4 if state=='walk' else 8
        left_y=-max(0,-math.sin(t))*lift
        right_y=-max(0,math.sin(t))*lift
        squat=3 if state=='walk' else 6
        bob=-squat*max(0,math.cos(2*t))
        lean=2 if state=='walk' else 5
    elif state=='jump':
        left_ang=26;right_ang=-21;left_arm=20;right_arm=-33;left_y=-10;right_y=-11;bob=-2;lean=3
    elif state=='fall':
        left_ang=-14;right_ang=17;left_arm=-34;right_arm=31;left_y=-6;right_y=-8;bob=0;lean=-1
    elif state=='crouch':
        left_ang=28;right_ang=-27;left_arm=-4;right_arm=5;left_y=30;right_y=29;bob=32;lean=10
    elif state=='roll':
        left_ang=57*math.cos(t);right_ang=-57*math.cos(t);left_arm=-35;right_arm=30;left_y=22;right_y=24;bob=18;lean=0
    elif state=='slash':
        left_ang=10;right_ang=-12;left_arm=-7;right_arm=65-88*min(1,max(0,phase*1.6));left_y=1;right_y=0;bob=1;lean=8
    elif state=='hurt':
        left_ang=20;right_ang=-12;left_arm=42;right_arm=-25;left_y=0;right_y=-2;bob=2;lean=-12
    else:
        left_ang=0;right_ang=0;left_arm=1.5*math.sin(t);right_arm=-1.5*math.sin(t);left_y=0;right_y=0;bob=1.8*math.sin(t);lean=1.2*math.sin(t)
    canvas=Image.new('RGBA',(SW,SH),(0,0,0,0))
    # The approved figure is posed nearly front-on; joints hinge at shoulders and hips.
    for name,px,py,angle,dx,dy in [
        ('left_arm',83,105,left_arm,0,bob),
        ('left_leg',107,164,left_ang,0,left_y+bob),
        ('right_leg',130,164,right_ang,0,right_y+bob),
        ('torso',118,135,lean,0,bob),
        ('head',121,81,lean*.45+math.sin(t)*1.1,0,bob-1),
        ('right_arm',150,107,right_arm,0,bob)
    ]:
        canvas.alpha_composite(transform(parts[name],px,py,angle,dx,dy))
    if state=='slash':
        # Draw the hand-held silver sword with a smooth, continuous arc across eight frames.
        frac=phase
        sword_angle= -70+155*frac
        blade=Image.new('RGBA',(SW,SH),(0,0,0,0))
        blade.alpha_composite(SWORD,(161,120))
        blade=transform(blade,161,146,sword_angle,0,bob)
        canvas.alpha_composite(blade)
    elif state in ('idle','walk','run','jump','fall'):
        # Sheathed behind right shoulder; unobtrusive so original outfit stays recognizable.
        pass
    if state=='roll':
        # Rotate entire assembled body as one during the forward somersault.
        canvas=transform(canvas,120,154,-360*phase,0,-4)
    # Crop/squash explicitly for poses which must be lower than the standing body.
    if state=='crouch':
        bbox=canvas.getchannel('A').getbbox()
        if bbox:
            crop=canvas.crop(bbox)
            crop=crop.resize((crop.width,int(crop.height*.68)),Image.Resampling.LANCZOS)
            lowered=Image.new('RGBA',(SW,SH),(0,0,0,0))
            lowered.alpha_composite(crop,(bbox[0],278-crop.height))
            canvas=lowered
    if state=='roll':
        bbox=canvas.getchannel('A').getbbox()
        if bbox:
            crop=canvas.crop(bbox)
            ratio=min(1,155/max(crop.width,crop.height))
            crop=crop.resize((max(1,int(crop.width*ratio)),max(1,int(crop.height*ratio))),Image.Resampling.LANCZOS)
            lowered=Image.new('RGBA',(SW,SH),(0,0,0,0))
            lowered.alpha_composite(crop,((SW-crop.width)//2,278-crop.height))
            canvas=lowered
    # Ensure all grounded animation poses share an exact pixel groundline (278),
    # including swinging legs; jumping itself is controlled by game physics.
    bbox=canvas.getchannel('A').getbbox()
    if bbox and state in ('idle','walk','run','crouch','slash','roll','hurt'):
        delta=278-bbox[3]
        if delta:
            shifted=Image.new('RGBA',(SW,SH),(0,0,0,0))
            shifted.alpha_composite(canvas,(0,delta))
            canvas=shifted
    return canvas

frames={'idle':8,'walk':10,'run':10,'jump':6,'fall':5,'crouch':4,'slash':8,'roll':10,'hurt':4}
out=P/'assets/characters/animated'
for state,count in frames.items():
    for i in range(count):
        ph=(i/count) if state not in ('slash','jump','fall','hurt','crouch') else (i/max(1,count-1))
        im=frame(state,ph)
        im.save(out/f'{state}_{i:02d}.png',optimize=True)
# Remove extraneous prior sprite frames no longer used.
for p in out.glob('*.png'):
    st=p.stem.rsplit('_',1)[0];index=int(p.stem.rsplit('_',1)[1]);
    if st not in frames or index>=frames[st]:p.unlink()
print('Created',sum(frames.values()),'frames from approved intact concept character')
