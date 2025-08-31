
const LS = { ec: 'mgd.eros.compass' };
const QUESTIONS = [
  {k:'Sovereign', q:'I like to set the frame and hold the room.'},
  {k:'Devotee', q:'Acts of care and service feel delicious.'},
  {k:'Trickster', q:'Playful mischief turns me on to life.'},
  {k:'Hunter', q:'Focus and pursuit energize me.'},
  {k:'Muse', q:'Being seen and adored lights me up.'},
];
function ask(){
  const scores = {Sovereign:0,Devotee:0,Trickster:0,Hunter:0,Muse:0};
  for (const item of QUESTIONS){
    const v = prompt(item.q+' (0–4)', '2'); if (v===null) return null;
    const n = Math.max(0, Math.min(4, parseInt(v,10)||0));
    scores[item.k] += n;
  }
  return scores;
}
function draw(scores){
  const c = document.getElementById('ec-canvas'); if (!c) return; const ctx = c.getContext('2d');
  ctx.clearRect(0,0,c.width,c.height);
  const keys = Object.keys(scores);
  const max = 4;
  const cx = c.width/2, cy = c.height/2, r = Math.min(cx, cy)-40;
  // web
  ctx.strokeStyle='rgba(255,255,255,.25)'; ctx.lineWidth=1;
  for (let ring=1; ring<=4; ring++){ ctx.beginPath(); for (let i=0;i<keys.length;i++){ const a=(i/keys.length)*Math.PI*2 - Math.PI/2; const x=cx+Math.cos(a)*r*(ring/4); const y=cy+Math.sin(a)*r*(ring/4); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.closePath(); ctx.stroke(); }
  // axes
  ctx.strokeStyle='rgba(255,255,255,.35)';
  keys.forEach((k,i)=>{ const a=(i/keys.length)*Math.PI*2 - Math.PI/2; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); ctx.stroke(); });
  // polygon
  ctx.beginPath(); ctx.fillStyle='rgba(255,30,138,.35)'; ctx.strokeStyle='#ff1e8a'; ctx.lineWidth=2;
  keys.forEach((k,i)=>{ const a=(i/keys.length)*Math.PI*2 - Math.PI/2; const rr = r*(scores[k]/max); const x=cx+Math.cos(a)*rr; const y=cy+Math.sin(a)*rr; if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
  ctx.closePath(); ctx.fill(); ctx.stroke();
  // labels
  ctx.fillStyle='#9ad5ff'; ctx.font='16px serif'; ctx.textAlign='center';
  keys.forEach((k,i)=>{ const a=(i/keys.length)*Math.PI*2 - Math.PI/2; const x=cx+Math.cos(a)*(r+18); const y=cy+Math.sin(a)*(r+18); ctx.fillText(k, x, y); });
}
function save(scores){ localStorage.setItem(LS.ec, JSON.stringify(scores)); }
function load(){ try{ return JSON.parse(localStorage.getItem(LS.ec)||'{}'); }catch(e){ return {}; } }
export function bootstrapCompass(){
  const saved = load(); if (Object.keys(saved).length) draw(saved);
  document.getElementById('ec-start')?.addEventListener('click', ()=>{ const s=ask(); if(!s) return; draw(s); save(s); });
  document.getElementById('ec-save')?.addEventListener('click', ()=>{ const data = load(); alert('Saved locally.'); });
  document.getElementById('ec-export')?.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(load(),null,2)], {type:'application/json'});
    const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='eros_compass.json'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCompass);
