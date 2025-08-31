
function printable(obj){
  const esc = s => (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
  return `<!doctype html><meta charset="utf-8"><title>Intimacy Agreement</title>
  <style>body{font-family:serif;padding:24px} h1{margin:0 0 10px}.box{border:1px solid #333;padding:12px;border-radius:8px;margin:10px 0}</style>
  <h1>Intimacy Agreement</h1>
  <div class="box"><strong>Parties:</strong> ${esc(obj.parties)}</div>
  <div class="box"><strong>Roles:</strong> ${esc(obj.roles)}</div>
  <div class="box"><strong>Safewords:</strong> ${esc(obj.safewords)}</div>
  <div class="box"><strong>Limits & Boundaries:</strong><br>${esc(obj.limits)}</div>
  <div class="box"><strong>Desires & Curiosities:</strong><br>${esc(obj.desires)}</div>
  <div class="box"><strong>Aftercare Plan:</strong><br>${esc(obj.aftercare)}</div>
  <script>window.onload=()=>window.print()</script>`;
}
export function bootstrapAgreements(){
  const saveBtn = document.getElementById('ag-save');
  const printBtn = document.getElementById('ag-print');
  function build(){
    return {
      parties: document.getElementById('ag-parties')?.value||'',
      roles: document.getElementById('ag-roles')?.value||'',
      safewords: document.getElementById('ag-safewords')?.value||'Green/Yellow/Red',
      limits: document.getElementById('ag-limits')?.value||'',
      desires: document.getElementById('ag-desires')?.value||'',
      aftercare: document.getElementById('ag-aftercare')?.value||''
    };
  }
  saveBtn?.addEventListener('click', ()=>{
    const obj = build();
    const list = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
    list.unshift({ id: crypto.randomUUID(), time: new Date().toISOString(), title:'Agreement', content: JSON.stringify(obj, null, 2) });
    localStorage.setItem('mgd.lore', JSON.stringify(list));
    alert('Agreement saved to Lore.');
  });
  printBtn?.addEventListener('click', ()=>{
    const w = window.open('about:blank'); w.document.write(printable(build())); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapAgreements);
