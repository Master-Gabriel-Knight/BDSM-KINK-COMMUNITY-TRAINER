
function loadLore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function saveLore(list){ localStorage.setItem('mgd.lore', JSON.stringify(list)); }
function render(list){
  const mount=document.getElementById('v-results'); if(!mount) return; mount.innerHTML='';
  list.forEach(x=>{
    const div=document.createElement('div'); div.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25);margin-bottom:6px';
    const tags = (x.tags||[]).map(t=> `<span style="font-size:12px;border:1px solid rgba(255,255,255,.25);border-radius:8px;padding:2px 6px;margin-left:6px;opacity:.85">${t}</span>`).join('');
    div.innerHTML = `<strong>${x.title||'Untitled'}</strong> <span style="opacity:.7">${new Date(x.time||Date.now()).toLocaleString()}</span> ${tags}<pre style="white-space:pre-wrap;margin:6px 0 0">${x.content||''}</pre>`;
    mount.appendChild(div);
  });
}
export function bootstrapVault(){
  const q=document.getElementById('v-q'); const tag=document.getElementById('v-tag'); const add=document.getElementById('v-addtag');
  function search(){ const term=(q?.value||'').toLowerCase().trim(); const all=loadLore(); const res = term? all.filter(x => (x.title||'').toLowerCase().includes(term) || (x.content||'').toLowerCase().includes(term) || (x.tags||[]).join(',').toLowerCase().includes(term)) : all.slice(0,10); render(res); }
  q?.addEventListener('input', search); search();
  add?.addEventListener('click', ()=>{ const t=(tag?.value||'').trim(); if(!t) return; const all=loadLore(); if(!all.length) return alert('No lore entries yet.'); all[0].tags = Array.from(new Set([...(all[0].tags||[]), t])); saveLore(all); search(); tag.value=''; });
}
document.addEventListener('DOMContentLoaded', bootstrapVault);
