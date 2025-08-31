
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m])); }
function build(){
  const compass = localStorage.getItem('mgd.eros.compass')||'{}';
  const agreements = (JSON.parse(localStorage.getItem('mgd.lore')||'[]').find(x=>x.title==='Agreement')||{}).content||'';
  const script = document.getElementById('script-view')?.textContent||'';
  const journal = (JSON.parse(localStorage.getItem('mgd.lore')||'[]').find(x=>x.title==='Scene Journal')||{}).content||'';
  return {compass, agreements, script, journal};
}
export function bootstrapCeremonyCard(){
  document.getElementById('ceremony-card')?.addEventListener('click', ()=>{
    const d = build();
    const html = `<!doctype html><meta charset="utf-8"><title>Ceremony Card</title>
    <style>body{font-family:serif;padding:24px} h1{margin:0 0 10px}.box{border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0;white-space:pre-wrap}</style>
    <h1>Ceremony Card</h1>
    <div class="box"><strong>Eros Compass</strong><br><code>${esc(d.compass)}</code></div>
    <div class="box"><strong>Agreements</strong><br>${esc(d.agreements)}</div>
    <div class="box"><strong>Script</strong><br>${esc(d.script)}</div>
    <div class="box"><strong>Journal</strong><br>${esc(d.journal)}</div>
    <script>window.onload=()=>window.print()</script>`;
    const w = window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCeremonyCard);
