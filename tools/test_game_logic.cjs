// No network/browser required. Exercises the real game module with a deterministic
// Canvas facade, verifying the playable loop still works after graphics updates.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync(__dirname+'/../js/game.js','utf8');
const listeners={};let loop=null;
const ctxt={};
for(const f of ['fillRect','strokeRect','beginPath','rect','clip','save','restore','drawImage','arc','roundRect','ellipse','stroke','fill','lineTo','moveTo','quadraticCurveTo','translate','scale','fillText','rotate','closePath'])ctxt[f]=()=>{};
ctxt.createLinearGradient=()=>({addColorStop(){}});
const els={game:{getContext(){return ctxt}},overlay:{classList:{add(){},remove(){}}},overlayTitle:{textContent:''},overlayText:{textContent:''},play:{textContent:'',onclick:null},restart:{textContent:'',onclick:null},sound:{textContent:'',onclick:null}};
class Img{constructor(){this.complete=true;this.naturalWidth=256;this.naturalHeight=256}set src(x){this.path=x}}
let game={document:{querySelector(s){let key=s.replace('#','');assert(els[key]);return els[key]}},Image:Img,window:{addEventListener(t,f){listeners[t]=f},AudioContext:class{}},requestAnimationFrame(f){loop=f},localStorage:{getItem(){return null},removeItem(){},setItem(){}},Math,Set,console};
game.window.window=game.window;
vm.createContext(game);vm.runInContext(code,game);
function state(s){return vm.runInContext(s,game)}
const assertNoError=()=>{assert(state('player.hp')>=0);assert(state('player.hp')<=99);assert(Number.isFinite(state('player.x')));assert(Number.isFinite(state('player.y')))};
assert.equal(state('VERSION'),'0.12.0');
assert.equal(state('animationLengths.walk'),12);assert.equal(state('animationLengths.run'),12);
assert.equal(state('player.hp'),99);assert.equal(state('platforms.length'),19);
assert.equal(state('tiles.wall.length'),8);
els.play.onclick();
let tm=0;function step(frames=1){for(let i=0;i<frames;i++){tm+=16.666;loop(tm)}};
step(30);assert(state('player.ground'),'character did not land');
const start=state('player.x');listeners.keydown({code:'ArrowRight',preventDefault(){},repeat:false});step(28);
assert(state('player.x')>start+45,'character did not walk');
listeners.keydown({code:'ShiftLeft',preventDefault(){},repeat:false});const runningStart=state('player.x');step(15);assert(state('player.x')>runningStart+60,'sprint too slow');
listeners.keyup({code:'ShiftLeft'});listeners.keydown({code:'Space',preventDefault(){},repeat:false});step(3);assert(state('player.vy')<0,'jump did not trigger');listeners.keyup({code:'Space'});
step(65);assertNoError();
listeners.keydown({code:'KeyX',preventDefault(){},repeat:false});step(2);assert(state('player.attack')>0,'sword attack missing');listeners.keyup({code:'KeyX'});
step(30);listeners.keyup({code:'ArrowRight'});listeners.keydown({code:'KeyC',preventDefault(){},repeat:false});step(1);
assertNoError();
// Release cleanup & direct drawing test of the new illustrated structures.
state('reset(true)');step(2);assert.equal(state('player.hp'),99);assert.equal(state('score'),0);
assert.equal(state('platforms.length'),19);
state('player.x=1930; player.y=GROUND-player.h; player.ground=true');step(2);
assert.equal(state('checkpoint'),1930,'checkpoint did not activate');
state('player.hp=18;player.inv=0;player.roll=0;hurt()');
assert.equal(state('player.hp'),0,'damage did not exhaust energy');
assert.equal(state('running'),false,'game should stop at zero energy');
els.play.onclick();assert.equal(state('player.hp'),99,'restart did not refill energy');
assert.equal(state('player.x'),1930,'checkpoint respawn failed');
state('player.x=WORLD-135;player.y=GROUND-player.h;player.vy=0;player.ground=true');
step(2);assert.equal(state('won'),true,'level goal did not trigger');
assertNoError();
console.log('PASS: 99 energy, ground collision, walk, sprint, jump, slash, roll, drawing, restart, tiles, v0.12.0');
