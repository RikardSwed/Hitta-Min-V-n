"""Reproducible v0.13 gameplay/render tweaks: distance-synced gait and dust/landing cues."""
from pathlib import Path
P=Path(__file__).resolve().parent.parent
f=P/'js/game.js'
s=f.read_text()
s=s.replace('0.12.0','0.13.0')
s=s.replace('// 65 articulated frames derived from the approved full-body schoolboy artwork.', '// 69 approved-character frames; walk/run rebuilt with painted leg rotation from the approved side view.')
s=s.replace('let coyote=0,jumpBuffer=0,heroPose="idle",heroPoseTime=0;','let coyote=0,jumpBuffer=0,heroPose="idle",heroPoseTime=0,stepDistance=0,lastDustStep=-1;')
s=s.replace('particles=[];coyote=0;jumpBuffer=0;heroPose="idle";heroPoseTime=0;', 'particles=[];coyote=0;jumpBuffer=0;heroPose="idle";heroPoseTime=0;stepDistance=0;lastDustStep=-1;')
s=s.replace('function update(dt){tick+=dt;', 'function update(dt){tick+=dt;')
s=s.replace('const oldY=p.y;p.x=Math.max(0,Math.min(WORLD-p.w,p.x+p.vx*dt));p.vy=', 'const oldY=p.y,wasGrounded=p.ground,oldX=p.x;p.x=Math.max(0,Math.min(WORLD-p.w,p.x+p.vx*dt));if(wasGrounded&&!p.roll&&!p.crouch)stepDistance+=Math.abs(p.x-oldX);p.vy=')
s=s.replace('if(p.y>H+100){', '''// Ground dust is tied to actual travel, so shoes don't throw out particles while idle.
if(p.ground&&!p.crouch&&!p.roll&&Math.abs(p.vx)>1.3){
 const stride=(Math.abs(p.vx)>4.25?140:110)/2;
 const stepNumber=Math.floor(stepDistance/stride);
 if(stepNumber!==lastDustStep){lastDustStep=stepNumber;
   for(let i=0;i<4;i++)particles.push({x:p.x+p.w/2+(Math.random()-.5)*18,y:p.y+p.h-3,vx:(Math.random()-.5)*1.8,vy:-Math.random()*1.8-.2,life:14+Math.random()*10,color:'#f6e6bb',dust:true});
 }
}
if(!wasGrounded&&p.ground&&p.vy===0&&oldY+p.h<p.y+p.h-2){
 for(let i=0;i<9;i++)particles.push({x:p.x+p.w/2+(Math.random()-.5)*28,y:p.y+p.h-3,vx:(Math.random()-.5)*3,vy:-Math.random()*2.8-.3,life:18+Math.random()*10,color:'#e7e0c4',dust:true});
}
if(p.y>H+100){''')
s=s.replace('  Math.floor(heroPoseTime/delay)%frames.length;', '''  (action==='walk'||action==='run')
   ? Math.floor(stepDistance/(action==='run'?140:110)*frames.length)%frames.length
   : Math.floor(heroPoseTime/delay)%frames.length;''')
s=s.replace("function effects(){for(const q of particles){ctx.globalAlpha=Math.min(1,q.life/15);circle(q.x-camera,q.y,3,q.color)}ctx.globalAlpha=1}","""function effects(){for(const q of particles){
 ctx.globalAlpha=Math.min(1,q.life/(q.dust?28:15));
 if(q.dust){ctx.fillStyle=q.color;ctx.beginPath();ctx.ellipse(q.x-camera,q.y,3.6,2.3,0,0,Math.PI*2);ctx.fill()}
 else circle(q.x-camera,q.y,3,q.color);
}ctx.globalAlpha=1}""")
s=s.replace('if(!ground){\n   ctx.strokeStyle=', """if(!ground){
   // A subtle painted stone edge, matching the original artwork's warm outlines.
   ctx.strokeStyle='#d9dbba99';ctx.lineWidth=1.6;
   ctx.beginPath();ctx.moveTo(p.x+2,p.y+2);ctx.lineTo(p.x+p.w-2,p.y+2);ctx.stroke();
   ctx.strokeStyle=""")
f.write_text(s)
print('game.js patched v0.13, chars',len(s))
