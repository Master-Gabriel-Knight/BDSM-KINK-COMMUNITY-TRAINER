
const KEYS = ['mgd.lint.rules','mgd.consent.checklists','mgd.risk.register','mgd.resources','mgd.safeword.patterns','mgd.playlist'];
function collect(){ const obj={}; KEYS.forEach(k=>{ const v=localStorage.getItem(k); if (v!=null) obj[k]=v; }); return obj; }
function apply(obj){ Object.entries(obj||{}).forEach(([k,v])=>{ if (KEYS.includes(k)) localStorage.setItem(k, v); }); }
function show(on){ const o=document.getElementById('packs-overlay'); if (o) o.style.display=on?'flex':'none'; }
export function bootstrapFacilitatorPacks(){
  document.getElementById('fp-open')?.addEventListener('click', ()=> show(true));
  document.getElementById('fp-close')?.addEventListener('click', ()=> show(false));
  document.getElementById('fp-export')?.addEventListener('click', ()=>{ const blob=new Blob([JSON.stringify(collect(),null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_facilitator_pack.json'; a.click(); });
  document.getElementById('fp-import')?.addEventListener('change', (e)=>{
    const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); apply(obj); alert('Pack imported.'); }catch(e){ alert('Invalid pack.'); } }; r.readAsText(f);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapFacilitatorPacks);
