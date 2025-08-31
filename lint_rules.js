
const LS = { rules:'mgd.lint.rules' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.rules)||'{"require":["aftercare","safeword"],"warn":["forever"],"maxWaitMin":10,"requireBreath":true}')}catch(e){return {"require":["aftercare","safeword"],"warn":["forever"],"maxWaitMin":10,"requireBreath":true}} }
function save(x){ localStorage.setItem(LS.rules, JSON.stringify(x)); }
export function bootstrapLintRules(){
  const open=document.getElementById('lr-open'); const box=document.getElementById('lint-rules-overlay'); const close=document.getElementById('lr-close'); const sbtn=document.getElementById('lr-save');
  function fill(){ const r=load(); document.getElementById('lr-require').value=(r.require||[]).join(','); document.getElementById('lr-warn').value=(r.warn||[]).join(','); document.getElementById('lr-maxwait').value=String(r.maxWaitMin||10); document.getElementById('lr-breath').checked=!!r.requireBreath; }
  open?.addEventListener('click', ()=>{ fill(); box.style.display='flex'; });
  close?.addEventListener('click', ()=> box.style.display='none');
  sbtn?.addEventListener('click', ()=>{ const r={ require:(document.getElementById('lr-require').value||'').split(',').map(s=>s.trim()).filter(Boolean), warn:(document.getElementById('lr-warn').value||'').split(',').map(s=>s.trim()).filter(Boolean), maxWaitMin: parseInt(document.getElementById('lr-maxwait').value||'10',10), requireBreath: document.getElementById('lr-breath').checked }; save(r); alert('Rules saved.'); });
}
document.addEventListener('DOMContentLoaded', bootstrapLintRules);
