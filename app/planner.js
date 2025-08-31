
function pad(n){ return (n<10?'0':'')+n; }
function toICSDate(dt){
  const d = new Date(dt);
  const y=d.getFullYear(), m=pad(d.getMonth()+1), da=pad(d.getDate()), h=pad(d.getHours()), mi=pad(d.getMinutes());
  return `${y}${m}${da}T${h}${mi}00`;
}
function makeICS(title, start, mins, desc){
  const dtstart = toICSDate(start);
  const end = new Date(new Date(start).getTime() + mins*60000);
  const dtend = toICSDate(end);
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MGD//Workshop//EN\nBEGIN:VEVENT\nUID:${Date.now()}@mgd\nDTSTAMP:${toICSDate(new Date())}\nDTSTART:${dtstart}\nDTEND:${dtend}\nSUMMARY:${title}\nDESCRIPTION:${desc.replace(/\n/g,'\\n')}\nEND:VEVENT\nEND:VCALENDAR`;
}
export function bootstrapPlanner(){
  const btn = document.getElementById('pl-export');
  btn?.addEventListener('click', ()=>{
    const title = document.getElementById('pl-title')?.value||'MGD Ritual';
    const start = document.getElementById('pl-start')?.value||new Date().toISOString().slice(0,16).replace('T',' ');
    const mins = parseInt(document.getElementById('pl-dur')?.value||'45',10);
    const script = document.getElementById('pl-script')?.value||'';
    const desc = script ? ('Script: '+script) : 'Spiral practice';
    const ics = makeICS(title, start, mins, desc);
    const blob = new Blob([ics], {type:'text/calendar'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_workshop.ics'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPlanner);
