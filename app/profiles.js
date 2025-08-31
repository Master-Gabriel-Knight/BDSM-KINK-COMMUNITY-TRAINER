
const NS = 'mgd.';
function dump(){ const o={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&k.startsWith(NS)) o[k]=localStorage.getItem(k); } return o; }
function restore(o){ Object.entries(o||{}).forEach(([k,v])=>{ if(k.startsWith(NS)) localStorage.setItem(k,v); }); }
function profileKey(name){ return `mgd.profile.${name}`; }
function saveProfile(name){ const data=dump(); localStorage.setItem(profileKey(name), JSON.stringify(data)); }
function loadProfile(name){ try{ const raw=localStorage.getItem(profileKey(name)); if(!raw) return false; // clear current mgd.*
  const toDel=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k&&k.startsWith(NS) && !k.startsWith('mgd.profile.')) toDel.push(k); } toDel.forEach(k=> localStorage.removeItem(k));
  restore(JSON.parse(raw)); return true; }catch(e){ return false; } }
export function bootstrapProfiles(){
  const name=document.getElementById('pf-name');
  document.getElementById('pf-save')?.addEventListener('click', ()=>{ const n=(name?.value||'').trim(); if(!n) return alert('Name required'); saveProfile(n); alert('Profile saved.'); });
  document.getElementById('pf-load')?.addEventListener('click', ()=>{ const n=(name?.value||'').trim(); if(!n) return; if (loadProfile(n)) alert('Profile loaded. Refresh recommended.'); else alert('Profile not found.'); });
  document.getElementById('pf-delete')?.addEventListener('click', ()=>{ const n=(name?.value||'').trim(); if(!n) return; localStorage.removeItem(profileKey(n)); alert('Profile deleted.'); });
  document.getElementById('pf-export')?.addEventListener('click', ()=>{ const n=(name?.value||'').trim()||'profile'; const blob=new Blob([localStorage.getItem(profileKey(n))||'{}'], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${n}.mgd.profile.json`; a.click(); });
  document.getElementById('pf-import')?.addEventListener('change', (e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const obj=JSON.parse(r.result); const n=(name?.value||'imported'); localStorage.setItem(profileKey(n), JSON.stringify(obj)); alert('Profile imported.'); }catch(e){ alert('Invalid profile file.'); } }; r.readAsText(f); });
}
document.addEventListener('DOMContentLoaded', bootstrapProfiles);
