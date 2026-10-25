"""Animated side-view limb poses from APPROVED character side illustration.
No third-party assets; edits only trouser and sneaker cutouts while preserving
face, coat, hair and sword. Generated transparent frames share 278px anchor.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageChops,ImageFilter
import numpy as np,cv2,math
P=Path(__file__).resolve().parent.parent
SRC=Image.open(P/'assets/source/approved-side-profile.png').convert('RGBA')
W,H=SRC.size
A=SRC.getchannel('A')
def mask_poly(polys,blur=0.8):
 im=Image.new('L',(W,H));d=ImageDraw.Draw(im)
 for pts in polys:d.polygon(pts,fill=255)
 return im.filter(ImageFilter.GaussianBlur(blur))
def cut(m):
 im=SRC.copy(); im.putalpha(ImageChops.multiply(A,m));return im
# Keep shoe + trousers together. Cuffs and sneakers are fully painted originals.
leg_rear=cut(mask_poly([[(67,165),(87,172),(91,195),(103,224),(108,250),(120,269),(121,289),(70,290),(72,263),(79,238),(69,215),(61,187)]]))
leg_front=cut(mask_poly([[(36,163),(71,162),(69,185),(68,215),(66,236),(68,263),(68,287),(13,288),(15,274),(30,266),(37,247),(31,232),(32,208)]]))
# Hide lower original legs under animations, but keep the whole blade/shielded forearm.
topmask=mask_poly([[(0,0),(134,0),(134,108),(128,150),(121,184),(98,185),(70,182),(14,184),(0,170)]],blur=0.75)
# sword as separate silver blade + hilt, so it won't follow leg rotation
swordmask=mask_poly([[(66,136),(75,134),(89,157),(99,166),(102,180),(115,193),(122,218),(138,242),(137,254),(127,250),(110,232),(99,211),(91,188),(79,175),(69,163)]],blur=1.0)
fronttop=cut(topmask); sword=cut(swordmask)
# right glove covers hip in front of near leg
arm=cut(mask_poly([[(79,126),(97,124),(115,134),(119,159),(110,181),(82,181),(73,173),(69,153)]],.65))
def affine_about(im, center,angle,dx=0,dy=0):
 m=cv2.getRotationMatrix2D(center,angle,1.0)
 m[0,2]+=dx;m[1,2]+=dy
 out=cv2.warpAffine(np.array(im),m,(W,H),flags=cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
 return Image.fromarray(out,'RGBA')
def generate(state,i,n):
 t=math.tau*i/n
 sp=1 if state=='walk' else 1.32
 angle=math.sin(t)* (11 if state=='walk' else 19)
 # bend the planted shoe slightly by sliding the shin relative to knee
 rear=affine_about(leg_rear,(72,165),-angle*sp,0,-3*max(0,-math.sin(t)))
 front=affine_about(leg_front,(52,164),angle*sp,0,-4*max(0,math.sin(t)))
 out=Image.new('RGBA',(W,H))
 out.alpha_composite(rear)
 out.alpha_composite(front)
 out.alpha_composite(fronttop)
 out.alpha_composite(sword)
 # Right glove and jacket cuff are preserved intact by the upper-body mask.
 # Stabilize only actual shoe pixels (excluding long sword)
 ar=np.asarray(out)
 yy,xx=np.where((ar[:,:,3]>140)&(np.indices(ar.shape[:2])[0]>251)&(np.indices(ar.shape[:2])[1]<120))
 bottom=int(yy.max()) if len(yy) else 287
 # Shift into 240x300 frame and horizontally mirror to face right
 frame=Image.new('RGBA',(240,300))
 pose=out.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 frame.alpha_composite(pose,(42,278-bottom))
 # Final, fixed foot baseline across all poses; stabilizes sprite when walking.
 bbox=frame.getchannel('A').getbbox()
 if bbox and bbox[3] != 278:
  normalized=Image.new('RGBA',(240,300))
  normalized.alpha_composite(frame,(0,278-bbox[3]))
  frame=normalized
 return frame
if __name__=='__main__':
 outdir=P/'assets/characters/animated'
 for state in ['walk','run']:
  for i in range(12):generate(state,i,12).save(outdir/f'{state}_{i:02d}.png',optimize=True)
 print('Built 24 joint-rotated walk/run frames; approved artwork retained.')
