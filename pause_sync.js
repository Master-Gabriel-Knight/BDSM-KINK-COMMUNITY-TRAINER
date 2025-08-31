
function send(type, detail){ try{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type, detail}})); }catch(e){} }
export function bootstrapPauseSync(){
  const p1=document.getElementById('script-pause'); const p2=document.getElementById('se-pause');
  p1?.addEventListener('click', ()=> send('pause', {}));
  p2?.addEventListener('click', ()=> send('pause', {}));
  document.getElementById('script-stop')?.addEventListener('click', ()=> send('stop', {}));
  document.getElementById('se-stop')?.addEventListener('click', ()=> send('stop', {}));
  // Follow incoming controls
  window.addEventListener('mgd:applyScriptControl', (e)=>{
    const {type}=e.detail||{};
    if (type==='pause'){ try{ speechSynthesis.pause(); }catch(e){} }
    if (type==='stop'){ try{ speechSynthesis.cancel(); }catch(e){} }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPauseSync);
