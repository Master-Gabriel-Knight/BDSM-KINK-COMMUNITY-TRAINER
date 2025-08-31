
function pad(n){ return (n<10?'0':'')+n; }
function toICSDate(dt){
  const d = new Date(dt);
  const y=d.getFullYear(), m=pad(d.getMonth()+1), da=pad(d.getDate()), h=pad(d.getHours()), mi=pad(d.getMinutes());
  return `${y}${m}${da}T${h}${mi}00`;
}
function makeEvent(title, start, mins, desc){
  return `BEGIN:VEVENT\nUID:${Date.now()}-${Math.random().toString(36).slice(2)}@mgd\nDTSTAMP:${toICSDate(new Date())}\nDTSTART:${toICSDate(start)}\nDTEND:${toICSDate(new Date(start.getTime()+mins*60000))}\nSUMMARY:${title}\nDESCRIPTION:${desc}\nEND:VEVENT`;
}
export function bootstrapPlaylistICS(){
  document.getElementById('pl-export-ics')?.addEventListener('click', ()=>{
    try{
      const list = JSON.parse(localStorage.getItem('mgd.playlist')||'[]'); if (!list.length) return alert('Playlist is empty.');
      let t = new Date(); const events = [];
      list.forEach((it,i)=>{ const mins = 5; events.push(makeEvent(it.name||('Item '+(i+1)), t, mins, 'MGD Ritual Playlist')); t = new Date(t.getTime()+mins*60000); });
      const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MGD//Ritual Playlist//EN\n${events.join('\n')}\nEND:VCALENDAR`;
      const blob = new Blob([ics], {type:'text/calendar'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='mgd_playlist.ics'; a.click();
    }catch(e){ alert('Could not export ICS.'); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPlaylistICS);
