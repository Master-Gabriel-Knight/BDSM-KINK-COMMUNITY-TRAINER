
function collect(){
  const dump = {}; for (let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if (k && k.startsWith('mgd.')) dump[k]=localStorage.getItem(k); }
  return dump;
}
function restore(obj){
  Object.entries(obj||{}).forEach(([k,v])=>{ if (k.startsWith('mgd.')) localStorage.setItem(k,v); });
}
export function bootstrapBackup(){
  document.getElementById('bk-export')?.addEventListener('click', ()=>{
    const blob=new Blob([JSON.stringify(collect(),null,2)], {type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_backup.json'; a.click();
  });
  document.getElementById('bk-import')?.addEventListener('change', (e)=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); restore(obj); alert('Backup imported. Refresh recommended.'); }catch(e){ alert('Invalid backup file.'); } };
    r.readAsText(f);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapBackup);
