
const LS = { th:'mgd.thermo' };
function show(on){ const o=document.getElementById('thermo-overlay'); if(o) o.style.display=on?'flex':'none'; }
function hint(a,s){
  if (s>=a) return 'Good pacing. Keep checking in.';
  if (a-s<=2) return 'Consider softer cadence or lighter language.';
  return 'Pause. Hydrate or cuddle. Consider aftercare.';
}
export function bootstrapThermostat(){
  const openBtn = document.getElementById('open-thermo');
  const closeBtn = document.getElementById('th-close');
  const ar = document.getElementById('th-arousal');
  const sf = document.getElementById('th-safety');
  const so = document.getElementById('th-soften');
  const msg = document.getElementById('th-hint');
  function update(){ const a=parseInt(ar.value,10), s=parseInt(sf.value,10); msg.textContent=hint(a,s); localStorage.setItem(LS.th, JSON.stringify({a,s,soft:so.checked})); try{ window.dispatchEvent(new CustomEvent('mgd:thermo', {detail:{a,s,soft:so.checked}})); }catch(e){} }
  ;[ar,sf,so].forEach(el => el?.addEventListener('input', update));
  openBtn?.addEventListener('click', ()=>show(true));
  closeBtn?.addEventListener('click', ()=>show(false));
  // load
  try{ const x=JSON.parse(localStorage.getItem(LS.th)||'{}'); if(ar&&sf){ ar.value=x.a||4; sf.value=x.s||8; so.checked = x.soft!==false; update(); } }catch(e){}
  // optional: slow stage tempo if softening
  window.addEventListener('mgd:thermo', (e)=>{
    const {a,s,soft}=e.detail||{}; if (!soft) return;
    const tempoEl = document.getElementById('script-tempo')||document.getElementById('se-tempo');
    if (tempoEl){ const base=parseFloat(tempoEl.value||'1'); const adj = (s<a? Math.min(2, base*1.1): base); tempoEl.value = adj.toFixed(1); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapThermostat);
