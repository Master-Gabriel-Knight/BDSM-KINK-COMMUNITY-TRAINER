
function loadLore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function saveLore(list){ localStorage.setItem('mgd.lore', JSON.stringify(list)); }
function dedupMerge(oldList, addList){
  const seen = new Set(oldList.map(x=> (x.title||'')+'|'+(x.time||0)));
  addList.forEach(x=>{ const key=(x.title||'')+'|'+(x.time||0); if (!seen.has(key)){ oldList.push(x); seen.add(key); } });
  return oldList.sort((a,b)=> (b.time||0)-(a.time||0));
}
export function bootstrapVaultIO(){
  document.getElementById('vault-export')?.addEventListener('click', ()=>{
    const blob=new Blob([JSON.stringify(loadLore(),null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_vault.json'; a.click();
  });
  document.getElementById('vault-import')?.addEventListener('change', (e)=>{
    const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const add=JSON.parse(r.result)||[]; const merged = dedupMerge(loadLore(), add); saveLore(merged); alert('Vault merged.'); }catch(e){ alert('Invalid vault file.'); } }; r.readAsText(f);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapVaultIO);
