
const LS = { curve:'mgd.curve', apply:'mgd.curve.apply', min:'mgd.curve.min' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.curve)||'[]')}catch(e){return[]} }
function save(list){ localStorage.setItem(LS.curve, JSON.stringify(list)); }
function draw(){
  const cv=document.getElementById('curve-canvas'); if(!cv) return; const ctx=cv.getContext('2d'); const W=cv.width, H=cv.height;
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,.15)'; for(let i=1;i<10;i++){ const y=Math.round(H*i/10); ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
  const pts=load(); if (!pts.length) return;
  ctx.strokeStyle='rgba(157,213,255,.9)'; ctx.lineWidth=3; ctx.beginPath(); pts.forEach((p,i)=>{ const x=p.t*W, y=(1-p.v)*H; if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
  ctx.fillStyle='#9ad5ff'; pts.forEach(p=>{ const x=p.t*W, y=(1-p.v)*H; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); });
}
function nearest(x,y){
  const cv=document.getElementById('curve-canvas'); const W=cv.width, H=cv.height; const pts=load(); let best=-1, bd=1e9;
  pts.forEach((p,i)=>{ const dx=x-(p.t*W), dy=y-((1-p.v)*H); const d=dx*dx+dy*dy; if (d<bd){ bd=d; best=i; } });
  return {i:best,d:Math.sqrt(bd)};
}
function saveUI(){
  const min=document.getElementById('curve-min')?.value||'15'; localStorage.setItem(LS.min, min);
  localStorage.setItem(LS.apply, document.getElementById('curve-apply')?.checked ? '1':'0');
}
export function bootstrapCurve(){
  const cv=document.getElementById('curve-canvas'); if(!cv) return; const ctx=cv.getContext('2d'); const W=cv.width, H=cv.height;
  // init
  if (localStorage.getItem(LS.min)) document.getElementById('curve-min').value = localStorage.getItem(LS.min);
  if (localStorage.getItem(LS.apply)==='1') document.getElementById('curve-apply').checked = true;
  draw();
  let drag=-1;
  function pos(e){ const r=cv.getBoundingClientRect(); const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches?e.touches[0].clientY:e.clientY)-r.top; return {x:x*(cv.width/r.width), y:y*(cv.height/r.height)}; }
  function click(e){ const p=pos(e); let pts=load(); const hit=nearest(p.x,p.y); if (hit.i>=0 && hit.d<100){ drag=hit.i; } else { pts = pts.concat([{t: Math.min(1, Math.max(0, p.x/W)), v: Math.min(1, Math.max(0, 1-p.y/H))}]).sort((a,b)=> a.t-b.t); save(pts); draw(); }
    e.preventDefault(); }
  function move(e){ if (drag<0) return; const p=pos(e); let pts=load(); const n={t: Math.min(1, Math.max(0, p.x/W)), v: Math.min(1, Math.max(0, 1-p.y/H))}; pts[drag]=n; pts.sort((a,b)=> a.t-b.t); save(pts); draw(); }
  function up(){ drag=-1; }
  cv.addEventListener('mousedown', click); window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  cv.addEventListener('touchstart', click, {passive:false}); cv.addEventListener('touchmove', move, {passive:false}); cv.addEventListener('touchend', up);
  document.getElementById('curve-clear')?.addEventListener('click', ()=>{ save([]); draw(); });
  document.getElementById('curve-save')?.addEventListener('click', saveUI);
  document.getElementById('curve-load')?.addEventListener('click', ()=>{ draw(); });
  // Apply to teleprompter speed
  function sample(t){
    const pts=load(); if (!pts.length) return 0.5;
    if (t<=pts[0].t) return pts[0].v;
    for (let i=0;i<pts.length-1;i++){ const a=pts[i], b=pts[i+1]; if (t>=a.t && t<=b.t){ const r=(t-a.t)/(b.t-a.t); return a.v*(1-r)+b.v*r; } }
    return pts[pts.length-1].v;
  }
  function loop(){
    if (localStorage.getItem(LS.apply)==='1'){
      const sc=document.getElementById('tp-scroll'); const speed=document.getElementById('tp-speed');
      if (sc && speed){
        const y=Math.abs(window.__tp_y||0); const ratio = y / (sc.scrollHeight||1000);
        const target = sample(ratio); // 0..1
        const base = 60; const min=20, max=140;
        const sp = Math.round(min + (max-min)*target);
        if (Math.abs(parseInt(speed.value||String(base),10) - sp) > 2){ speed.value = String(sp); }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
}
document.addEventListener('DOMContentLoaded', bootstrapCurve);
