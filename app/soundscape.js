
let ctx, osc, noise, gainTone, gainNoise;
function ensure(){
  if (ctx) return;
  ctx = new (window.AudioContext||window.webkitAudioContext)();
  osc = ctx.createOscillator(); gainTone = ctx.createGain();
  osc.type='sine'; osc.frequency.value = 432; gainTone.gain.value=0;
  // white noise -> simple lowpass
  const bufferSize = 2 * ctx.sampleRate;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i=0;i<bufferSize;i++){ data[i] = Math.random()*2-1; }
  noise = ctx.createBufferSource(); noise.buffer=buffer; noise.loop=true;
  gainNoise = ctx.createGain(); gainNoise.gain.value=0.0;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=800;
  osc.connect(gainTone).connect(ctx.destination);
  noise.connect(lp).connect(gainNoise).connect(ctx.destination);
  osc.start(); noise.start();
}
function setHz(hz){ if (osc) osc.frequency.value = hz; }
function setNoise(v){ if (gainNoise) gainNoise.gain.value = v; }
function setOn(on){
  ensure();
  gainTone.gain.linearRampToValueAtTime(on?0.1:0.0, ctx.currentTime + .2);
}
export function bootstrapSound(){
  const on = document.getElementById('snd-on');
  const hz = document.getElementById('snd-hz');
  const nz = document.getElementById('snd-noise');
  on?.addEventListener('change', ()=> setOn(on.checked));
  hz?.addEventListener('input', ()=> setHz(parseFloat(hz.value)||432));
  nz?.addEventListener('input', ()=> setNoise(parseFloat(nz.value)||0));
}
document.addEventListener('DOMContentLoaded', bootstrapSound);

let oscR, panL, panR;
function ensureStereo(){
  if (!ctx) ensure();
  if (!oscR){
    oscR = ctx.createOscillator(); const gR = ctx.createGain(); gR.gain.value = 0;
    panL = ctx.createStereoPanner(); panL.pan.value = -1;
    panR = ctx.createStereoPanner(); panR.pan.value = 1;
    osc.connect(panL).connect(gainTone).connect(ctx.destination);
    oscR.connect(panR).connect(gR).connect(ctx.destination);
    oscR.type='sine'; oscR.frequency.value = 437; oscR.start();
    // track same gain for simplicity
    gainTone = gR;
  }
}
function setBeatHz(b){
  ensureStereo();
  const base = parseFloat(document.getElementById('snd-hz')?.value||'432');
  if (osc && oscR){ osc.frequency.value = base; oscR.frequency.value = Math.max(1, base + b); }
}
export function bootstrapSoundPlus(){
  window.addEventListener('mgd:snd:off', ()=>{ try{ if (gainTone) gainTone.gain.value=0; if (gainNoise) gainNoise.gain.value=0; }catch(e){} });
  const beat = document.getElementById('snd-beat');
  beat?.addEventListener('input', ()=> setBeatHz(parseFloat(beat.value)||0));
}
document.addEventListener('DOMContentLoaded', bootstrapSoundPlus);

window.addEventListener('mgd:thermo', (e)=>{
  const {a,s} = e.detail||{};
  try{
    const nz = document.getElementById('snd-noise'); if (nz){ const v = Math.min(0.5, Math.max(0, a/50 + (8-s)/80)); nz.value = v.toFixed(2); nz.dispatchEvent(new Event('input')); }
  }catch(err){}
});
