
// All resources are local; the site works on static GitHub Pages.
const cache='?v=0.12.0';

// 65 articulated frames derived from the approved full-body schoolboy artwork.
const animationLengths={idle:8,walk:12,run:12,jump:6,fall:5,crouch:4,slash:8,roll:10,hurt:4};
const animations={};
for(const [name,count] of Object.entries(animationLengths)){
 animations[name]=Array.from({length:count},(_,i)=>{
  const image=new Image();image.src=`assets/characters/animated/${name}_${String(i).padStart(2,'0')}.png${cache}`;return image;
 });
}

const panorama=new Image();panorama.src='assets/backgrounds/approved-park-panorama.jpg'+cache;
const portrait=new Image();portrait.src='assets/characters/animated/idle_00.png'+cache;
const artwork={};
for(const [key,filename] of Object.entries({
  wall:'mossy-wall.png',ledge:'grass-ledge.png',lamp:'park-lamp.png',flowers:'flowers.png',
  bench:'../backgrounds/illustrated-bench.png',banner:'park-banner.png',
  save:'checkpoint.png',school:'school-gate.png',enemy:'friendly-blob.png'
})){
 const img=new Image();img.src='assets/decor/'+filename+cache;artwork[key]=img;
}
// Eight illustrated surface variations eliminate the obvious 256-pixel wallpaper repeat.
const tiles={wall:[],ledge:[]};
for(const type of Object.keys(tiles))for(let i=0;i<8;i++){
 const image=new Image();image.src=`assets/tiles/variants/${type}-${i}.png${cache}`;
 tiles[type].push(image);
}
function ready(img){return img&&img.complete&&img.naturalWidth>0}
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const W=960,H=540,WORLD=3900,GROUND=462;
const overlay=document.querySelector('#overlay'),overlayTitle=document.querySelector('#overlayTitle'),overlayText=document.querySelector('#overlayText');
let running=false,paused=false,won=false,camera=0,tick=0,sound=true,last=0,checkpoint=80,score=0,particles=[];
let coyote=0,jumpBuffer=0,heroPose="idle",heroPoseTime=0;
const VERSION='0.12.0';
let visitedSections=new Set();
const keys=new Set(),pressed=new Set();
const platforms=[{x:0,y:GROUND,w:670,h:90},{x:735,y:GROUND,w:690,h:90},{x:1500,y:GROUND,w:670,h:90},{x:2250,y:GROUND,w:700,h:90},{x:3040,y:GROUND,w:860,h:90},
{x:240,y:370,w:145,h:18},{x:460,y:302,w:145,h:18},{x:825,y:368,w:145,h:18},{x:1050,y:303,w:150,h:18},{x:1290,y:359,w:115,h:18},{x:1550,y:367,w:160,h:18},{x:1790,y:306,w:150,h:18},{x:2010,y:369,w:145,h:18},{x:2330,y:364,w:150,h:18},{x:2570,y:304,w:170,h:18},{x:2820,y:366,w:115,h:18},{x:3100,y:369,w:165,h:18},{x:3380,y:305,w:165,h:18},{x:3590,y:365,w:160,h:18}];
const initialItems=[{x:300,y:334},{x:518,y:266},{x:890,y:332},{x:1100,y:267},{x:1610,y:330},{x:1840,y:270},{x:2380,y:327},{x:2640,y:269},{x:3170,y:333},{x:3440,y:269}];
const initialEnemies=[{x:570,min:510,max:645},{x:930,min:770,max:1100},{x:1660,min:1520,max:1900},{x:2090,min:1980,max:2160},{x:2440,min:2270,max:2660},{x:3260,min:3070,max:3450},{x:3660,min:3530,max:3810}];
let items=[],enemies=[];
const player={x:80,y:300,w:31,h:54,vx:0,vy:0,face:1,ground:false,hp:99,inv:0,attack:0,attackCD:0,roll:0,rollCD:0,crouch:false};
function reset(full=true){checkpoint=full?80:checkpoint;player.x=checkpoint;player.y=280;player.vx=0;player.vy=0;player.hp=99;player.inv=0;player.roll=0;player.attack=0;player.ground=false;camera=0;tick=0;score=0;particles=[];coyote=0;jumpBuffer=0;heroPose="idle";heroPoseTime=0;visitedSections=new Set();items=initialItems.map((v,i)=>({...v,id:i,taken:false}));enemies=initialEnemies.map((v,i)=>({...v,id:i,y:GROUND-29,w:39,h:29,dir:i%2?1:-1,alive:true}));if(full){try{localStorage.removeItem('stadsparken-checkpoint')}catch{}}}
function show(title,text,button){overlayTitle.textContent=title;overlayText.textContent=text;document.querySelector('#play').textContent=button;overlay.classList.remove('hidden')}
function hide(){overlay.classList.add('hidden')}
function start(){if(won){reset();won=false}if(!running&&player.hp<=0)reset(false);running=true;paused=false;pressed.clear();hide()}
document.querySelector('#play').onclick=start;document.querySelector('#restart').onclick=()=>{reset();running=true;paused=false;won=false;hide()};document.querySelector('#sound').onclick=()=>{sound=!sound;document.querySelector('#sound').textContent=sound?'♪ Ljud: på':'♪ Ljud: av'};
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!keys.has(e.code))pressed.add(e.code);keys.add(e.code);if(['KeyP','Escape'].includes(e.code)&&!e.repeat){if(running){paused=!paused;if(paused)show('Paus','Ta en liten paus. Parken väntar på dig.','Fortsätt →');else hide()}}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(running&&!paused){paused=true;show('Paus','Spelet pausades när fönstret tappade fokus.','Fortsätt →')}});
const held=(...a)=>a.some(k=>keys.has(k)),tap=(...a)=>a.some(k=>pressed.has(k));
let audio;function beep(freq=440,dur=.08,type='sine'){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(70,freq*.7),audio.currentTime+dur);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+dur)}catch{}}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function burst(x,y,color,n=9){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*7,vy:-Math.random()*5-1,life:35+Math.random()*20,color})}
function hurt(){if(player.inv||player.roll)return;player.hp=Math.max(0,player.hp-18);player.inv=70;player.vy=-7;player.vx=-player.face*5;burst(player.x+15,player.y+22,'#ffb6a4');beep(170,.19,'sawtooth');if(player.hp<=0){running=false;show('Energin tog slut!','Du kan försöka igen från den senaste kontrollpunkten.','Försök igen →')}}
function update(dt){tick+=dt;visitedSections.add(Math.min(11,Math.floor(player.x/(WORLD/12))));const p=player;const dir=(held('ArrowRight','KeyD')?1:0)-(held('ArrowLeft','KeyA')?1:0);p.crouch=held('ArrowDown','KeyS')&&p.ground&&!p.roll;p.attack=Math.max(0,p.attack-dt);p.attackCD=Math.max(0,p.attackCD-dt);p.roll=Math.max(0,p.roll-dt);p.rollCD=Math.max(0,p.rollCD-dt);p.inv=Math.max(0,p.inv-dt);coyote=p.ground?7:Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);if(tap('Space','KeyW','ArrowUp'))jumpBuffer=8;
if(dir&&!p.roll)p.face=dir;
if(jumpBuffer>0&&coyote>0&&!p.crouch&&!p.roll){p.vy=-13.7;p.ground=false;coyote=0;jumpBuffer=0;beep(480,.1)}
if(!held('Space','KeyW','ArrowUp')&&p.vy< -4)p.vy+=.52*dt;
if(tap('KeyJ','KeyX')&&!p.attackCD&&!p.roll&&!p.crouch){p.attack=13;p.attackCD=22;beep(720,.09,'triangle')}
if(tap('KeyK','KeyC')&&!p.rollCD&&p.ground){p.roll=23;p.rollCD=43;p.face=dir||p.face;p.vx=p.face*9.5;beep(390,.16)}
if(p.roll)p.vx=p.face*9.5;else p.vx+=(dir*(p.crouch?1.35:(held('ShiftLeft','ShiftRight')?5.8:3.6))-p.vx)*Math.min(1,.22*dt);
const oldY=p.y;p.x=Math.max(0,Math.min(WORLD-p.w,p.x+p.vx*dt));p.vy=Math.min(17,p.vy+.66*dt);p.y+=p.vy*dt;p.ground=false;
for(const plat of platforms){if(p.x+p.w>plat.x+5&&p.x<plat.x+plat.w-5&&oldY+p.h<=plat.y+8&&p.y+p.h>=plat.y&&p.vy>=0){p.y=plat.y-p.h;p.vy=0;p.ground=true}}
if(p.y>H+100){p.hp=Math.max(0,p.hp-25);p.x=checkpoint;p.y=230;p.vx=0;p.vy=0;p.inv=75;if(p.hp<=0){running=false;show('Energin tog slut!','Försök igen från kontrollpunkten.','Försök igen →')}beep(180,.2)}
for(const item of items){if(item.taken)continue;const dx=p.x+p.w/2-item.x,dy=p.y+p.h/2-item.y;if(dx*dx+dy*dy<35*35){item.taken=true;p.hp=Math.min(99,p.hp+15);score++;burst(item.x,item.y,'#ffdb69',13);beep(950,.13)}}
for(const e of enemies){if(!e.alive)continue;e.x+=e.dir*1.25*dt;if(e.x<e.min||e.x>e.max)e.dir*=-1;if(p.attack>0){const slash={x:p.face>0?p.x+p.w-2:p.x-58,y:p.y+5,w:60,h:48};if(overlap(slash,e)){e.alive=false;burst(e.x+18,e.y+12,'#9ae5d7',18);beep(620,.16,'square');continue}}if(overlap(p,e))hurt()}
if(p.x>1920&&checkpoint<1900){checkpoint=1930;try{localStorage.setItem('stadsparken-checkpoint','1930')}catch{}burst(1940,390,'#9df4ff',25);beep(1050,.25)}
if(p.x>WORLD-140){won=true;running=false;show('Banan avklarad! ✨',`Du hittade vägen genom Stadsparken och samlade ${score} av ${items.length} energikapslar. Nästa äventyr väntar i skolan!`,'Spela igen →');beep(1100,.4)}
for(const q of particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=.18*dt;q.life-=dt}particles=particles.filter(q=>q.life>0);camera+=(Math.max(0,Math.min(WORLD-W,p.x-330))-camera)*Math.min(1,.085*dt);pressed.clear()}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function line(points,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function background(){
  const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#a9d7fb');sky.addColorStop(1,'#e3f2e0');
  ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
  // One continuous panorama constructed exclusively from the APPROVED park paintings.
  // It does not endlessly stamp multiple transparent fountains onto each other.
  if(ready(panorama)){
    const viewX=Math.max(0,Math.min(panorama.naturalWidth-W,camera*.90));
    ctx.drawImage(panorama,viewX,0,W,540,0,0,W,540);
  }
  const distant=ctx.createLinearGradient(0,310,0,540);
  distant.addColorStop(0,'#ffffff00');distant.addColorStop(.65,'#e7f0d60b');distant.addColorStop(1,'#122c3240');
  ctx.fillStyle=distant;ctx.fillRect(0,310,W,230);
}
function drawWorldImage(name,x,y,w,h){
 const img=artwork[name];if(ready(img)&&x+w>=camera-80&&x<camera+W+80)ctx.drawImage(img,x,y,w,h);
}
const flowerSpots=[35,530,1010,1550,2350,3110,3620];
const lamps=[415,1140,2370,3360];
const banners=[1350,2710];
function scenery(){
 ctx.save();ctx.translate(-camera,0);
 for(const x of lamps)drawWorldImage('lamp',x,GROUND-193,77,193);
 for(const x of banners)drawWorldImage('banner',x,GROUND-143,95,143);
 for(const x of [170,1075,1740,2835,3500])drawWorldImage('bench',x,GROUND-69,105,73);
 for(const x of flowerSpots)drawWorldImage('flowers',x,GROUND-42,120,43);
 drawWorldImage('save',1871,GROUND-145,99,145);
 drawWorldImage('school',3734,GROUND-154,160,154);
 ctx.restore();
}
// A low-water channel belongs to each real gap in the stage, not a non-collidable fake bridge.
const waterChannels=[[670,735],[1425,1500],[2170,2250],[2950,3040]];
function water(){
 ctx.save();ctx.translate(-camera,0);
 for(let k=0;k<waterChannels.length;k++){
  const [a,b]=waterChannels[k];if(b<camera-90||a>camera+W+90)continue;
  const x=a-16,w=b-a+32,y=GROUND+3;
  const grad=ctx.createLinearGradient(0,y,0,H);grad.addColorStop(0,'#8ccbcc');grad.addColorStop(.55,'#3a91ac');grad.addColorStop(1,'#256d8c');
  ctx.fillStyle=grad;ctx.fillRect(x,y,w,H-y);
  ctx.strokeStyle='#e5f8e2a8';ctx.lineWidth=2;
  for(let row=0;row<9;row++){
   const yy=y+12+row*10;
   for(let j=0;j<3;j++){
    const xx=x+((j*39+row*17+tick*.47)%(w+28))-14;
    ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+9,yy-3,xx+18,yy);ctx.stroke();
   }
  }
  for(const bank of [a-7,b+5]){
   ctx.strokeStyle='#386c51';ctx.lineWidth=2.4;
   for(let j=0;j<5;j++){
    const xx=bank+(j-2)*4;
    ctx.beginPath();ctx.moveTo(xx,GROUND+27);ctx.quadraticCurveTo(xx+j*2,GROUND+12,xx+Math.sin(tick*.025+j)*4,GROUND-9-j*3);ctx.stroke();
   }
  }
 }
 ctx.restore();
}
function drawPlatforms(){
 ctx.save();ctx.translate(-camera,0);
 for(const p of platforms){
  if(p.x>camera+W+60||p.x+p.w<camera-60)continue;
  const ground=p.h>50;
  // The collider top is always exactly p.y, including the suspended shelves.
  const thickness=ground?Math.max(145,p.h):51;
  ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,thickness);ctx.clip();
  let n=0;
  for(let x=p.x;x<p.x+p.w;x+=256,n++){
   const variant=(Math.floor(p.x/173)+n*5+n*n)%8;
   const img=tiles[ground?'wall':'ledge'][variant];
   if(ready(img)){
    const th=ground?144:58;
    for(let y=p.y;y<p.y+thickness;y+=th)ctx.drawImage(img,x,y,256,th);
   }else{ctx.fillStyle=ground?'#52686b':'#58696a';ctx.fillRect(x,p.y,256,thickness)}
  }
  ctx.restore();
  // Add ivy and shaded masonry beneath suspended ledges; does not affect hitboxes.
  if(!ground){
   ctx.strokeStyle='#2f60517c';ctx.lineWidth=3;
   const n=Math.floor(p.w/44);
   for(let i=0;i<n;i++){
    const x=p.x+22+i*44;
    ctx.beginPath();ctx.moveTo(x,p.y+40);ctx.quadraticCurveTo(x+7,p.y+59,x+Math.sin(tick*.02+i)*3,p.y+66+i%3*10);ctx.stroke();
   }
  }
 }
 ctx.restore();
}
// Illustrated masonry arches built into solid garden terraces.
// Entire decoration stays BELOW the actual collision surface.
function gardenArches(){
 ctx.save();ctx.translate(-camera,0);
 for(const [x,w] of [[410,158],[1160,166],[1860,160],[2590,164],[3320,172]]){
  if(x+w<camera-30||x>camera+W+30)continue;
  const top=GROUND+32,left=x,right=x+w;
  const ink=ctx.createLinearGradient(0,top,0,H);
  ink.addColorStop(0,'#132c3d');ink.addColorStop(.42,'#2d6177');ink.addColorStop(1,'#5aa8ad');
  ctx.fillStyle=ink;ctx.beginPath();ctx.moveTo(left,H+10);ctx.lineTo(left,GROUND+69);
  ctx.quadraticCurveTo(x+w/2,top-34,right,GROUND+69);ctx.lineTo(right,H+10);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#32454a';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(left,GROUND+69);
  ctx.quadraticCurveTo(x+w/2,top-34,right,GROUND+69);ctx.stroke();
  ctx.strokeStyle='#b8bba2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(left-4,GROUND+69);
  ctx.quadraticCurveTo(x+w/2,top-38,right+4,GROUND+69);ctx.stroke();
  // Stone voussoirs radiate around each arch crown.
  for(let i=1;i<7;i++){
   const q=i/7,xx=left+q*w,yy=GROUND+69-(w/2)*(1-Math.pow(2*q-1,2))*.43;
   ctx.strokeStyle='#c0c7b35e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xx,yy-7);ctx.lineTo(xx+(q-.5)*8,yy+4);ctx.stroke();
  }
  ctx.strokeStyle='#cef3e586';ctx.lineWidth=1.7;
  for(let i=0;i<5;i++){
   const yy=GROUND+75+i*10,xx=left+16+i*17;
   ctx.beginPath();ctx.moveTo(xx,yy);ctx.quadraticCurveTo(xx+11+Math.sin(tick*.02+i)*3,yy-2,xx+25,yy);ctx.stroke();
  }
 }
 ctx.restore();
}
function drawItems(){ctx.save();ctx.translate(-camera,0);for(const item of items){if(item.taken)continue;const y=item.y+Math.sin(tick*.075+item.id)*5;circle(item.x,y,18,'#ffde7999');circle(item.x,y,12,'#ffe17c');circle(item.x,y,7,'#fff9df');line([[item.x-4,y],[item.x+4,y]],'#dba54c',2);line([[item.x,y-4],[item.x,y+4]],'#dba54c',2)}ctx.restore()}
function drawEnemies(){
 ctx.save();ctx.translate(-camera,0);
 for(const e of enemies){
   if(!e.alive)continue;
   const bob=Math.sin(tick*.085+e.id)*2;
   ctx.save();ctx.translate(e.x+e.w/2,e.y+e.h+3+bob);
   ctx.scale(1+Math.sin(tick*.085+e.id)*.035,1-Math.sin(tick*.085+e.id)*.05);
   if(ready(artwork.enemy))ctx.drawImage(artwork.enemy,-29,-44,58,44);
   else{circle(0,-18,19,'#84ca68');circle(-7,-17,3,'#2b4850');circle(7,-17,3,'#2b4850')}
   ctx.restore();
 }
 ctx.restore();
}
// Precise foot-anchored 2D cutout animation. Physics collider remains independent of art.
function hero(){
 const p=player,screenX=p.x-camera+p.w/2, footY=p.y+p.h;
 let action='idle';
 if(p.inv>0&&Math.floor(tick/6)%2)action='hurt';
 else if(p.roll>0)action='roll';
 else if(p.attack>0)action='slash';
 else if(p.crouch)action='crouch';
 else if(!p.ground)action=p.vy<0?'jump':'fall';
 else if(Math.abs(p.vx)>4.25)action='run';
 else if(Math.abs(p.vx)>.35)action='walk';
 if(action!==heroPose){heroPose=action;heroPoseTime=0}
 else heroPoseTime+= (action==='walk'||action==='run')?Math.max(.35,Math.abs(p.vx)/3.5):1;
 const frames=animations[action];
 const delay={idle:11,walk:4.6,run:3.55,jump:6,fall:6,crouch:8,slash:2,roll:2.25,hurt:5}[action];
 const idx=(action==='slash')?Math.min(frames.length-1,Math.floor((13-p.attack)/(13/frames.length))):
  (action==='roll')?Math.min(frames.length-1,Math.floor((23-p.roll)/(23/frames.length))):
  Math.floor(heroPoseTime/delay)%frames.length;
 const img=frames[Math.max(0,idx)];
 ctx.save();ctx.translate(screenX,footY);ctx.scale(p.face,1);
 if(p.ground){ctx.fillStyle='#122b3340';ctx.beginPath();ctx.ellipse(0,1,30,5,0,0,Math.PI*2);ctx.fill()}
 if(p.inv>0&&Math.floor(tick/4)%2)ctx.globalAlpha=.53;
 const drawH=157,drawW=(action==='walk'||action==='run')?133:125,footRatio=278/300;
 if(ready(img))ctx.drawImage(img,-drawW/2,-drawH*footRatio,drawW,drawH);
 else{rounded(-17,-104,34,104,8,'#f5efe7');circle(0,-110,18,'#e9c05f')}
 if(p.attack>0){
   const progress=(13-p.attack)/13;
   ctx.save();ctx.globalAlpha=.65*(1-progress);
   ctx.strokeStyle='#d8f6ff';ctx.lineWidth=5;ctx.beginPath();
   ctx.arc(20,-69,55,-1.65+progress*1.4,-.45+progress*1.4);ctx.stroke();ctx.restore();
 }
 ctx.restore();
}
function effects(){for(const q of particles){ctx.globalAlpha=Math.min(1,q.life/15);circle(q.x-camera,q.y,3,q.color)}ctx.globalAlpha=1}
function hud(){
 ctx.save();
 rounded(15,13,329,87,15,'#102e43df');
 ctx.strokeStyle='#e1b875';ctx.lineWidth=2;ctx.strokeRect(16,14,327,85);
 // Original blonde hero's face appears on his HUD portrait.
 circle(63,56,41,'#172f42');circle(63,56,37,'#edc783');
 ctx.save();ctx.beginPath();ctx.arc(63,56,33,0,Math.PI*2);ctx.clip();
 if(ready(portrait))ctx.drawImage(portrait,78,20,89,83,29,20,68,72);
 ctx.restore();
 ctx.fillStyle='#fff8df';ctx.font='bold 14px system-ui';ctx.fillText('ENERGI',118,36);
 rounded(117,47,212,17,8,'#1e3b4e');rounded(119,49,208*(player.hp/99),13,6,player.hp>30?'#87d782':'#f3a16f');
 ctx.fillStyle='#ffffff';ctx.font='bold 22px system-ui';ctx.textAlign='right';ctx.fillText(`${player.hp} / 99`,328,87);ctx.textAlign='left';
 // Capsules are a separate collectible counter, not additional lives.
 rounded(363,15,141,35,11,'#102e43da');ctx.fillStyle='#fff2cc';ctx.font='bold 14px system-ui';ctx.fillText(`✦ ${score} / ${items.length}`,377,38);
 if(player.x<180){rounded(360,63,277,37,12,'#fff5dbc9');ctx.fillStyle='#365667';ctx.font='bold 14px system-ui';ctx.fillText('→ Följ stigen mot skolan!',379,87)}
 if(player.x>1840&&player.x<2100){rounded(357,65,275,40,12,'#fff5dbc9');ctx.fillStyle='#365667';ctx.font='bold 14px system-ui';ctx.fillText('✓ Kontrollpunkt aktiverad!',369,90)}
 ctx.restore();
}
function minimap(){
 const x=691,y=13,w=253,h=128,ix=x+15,iy=y+36,iw=w-30,ih=67;
 ctx.save();rounded(x,y,w,h,13,'#102c40ee');
 ctx.strokeStyle='#e2be7b';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x+2,y+2,w-4,h-4,12);ctx.stroke();
 ctx.fillStyle='#f8e8ba';ctx.textAlign='center';ctx.font='bold 14px Georgia,serif';ctx.fillText('STADSPARKEN',x+w/2,y+22);ctx.textAlign='left';
 rounded(ix,iy,iw,ih,5,'#1b3447');
 // Top-down route constructed directly from all real platform positions.
 for(const pl of platforms){
  const px=ix+Math.round(pl.x/WORLD*iw),pw=Math.max(2,Math.round(pl.w/WORLD*iw));
  const py=iy+11+Math.round((pl.y-300)/(GROUND-300)*34);
  ctx.fillStyle=visitedSections.has(Math.floor(pl.x/(WORLD/12)))?'#aac5b0':'#647d8e';
  ctx.fillRect(px,py,pw,pl.h>50?8:4);
 }
 // Unexplored sections fade naturally instead of revealing the route immediately.
 for(let i=0;i<12;i++)if(!visitedSections.has(i)){
  ctx.fillStyle='#0d243360';ctx.fillRect(ix+i*iw/12,iy,iw/12+1,ih);
 }
 const pos=ix+Math.max(0,Math.min(WORLD,player.x))/WORLD*iw;
 const savePos=ix+1930/WORLD*iw;
 circle(savePos,iy+32,6,checkpoint>80?'#ffd16a':'#7e8994');
 circle(pos,iy+45,6,'#fff3dc');circle(pos,iy+45,4,'#e67861');
 ctx.fillStyle='#f7edd9';ctx.font='11px system-ui';ctx.fillText('● Du',x+15,y+118);ctx.fillText('★ Kontrollpunkt',x+91,y+118);
 ctx.restore();
}
// A few drifting petals give motion to a static painting without looking like UI.
function ambient(){
 ctx.save();
 for(let i=0;i<17;i++){
  const t=tick*.28+i*19.7;
  const x=((i*263.7-t*1.5-camera*.18)%1120+1120)%1120-60;
  const y=125+(i*67)%310+Math.sin(t*.034)*12;
  ctx.save();ctx.translate(x,y);ctx.rotate(t*.015);
  ctx.fillStyle=(i%3===0?'#fff3d2b0':i%3===1?'#f9bed29c':'#cce6a798');
  ctx.beginPath();ctx.ellipse(0,0,2.5,5,.5,0,Math.PI*2);ctx.fill();ctx.restore();
 }
 ctx.restore();
}
function render(){background();water();drawPlatforms();gardenArches();scenery();drawItems();drawEnemies();hero();effects();ambient();hud();minimap();ctx.fillStyle='#0e263cbb';ctx.fillRect(W-215,H-30,215,30);ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText(`Stadsparken · v${VERSION}`,W-195,H-11)}
function loop(t){const dt=Math.min(2,(t-last)/16.666||1);last=t;if(running&&!paused)update(dt);render();requestAnimationFrame(loop)}
reset(false);try{if(localStorage.getItem('stadsparken-checkpoint')==='1930'){checkpoint=1930;player.x=1930}}catch{}requestAnimationFrame(loop);
