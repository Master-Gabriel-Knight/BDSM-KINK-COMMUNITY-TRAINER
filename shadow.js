
export function bootstrapShadow(){
  const btn = document.getElementById('shadow-toggle');
  const overlay = document.getElementById('shadow-overlay');
  const exit = document.getElementById('shadow-exit');
  const cue = document.getElementById('shadow-cue');
  function show(on){ overlay.style.display = on ? 'flex' : 'none'; }
  btn?.addEventListener('click', ()=> show(overlay.style.display!=='flex'));
  exit?.addEventListener('click', ()=> show(false));
  // Listen to breath cues
  window.addEventListener('mgd:cue', (e)=>{ if (overlay.style.display==='flex'){ cue.textContent = e.detail || ''; } });
}
document.addEventListener('DOMContentLoaded', bootstrapShadow);
