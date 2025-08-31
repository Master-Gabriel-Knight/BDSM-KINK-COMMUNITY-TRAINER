
const LS = { ver:'mgd.script.versions' };
function list(){ try{return JSON.parse(localStorage.getItem(LS.ver)||'[]')}catch(e){return[]} }
function saveList(x){ localStorage.setItem(LS.ver, JSON.stringify(x)); }
function add(){ const text=document.getElementById('script-view')?.textContent||''; const L=list(); L.unshift({time:Date.now(), text}); saveList(L); alert('Version saved.'); }
function fmt(t){ const d=new Date(t); return d.toLocaleString(); }
function fillSelect(sel, L){ sel.innerHTML=''; L.forEach((v,i)=>{ const o=document.createElement('option'); o.value=String(i); o.textContent = '#'+(L.length-i)+' — '+fmt(v.time); sel.appendChild(o); }); sel.selectedIndex = 0; }
function diff(a, b){ // naive line diff
  const A=(a||'').split('\n'), B=(b||'').split('\n'); let out='';
  let i=0,j=0; while (i<A.length || j<B.length){
    if (i<A.length && j<B.length && A[i]===B[j]){ out += A[i]+'\n'; i++; j++; }
    else if (j<B.length && !A.includes(B[j])){ out += '+ '+B[j]+'\n'; j++; }
    else { out += '- '+(A[i]||'')+'\n'; i++; }
  }
  return out;
}
export function bootstrapVersions(){
  const btnSave=document.getElementById('ver-save'); const btnManage=document.getElementById('ver-manage');
  const box=document.getElementById('ver-overlay'); const listBox=document.getElementById('ver-list');
  const left=document.getElementById('ver-left'); const right=document.getElementById('ver-right'); const view=document.getElementById('ver-view');
  const goDiff=document.getElementById('ver-diff'); const restore=document.getElementById('ver-restore'); const close=document.getElementById('ver-close');
  btnSave?.addEventListener('click', add);
  btnManage?.addEventListener('click', ()=>{
    const L=list(); box.style.display='flex';
    listBox.textContent = L.map((v,i)=> '['+fmt(v.time)+'] '+(v.text.slice(0,80)) ).join('\n');
    fillSelect(left, L); fillSelect(right, L);
  });
  goDiff?.addEventListener('click', ()=>{
    const L=list(); const a=L[parseInt(left.value||'0',10)]?.text||''; const b=L[parseInt(right.value||'0',10)]?.text||'';
    view.textContent = diff(a,b);
  });
  restore?.addEventListener('click', ()=>{
    const L=list(); const b=L[parseInt(right.value||'0',10)]?.text||''; const v=document.getElementById('script-view'); if(v){ v.textContent=b; alert('Restored to selected version.'); }
  });
  close?.addEventListener('click', ()=> box.style.display='none');
}
document.addEventListener('DOMContentLoaded', bootstrapVersions);
