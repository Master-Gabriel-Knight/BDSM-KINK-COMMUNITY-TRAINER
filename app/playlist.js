
const LS = { pl:'mgd.playlist' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.pl)||'[]')}catch(e){return[]} }
function save(x){ localStorage.setItem(LS.pl, JSON.stringify(x)); }
function render(){
  const list=load(); const ol=document.getElementById('pl-list'); if(!ol) return; ol.innerHTML=''; list.forEach((it,i)=>{ const li=document.createElement('li'); li.textContent = it.name; ol.appendChild(li); });
}
function apply(i){
  const list=load(); const it=list[i]; if(!it) return;
  const view=document.getElementById('script-view'); if (view){ view.textContent = it.content; }
  document.getElementById('script-play')?.click();
}
export function bootstrapPlaylist(){
  const add=document.getElementById('pl-add'); const play=document.getElementById('pl-play'); const nxt=document.getElementById('pl-next'); const clr=document.getElementById('pl-clear'); const name=document.getElementById('pl-name');
  add?.addEventListener('click', ()=>{
    const view=document.getElementById('script-view'); const content=view?.textContent||''; const nm=name?.value||'Untitled';
    if (!content.trim()) return alert('No script in view to add.');
    const list=load(); list.push({name:nm, content}); save(list); render();
  });
  play?.addEventListener('click', ()=> apply(0));
  nxt?.addEventListener('click', ()=>{ const list=load(); list.push(list.shift()); save(list); render(); apply(0); });
  clr?.addEventListener('click', ()=>{ save([]); render(); });
  render();
}
document.addEventListener('DOMContentLoaded', bootstrapPlaylist);
