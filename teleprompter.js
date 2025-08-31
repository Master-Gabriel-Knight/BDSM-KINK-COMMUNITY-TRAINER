
let running=false, y=0, raf=null;
function show(on){ const o=document.getElementById('tp-overlay'); if (o) o.style.display=on?'block':'none'; }
function content(){ const v=document.getElementById('script-view')?.textContent||''; return v||'Open a script, then start the Teleprompter.'; }
function render(){
  const scroll=document.getElementById('tp-scroll'); const size=parseInt(document.getElementById('tp-size').value||'48',10);
  const contrast=document.getElementById('tp-contrast').checked;
  if (!scroll) return;
  scroll.style.fontSize = size+'px';
  document.body.style.background = contrast? '#000' : '#000';
  document.getElementById('tp-overlay').style.color = contrast? '#fff' : '#ddd';
  scroll.textContent = content();
}
function tick(){
  if (!running){ raf=requestAnimationFrame(tick); return; }
  const sp = parseInt(document.getElementById('tp-speed').value||'60',10);
  y -= sp/100; document.getElementById('tp-scroll').style.transform = `translateY(${y}px)`;
  raf=requestAnimationFrame(tick);
}
export function bootstrapTeleprompter(){
  document.getElementById('tp-open')?.addEventListener('click', ()=>{ y=0; render(); show(true); });
  document.getElementById('tp-close')?.addEventListener('click', ()=> show(false));
  document.getElementById('tp-start')?.addEventListener('click', ()=>{ running=true; window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'teleprompter', value:'start', speed:parseInt(document.getElementById('tp-speed').value||'60',10)}})); });
  document.getElementById('tp-pause')?.addEventListener('click', ()=>{ running=false; window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'teleprompter', value:'pause'}})); });
  document.getElementById('tp-reset')?.addEventListener('click', ()=>{ y=0; window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'teleprompter', value:'reset'}})); });
  document.getElementById('tp-speed')?.addEventListener('input', ()=>{ window.dispatchEvent(new CustomEvent('mgd:scriptControl', {detail:{type:'teleprompter', value:'speed', speed:parseInt(document.getElementById('tp-speed').value||'60',10)}})); });
  document.getElementById('tp-size')?.addEventListener('input', render);
  document.getElementById('tp-contrast')?.addEventListener('change', render);
  render(); tick();
}
document.addEventListener('DOMContentLoaded', bootstrapTeleprompter);
