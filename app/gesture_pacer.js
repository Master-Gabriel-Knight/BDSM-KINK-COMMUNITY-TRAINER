
export function bootstrapGesturePacer(){
  let active=false, lastY=0;
  const box=document.getElementById('tp-gesture'); if(!box) return;
  function onDown(e){ if (!box.checked) return; active=true; lastY = e.clientY|| (e.touches? e.touches[0].clientY:0); e.preventDefault(); }
  function onMove(e){ if (!active) return; const y = e.clientY|| (e.touches? e.touches[0].clientY:0); const dy = (lastY - y); lastY = y;
    const sp=document.getElementById('tp-speed'); if(!sp) return; const cur=parseInt(sp.value||'60',10); const next = Math.max(10, Math.min(200, cur + Math.round(dy*0.5))); sp.value = String(next);
  }
  function onUp(){ active=false; }
  const area=document.getElementById('tp-overlay') || document.body;
  area.addEventListener('mousedown', onDown); window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
  area.addEventListener('touchstart', onDown, {passive:false}); window.addEventListener('touchmove', onMove, {passive:false}); window.addEventListener('touchend', onUp);
}
document.addEventListener('DOMContentLoaded', bootstrapGesturePacer);
