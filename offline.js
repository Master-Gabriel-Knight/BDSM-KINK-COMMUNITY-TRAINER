
const SW_PATH = 'sw.js';
function status(t){ const el=document.getElementById('sw-status'); if (el) el.textContent=t; }
export function bootstrapOffline(){
  document.getElementById('sw-install')?.addEventListener('click', async ()=>{
    if (!('serviceWorker' in navigator)) return status('ServiceWorker unsupported.');
    try{ await navigator.serviceWorker.register(SW_PATH); status('Installed. Reload may be required.'); }catch(e){ status('Failed: '+e.message); }
  });
  document.getElementById('sw-update')?.addEventListener('click', async ()=>{
    try{ const reg = await navigator.serviceWorker.getRegistration(); await reg?.update(); status('Update requested.'); }catch(e){ status('Update failed.'); }
  });
  document.getElementById('sw-clear')?.addEventListener('click', async ()=>{
    try{ const reg = await navigator.serviceWorker.getRegistration(); await reg?.unregister(); const keys = await caches.keys(); await Promise.all(keys.map(k=> caches.delete(k))); status('Cleared.'); }catch(e){ status('Clear failed.'); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapOffline);
