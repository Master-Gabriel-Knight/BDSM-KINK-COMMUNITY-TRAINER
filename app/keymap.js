
const LS = { km:'mgd.keymap' };
const DEFAULTS = { breath:'b', kink:'m', guardian:'g', panic:'p', palette:'cmd+k' };
function save(map){ localStorage.setItem(LS.km, JSON.stringify(map)); }
function load(){ try{ return JSON.parse(localStorage.getItem(LS.km)||'{}'); }catch(e){ return {}; } }
function norm(s){ return (s||'').toLowerCase().replace(/\s+/g,''); }
function match(e, combo){
  const c = norm(combo);
  if (c==='cmd+k' || c==='ctrl+k'){ return (e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='k'; }
  return !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase()===c;
}
function run(action){
  if (action==='breath') document.getElementById('breath-start')?.click();
  if (action==='kink'){ const x=document.getElementById('kink-enabled'); if (x){ x.checked=!x.checked; x.dispatchEvent(new Event('change')); } }
  if (action==='guardian'){ const x=document.getElementById('guardian-enable'); if (x){ x.checked=!x.checked; x.dispatchEvent(new Event('change')); } }
  if (action==='panic') document.getElementById('panic-stop')?.click();
  if (action==='palette'){ const i=document.getElementById('cmd-input'); if(i){ const o=document.getElementById('cmd-overlay'); o.style.display='block'; i.focus(); } }
}
export function bootstrapKeymap(){
  const saved = {...DEFAULTS, ...load()};
  document.querySelectorAll('input.km').forEach(inp=>{
    const act = inp.dataset.act; inp.value = saved[act];
  });
  document.getElementById('km-save')?.addEventListener('click', ()=>{
    const map={}; document.querySelectorAll('input.km').forEach(inp=> map[inp.dataset.act]=inp.value);
    save(map); alert('Keymap saved.');
  });
  window.addEventListener('keydown', (e)=>{
    const map = {...DEFAULTS, ...load()};
    for (const [act, combo] of Object.entries(map)){ if (match(e, combo)){ e.preventDefault(); run(act); break; } }
  }, true);
}
document.addEventListener('DOMContentLoaded', bootstrapKeymap);
