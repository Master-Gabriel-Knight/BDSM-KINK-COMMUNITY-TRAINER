
function show(on){ const o=document.getElementById('golden-overlay'); if(o) o.style.display=on?'flex':'none'; }
const STEPS = [
  {label:'Guardian + Demo on', run:()=>{ const g=document.getElementById('guardian-enable'); if(g){ g.checked=true; g.dispatchEvent(new Event('change')); } const d=document.getElementById('demo-toggle'); if(d){ d.checked=true; d.dispatchEvent(new Event('change')); } }},
  {label:'Consent micro‑lesson (Signals deck)', run:()=>{ document.getElementById('qz-select').value='signals'; document.getElementById('qz-start').click(); }},
  {label:'Breath & Node tour', run:()=>{ document.getElementById('breath-start')?.click(); }},
  {label:'Check‑Ins every 10 min', run:()=>{ const m=document.getElementById('ci-min'); if(m){ m.value='10'; } document.getElementById('ci-start')?.click(); }},
  {label:'Praxis Track: Awakening', run:()=>{ const t=document.getElementById('px-track'); if(t){ t.value='awakening'; } document.getElementById('px-begin')?.click(); }},
  {label:'Journal prompt at close', run:()=>{ window.dispatchEvent(new CustomEvent('mgd:ritualComplete')); }},
  {label:'Export Ceremony Card', run:()=>{ document.getElementById('ceremony-card')?.click(); }}
];
let i=0;
export function bootstrapGolden(){
  const status=document.getElementById('golden-status');
  function step(){ if (i>=STEPS.length){ status.textContent='Complete.'; return; } const s=STEPS[i++]; s.run(); status.textContent='Ran: '+s.label; }
  document.getElementById('open-golden')?.addEventListener('click', ()=>{ i=0; status.textContent='Idle.'; show(true); });
  document.getElementById('golden-start')?.addEventListener('click', step);
  document.getElementById('golden-next')?.addEventListener('click', step);
  document.getElementById('golden-close')?.addEventListener('click', ()=> show(false));
}
document.addEventListener('DOMContentLoaded', bootstrapGolden);
