
function loadLore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function saveLore(list){ localStorage.setItem('mgd.lore', JSON.stringify(list)); }
function dedupMerge(oldList, addList){
  const seen = new Set(oldList.map(x=> (x.title||'')+'|'+(x.time||0)));
  addList.forEach(x=>{ const key=(x.title||'')+'|'+(x.time||0); if (!seen.has(key)){ oldList.push(x); seen.add(key); } });
  return oldList.sort((a,b)=> (b.time||0)-(a.time||0));
}
export function bootstrapCommunityPacks(){
  const open=document.getElementById('cp-open'); const box=document.getElementById('community-overlay'); const close=document.getElementById('cp-close');
  open?.addEventListener('click', ()=> box.style.display='flex');
  close?.addEventListener('click', ()=> box.style.display='none');
  document.getElementById('cp-export')?.addEventListener('click', ()=>{
    const script = document.getElementById('script-view')?.textContent||'';
    const lore = loadLore().slice(0, 20); // top 20
    const tags = (lore[0]?.tags)||[];
    const safety = JSON.parse(localStorage.getItem('mgd.lint.rules')||'{}');
    const pack = { kind:'mgd.community', version:1, script, lore, tags, safety };
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(pack,null,2)], {type:'application/json'})); a.download='mgd_community_pack.json'; a.click();
  });
  document.getElementById('cp-import')?.addEventListener('change', (e)=>{
    const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{
      try{
        const obj=JSON.parse(r.result); if (obj.kind!=='mgd.community') return alert('Not a Community Pack.');
        // merge lore; append script as a new lore entry for reference
        if (obj.script){ const L = loadLore(); L.unshift({title:'Community Script', time:Date.now(), content: obj.script, tags:['community']}); saveLore(dedupMerge(L, obj.lore||[])); }
        alert('Community Pack imported. See Lore for the script entry.');
      }catch(e){ alert('Invalid pack.'); }
    }; r.readAsText(f);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCommunityPacks);
