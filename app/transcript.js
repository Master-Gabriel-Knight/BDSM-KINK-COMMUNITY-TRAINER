
const LS = { tr:'mgd.transcript' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.tr)||'[]')}catch(e){return[]} }
function save(x){ localStorage.setItem(LS.tr, JSON.stringify(x)); }
function push(line){ const list=load(); list.push({t:Date.now(), line}); save(list); }
function fmt(t){ const d=new Date(t); const hh=String(d.getHours()).padStart(2,'0'); const mm=String(d.getMinutes()).padStart(2,'0'); const ss=String(d.getSeconds()).padStart(2,'0'); return `${hh}:${mm}:${ss}`; }
function render(){ const v=document.getElementById('tr-view'); if(!v) return; v.textContent = load().map(x=> `[${fmt(x.t)}] ${x.line}`).join('\n'); }
export function bootstrapTranscript(){
  document.getElementById('tr-refresh')?.addEventListener('click', render);
  document.getElementById('tr-clear')?.addEventListener('click', ()=>{ save([]); render(); });
  document.getElementById('tr-export')?.addEventListener('click', ()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([document.getElementById('tr-view').textContent||''],{type:'text/plain'})); a.download='mgd_transcript.txt'; a.click(); });
  window.addEventListener('mgd:phase', e=> push('Phase: '+e.detail));
  window.addEventListener('mgd:cue', e=> push('Cue: '+e.detail));
  window.addEventListener('mgd:scriptStep', e=> push('Step: '+(e.detail?.say||e.detail?.decree||'')));
  render();
}
document.addEventListener('DOMContentLoaded', bootstrapTranscript);
