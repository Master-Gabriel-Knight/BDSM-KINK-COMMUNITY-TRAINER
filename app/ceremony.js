
function show(on){ const o=document.getElementById('ceremony-overlay'); if(o) o.style.display=on?'flex':'none'; }
let step = 0;
const STEPS = ['compass','agreements','script','breath','journal'];
function go(){
  const k = STEPS[step]||null;
  if (!k){ show(false); step=0; return; }
  if (k==='compass') document.getElementById('ec-start')?.click();
  if (k==='agreements') window.scrollTo({top: document.getElementById('agreements').offsetTop-20, behavior:'smooth'});
  if (k==='script') window.scrollTo({top: document.getElementById('stage-scripts').offsetTop-20, behavior:'smooth'});
  if (k==='breath') document.getElementById('breath-start')?.click();
  if (k==='journal') window.dispatchEvent(new CustomEvent('mgd:ritualComplete'));
  step++;
}
export function bootstrapCeremony(){
  document.getElementById('open-ceremony')?.addEventListener('click', ()=>{ step=0; show(true); });
  document.getElementById('ceremony-start')?.addEventListener('click', go);
  document.getElementById('ceremony-next')?.addEventListener('click', go);
  document.getElementById('ceremony-close')?.addEventListener('click', ()=> show(false));
}
document.addEventListener('DOMContentLoaded', bootstrapCeremony);
