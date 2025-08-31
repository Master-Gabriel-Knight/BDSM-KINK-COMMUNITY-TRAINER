
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]); }
function getRR(){ try{return JSON.parse(localStorage.getItem('mgd.risk.register')||'[]')}catch(e){return[]} }
function getCC(){ try{return JSON.parse(localStorage.getItem('mgd.consent.checklists')||'{}')}catch(e){return{}} }
function ccHTML(bank){
  const decks = Object.keys(bank||{}); if (!decks.length) return '<p><em>No checklist selections.</em></p>';
  return decks.map(d=> `<h3>${esc(d)}</h3><ul>` + Object.entries(bank[d]).map(([i,v])=> `<li>Item ${Number(i)+1}: ${esc(v||'')}</li>`).join('') + '</ul>').join('');
}
export function bootstrapAftercarePacket(){
  document.getElementById('db-packet')?.addEventListener('click', ()=>{
    const highs = document.getElementById('db-highs')?.value||'';
    const edges = document.getElementById('db-edges')?.value||'';
    const care = document.getElementById('db-care')?.value||'';
    const rr = getRR(); const cc = getCC();
    const html = `<!doctype html><meta charset="utf-8"><title>Aftercare Packet</title>
    <style>body{font-family:serif;padding:24px;max-width:860px;margin:auto} h1,h2,h3{margin:0 0 8px} .box{border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0}</style>
    <h1>Aftercare Packet</h1>
    <div class="box"><h2>Debrief Highlights</h2><p>${esc(highs)}</p><h3>Edges</h3><p>${esc(edges)}</p><h3>Aftercare Plan</h3><p>${esc(care)}</p></div>
    <div class="box"><h2>Consent Checklists (snapshot)</h2>${ccHTML(cc)}</div>
    <div class="box"><h2>Risk Register (snapshot)</h2>${(rr||[]).map((it,i)=> `<p><strong>${i+1}.</strong> ${esc(it.risk)}<br><em>Mitigation:</em> ${esc(it.mit)}<br>Likelihood: ${it.like} • Severity: ${it.sev}</p>`).join('')||'<p><em>None.</em></p>'}</div>
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapAftercarePacket);
