
const LS = { em:'mgd.emergency' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.em)||'{}')}catch(e){return{}} }
function save(x){ localStorage.setItem(LS.em, JSON.stringify(x)); }
function show(on){ const o=document.getElementById('emerg-overlay'); if(o) o.style.display=on?'flex':'none'; }
export function bootstrapEmergency(){
  const d=load(); const n=document.getElementById('em-name'); const c=document.getElementById('em-contact'); const no=document.getElementById('em-notes');
  if (n) n.value=d.name||''; if (c) c.value=d.contact||''; if (no) no.value=d.notes||'';
  document.getElementById('em-save')?.addEventListener('click', ()=>{ save({name:n?.value||'', contact:c?.value||'', notes:no?.value||''}); alert('Saved.'); });
  document.getElementById('em-close')?.addEventListener('click', ()=> show(false));
  window.addEventListener('keydown', (e)=>{ if (e.key==='!' ){ e.preventDefault(); show(true); } });
}
document.addEventListener('DOMContentLoaded', bootstrapEmergency);
