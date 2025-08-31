
function key(n){ return 'mgd.profile.'+n; }
export function bootstrapProfileSwitcher(){
  const name=document.getElementById('ps-name'); const load=document.getElementById('ps-load'); const save=document.getElementById('ps-save');
  function dump(){ const o={}; for (let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if (k && k.startsWith('mgd.')) o[k]=localStorage.getItem(k); } return o; }
  load?.addEventListener('click', ()=>{ const n=(name?.value||'').trim(); if(!n) return; const raw=localStorage.getItem(key(n)); if(!raw) return alert('No profile '+n); const cur=dump(); // backup current
    localStorage.setItem('mgd.profile.__last', JSON.stringify(cur)); Object.keys(cur).forEach(k=>{ if(!k.startsWith('mgd.profile.')) localStorage.removeItem(k); }); const obj=JSON.parse(raw); Object.entries(obj).forEach(([k,v])=> localStorage.setItem(k,v)); alert('Loaded '+n+'. Refresh recommended.'); });
  save?.addEventListener('click', ()=>{ const n=(name?.value||'').trim(); if(!n) return alert('Name required'); const d=dump(); localStorage.setItem(key(n), JSON.stringify(d)); alert('Saved '+n); });
}
document.addEventListener('DOMContentLoaded', bootstrapProfileSwitcher);
