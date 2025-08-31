
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }
function itemize(list, title){
  return `<h2>${title}</h2>` + (list && list.length ? list.map(x=> `<p><strong>${esc(x.title||'Untitled')}</strong><br><em>${new Date(x.time||Date.now()).toLocaleString()}</em><br><pre>${esc(x.content||'')}</pre></p>`).join('') : '<p><em>None yet.</em></p>');
}
function getLore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function getRR(){ try{return JSON.parse(localStorage.getItem('mgd.risk.register')||'[]')}catch(e){return[]} }
function getCC(){ try{return JSON.parse(localStorage.getItem('mgd.consent.checklists')||'{}')}catch(e){return{}} }
function ccHTML(bank){
  const decks = Object.keys(bank||{}); if (!decks.length) return '<p><em>No checklist selections.</em></p>';
  return decks.map(d=> `<h3>${d}</h3><ul>` + Object.entries(bank[d]).map(([i,v])=> `<li>Item ${Number(i)+1}: ${esc(v||'')}</li>`).join('') + '</ul>').join('');
}
export function bootstrapWorkshopPack(){
  document.getElementById('wp-export')?.addEventListener('click', ()=>{
    const lore = getLore();
    const html = `<!doctype html><meta charset="utf-8"><title>MGD Workshop Pack</title>
    <style>body{font-family:serif;padding:24px;max-width:820px;margin:auto} .box{border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0} h1,h2,h3{margin:0 0 8px}</style>
    <h1>MGD Workshop Pack</h1>
    <div class="box">${itemize(lore.filter(x=>/Agreement|Ceremony|Scene Journal/i.test(x.title||'')), 'Ceremony & Journal')}</div>
    <div class="box"><h2>Risk Register</h2>${(getRR()||[]).map((it,i)=> `<p><strong>${i+1}.</strong> ${esc(it.risk)}<br><em>Mitigation:</em> ${esc(it.mit)}<br>Likelihood: ${it.like} • Severity: ${it.sev}</p>`).join('')||'<p><em>None yet.</em></p>'}</div>
    <div class="box"><h2>Consent Checklists</h2>${ccHTML(getCC())}</div>
    <div class="box"><h2>Script Snapshot</h2><pre>${esc(document.getElementById('script-view')?.textContent||'')}</pre></div>
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapWorkshopPack);
