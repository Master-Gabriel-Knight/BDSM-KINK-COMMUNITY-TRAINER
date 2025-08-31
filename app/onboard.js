
const LS = { first:'mgd.first.run' };
function show(on){ const o = document.getElementById('onboard-overlay'); if (!o) return; o.style.display = on?'flex':'none'; }
export function bootstrapOnboard(){
  if (!localStorage.getItem(LS.first)){ show(true); }
  document.getElementById('onboard-dismiss')?.addEventListener('click', ()=>{ localStorage.setItem(LS.first,'1'); show(false); });
  document.getElementById('onboard-do')?.addEventListener('click', ()=>{
    localStorage.setItem(LS.first,'1'); show(false);
    // soft guide: open teaching mode if available
    document.getElementById('teach-open')?.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapOnboard);
