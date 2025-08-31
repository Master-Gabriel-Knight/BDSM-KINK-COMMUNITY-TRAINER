
let timer=null;
function chime(freq=720, ms=140){
  try{
    const ctx=new (window.AudioContext||window.webkitAudioContext)(); const o=ctx.createOscillator(); const g=ctx.createGain();
    o.type='sine'; o.frequency.value=freq; g.gain.value=0.0001; o.connect(g).connect(ctx.destination);
    const now=ctx.currentTime; g.gain.linearRampToValueAtTime(0.1, now+0.02); g.gain.linearRampToValueAtTime(0.0001, now+ms/1000); o.start(); o.stop(now+ms/1000+0.05);
  }catch(e){}
}
export function bootstrapCheckins(){
  const minBox=document.getElementById('ci-min'); const start=document.getElementById('ci-start'); const stop=document.getElementById('ci-stop'); const st=document.getElementById('ci-status');
  start?.addEventListener('click', ()=>{ const m=parseInt(minBox?.value||'10',10); const dur=Math.max(1,m)*60000; st.textContent='Running…'; clearInterval(timer); timer=setInterval(()=>{ chime(); alert('Check‑in: How are we?'); }, dur); });
  stop?.addEventListener('click', ()=>{ clearInterval(timer); st.textContent='Stopped.'; });
}
document.addEventListener('DOMContentLoaded', bootstrapCheckins);
