
function vibrate(pattern){ try{ navigator.vibrate && navigator.vibrate(pattern);}catch(e){} }
let PATTERNS = { green:[100,40,100], yellow:[200,70,200,70,200], red:[600,80,600,80,600] };
  try{ const u=JSON.parse(localStorage.getItem('mgd.safeword.patterns')||'{}'); PATTERNS = {...PATTERNS, ...u}; }catch(e){}
export function bootstrapSafeword(){
  const open=document.getElementById('sw-test-open'); const box=document.getElementById('safeword-tester'); const close=document.getElementById('sw-close');
  open?.addEventListener('click', ()=> box.style.display='flex');
  close?.addEventListener('click', ()=> box.style.display='none');
  box?.querySelectorAll('button[data-sw]').forEach(b => b.addEventListener('click', ()=> vibrate(PATTERNS[b.dataset.sw])));
}
document.addEventListener('DOMContentLoaded', bootstrapSafeword);
