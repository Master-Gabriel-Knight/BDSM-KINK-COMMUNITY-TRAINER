
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]); }
function format(text){
  const lines = (text||'').split(/\n/);
  return lines.map(s=>{
    if (/^\s*decree:/i.test(s)) return '<h2>'+esc(s.replace(/\s*decree:/i,'').trim())+'</h2>';
    if (/^\s*say:/i.test(s)) return '<p><strong>'+esc(s.replace(/\s*say:/i,'').trim())+'</strong></p>';
    if (/wait\s*[:=]/i.test(s)) return '<p style="opacity:.8">'+esc(s)+'</p>';
    return '<p>'+esc(s)+'</p>';
  }).join('');
}
export function bootstrapFacilitatorPrint(){
  document.getElementById('fac-print')?.addEventListener('click', ()=>{
    const html = `<!doctype html><meta charset="utf-8"><title>Facilitator Script</title>
    <style>body{font-family:serif;padding:24px;max-width:860px;margin:auto} h2{font-size:28px;margin:18px 0 8px} p{font-size:20px;line-height:1.5}</style>
    ${format(document.getElementById('script-view')?.textContent||'')}
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapFacilitatorPrint);
