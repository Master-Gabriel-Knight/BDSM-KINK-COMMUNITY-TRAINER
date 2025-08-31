
let raf=null;
export function bootstrapProjector(){
  const open=document.getElementById('proj-open'); const box=document.getElementById('projector-overlay'); const close=document.getElementById('proj-close'); const text=document.getElementById('proj-text'); const follow=document.getElementById('proj-follow');
  function content(){ return document.getElementById('script-view')?.textContent||''; }
  function render(){ text.textContent = content(); }
  function loop(){ if (follow?.checked){ const src=document.getElementById('tp-scroll'); if(src){ text.style.transform = src.style.transform; } } raf=requestAnimationFrame(loop); }
  open?.addEventListener('click', ()=>{ render(); box.style.display='block'; cancelAnimationFrame(raf); loop(); });
  close?.addEventListener('click', ()=>{ box.style.display='none'; cancelAnimationFrame(raf); });
  document.getElementById('tp-open')?.addEventListener('click', render);
}
document.addEventListener('DOMContentLoaded', bootstrapProjector);
