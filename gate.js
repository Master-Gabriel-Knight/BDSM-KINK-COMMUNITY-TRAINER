
function quizzesOk(){
  try{ const p=JSON.parse(localStorage.getItem('mgd.quiz.progress')||'{}'); return !!(p.signals && p.aftercare); }catch(e){ return false; }
}
export function bootstrapGate(){
  const box=document.getElementById('gate-enable'); const kink=document.getElementById('kink-enabled');
  function enforce(){
    if (!box?.checked) return;
    if (kink && kink.checked && !quizzesOk()){ kink.checked=false; kink.dispatchEvent(new Event('change')); alert('Complete Signals & Aftercare quizlets first to unlock Kink Mode.'); }
  }
  box?.addEventListener('change', enforce);
  kink?.addEventListener('change', enforce);
}
document.addEventListener('DOMContentLoaded', bootstrapGate);
