
function card(label, value){
  const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
  d.innerHTML = `<div style="opacity:.8">${label}</div><div style="font-size:22px">${value}</div>`; return d;
}
function heatUsage(){ try{return JSON.parse(localStorage.getItem('mgd.node.usage')||'{}')}catch(e){return{}} }
function lore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function playlist(){ try{return JSON.parse(localStorage.getItem('mgd.playlist')||'[]')}catch(e){return[]} }
function minutesPracticed(){ try{return JSON.parse(localStorage.getItem('mgd.practice.min')||'0') }catch(e){return 0} }
export function bootstrapStats(){
  const grid=document.getElementById('stats-grid'); const ref=document.getElementById('stats-refresh'); const ex=document.getElementById('stats-export');
  function render(){
    if (!grid) return;
    grid.innerHTML='';
    const usage = heatUsage(); const topNode = Object.entries(usage).sort((a,b)=> (b[1]||0)-(a[1]||0))[0]?.[0] || '—';
    grid.appendChild(card('Lore entries', lore().length));
    grid.appendChild(card('Playlist items', playlist().length));
    grid.appendChild(card('Top node', topNode));
    grid.appendChild(card('Practice minutes (self‑logged)', minutesPracticed()));
  }
  function exportCSV(){
    const rows = [['metric','value'], ['lore_entries', String(lore().length)], ['playlist_items', String(playlist().length)], ['top_node', Object.entries(heatUsage()).sort((a,b)=> (b[1]||0)-(a[1]||0))[0]?.[0] || ''], ['practice_minutes', String(minutesPracticed())]];
    const csv = rows.map(r=> r.map(x=> `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download='mgd_stats.csv'; a.click();
  }
  ref?.addEventListener('click', render); ex?.addEventListener('click', exportCSV); render();
}
document.addEventListener('DOMContentLoaded', bootstrapStats);
