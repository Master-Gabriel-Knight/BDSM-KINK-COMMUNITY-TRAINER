
function setFrozen(on){
  const box=document.getElementById('freeze-overlay'); if (!box) return;
  box.style.display = on? 'flex':'none';
  try{ window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'teleprompter', value: on? 'pause':'start'}})); }catch(e){}
  // mute speech
  try{ speechSynthesis.cancel(); }catch(e){}
}
export function bootstrapFreeze(){
  document.getElementById('freeze-btn')?.addEventListener('click', ()=> setFrozen(true));
  document.getElementById('freeze-off')?.addEventListener('click', ()=> setFrozen(false));
}
document.addEventListener('DOMContentLoaded', bootstrapFreeze);
