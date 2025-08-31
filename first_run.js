
function show(on){ const o=document.getElementById('first-run'); if (o) o.style.display=on?'flex':'none'; }
function stepScroll(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth', block:'center'}); }
export function bootstrapFirstRun(){
  const open=document.getElementById('fr-open'); const run=document.getElementById('fr-run'); const dis=document.getElementById('fr-dismiss');
  open?.addEventListener('click', ()=> show(true));
  dis?.addEventListener('click', ()=> show(false));
  run?.addEventListener('click', ()=>{
    show(false);
    stepScroll('theme-switcher');
    setTimeout(()=> stepScroll('safeword-haptics'), 800);
    setTimeout(()=>{ const q=document.getElementById('qz-select'); if(q){ q.value='signals'; } document.getElementById('qz-start')?.click(); }, 1600);
    setTimeout(()=> stepScroll('resources'), 2800);
    setTimeout(()=> stepScroll('breath-visual'), 3600);
    localStorage.setItem('mgd.firstRun.completed','1');
  });
  if (!localStorage.getItem('mgd.firstRun.completed')){ setTimeout(()=> show(true), 1200); }
}
document.addEventListener('DOMContentLoaded', bootstrapFirstRun);
