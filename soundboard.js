
let ctx=null;
function beep(freq=660, dur=200){
  try{
    ctx = ctx || new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(), g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur/1000);
    o.start(); o.stop(ctx.currentTime + dur/1000 + 0.02);
  }catch(e){}
}
export function bootstrapSoundboard(){
  document.getElementById('sb-test')?.addEventListener('click', ()=>{
    const f=parseInt(document.getElementById('sb-freq')?.value||'660',10);
    const d=parseInt(document.getElementById('sb-dur')?.value||'200',10);
    beep(f,d);
  });
  window.addEventListener('mgd:safetyPulse', ()=>{
    if (!document.getElementById('sb-onpulse')?.checked) return;
    const f=parseInt(document.getElementById('sb-freq')?.value||'660',10);
    const d=parseInt(document.getElementById('sb-dur')?.value||'200',10);
    beep(f,d);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapSoundboard);
