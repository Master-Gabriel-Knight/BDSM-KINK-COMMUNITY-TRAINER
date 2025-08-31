
function show(on){ const o=document.getElementById('consent-overlay'); if(o) o.style.display=on?'flex':'none'; }
function log(choice){
  try{ const L=JSON.parse(localStorage.getItem('mgd.lore')||'[]'); L.unshift({title:'Consent Prompt', time:Date.now(), content:'Choice: '+choice}); localStorage.setItem('mgd.lore', JSON.stringify(L)); }catch(e){}
}
function send(choice){
  try{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'consent', value:choice}})); }catch(e){}
}
function adjustIntensity(choice){
  const slider=document.getElementById('kink-intensity');
  if (!slider) return;
  if (choice==='no' || choice==='unsure'){ slider.value = String(Math.max(0, parseInt(slider.value||'0',10)-2)); slider.dispatchEvent(new Event('input')); }
}
export function bootstrapConsentPrompt(){
  document.getElementById('cc-open')?.addEventListener('click', ()=> show(true));
  document.getElementById('cc-close')?.addEventListener('click', ()=> show(false));
  document.querySelectorAll('.cc-choice').forEach(b=> b.addEventListener('click', ()=>{ const v=b.dataset.v; log(v); send(v); adjustIntensity(v); show(false); }));
}
document.addEventListener('DOMContentLoaded', bootstrapConsentPrompt);
