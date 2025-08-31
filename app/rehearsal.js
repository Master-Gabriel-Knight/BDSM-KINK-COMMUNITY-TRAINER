
const LS = { rr:'mgd.rehearsal' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.rr)||'[]')}catch(e){return[]} }
function save(x){ localStorage.setItem(LS.rr, JSON.stringify(x)); }
function render(){
  const list=load(); const ol=document.getElementById('rr-list'); if(!ol) return; ol.innerHTML=''; list.forEach((it,i)=>{ const li=document.createElement('li'); li.textContent = `${it.name||('Item '+(i+1))} — ${it.min||5} min`; ol.appendChild(li); });
}
let idx=0, endAt=0, timer=null;
function status(txt){ const el=document.getElementById('rr-status'); if (el) el.textContent = txt; }
function tick(){
  const s = Math.max(0, Math.floor((endAt - Date.now())/1000));
  const m = Math.floor(s/60), ss = String(s%60).padStart(2,'0');
  const list=load(); const cur=list[idx];
  status(cur ? `Now: ${cur.name} — ${m}:${ss}` : 'Complete.');
  if (s<=0){ next(); }
}
function start(){ const list=load(); idx=0; if(!list.length) return status('Add items to start.'); endAt = Date.now() + (list[0].min||5)*60000; clearInterval(timer); timer=setInterval(tick, 500); tick(); }
function next(){ const list=load(); if (++idx>=list.length){ clearInterval(timer); status('Complete.'); return; } endAt = Date.now() + (list[idx].min||5)*60000; }
function add(){
  const name = document.getElementById('rr-name')?.value || 'Untitled';
  const min = parseInt(document.getElementById('rr-min')?.value||'5',10);
  const script = document.getElementById('script-view')?.textContent||'';
  const list=load(); list.push({name, min, script}); save(list); render();
}
function clearAll(){ save([]); render(); status('Idle.'); }
function toICSDate(dt){ const d=new Date(dt); const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), da=String(d.getDate()).padStart(2,'0'), h=String(d.getHours()).padStart(2,'0'), mi=String(d.getMinutes()).padStart(2,'0'); return `${y}${m}${da}T${h}${mi}00`; }
function exportICS(){ const list=load(); if(!list.length) return alert('Empty run.'); let t=new Date(); const ev=list.map((it,i)=> `BEGIN:VEVENT\nUID:${Date.now()}-${i}@mgd\nDTSTAMP:${toICSDate(new Date())}\nDTSTART:${toICSDate(t)}\nDTEND:${toICSDate(new Date(t.getTime()+(it.min||5)*60000))}\nSUMMARY:${it.name||('Item '+(i+1))}\nDESCRIPTION:MGD Rehearsal\nEND:VEVENT`); const ics=`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MGD//Rehearsal//EN\n${ev.join('\n')}\nEND:VCALENDAR`; const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'})); a.download='mgd_rehearsal.ics'; a.click(); }
export function bootstrapRehearsal(){
  document.getElementById('rr-add')?.addEventListener('click', add);
  document.getElementById('rr-start')?.addEventListener('click', start);
  document.getElementById('rr-next')?.addEventListener('click', next);
  document.getElementById('rr-clear')?.addEventListener('click', clearAll);
  document.getElementById('rr-ics')?.addEventListener('click', exportICS);
  render(); status('Idle.');
}
document.addEventListener('DOMContentLoaded', bootstrapRehearsal);
