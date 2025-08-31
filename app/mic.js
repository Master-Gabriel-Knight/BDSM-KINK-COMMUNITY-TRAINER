
let stream=null, ctx=null, proc=null;
function start(){
  navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{
    stream = s; ctx = new (window.AudioContext||window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(s);
    const analyser = ctx.createAnalyser(); analyser.fftSize=1024;
    src.connect(analyser);
    const bar = document.createElement('div'); bar.id='mic-bar'; bar.style.cssText='height:6px;background:#4da3ff;width:0;transition:width .1s linear;margin-top:6px;border-radius:6px';
    document.getElementById('breath-visual')?.after(bar);
    function tick(){
      const data=new Uint8Array(analyser.fftSize); analyser.getByteTimeDomainData(data);
      let sum=0; for(let i=0;i<data.length;i++){ const v=(data[i]-128)/128; sum+=v*v; }
      const rms=Math.sqrt(sum/data.length); const pct=Math.min(100, Math.floor(rms*300));
      bar.style.width=pct+'%'; requestAnimationFrame(tick);
    }
    tick();
  }).catch(()=> alert('Mic access denied.'));
}
function stop(){
  try{ stream && stream.getTracks().forEach(t=>t.stop()); }catch(e){}
  try{ document.getElementById('mic-bar')?.remove(); }catch(e){}
}
export function bootstrapMic(){
  const box = document.getElementById('mic-assist');
  box?.addEventListener('change', ()=>{ if (box.checked) start(); else stop(); });
}
document.addEventListener('DOMContentLoaded', bootstrapMic);
