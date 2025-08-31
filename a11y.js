
function applyDys(on){
  document.documentElement.style.setProperty('--font', on? 'ui-rounded, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' : '');
  document.documentElement.style.setProperty('--letterspace', on? '0.02em' : '0');
  localStorage.setItem('mgd.a11y.dys', on?'1':'0');
}
function applyContrast(on){
  document.documentElement.style.setProperty('--contrast', on? '1' : '');
  document.body.style.filter = on? 'contrast(1.15) brightness(1.05)' : '';
  localStorage.setItem('mgd.a11y.contrast', on?'1':'0');
}
function announce(text){
  if (localStorage.getItem('mgd.a11y.aria')!=='1') return;
  const live=document.getElementById('a11y-live'); if (live){ live.textContent=''; setTimeout(()=> live.textContent=String(text||''), 10); }
}
export function bootstrapA11y(){
  const dys=document.getElementById('a11y-dys'); const hc=document.getElementById('a11y-contrast'); const ar=document.getElementById('a11y-aria');
  if (localStorage.getItem('mgd.a11y.dys')==='1'){ if(dys) dys.checked=true; applyDys(true); }
  if (localStorage.getItem('mgd.a11y.contrast')==='1'){ if(hc) hc.checked=true; applyContrast(true); }
  if (localStorage.getItem('mgd.a11y.aria')!=='0'){ if(ar) ar.checked=true; localStorage.setItem('mgd.a11y.aria','1'); }
  dys?.addEventListener('change', ()=> applyDys(dys.checked));
  hc?.addEventListener('change', ()=> applyContrast(hc.checked));
  ar?.addEventListener('change', ()=> localStorage.setItem('mgd.a11y.aria', ar.checked?'1':'0'));
  window.addEventListener('mgd:cue', e=> announce('Cue: '+(e.detail||'')));
  window.addEventListener('mgd:phase', e=> announce('Phase: '+(e.detail||'')));
}
document.addEventListener('DOMContentLoaded', bootstrapA11y);
