
const LS = { gal:'mgd.sigil.gallery' };
function gallery(){ try{return JSON.parse(localStorage.getItem(LS.gal)||'[]')}catch(e){return[]} }
function saveGallery(list){ localStorage.setItem(LS.gal, JSON.stringify(list)); }
function drawGrid(){
  const g=document.getElementById('sigil-grid'); if(!g) return; const list=gallery(); g.innerHTML='';
  list.forEach((it,i)=>{
    const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:6px;background:rgba(0,0,0,.25)';
    d.innerHTML = `<div style="font-weight:600">${it.title||'Untitled'}</div><div class="sub" style="opacity:.8">${new Date(it.time||Date.now()).toLocaleString()}</div><img alt="sigil" src="${it.data}" style="width:100%;border-radius:8px;margin-top:4px"><div class="sub" style="opacity:.8">${it.note||''}</div>`;
    g.appendChild(d);
  });
}
export function bootstrapSigil(){
  const cv=document.getElementById('sigil-canvas'); if(!cv) return; const ctx=cv.getContext('2d'); let drawing=false, lx=0, ly=0;
  ctx.fillStyle='#000'; ctx.fillRect(0,0,cv.width,cv.height);
  function pos(e){ const r=cv.getBoundingClientRect(); const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top; return {x:x*(cv.width/r.width), y:y*(cv.height/r.height)}; }
  function start(e){ drawing=true; const p=pos(e); lx=p.x; ly=p.y; e.preventDefault(); }
  function move(e){ if(!drawing) return; const p=pos(e); const size=parseInt(document.getElementById('sigil-size')?.value||'6',10); const col=document.getElementById('sigil-color')?.value||'#ff86c8'; ctx.strokeStyle=col; ctx.lineWidth=size; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(lx,ly); ctx.lineTo(p.x,p.y); ctx.stroke(); lx=p.x; ly=p.y; e.preventDefault(); }
  function end(){ drawing=false; }
  cv.addEventListener('mousedown', start); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', end);
  cv.addEventListener('touchstart', start, {passive:false}); cv.addEventListener('touchmove', move, {passive:false}); cv.addEventListener('touchend', end);
  document.getElementById('sigil-clear')?.addEventListener('click', ()=>{ ctx.fillStyle='#000'; ctx.fillRect(0,0,cv.width,cv.height); });
  document.getElementById('sigil-save')?.addEventListener('click', ()=>{
    const it={ title: (document.getElementById('sigil-title')?.value||'Untitled'), note: (document.getElementById('sigil-note')?.value||''), time: Date.now(), data: cv.toDataURL('image/png') };
    const list=gallery(); list.unshift(it); saveGallery(list); drawGrid(); alert('Saved to Gallery.');
  });
  document.getElementById('sigil-export')?.addEventListener('click', ()=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(gallery(),null,2)], {type:'application/json'})); a.download='mgd_sigil_gallery.json'; a.click(); });
  document.getElementById('sigil-import')?.addEventListener('change', (e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const add=JSON.parse(r.result)||[]; const merged = (gallery()).concat(add).slice(0,100); saveGallery(merged); drawGrid(); }catch(e){ alert('Invalid gallery file.'); } }; r.readAsText(f); });
  drawGrid();
}
document.addEventListener('DOMContentLoaded', bootstrapSigil);
