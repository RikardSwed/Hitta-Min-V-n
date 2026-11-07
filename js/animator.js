/**
 * Stadens Hemlighet – deterministic, testable character animation decisions.
 * Original artwork remains from the approved modern boy. Eight-frame walk/run loops
 * use four approved painted keyposes plus four non-ghosted rigged passing frames.
 * No DOM or Canvas dependencies. Game physics never depends on animation frames.
 */
export const FRAME_COUNTS=Object.freeze({
  idle:8, walk:8, run:8, jump:4, fall:4, spin:8,
  crouch:2, slash:3, hurt:1, land:5,
});

export const FILE_PREFIX=Object.freeze({fall:'jump',spin:'spinair'});
export const STANCE=Object.freeze({walkStride:72,runStride:88,spinFramesPerRevolution:24,turnFrames:8});

export function selectAction(p, landingTimer=0, tick=0){
  if(p.inv>0 && Math.floor(tick/6)%2) return 'hurt';
  if(p.attack>0) return 'slash';
  if(p.crouch) return 'crouch';
  if(p.spin && !p.ground) return 'spin';
  if(!p.ground) return p.vy<1?'jump':'fall';
  if(landingTimer>0) return 'land';
  if(Math.abs(p.vx)>4.35) return 'run';
  if(Math.abs(p.vx)>.35) return 'walk';
  return 'idle';
}

export function frameFor(action,p,elapsed=0){
  const n=FRAME_COUNTS[action]||1;
  const clamp=(v)=>Math.max(0,Math.min(n-1,v));
  if(action==='hurt')return 0;
  if(action==='idle')return Math.floor(elapsed/11)%n;
  if(action==='land'){
    const progress=Math.min(0.999,(p.landClock||0)/Math.max(1,p.landDuration||9));
    const stage=Math.min(3,Math.floor(progress*4));
    return stage===3 && Math.abs(p.vx||0)>1.1 ? 4 : stage;
  }
  if(action==='walk'||action==='run')return Math.floor((((p.gaitPhase||0)%1+1)%1)*n)%n;
  if(action==='spin')return Math.floor(((p.spinClock||0)%STANCE.spinFramesPerRevolution)/STANCE.spinFramesPerRevolution*n)%n;
  if(action==='slash')return clamp(Math.floor((13-(p.attack||0))/13*n));
  if(action==='crouch')return clamp(Math.floor(elapsed/9));
  if(action==='jump'){
    if((p.airAge||0)<4)return 0;  // launch
    if(p.vy< -6)return clamp(1); // ascent
    if(p.vy< -1)return clamp(2); // approaching apex
    return clamp(3);           // apex
  }
  if(action==='fall')return p.vy<7?2:3;
  return Math.floor(elapsed/6)%n;
}

/** Continuous contact phase: preserves the same leading foot when walk becomes run. */
export function advanceGait(phase,deltaPixels,run=false){
  const stride=run?STANCE.runStride:STANCE.walkStride;
  return (((phase+Math.max(0,deltaPixels)/stride)%1)+1)%1;
}

/** Ground-anchored art transform: body bends, feet stay on the platform. */
export function artMotion(action,p,landingTimer,elapsed){
  const cycle=(p.gaitPhase||0)*Math.PI*2;
  const speed=Math.abs(p.vx||0);
  let lean=0,breath=0,stretchX=1,stretchY=1,shiftX=0;
  if(action==='idle'){breath=0.009*Math.sin(elapsed*0.055);lean=-.018*Math.max(-1,Math.min(1,p.accel||0));}
  if(action==='walk'){
    lean=.008*Math.sin(cycle)-.035*Math.max(-1,Math.min(1,p.accel||0));
    stretchY+=.011*Math.cos(2*cycle);
    shiftX=.5*Math.cos(cycle)*Math.min(speed/3.75,1);
  }
  if(action==='run'){
    lean=.045+.01*Math.sin(cycle)-.036*Math.max(-1,Math.min(1,p.accel||0));
    stretchY+=.014*Math.cos(2*cycle);
    shiftX=.6*Math.cos(cycle)*Math.min(speed/5.95,1);
  }
  if(action==='jump')lean=-.025;
  if(action==='fall')lean=.018;
  if(action==='land'){lean=.025; stretchY-=.012*Math.max(0,1-(p.landClock||0)/Math.max(1,p.landDuration||9));}
  if(action==='slash')lean=.02;
  if(action==='crouch')stretchY=.99;
  // Scale around the FOOT, not the torso. Never translate a grounded shoe vertically.
  if(landingTimer>0){
    const v=Math.min(1,landingTimer);
    stretchY*=1-.065*v;
    stretchX*=1+.045*v;
  }
  stretchY+=breath;
  return {lean,stretchX,stretchY,shiftX};
}

/** Contact events are aligned to gait cycle boundaries, unlike a separate dust counter. */
export function crossedFootContact(previousPhase,nextPhase){
  const before=((previousPhase%1)+1)%1;
  const after=((nextPhase%1)+1)%1;
  return after<before || (before<.5 && after>=.5);
}

/** Four illustrated transition stages, sampled from the approved 2026 modern model sheet.
 *  Three-quarter and front views replace the old horizontal squash illusion.
 *  Stage 0/4 keep the original locomotion sprite; stage 1/3 show the source
 *  three-quarter art; stage 2 shows the real approved front illustration.
 */
export function turnaroundPose(p){
  if(!(p.turnTimer>0) || !p.ground || p.spin) return null;
  const duration=Math.max(1,p.turnDuration||8);
  const progress=Math.max(0,Math.min(1,1-p.turnTimer/duration));
  if(progress<.16) return {name:'source',face:p.turnFrom||-p.face};
  if(progress<.39) return {name:'three',face:p.turnFrom||-p.face};
  if(progress<.62) return {name:'front',face:1};
  if(progress<.86) return {name:'three',face:p.face};
  return {name:'source',face:p.face};
}

/** Legacy fallback for missing illustrated turning assets. */
export function facingTransform(p){
  const remain=Math.max(0,p.turnTimer||0);
  if(!remain)return {scaleX:p.face||1, turning:false};
  const duration=Math.max(1,p.turnDuration||STANCE.turnFrames);
  const progress=Math.max(0,Math.min(1,1-remain/duration));
  const oldFace=p.turnFrom||-(p.face||1);
  return {scaleX:oldFace*Math.cos(Math.PI*progress),turning:true};
}
