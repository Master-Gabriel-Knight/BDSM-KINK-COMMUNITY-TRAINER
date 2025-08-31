
export function bootstrapSyncBroadcast(){
  window.addEventListener('mgd:scriptControl', (e)=>{
    const payload = {type:'script_ctl', value:e.detail||{}};
    try{
      if (window.mgdSync && typeof window.mgdSync.send==='function'){ window.mgdSync.send(payload); return; }
    }catch(err){}
    // Fallback: try to tap into sync.js message bus if exposed
    try{ window.dispatchEvent(new CustomEvent('mgd:syncSend', {detail: payload})); }catch(err){}
  });
}
document.addEventListener('DOMContentLoaded', bootstrapSyncBroadcast);
