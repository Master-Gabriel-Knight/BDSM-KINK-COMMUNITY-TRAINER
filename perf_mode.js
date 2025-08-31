
function apply(on){
  document.documentElement.style.setProperty('--anim', on? '0s' : '.4s');
  localStorage.setItem('mgd.perf', on?'1':'0');
}
export function bootstrapPerfMode(){
  const box=document.getElementById('perf-toggle'); if(!box) return;
  box.checked = localStorage.getItem('mgd.perf')==='1';
  apply(box.checked);
  box.addEventListener('change', ()=> apply(box.checked));
}
document.addEventListener('DOMContentLoaded', bootstrapPerfMode);
