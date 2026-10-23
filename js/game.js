
// Original concept-art assets are bundled locally; the game works offline.
const sprites={};for(const name of ['idle','walk1','walk2','run1','run2','jump','fall','crouch','slash1','slash2','roll1','roll2','hurt']){const img=new Image();img.src=`assets/characters/${name}.png`;sprites[name]=img;}
const parkArt=new Image();parkArt.src='assets/backgrounds/approved-park.png';
const fountainArt=new Image();fountainArt.src='assets/backgrounds/approved-fountain.png';
const stoneArt=new Image();stoneArt.src='assets/tiles/stone-bridge.png';
const mossArt=new Image();mossArt.src='assets/tiles/mossy-stone.png';
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d');
const W=960,H=540,WORLD=3900,GROUND=462;
const overlay=document.querySelector('#overlay'),overlayTitle=document.querySelector('#overlayTitle'),overlayText=document.querySelector('#overlayText');
let running=false,paused=false,won=false,camera=0,tick=0,sound=true,last=0,checkpoint=80,score=0,particles=[];
let coyote=0,jumpBuffer=0,heroPose="idle",heroPoseTime=0;
const keys=new Set(),pressed=new Set();
const platforms=[{x:0,y:GROUND,w:670,h:90},{x:735,y:GROUND,w:690,h:90},{x:1500,y:GROUND,w:670,h:90},{x:2250,y:GROUND,w:700,h:90},{x:3040,y:GROUND,w:860,h:90},
{x:240,y:370,w:145,h:18},{x:460,y:302,w:145,h:18},{x:825,y:368,w:145,h:18},{x:1050,y:303,w:150,h:18},{x:1290,y:359,w:115,h:18},{x:1550,y:367,w:160,h:18},{x:1790,y:306,w:150,h:18},{x:2010,y:369,w:145,h:18},{x:2330,y:364,w:150,h:18},{x:2570,y:304,w:170,h:18},{x:2820,y:366,w:115,h:18},{x:3100,y:369,w:165,h:18},{x:3380,y:305,w:165,h:18},{x:3590,y:365,w:160,h:18}];
const initialItems=[{x:300,y:334},{x:518,y:266},{x:890,y:332},{x:1100,y:267},{x:1610,y:330},{x:1840,y:270},{x:2380,y:327},{x:2640,y:269},{x:3170,y:333},{x:3440,y:269}];
const initialEnemies=[{x:570,min:510,max:645},{x:930,min:770,max:1100},{x:1660,min:1520,max:1900},{x:2090,min:1980,max:2160},{x:2440,min:2270,max:2660},{x:3260,min:3070,max:3450},{x:3660,min:3530,max:3810}];
let items=[],enemies=[];
const player={x:80,y:300,w:31,h:54,vx:0,vy:0,face:1,ground:false,hp:99,inv:0,attack:0,attackCD:0,roll:0,rollCD:0,crouch:false};
function reset(full=true){checkpoint=full?80:checkpoint;player.x=checkpoint;player.y=280;player.vx=0;player.vy=0;player.hp=99;player.inv=0;player.roll=0;player.attack=0;player.ground=false;camera=0;tick=0;score=0;particles=[];coyote=0;jumpBuffer=0;heroPose="idle";heroPoseTime=0;items=initialItems.map((v,i)=>({...v,id:i,taken:false}));enemies=initialEnemies.map((v,i)=>({...v,id:i,y:GROUND-29,w:39,h:29,dir:i%2?1:-1,alive:true}));if(full){try{localStorage.removeItem('stadsparken-checkpoint')}catch{}}}
function show(title,text,button){overlayTitle.textContent=title;overlayText.textContent=text;document.querySelector('#play').textContent=button;overlay.classList.remove('hidden')}
function hide(){overlay.classList.add('hidden')}
function start(){if(won){reset();won=false}if(!running&&player.hp<=0)reset(false);running=true;paused=false;pressed.clear();hide()}
document.querySelector('#play').onclick=start;document.querySelector('#restart').onclick=()=>{reset();running=true;paused=false;won=false;hide()};document.querySelector('#sound').onclick=()=>{sound=!sound;document.querySelector('#sound').textContent=sound?'♪ Ljud: på':'♪ Ljud: av'};
window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(!keys.has(e.code))pressed.add(e.code);keys.add(e.code);if(['KeyP','Escape'].includes(e.code)&&!e.repeat){if(running){paused=!paused;if(paused)show('Paus','Ta en liten paus. Parken väntar på dig.','Fortsätt →');else hide()}}});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(running&&!paused){paused=true;show('Paus','Spelet pausades när fönstret tappade fokus.','Fortsätt →')}});
const held=(...a)=>a.some(k=>keys.has(k)),tap=(...a)=>a.some(k=>pressed.has(k));
let audio;function beep(freq=440,dur=.08,type='sine'){if(!sound)return;try{audio??=new (window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(70,freq*.7),audio.currentTime+dur);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+dur);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+dur)}catch{}}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}
function burst(x,y,color,n=9){for(let i=0;i<n;i++)particles.push({x,y,vx:(Math.random()-.5)*7,vy:-Math.random()*5-1,life:35+Math.random()*20,color})}
function hurt(){if(player.inv||player.roll)return;player.hp=Math.max(0,player.hp-18);player.inv=70;player.vy=-7;player.vx=-player.face*5;burst(player.x+15,player.y+22,'#ffb6a4');beep(170,.19,'sawtooth');if(player.hp<=0){running=false;show('Energin tog slut!','Du kan försöka igen från den senaste kontrollpunkten.','Försök igen →');reset(false);player.x=checkpoint;player.y=280}}
function update(dt){tick+=dt;const p=player;const dir=(held('ArrowRight','KeyD')?1:0)-(held('ArrowLeft','KeyA')?1:0);p.crouch=held('ArrowDown','KeyS')&&p.ground&&!p.roll;p.attack=Math.max(0,p.attack-dt);p.attackCD=Math.max(0,p.attackCD-dt);p.roll=Math.max(0,p.roll-dt);p.rollCD=Math.max(0,p.rollCD-dt);p.inv=Math.max(0,p.inv-dt);coyote=p.ground?7:Math.max(0,coyote-dt);jumpBuffer=Math.max(0,jumpBuffer-dt);if(tap('Space','KeyW','ArrowUp'))jumpBuffer=8;
if(dir&&!p.roll)p.face=dir;
if(jumpBuffer>0&&coyote>0&&!p.crouch&&!p.roll){p.vy=-13.7;p.ground=false;coyote=0;jumpBuffer=0;beep(480,.1)}
if(!held('Space','KeyW','ArrowUp')&&p.vy< -4)p.vy+=.52*dt;
if(tap('KeyJ','KeyX')&&!p.attackCD&&!p.roll){p.attack=13;p.attackCD=22;beep(720,.09,'triangle')}
if(tap('KeyK','KeyC')&&!p.rollCD&&p.ground){p.roll=23;p.rollCD=43;p.face=dir||p.face;p.vx=p.face*9.5;beep(390,.16)}
if(p.roll)p.vx=p.face*9.5;else p.vx+=(dir*(p.crouch?1.4:4.1)-p.vx)*Math.min(1,.22*dt);
const oldY=p.y;p.x=Math.max(0,Math.min(WORLD-p.w,p.x+p.vx*dt));p.vy=Math.min(17,p.vy+.66*dt);p.y+=p.vy*dt;p.ground=false;
for(const plat of platforms){if(p.x+p.w>plat.x+5&&p.x<plat.x+plat.w-5&&oldY+p.h<=plat.y+8&&p.y+p.h>=plat.y&&p.vy>=0){p.y=plat.y-p.h;p.vy=0;p.ground=true}}
if(p.y>H+100){p.hp=Math.max(0,p.hp-25);p.x=checkpoint;p.y=230;p.vx=0;p.vy=0;p.inv=75;if(p.hp<=0){running=false;show('Energin tog slut!','Försök igen från kontrollpunkten.','Försök igen →');reset(false)}beep(180,.2)}
for(const item of items){if(item.taken)continue;const dx=p.x+p.w/2-item.x,dy=p.y+p.h/2-item.y;if(dx*dx+dy*dy<35*35){item.taken=true;p.hp=Math.min(99,p.hp+15);score++;burst(item.x,item.y,'#ffdb69',13);beep(950,.13)}}
for(const e of enemies){if(!e.alive)continue;e.x+=e.dir*1.25*dt;if(e.x<e.min||e.x>e.max)e.dir*=-1;if(p.attack>0){const slash={x:p.face>0?p.x+p.w-2:p.x-58,y:p.y+5,w:60,h:48};if(overlap(slash,e)){e.alive=false;burst(e.x+18,e.y+12,'#9ae5d7',18);beep(620,.16,'square');continue}}if(overlap(p,e))hurt()}
if(p.x>1920&&checkpoint<1900){checkpoint=1930;try{localStorage.setItem('stadsparken-checkpoint','1930')}catch{}burst(1940,390,'#9df4ff',25);beep(1050,.25)}
if(p.x>WORLD-140){won=true;running=false;show('Banan avklarad! ✨',`Du hittade vägen genom Stadsparken och samlade ${score} av ${items.length} energikapslar. Nästa äventyr väntar i skolan!`,'Spela igen →');beep(1100,.4)}
for(const q of particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=.18*dt;q.life-=dt}particles=particles.filter(q=>q.life>0);camera+=(Math.max(0,Math.min(WORLD-W,p.x-330))-camera)*Math.min(1,.085*dt);pressed.clear()}
function rounded(x,y,w,h,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill()}
function line(points,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
function circle(x,y,r,color){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function background(){
 const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#8bc8fa');sky.addColorStop(1,'#d9f0e2');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
 // Two different park illustrations from the exact concept sheets approved by the player.
 // They scroll more slowly than the platforms for depth.
 if(parkArt.complete&&parkArt.naturalWidth){const tileW=1250,offset=(camera*.14)%tileW;for(let i=-1;i<3;i++)ctx.drawImage(parkArt,i*tileW-offset,0,tileW,430)}
 if(fountainArt.complete&&fountainArt.naturalWidth){const offset=(camera*.30)%1450;for(let i=-1;i<3;i++)ctx.drawImage(fountainArt,i*1450-offset,165,690,305)}
 const fade=ctx.createLinearGradient(0,340,0,500);fade.addColorStop(0,'#ffffff00');fade.addColorStop(1,'#193a3530');ctx.fillStyle=fade;ctx.fillRect(0,340,W,160);
}
function tree(x,base,scale=1){ctx.save();ctx.translate(x,base);ctx.scale(scale,scale);rounded(-10,-132,20,140,7,'#7e5848');line([[0,-83],[-32,-117]],'#7e5848',9);line([[0,-100],[31,-137]],'#7e5848',8);for(const [dx,dy,r,c] of [[-39,-137,43,'#448d69'],[12,-160,52,'#4f9e70'],[55,-128,38,'#448d69'],[-7,-114,42,'#66b77c'],[27,-174,31,'#79c98a']])circle(dx,dy,r,c);ctx.restore()}
function lamppost(x){rounded(x-4,302,8,161,3,'#324d5a');circle(x,300,14,'#334a55');circle(x,299,10,'#ffdc8b');rounded(x-13,285,26,5,2,'#344a57')}
function bench(x,y){rounded(x,y-36,80,10,3,'#b77d53');rounded(x,y-22,80,10,3,'#b77d53');rounded(x+5,y-10,70,9,2,'#c58b58');rounded(x+13,y-2,5,17,1,'#4a5c62');rounded(x+63,y-2,5,17,1,'#4a5c62')}
function fountain(x){rounded(x-85,420,170,28,8,'#819fab');rounded(x-68,405,136,21,7,'#b7d3d7');circle(x,396,29,'#c2eaf0');rounded(x-9,349,18,61,7,'#8aadb9');circle(x,345,12,'#c4e4e4');for(let i=-2;i<=2;i++){const dx=i*23;line([[x,348],[x+dx,330-Math.abs(i)*6],[x+dx*1.6,400]],'#7ad8ef',3)}}
function scenery(){ctx.save();ctx.translate(-camera,0);
 for(let x=100;x<WORLD;x+=670){tree(x,GROUND,1.2);lamppost(x+205);bench(x+315,GROUND)}
 fountain(1150);fountain(2840);
 rounded(1895,365,14,100,2,'#516e74');rounded(1875,348,54,28,5,'#f6d58a');ctx.fillStyle='#425b66';ctx.font='bold 12px system-ui';ctx.fillText('SPARA',1881,367);
 rounded(3770,350,90,105,10,'#547f8e');rounded(3782,363,66,79,7,'#e9cb8d');rounded(3793,375,44,60,5,'#496f85');ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.fillText('SKOLAN',3785,343);ctx.restore()}
function drawPlatforms(){ctx.save();ctx.translate(-camera,0);
 for(const p of platforms){
   ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,p.h);ctx.clip();
   if(stoneArt.complete&&stoneArt.naturalWidth){for(let x=p.x;x<p.x+p.w;x+=220)ctx.drawImage(stoneArt,x,p.y-19,220,Math.max(145,p.h+36));}
   else rounded(p.x,p.y,p.w,p.h,3,'#47575b');
   ctx.fillStyle='#1d2f3a55';ctx.fillRect(p.x,p.y+16,p.w,p.h);
   ctx.fillStyle='#334b4a';ctx.fillRect(p.x,p.y+10,p.w,8);
   ctx.fillStyle='#74a84d';ctx.fillRect(p.x,p.y,p.w,10);
   ctx.fillStyle='#a7d768';for(let x=p.x;x<p.x+p.w;x+=13){ctx.beginPath();ctx.ellipse(x,p.y+2,10,4,0,0,Math.PI*2);ctx.fill()}
   ctx.restore();
 }ctx.restore()}
function drawItems(){ctx.save();ctx.translate(-camera,0);for(const item of items){if(item.taken)continue;const y=item.y+Math.sin(tick*.075+item.id)*5;circle(item.x,y,18,'#ffde7999');circle(item.x,y,12,'#ffe17c');circle(item.x,y,7,'#fff9df');line([[item.x-4,y],[item.x+4,y]],'#dba54c',2);line([[item.x,y-4],[item.x,y+4]],'#dba54c',2)}ctx.restore()}
function drawEnemies(){ctx.save();ctx.translate(-camera,0);for(const e of enemies){if(!e.alive)continue;ctx.save();ctx.translate(e.x,e.y+Math.sin(tick*.09+e.id)*2);rounded(1,9,36,20,10,'#526c87');rounded(6,3,27,22,10,'#8db9c0');rounded(10,10,19,10,5,'#273f5d');circle(15,15,3,'#ffdf8e');circle(25,15,3,'#ffdf8e');circle(8,29,6,'#45566d');circle(31,29,6,'#45566d');ctx.restore()}ctx.restore()}
// All poses share a consistent visual baseline. The original concept cutouts have
// different proportions, so normalization prevents the hero from changing size.
function hero(){
 const p=player,x=p.x-camera+p.w/2,y=p.y+p.h;
 let pose='idle';
 if(p.inv>0&&Math.floor(tick/5)%2)pose='hurt';
 else if(p.attack>0)pose=p.attack>6?'slash1':'slash2';
 else if(p.roll>0)pose=Math.floor(tick/5)%2?'roll1':'roll2';
 else if(p.crouch)pose='crouch';
 else if(!p.ground)pose=p.vy<0?'jump':'fall';
 else if(Math.abs(p.vx)>2.4)pose=Math.floor(tick/7)%2?'run1':'run2';
 else if(Math.abs(p.vx)>.3)pose=Math.floor(tick/9)%2?'walk1':'walk2';
 if(pose!==heroPose){heroPose=pose;heroPoseTime=0}else heroPoseTime++;
 const im=sprites[pose];ctx.save();ctx.translate(x,y);ctx.scale(p.face,1);
 // Grounding shadow helps the player judge jumps and landings.
 if(p.ground){ctx.fillStyle='#173d4640';ctx.beginPath();ctx.ellipse(0,1,20,4,0,0,Math.PI*2);ctx.fill()}
 if(p.inv>0&&Math.floor(tick/4)%2)ctx.globalAlpha=.55;
 if(im&&im.complete&&im.naturalWidth){
   const height=pose==='crouch'?46:pose.startsWith('roll')?48:pose.startsWith('slash')?73:pose==='hurt'?67:68;
   const width=Math.min(pose.startsWith('slash')?93:pose.startsWith('roll')?74:65,height*im.naturalWidth/im.naturalHeight);
   const bounce=p.ground&&!p.crouch&&Math.abs(p.vx)>1&&!p.roll?Math.abs(Math.sin(tick*.22))*2:0;
   ctx.drawImage(im,-width/2,-height-bounce,width,height);
 }else{rounded(-14,-57,28,57,7,'#f7f0e5');circle(0,-63,15,'#f7c454')}
 if(p.attack>0){ctx.strokeStyle='#b8f2ff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(7,-34,49,-1.15,.65);ctx.stroke()}
 ctx.restore();
}
function effects(){for(const q of particles){ctx.globalAlpha=Math.min(1,q.life/15);circle(q.x-camera,q.y,3,q.color)}ctx.globalAlpha=1}
function hud(){rounded(17,15,215,64,13,'#183951dc');ctx.fillStyle='#fff8e8';ctx.font='bold 13px system-ui';ctx.fillText('ENERGI',31,35);ctx.font='bold 28px system-ui';ctx.fillText(String(player.hp).padStart(2,'0'),31,67);rounded(94,48,121,13,6,'#2c4658');rounded(94,48,121*player.hp/99,13,6,player.hp>30?'#f6c86d':'#f1827b');ctx.font='bold 13px system-ui';ctx.fillStyle='#fff8e8';ctx.fillText('MAX 99',156,35);rounded(747,15,195,43,11,'#183951dc');ctx.font='bold 15px system-ui';ctx.fillText(`✦ ${score} / ${items.length} kapslar`,764,42);if(player.x<185){rounded(300,20,350,39,12,'#fdf2dccc');ctx.fillStyle='#284b61';ctx.font='bold 15px system-ui';ctx.fillText('→ Följ stigen genom parken!',329,45)}if(player.x>1850&&player.x<2050){rounded(340,84,295,40,12,'#fdf2dccc');ctx.fillStyle='#284b61';ctx.font='bold 15px system-ui';ctx.fillText('✓ Kontrollpunkt aktiverad!',366,109)}}
function render(){background();drawPlatforms();drawItems();drawEnemies();hero();effects();hud();ctx.fillStyle='#0e263cbb';ctx.fillRect(W-215,H-30,215,30);ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText('Stadsparken · v0.5.0',W-195,H-11)}
function loop(t){const dt=Math.min(2,(t-last)/16.666||1);last=t;if(running&&!paused)update(dt);render();requestAnimationFrame(loop)}
reset(false);try{if(localStorage.getItem('stadsparken-checkpoint')==='1930'){checkpoint=1930;player.x=1930}}catch{}requestAnimationFrame(loop);
