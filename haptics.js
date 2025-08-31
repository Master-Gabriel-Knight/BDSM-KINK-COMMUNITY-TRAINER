
function parse(s){ return (String(s||'').split(/\s*,\s*/).map(x=> parseInt(x,10)).filter(n=> !isNaN(n) && n>=0)); }
function vibr(arr){ try{ if (navigator.vibrate) navigator.vibrate(arr); }catch(e){} }
function save(){
  const obj={ g:parse(document.getElementById('hv-g')?.value), y:parse(document.getElementById('hv-y')?.value), r:parse(document.getElementById('hv-r')?.value), c:parse(document.getElementById('hv-c')?.value) };
  localStorage.setItem('mgd.haptics', JSON.stringify(obj)); return obj;
}
function load(){ try{ return JSON.parse(localStorage.getItem('mgd.haptics')||'{}'); }catch(e){ return {}; } }
export function bootstrapHaptics(){
  const S=load(); if (S.g) document.getElementById('hv-g').value=S.g.join(','); if (S.y) document.getElementById('hv-y').value=S.y.join(','); if (S.r) document.getElementById('hv-r').value=S.r.join(','); if (S.c) document.getElementById('hv-c').value=S.c.join(',');
  document.getElementById('hv-save')?.addEventListener('click', ()=>{ save(); alert('Saved.'); });
  document.getElementById('hv-test')?.addEventListener('click', ()=>{ const O=save(); setTimeout(()=> vibr(O.g||[]), 0); setTimeout(()=> vibr(O.y||[]), 600); setTimeout(()=> vibr(O.r||[]), 1400); setTimeout(()=> vibr(O.c||[]), 2400); });
  window.addEventListener('mgd:safetyPulse', e=>{ const O=load(); const v=String(e.detail?.value||''); if (v==='green') vibr(O.g||[]); if (v==='yellow') vibr(O.y||[]); if (v==='red') vibr(O.r||[]); });
  window.addEventListener('mgd:scriptControl', e=>{ const d=e.detail||{}; if (d.type==='consent'){ vibr(load().c||[]); } });
}
document.addEventListener('DOMContentLoaded', bootstrapHaptics);
