
const CMDS = [
  ['Open Breath','breath'],
  ['Toggle Guardian','guardian'],
  ['Open Thermostat','thermo'],
  ['Start Golden Path','golden'],
  ['Guided Tour','tour'],
  ['Projector Mode','projector'],
  ['Panic Stop','panic'],
  ['Consent Checklists','checklists'],
  ['Risk Register','risk'],
  ['Workshop Planner','planner'],
  ['Open Ceremony','ceremony'],
  ['Open Journal','journal']
];
function show(on){ const o=document.getElementById('cmd-overlay'); if(o) o.style.display=on?'block':'none'; if(on){ const i=document.getElementById('cmd-input'); i.value=''; i.focus(); render(''); } }
function render(q){
  const list=document.getElementById('cmd-list'); list.innerHTML='';
  const hit = CMDS.filter(([t])=> t.toLowerCase().includes((q||'').toLowerCase()));
  hit.forEach(([t,k])=>{ const b=document.createElement('button'); b.className='navbtn'; b.textContent=t; b.style.margin='4px'; b.addEventListener('click', ()=> run(k)); list.appendChild(b); });
}
function run(key){
  if (key==='breath') document.getElementById('breath-start')?.click();
  if (key==='guardian'){ const g=document.getElementById('guardian-enable'); if(g){ g.checked=!g.checked; g.dispatchEvent(new Event('change')); } }
  if (key==='thermo') document.getElementById('open-thermo')?.click();
  if (key==='golden') document.getElementById('open-golden')?.click();
  if (key==='tour') document.getElementById('open-tour')?.click();
  if (key==='projector'){ document.getElementById('proj-open')?.click(); }
  if (key==='panic') document.getElementById('panic-stop')?.click();
  if (key==='checklists') document.getElementById('consent-checklists')?.scrollIntoView({behavior:'smooth'});
  if (key==='risk') document.getElementById('risk-register')?.scrollIntoView({behavior:'smooth'});
  if (key==='planner') document.getElementById('planner')?.scrollIntoView({behavior:'smooth'});
  if (key==='ceremony') document.getElementById('open-ceremony')?.click();
  if (key==='journal') window.dispatchEvent(new CustomEvent('mgd:ritualComplete'));
  show(false);
}
export function bootstrapCommandPalette(){
  document.getElementById('cmd-close')?.addEventListener('click', ()=> show(false));
  document.getElementById('cmd-input')?.addEventListener('input', (e)=> render(e.target.value));
  window.addEventListener('keydown', (e)=>{
    if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='k'){ e.preventDefault(); show(true); }
    if (e.key==='Escape') show(false);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCommandPalette);
