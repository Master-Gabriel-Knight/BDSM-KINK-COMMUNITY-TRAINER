
function parse(text){
  const lines=(text||'').split(/\n/).map(s=>s.trim()).filter(Boolean);
  const out=[];
  lines.forEach((s,i)=>{
    const m = s.match(/wait\s*[:=]?\s*(\d+)\s*(ms|s|m)?/i);
    let dur = 10; // default seconds per step
    if (m){ const n=parseInt(m[1],10); const u=(m[2]||'s').toLowerCase(); dur = u==='m'? n*60 : u==='ms'? Math.max(1, Math.round(n/1000)) : n; }
    out.push({i:i+1, label: s.slice(0,40), dur});
  });
  return out;
}
function draw(){
  const c=document.getElementById('tl-canvas'); if(!c) return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  const items = parse(document.getElementById('script-view')?.textContent||'');
  const total = items.reduce((a,b)=> a+b.dur, 0) || 1;
  let x=20; const H=c.height, W=c.width, avail=W-40;
  items.forEach(it=>{
    const w = Math.max(4, Math.round(avail * (it.dur/total)));
    ctx.fillStyle='rgba(157,213,255,.85)'; ctx.fillRect(x, H/2-18, w, 36);
    ctx.fillStyle='#000'; ctx.font='11px serif'; ctx.fillText(String(it.i), x+3, H/2+4);
    x += w+2;
  });
  ctx.fillStyle='#9ad5ff'; ctx.font='12px serif'; ctx.fillText('Total ~ '+Math.round(total)+'s', 10, 16);
}
export function bootstrapTimeline(){
  document.getElementById('tl-refresh')?.addEventListener('click', draw);
  document.getElementById('tl-export')?.addEventListener('click', ()=>{ const c=document.getElementById('tl-canvas'); const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='script_timeline.png'; a.click(); });
  draw();
}
document.addEventListener('DOMContentLoaded', bootstrapTimeline);
