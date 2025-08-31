
function hash(s){ let h=1779033703; for (let i=0;i<s.length;i++){ h = (h ^ s.charCodeAt(i)) * 3432918353 >>> 0; h = (h<<13) | (h>>>19); } return h>>>0; }
function rnd(seed){ return ()=> (seed = (seed*1664525+1013904223)>>>0) / 4294967296; }
export function bootstrapSigilifier(){
  const txt = document.getElementById('sg-text');
  const make = document.getElementById('sg-make');
  const save = document.getElementById('sg-save');
  const canvas = document.getElementById('sg-canvas');
  const ctx = canvas?.getContext('2d');
  function draw(){
    if (!ctx) return;
    const phrase = (txt?.value||'sovereign flame').trim();
    const r = rnd(hash(phrase));
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // background grid
    ctx.globalCompositeOperation='source-over';
    ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 1;
    for (let x=0;x<canvas.width;x+=60){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
    for (let y=0;y<canvas.height;y+=60){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
    // central emblem
    const cx = canvas.width/2, cy = canvas.height/2;
    const layers = 8;
    for (let i=0;i<layers;i++){
      const ang = r()*Math.PI*2;
      const rad = 40 + r()*160;
      const n = 3 + Math.floor(r()*5);
      ctx.beginPath();
      for (let k=0;k<n;k++){
        const a = ang + (k/n)*Math.PI*2;
        const x = cx + Math.cos(a)*rad;
        const y = cy + Math.sin(a)*rad*(0.6 + r()*0.6);
        if (k===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.lineWidth = 1 + r()*4;
      ctx.strokeStyle = 'rgba(255,30,138,'+(0.15+0.6*r())+')';
      ctx.shadowBlur = 6*r();
      ctx.shadowColor = '#ff1e8a';
      ctx.stroke();
    }
    // omega spine
    ctx.shadowBlur = 0; ctx.font = '28px serif'; ctx.textAlign='center';
    for (let t=0;t<16;t++){
      const x = 100 + (canvas.width-200)*(t/15);
      const y = cy + Math.sin(t/2)*60;
      ctx.fillStyle = 'rgba(77,163,255,'+(0.6*(1-Math.abs(t-7.5)/8)+0.2)+')';
      ctx.fillText('Ω', x, y);
    }
    // label
    ctx.fillStyle = 'rgba(255,255,255,.7)';
    ctx.font = '16px serif';
    ctx.fillText('“'+phrase+'”', cx, canvas.height-18);
  }
  make?.addEventListener('click', draw);
  save?.addEventListener('click', ()=>{
    if (!canvas) return;
    const src = canvas.toDataURL('image/png');
    window.MGD_addToGallery?.({ src, title: 'Sigilified', tag: 'sigil' });
  });
  // auto-render once
  draw();
}
document.addEventListener('DOMContentLoaded', bootstrapSigilifier);
