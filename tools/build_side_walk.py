"""Generate clean side-view walk/run cycles by gently warping the original APPROVED
side-view drawing. A continuous mesh avoids tearing white hoodie/boots into cutout shards.
Familiar clothes, face, sword and dark ink are exactly those of the approved concept.
"""
from pathlib import Path
from PIL import Image
import cv2,numpy as np,math
P=Path(__file__).resolve().parent.parent
src=np.asarray(Image.open(P/'assets/source/approved-side-profile.png').convert('RGBA'))
h,w=src.shape[:2]
y,x=np.mgrid[0:h,0:w].astype('float32')

def make(state,i,n):
 phase=2*math.pi*i/n
 velocity=1.0 if state=='walk' else 1.4
 # Smoothly deform left/right trouser legs below the hip, in counterphase.
 # Head, face, white jacket and hood remain almost untouched.
 active=np.clip((y-167)/110,0,1)**1.25
 side=np.tanh((x-67)/13)
 step=np.sin(phase)
 # Character faces left in original art; flip after deform to face right in game.
 leg_dx=active*(12*velocity)*step*side
 # Lift the swing-leg knee/foot, gentle downward landing for the planted foot.
 rear=np.clip((67-x)/30,0,1)
 front=np.clip((x-65)/30,0,1)
 lift_rear=max(0,step)*(7 if state=='walk' else 11)
 lift_front=max(0,-step)*(7 if state=='walk' else 11)
 lift=active*(rear*lift_rear+front*lift_front)
 # Forward pitch on upper body and a subtle two-beat weight shift.
 torso_weight=np.clip((175-y)/130,0,1)
 pitch= (2.0 if state=='walk' else 4.0)*torso_weight
 bounce= (1 if state=='walk' else 2.5)*abs(math.sin(phase*2))
 mapx=x-leg_dx-pitch
 mapy=y+lift+bounce
 warped=cv2.remap(src,mapx.astype('float32'),mapy.astype('float32'),cv2.INTER_CUBIC,borderMode=cv2.BORDER_CONSTANT,borderValue=(0,0,0,0))
 # Independent standing-foot anchor, derived only from shoes (avoids sword-tip downshift).
 yy,xx=np.where((warped[:,:,3]>100)&(y>240)&(x<115))
 shoe_bottom=int(yy.max()) if len(yy) else 291
 frame=Image.new('RGBA',(240,300))
 pose=Image.fromarray(warped,'RGBA').transpose(Image.Transpose.FLIP_LEFT_RIGHT)
 frame.alpha_composite(pose,(42,278-shoe_bottom))
 return frame

out=P/'assets/characters/animated'
for state,n in [('walk',12),('run',12)]:
 for i in range(n):make(state,i,n).save(out/f'{state}_{i:02d}.png',optimize=True)
print('Exported continuous-mesh walking/running cycles from original side-profile artwork')
