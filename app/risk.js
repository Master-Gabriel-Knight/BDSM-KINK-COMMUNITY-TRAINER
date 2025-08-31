
const LS = { rr:'mgd.risk.register' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.rr)||'[]')}catch(e){return[]} }
function save(list){ localStorage.setItem(LS.rr, JSON.stringify(list)); }
function row(item, i){
  const risk = (item.like||1)*(item.sev||1);
  const level = risk>=16?'High':risk>=9?'Medium':'Low';
  return `<div class="row" style="gap:8px;align-items:center;border-bottom:1px dashed rgba(255,255,255,.15);padding:6px 0">
    <strong>#${i+1}</strong><span>${item.risk}</span>
    <em style="opacity:.8">→ ${item.mit}</em>
    <span> L:${item.like} S:${item.sev} </span>
    <span style="padding:2px 6px;border-radius:6px;background:${level==='High'?'#712':'#264'}">${level}</span>
  </div>`;
}
function render(){
  const list = load();
  const tbl = document.getElementById('rr-table'); if(!tbl) return;
  tbl.innerHTML = list.map(row).join('') || '<p style="opacity:.8">No items yet.</p>';
}
export function bootstrapRisk(){
  const add = document.getElementById('rr-add');
  const saveBtn = document.getElementById('rr-save');
  const pdfBtn = document.getElementById('rr-pdf');
  add?.addEventListener('click', ()=>{
    const item = {
      risk: document.getElementById('rr-risk')?.value||'',
      mit: document.getElementById('rr-mit')?.value||'',
      like: parseInt(document.getElementById('rr-like')?.value||'1',10),
      sev: parseInt(document.getElementById('rr-sev')?.value||'1',10)
    };
    const list = load(); list.push(item); save(list); render();
  });
  saveBtn?.addEventListener('click', ()=>{ alert('Saved locally.'); });
  pdfBtn?.addEventListener('click', ()=>{
    const list = load();
    const html = `<!doctype html><meta charset="utf-8"><title>Risk Register</title>
    <style>body{font-family:serif;padding:24px}</style>
    <h1>Risk Register</h1>
    ${list.map((it,i)=>`<p><strong>${i+1}.</strong> ${it.risk}<br><em>Mitigation:</em> ${it.mit}<br>Likelihood: ${it.like} • Severity: ${it.sev}</p>`).join('')}
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
  render();
}
document.addEventListener('DOMContentLoaded', bootstrapRisk);
