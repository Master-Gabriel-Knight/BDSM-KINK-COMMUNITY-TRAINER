
const LS = { ac: 'mgd.aftercare' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.ac)||'{}')}catch(e){return {enabled:true,sched:'10,20,40',notify:false}}}
function save(x){ localStorage.setItem(LS.ac, JSON.stringify(x)); }
function notify(msg){
  if (!('Notification' in window)) return alert(msg);
  if (Notification.permission === 'granted'){ new Notification(msg); }
  else if (Notification.permission !== 'denied'){
    Notification.requestPermission().then(p => { if (p==='granted') new Notification(msg); else alert(msg); });
  } else { alert(msg); }
}
function scheduleCheckIns(){
  const cfg = load();
  if (!cfg.enabled) return;
  const mins = (cfg.sched||'').split(',').map(s=>parseInt(s.trim(),10)||0).filter(n=>n>0);
  mins.forEach(m => setTimeout(()=> notify(`Aftercare check‑in (${m} min): water? food? cuddle?`), m*60*1000));
}
export function bootstrapAftercare(){
  const cfg = load();
  const en = document.getElementById('ac-enabled'); const sch = document.getElementById('ac-schedule'); const nt = document.getElementById('ac-notify');
  if (en) en.checked = cfg.enabled!==false;
  if (sch) sch.value = cfg.sched||'10,20,40';
  if (nt) nt.checked = !!cfg.notify;
  en?.addEventListener('change', ()=>{ cfg.enabled=en.checked; save(cfg); });
  sch?.addEventListener('input', ()=>{ cfg.sched=sch.value; save(cfg); });
  nt?.addEventListener('change', ()=>{ cfg.notify=nt.checked; if (nt.checked) Notification.requestPermission(); save(cfg); });
  document.getElementById('ac-test')?.addEventListener('click', scheduleCheckIns);
  // Hooks
  window.addEventListener('mgd:ritualComplete', scheduleCheckIns);
  window.addEventListener('mgd:nodeComplete', scheduleCheckIns);
}
document.addEventListener('DOMContentLoaded', bootstrapAftercare);
