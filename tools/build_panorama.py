"""Combine ONLY the two earlier approved park paintings into a longer scrolling panorama."""
from PIL import Image,ImageFilter
from pathlib import Path
import numpy as np
P=Path(__file__).resolve().parent.parent
park=Image.open(P/'assets/backgrounds/approved-park.png').convert('RGB')
water=Image.open(P/'assets/backgrounds/approved-fountain.png').convert('RGB')
# Keep approved composition mostly unchanged and crop unneeded sky/light foreground.
segments=[(park.resize((1690,540),Image.Resampling.LANCZOS),0),
          (water.resize((1230,620),Image.Resampling.LANCZOS).crop((0,0,1230,540)),1420),
          (park.resize((1690,540),Image.Resampling.LANCZOS),2440)]
W,H=4000,540
output=np.zeros((H,W,3),dtype=np.float32)
weight=np.zeros((H,W,1),dtype=np.float32)
for im,x in segments:
 a=np.asarray(im,dtype=np.float32)
 w=im.width
 ramp=np.ones(w,dtype=np.float32)
 taper=200
 if x>0:ramp[:taper]=np.linspace(.001,1,taper)
 if x+w<W:ramp[-taper:]=np.minimum(ramp[-taper:],np.linspace(1,.001,taper))
 ramp=ramp[None,:,None]
 width=min(w,W-x)
 output[:,x:x+width]+=a[:,:width]*ramp[:,:width]
 weight[:,x:x+width]+=ramp[:,:width]
output=np.clip(output/np.maximum(weight,.001),0,255).astype('uint8')
# A subtle foreground atmosphere hides most join artifacts without repainting the original art.
out=Image.fromarray(output,'RGB');out.save(P/'assets/backgrounds/approved-park-panorama.jpg',quality=91,optimize=True)
print('Panorama built',out.size)
