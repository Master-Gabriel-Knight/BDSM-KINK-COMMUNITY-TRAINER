
let lastPing=0;
function out(t){ const el=document.getElementById('lat-out'); if (el) el.textContent = t; }
export function bootstrapLatency(){
  document.getElementById('lat-ping')?.addEventListener('click', ()=>{
    lastPing = Date.now();
    try{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'ping', t:lastPing}})); }catch(e){}
  });
  window.addEventListener('mgd:applyScriptControl', (e)=>{
    const d=e.detail||{};
    if (d.type==='ping' && !d.reply){ // echo
      try{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'ping', t:d.t, reply:true}})); }catch(e){}
    } else if (d.type==='ping' && d.reply){ const rtt = Date.now() - (d.t||Date.now()); out('RTT ~ '+rtt+' ms'); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapLatency);
