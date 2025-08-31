
let timer=null;
function show(on){ const o=document.getElementById('sp-overlay'); if (o) o.style.display = on?'flex':'none'; }
function send(value){
  try{ window.dispatchEvent(new CustomEvent('mgd:safetyPulse', {detail:{value}})); }catch(e){}
  try{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'pulse', value}})); }catch(e){}
}
export function bootstrapSafetyPulse(){
  const min=document.getElementById('sp-min'); const start=document.getElementById('sp-start'); const stop=document.getElementById('sp-stop'); const st=document.getElementById('sp-status');
  start?.addEventListener('click', ()=>{ const m=parseInt(min?.value||'8',10); clearInterval(timer); st.textContent='Running…'; timer=setInterval(()=> show(true), Math.max(1,m)*60000); });
  stop?.addEventListener('click', ()=>{ clearInterval(timer); st.textContent='Stopped.'; });
  document.getElementById('sp-close')?.addEventListener('click', ()=> show(false));
  document.querySelectorAll('.sp-choice').forEach(b=> b.addEventListener('click', ()=>{ send(b.dataset.v); show(false); }));
}
document.addEventListener('DOMContentLoaded', bootstrapSafetyPulse);
