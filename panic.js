
export function bootstrapPanic(){
  const b = document.getElementById('panic-stop'); if (!b) return;
  b.addEventListener('click', ()=>{
    try{ speechSynthesis.cancel(); }catch(e){}
    // close overlays if visible
    ['breath-overlay','shadow-overlay','partner-overlay','consent-overlay','playdeck-overlay'].forEach(id => {
      const el = document.getElementById(id); if (el) el.style.display='none';
    });
    // turn off soundscape
    try{ window.dispatchEvent(new CustomEvent('mgd:snd:off')); }catch(e){}
    // dispatch panic for any module to stop timers
    try{ window.dispatchEvent(new CustomEvent('mgd:panic')); }catch(e){}
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPanic);

// Shake‑to‑Panic (mobile)
try{
  let last=0;
  window.addEventListener('devicemotion', (e)=>{
    const a = e.accelerationIncludingGravity||{};
    const mag = Math.sqrt((a.x||0)**2 + (a.y||0)**2 + (a.z||0)**2);
    const now = Date.now();
    if (mag>30 && (now-last)>1000){ last=now; document.getElementById('panic-stop')?.click(); }
  });
}catch(e){}
