from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import cv2,numpy as np
P=Path(__file__).resolve().parent.parent
src=np.array(Image.open(P/'assets/references/approved-original-character-and-areas.png').convert('RGB'))
print('src size',src.shape)
# Original character sheet is 1536x1024. Clean full-body side-profile occupies x 168..323, y42..333
x0,y0,x1,y1=163,39,322,332
roi=src[y0:y1,x0:x1].copy()
h,w=roi.shape[:2]
mask=np.zeros((h,w),np.uint8)
# approximate silhouette polygon in original sheet coords relative to crop
poly=[(35,8),(72,3),(94,13),(108,24),(105,36),(115,43),(105,66),(87,78),(75,95),(86,104),(112,122),(114,150),(121,168),(127,188),(143,222),(149,254),(143,264),(123,254),(106,219),(93,206),(111,243),(119,278),(113,291),(66,291),(58,280),(55,256),(44,214),(40,244),(52,274),(52,289),(6,291),(5,280),(12,262),(22,227),(19,195),(25,175),(4,189),(0,163),(15,138),(19,119),(30,99),(36,78),(23,59),(24,33)]
cv2.fillPoly(mask,[np.array(poly,np.int32)],cv2.GC_PR_FGD)
# sure foreground near inner torso/head/boots, preserving white hoodie from background
hard=[[(43,23),(74,18),(88,34),(85,57),(55,68),(39,48)],[(35,105),(85,98),(103,126),(95,157),(81,170),(31,168),(20,140)],[(104,131),(120,136),(118,184),(99,182)],[(10,153),(26,129),(39,150),(28,189),(9,193)],[(33,178),(64,180),(59,228),(49,245),(29,236)],[(67,180),(89,174),(102,223),(105,250),(81,255),(67,230)],[(19,257),(55,257),(52,281),(12,282)],[(75,256),(108,258),(107,284),(71,283)],[(111,206),(117,213),(138,249)]]
for p in hard:cv2.fillPoly(mask,[np.array(p,np.int32)],cv2.GC_FGD)
mask[0:3,:]=0;mask[-2:,:]=0;mask[:,0:2]=0;mask[:,-2:]=0
bModel=np.zeros((1,65),np.float64);fModel=np.zeros((1,65),np.float64)
cv2.grabCut(roi,mask,None,bModel,fModel,9,cv2.GC_INIT_WITH_MASK)
alpha=np.where((mask==cv2.GC_FGD)|(mask==cv2.GC_PR_FGD),255,0).astype(np.uint8)
# Remove disconnected visual debris, keep dominant silhouette
n,labels,stats,_=cv2.connectedComponentsWithStats(alpha,8)
components=sorted([(stats[i,4],i) for i in range(1,n)],reverse=True)
keep=components[0][1];alpha=np.where(labels==keep,255,0).astype('uint8')
alpha=cv2.morphologyEx(alpha,cv2.MORPH_CLOSE,np.ones((3,3),np.uint8))
# White clothing and the shaded left leg are visually enclosed by ink outlines.
# GrabCut confuses their light colors with the pale concept-sheet paper: restore those
# exact painted regions with narrow, manually verified interior silhouette masks.
repair=np.zeros_like(alpha)
for points in [
 [(44,88),(74,85),(99,96),(103,121),(97,150),(93,174),(60,175),(42,173),(25,160),(31,131)],
 [(27,169),(62,169),(68,185),(62,224),(55,247),(39,255),(20,250),(24,221)],
 [(21,240),(53,241),(55,260),(56,284),(7,286),(7,274),(14,264)]
]:cv2.fillPoly(repair,[np.array(points,np.int32)],255)
alpha=np.maximum(alpha,repair)
# Knock out off-white paper contiguous with the outside, without erasing enclosed light clothing.
from scipy.ndimage import binary_propagation
bg=np.array([243,239,231],np.int16)
diff=np.abs(roi.astype(np.int16)-bg).sum(axis=2)
candidate=diff<32
seed=np.zeros((h,w),bool)
seed[0,:]=candidate[0,:];seed[-1,:]=candidate[-1,:];seed[:,0]=candidate[:,0];seed[:,-1]=candidate[:,-1]
connected=binary_propagation(seed,mask=candidate)
alpha[connected]=0
# Remaining near-paper gaps between moving legs must not rotate as opaque wedges.
alpha[(np.indices(alpha.shape)[0]>169)&(diff<27)]=0
alpha=cv2.GaussianBlur(alpha,(3,3),.45)
rgba=np.dstack([roi,alpha])
output=Image.fromarray(rgba,'RGBA')
out=P/'assets/source/approved-side-profile.png';output.save(out)
mat=Image.new('RGB',(w*3,h),'#d7e9ed')
mat.paste(Image.fromarray(roi),(0,0));mat.paste(output,(w,0),output)
mat.paste(output,(w*2,0),output)
mat.save('/mnt/data/side-matte-test.png')
print('side extraction saved',out,components[:6])
