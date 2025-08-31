
let cdTimer=null, endAt=0;
function tick(){
  const s = Math.max(0, Math.floor((endAt - Date.now())/1000));
  const m = Math.floor(s/60), ss = String(s%60).padStart(2,'0');
  const out = `${m}:${ss}`;
  const el = document.getElementById('cd-status'); if (el) el.textContent = s>0? ('Remaining: '+out) : 'Done.';
  if (s<=0) { clearInterval(cdTimer); try{ alert('Timer complete.'); }catch(e){} }
}
export function bootstrapCountdown(){
  const start=document.getElementById('cd-start'); const stop=document.getElementById('cd-stop'); const min=document.getElementById('cd-min');
  start?.addEventListener('click', ()=>{ const mins=parseInt(min?.value||'5',10); endAt = Date.now() + Math.max(1, mins)*60000; clearInterval(cdTimer); cdTimer=setInterval(tick, 500); tick(); });
  stop?.addEventListener('click', ()=>{ clearInterval(cdTimer); const el=document.getElementById('cd-status'); if (el) el.textContent='Stopped.'; });
}
document.addEventListener('DOMContentLoaded', bootstrapCountdown);
