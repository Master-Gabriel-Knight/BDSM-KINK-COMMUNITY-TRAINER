
function show(id,on=true){ const x=document.getElementById(id); if (x) x.style.display=on?'flex':'none'; }
export function bootstrapHotkeys(){
  window.addEventListener('keydown', (e)=>{
    if (e.key==='?'){ e.preventDefault(); show('hotkeys-overlay', true); }
    if (e.key==='B' || e.key==='b'){ e.preventDefault(); document.getElementById('breath-start') ? show('breath-overlay', true) : document.getElementById('open-playdeck')?.click(); }
    if (e.key==='M' || e.key==='m'){ const box=document.getElementById('kink-enabled'); if (box){ box.checked=!box.checked; box.dispatchEvent(new Event('change')); } }
    if (e.key==='G' || e.key==='g'){ const g=document.getElementById('guardian-enable'); if (g){ g.checked=!g.checked; g.dispatchEvent(new Event('change')); } }
    if (e.key==='P' || e.key==='p'){ document.getElementById('panic-stop')?.click(); }
    if (e.key==='Escape'){ show('hotkeys-overlay', false); }
  });
  document.getElementById('hotkeys-close')?.addEventListener('click', ()=> show('hotkeys-overlay', false));
}
document.addEventListener('DOMContentLoaded', bootstrapHotkeys);
