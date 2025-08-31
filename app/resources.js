
const LS = { res:'mgd.resources' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.res)||'[]')}catch(e){return[]} }
function save(list){ localStorage.setItem(LS.res, JSON.stringify(list)); }
function render(){
  const list = load(); const mount=document.getElementById('res-list'); if(!mount) return; mount.innerHTML='';
  list.forEach((x,i)=>{ const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25);margin-bottom:6px'; d.innerHTML=`<strong>${x.name}</strong><div>${x.note}</div>`; mount.appendChild(d); });
}
export function bootstrapResources(){
  document.getElementById('res-add')?.addEventListener('click', ()=>{ const name=document.getElementById('res-name')?.value||''; const note=document.getElementById('res-note')?.value||''; if(!name) return; const list=load(); list.unshift({name, note}); save(list); render(); });
  document.getElementById('res-export')?.addEventListener('click', ()=>{ const blob=new Blob([JSON.stringify(load(),null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_resources.json'; a.click(); });
  render();
}
document.addEventListener('DOMContentLoaded', bootstrapResources);
