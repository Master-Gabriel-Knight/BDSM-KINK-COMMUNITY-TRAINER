
let deferred = null;
export function bootstrapPWA(){
  if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(()=>{
      const el=document.getElementById('pwa-status'); if (el) el.textContent='Service worker registered for offline use.';
    }).catch(()=>{});
  }
  window.addEventListener('beforeinstallprompt', (e)=>{ e.preventDefault(); deferred = e; const st=document.getElementById('pwa-status'); if(st) st.textContent='App can be installed.'; });
  document.getElementById('pwa-install')?.addEventListener('click', async ()=>{ if (deferred){ deferred.prompt(); deferred = null; } else { alert('Install prompt not available yet.'); } });
}
document.addEventListener('DOMContentLoaded', bootstrapPWA);
