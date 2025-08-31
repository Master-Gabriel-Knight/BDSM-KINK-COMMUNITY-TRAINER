
let selfData = {a:4,s:8}, partnerData = {a:4,s:8};
function show(on){ const o=document.getElementById('harmony-overlay'); if(o) o.style.display=on?'flex':'none'; }
function draw(){
  const c=document.getElementById('hm-canvas'); if(!c) return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  ctx.strokeStyle='rgba(255,255,255,.2)'; ctx.strokeRect(10,10,c.width-20,c.height-20);
  function dot(x,y,color,label){ ctx.fillStyle=color; ctx.beginPath(); ctx.arc(60+x*(c.width-120)/10, c.height-60 - y*(c.height-120)/10, 8, 0, Math.PI*2); ctx.fill(); ctx.fillStyle='#fff'; ctx.font='14px serif'; ctx.fillText(label, 60+x*(c.width-120)/10+12, c.height-60 - y*(c.height-120)/10+4); }
  // axes labels
  ctx.fillStyle='#9ad5ff'; ctx.font='16px serif'; ctx.fillText('Arousal →', c.width/2-40, c.height-20);
  ctx.save(); ctx.translate(20, c.height/2+40); ctx.rotate(-Math.PI/2); ctx.fillText('Safety →', 0, 0); ctx.restore();
  dot(selfData.a, selfData.s, '#ff1e8a', 'You');
  dot(partnerData.a, partnerData.s, '#4da3ff', 'Partner');
}
export function bootstrapHarmony(){
  document.getElementById('hm-close')?.addEventListener('click', ()=> show(false));
  window.addEventListener('mgd:thermo', e=>{ selfData=e.detail||selfData; draw(); });
  window.addEventListener('mgd:partnerThermo', e=>{ partnerData=e.detail||partnerData; draw(); show(true); });
  draw();
}
document.addEventListener('DOMContentLoaded', bootstrapHarmony);
