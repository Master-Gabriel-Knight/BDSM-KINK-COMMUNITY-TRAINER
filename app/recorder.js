
let running=false, logs=[];
function log(type, data){ if(!running) return; logs.push({ts:new Date().toISOString(), type, data}); const pre=document.getElementById('rec-log'); if(pre){ pre.textContent = logs.map(l=> `[${l.ts}] ${l.type}: ${JSON.stringify(l.data)}`).join('\n'); } }
export function bootstrapRecorder(){
  document.getElementById('rec-start')?.addEventListener('click', ()=>{ running=true; logs=[]; log('start', {}); });
  document.getElementById('rec-stop')?.addEventListener('click', ()=>{ log('stop', {}); running=false; });
  document.getElementById('rec-export')?.addEventListener('click', ()=>{ const blob=new Blob([JSON.stringify(logs,null,2)], {type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_session.json'; a.click(); });
  window.addEventListener('mgd:cue', e=> log('cue', e.detail));
  window.addEventListener('mgd:scriptStep', e=> log('scriptStep', e.detail));
  window.addEventListener('mgd:thermo', e=> log('thermo', e.detail));
  window.addEventListener('mgd:panic', ()=> log('panic', {}));
}
document.addEventListener('DOMContentLoaded', bootstrapRecorder);
