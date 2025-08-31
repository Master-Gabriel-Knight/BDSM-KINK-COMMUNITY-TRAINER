
function show(on){ const o=document.getElementById('debrief-overlay'); if(o) o.style.display=on?'flex':'none'; }
function saveLore(entry){
  try{ const L = JSON.parse(localStorage.getItem('mgd.lore')||'[]'); L.unshift(entry); localStorage.setItem('mgd.lore', JSON.stringify(L)); }catch(e){}
}
function pdf(){
  const highs = document.getElementById('db-highs')?.value||'';
  const edges = document.getElementById('db-edges')?.value||'';
  const care = document.getElementById('db-care')?.value||'';
  const html = `<!doctype html><meta charset="utf-8"><title>MGD Debrief</title>
  <style>body{font-family:serif;padding:24px;max-width:820px;margin:auto}</style>
  <h1>MGD Debrief</h1>
  <h2>What felt safe, warm, or empowering</h2><p>${highs.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p>
  <h2>Edges or needs</h2><p>${edges.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p>
  <h2>Aftercare plan</h2><p>${care.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</p>
  <script>window.onload=()=>window.print()</script>`;
  const w=window.open('about:blank'); w.document.write(html); w.document.close();
}
export function bootstrapDebrief(){
  document.getElementById('db-open')?.addEventListener('click', ()=> show(true));
  document.getElementById('db-close')?.addEventListener('click', ()=> show(false));
  document.getElementById('db-save')?.addEventListener('click', ()=>{
    const entry = { title:'Debrief', time: Date.now(), content: '\nHighs:\n'+(document.getElementById('db-highs')?.value||'')+'\n\nEdges:\n'+(document.getElementById('db-edges')?.value||'')+'\n\nAftercare:\n'+(document.getElementById('db-care')?.value||'') };
    saveLore(entry); alert('Saved to Lore.');
  });
  document.getElementById('db-pdf')?.addEventListener('click', pdf);
  // Auto-open on ritualComplete
  window.addEventListener('mgd:ritualComplete', ()=> show(true));
}
document.addEventListener('DOMContentLoaded', bootstrapDebrief);
