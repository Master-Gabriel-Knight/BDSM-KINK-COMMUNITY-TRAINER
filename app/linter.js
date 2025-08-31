
function out(msg, level='info'){
  const el=document.getElementById('lint-out'); if(!el) return;
  const div=document.createElement('div'); div.style.cssText='margin:4px 0;padding:6px;border-radius:8px;background:'+(level==='warn'?'#402':'#133');
  div.innerHTML = '<strong>'+level.toUpperCase()+':</strong> '+msg; el.appendChild(div);
}
function clear(){ const el=document.getElementById('lint-out'); if (el) el.innerHTML=''; }
function lint(text){
  const rules = JSON.parse(localStorage.getItem('mgd.lint.rules')||'{}');
  clear();
  const t = (text||'').toLowerCase();
  if ((rules.require||['aftercare','safeword']).some(k=>k.toLowerCase().includes('aftercare')) && !/aftercare/.test(t)) out('No explicit aftercare step mentioned. Consider adding a closing care block.', 'warn');
  if ((rules.require||['aftercare','safeword']).some(k=>k.toLowerCase().includes('safeword')) && !/(safeword|green|yellow|red)/.test(t)) out('No safeword or traffic-light check referenced.', 'warn');
  const waits = [...t.matchAll(/wait\s*[:=]?\s*(\d+)(ms|s|m)?/g)].map(m=> ({n:parseInt(m[1],10), u:m[2]||'ms'}));
  const maxMs = ((rules.maxWaitMin||10)*60000);
  waits.forEach(w=>{
    const ms = w.u==='m'? w.n*60000 : w.u==='s'? w.n*1000 : w.n;
    if (ms > maxMs) out('Very long wait detected (~'+Math.round(ms/60000)+' min). Ensure check-ins and hydration.', 'warn');
  });
  if ((rules.requireBreath!==false) && !/cadence|breath/.test(t)) out('No breath cadence mentioned. Consider setting a cadence (e.g., 4,7,8,0).', 'info');
  out('Lint complete. Use judgment; the linter is conservative.', 'info');
}
export function bootstrapLinter(){
  document.getElementById('lint-run')?.addEventListener('click', ()=>{
    const view = document.getElementById('script-view'); lint(view?.textContent||'');
  });
}
document.addEventListener('DOMContentLoaded', bootstrapLinter);

try{ (JSON.parse(localStorage.getItem('mgd.lint.rules')||'{}').warn||[]).forEach(w=>{ if (w && (text||'').toLowerCase().includes(w.toLowerCase())) out('Warn keyword “'+w+'” detected. Check tone/consent.', 'warn'); }); }catch(e){}