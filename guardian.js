
const LS = { guard:'mgd.guardian.enabled', outline:'mgd.guardian.outline' };
function set(on){
  localStorage.setItem(LS.guard, on?'1':''); 
  document.documentElement.dataset.guardian = on ? 'on' : 'off';
  // Tone down: turn off kink flavor & disable intensity slider
  try{
    const flavor = document.getElementById('kink-flavor'); if (flavor){ flavor.checked = false; flavor.disabled = on; flavor.dispatchEvent(new Event('change')); }
    const intensity = document.getElementById('kink-intensity'); if (intensity){ intensity.value = 0; intensity.disabled = on; intensity.dispatchEvent(new Event('input')); }
  }catch(e){}
}
function toggleOutline(){
  const on = !(localStorage.getItem(LS.outline)==='1');
  localStorage.setItem(LS.outline, on?'1':'');
  document.body.style.outline = on ? '3px dashed rgba(255,255,255,.35)' : 'none';
}
export function bootstrapGuardian(){
  const en = document.getElementById('guardian-enable');
  const out = document.getElementById('guardian-outline');
  if (en){ en.checked = localStorage.getItem(LS.guard)==='1'; }
  set(en?.checked || false);
  en?.addEventListener('change', ()=> set(en.checked));
  out?.addEventListener('click', toggleOutline);
  if (localStorage.getItem(LS.outline)==='1'){ document.body.style.outline = '3px dashed rgba(255,255,255,.35)'; }
}
document.addEventListener('DOMContentLoaded', bootstrapGuardian);
