
export function bootstrapTPSync(){
  window.addEventListener('mgd:applyScriptControl', (e)=>{
    const d=e.detail||{}; if (d.type!=='teleprompter') return;
    const scroll=document.getElementById('tp-scroll'); if (!scroll) return;
    if (d.value==='start'){ window.__tp_running=true; if (typeof d.speed==='number'){ const s=document.getElementById('tp-speed'); if(s){ s.value=String(d.speed); } } }
    if (d.value==='pause'){ window.__tp_running=false; }
    if (d.value==='reset'){ window.__tp_y=0; scroll.style.transform='translateY(0)'; }
    if (d.value==='speed' && typeof d.speed==='number'){ const s=document.getElementById('tp-speed'); if(s){ s.value=String(d.speed); } }
  });
  function tick(){
    const scroll=document.getElementById('tp-scroll'); if (!scroll){ requestAnimationFrame(tick); return; }
    const sp = parseInt(document.getElementById('tp-speed').value||'60',10);
    if (window.__tp_running){ window.__tp_y = (window.__tp_y||0) - sp/100; scroll.style.transform = `translateY(${window.__tp_y}px)`; }
    requestAnimationFrame(tick);
  }
  tick();
}
document.addEventListener('DOMContentLoaded', bootstrapTPSync);
