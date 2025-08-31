
export function bootstrapEphemeral(){
  const box=document.getElementById('ephemeral-toggle'); if (!box) return;
  if (localStorage.getItem('mgd.ephemeral')==='1') box.checked=true;
  box.addEventListener('change', ()=>{ localStorage.setItem('mgd.ephemeral', box.checked?'1':''); });
  window.addEventListener('beforeunload', ()=>{ if (localStorage.getItem('mgd.ephemeral')==='1'){ try{ const keys=[]; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if (k && k.startsWith('mgd.')) keys.push(k); } keys.forEach(k=> localStorage.removeItem(k)); }catch(e){} } });
}
document.addEventListener('DOMContentLoaded', bootstrapEphemeral);
