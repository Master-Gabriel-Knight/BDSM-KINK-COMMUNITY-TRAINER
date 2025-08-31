
const LS = { use:'mgd.node.usage' };
const NODES = ['ha-valen','sa-thriel','lu-emra','re-anar','yu-zhal','om-veyah','tu-ruun','shen-thav','ma-vira','ka-tor','za-leth','vi-serel','no-vaun'];
function load(){ try{return JSON.parse(localStorage.getItem(LS.use)||'{}')}catch(e){return{}} }
function save(x){ localStorage.setItem(LS.use, JSON.stringify(x)); }
function draw(){
  const c=document.getElementById('hm-canvas'); if(!c) return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  const usage = load();
  const barW = (c.width-60)/NODES.length, max = Math.max(1, ...Object.values(usage));
  for (let i=0;i<NODES.length;i++){
    const v = usage[NODES[i]]||0; const h = (c.height-60)*v/max;
    ctx.fillStyle = 'rgba(255,30,138,'+(0.2+0.8*(v/max))+')';
    ctx.fillRect(30 + i*barW, c.height-30 - h, barW-4, h);
    ctx.fillStyle='#9ad5ff'; ctx.font='12px serif'; ctx.save(); ctx.translate(30+i*barW+(barW-4)/2, c.height-16); ctx.rotate(-Math.PI/3); ctx.fillText(NODES[i], 0, 0); ctx.restore();
  }
  ctx.strokeStyle='rgba(255,255,255,.2)'; ctx.strokeRect(10,10,c.width-20,c.height-20);
}
export function bootstrapHeatmap(){
  document.getElementById('hm-refresh')?.addEventListener('click', draw);
  document.getElementById('hm-export')?.addEventListener('click', ()=>{ const c=document.getElementById('hm-canvas'); const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='mgd_heatmap.png'; a.click(); });
  // increment usage on node select
  window.addEventListener('mgd:selectNode', (e)=>{ const id=(e.detail||'').trim(); const u=load(); u[id]=(u[id]||0)+1; save(u); });
  draw();
}
document.addEventListener('DOMContentLoaded', bootstrapHeatmap);
