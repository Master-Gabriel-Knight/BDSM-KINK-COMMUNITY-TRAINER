
function vib(p){ try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} }
export function bootstrapPhaseVibe(){
  const box=document.getElementById('phase-vibe');
  function onPhase(e){ if (!box?.checked) return; const ph=e.detail; if (ph==='Inhale') vib([60]); else if (ph==='Hold') vib([30,40,30]); else if (ph==='Exhale') vib([20]); else vib([10]); }
  window.addEventListener('mgd:phase', onPhase);
}
document.addEventListener('DOMContentLoaded', bootstrapPhaseVibe);
