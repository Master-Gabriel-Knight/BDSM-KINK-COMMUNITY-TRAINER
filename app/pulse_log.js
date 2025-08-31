
export function bootstrapPulseLog(){
  function push(v){ try{ const L=JSON.parse(localStorage.getItem('mgd.pulse.log')||'[]'); L.push({t:Date.now(), v}); localStorage.setItem('mgd.pulse.log', JSON.stringify(L)); }catch(e){} }
  window.addEventListener('mgd:safetyPulse', e=> push(e.detail?.value||''));
  window.addEventListener('mgd:applyScriptControl', e=>{ const d=e.detail||{}; if (d.type==='pulse') push(d.value||''); });
}
document.addEventListener('DOMContentLoaded', bootstrapPulseLog);
