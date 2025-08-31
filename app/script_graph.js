
function parseScript(text){
  const lines = (text||'').split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const steps = lines.map((s,i)=>({i, t:s, kind: (/^say:/i.test(s)?'say': /^decree:/i.test(s)?'decree': /wait/i.test(s)?'wait': /node/i.test(s)?'node':'cue')}));
  return steps;
}
function draw(steps){
  const c=document.getElementById('sg-canvas'); if(!c) return; const ctx=c.getContext('2d'); ctx.clearRect(0,0,c.width,c.height);
  const W=c.width, H=c.height; const pad=40; const gap=(W-2*pad)/Math.max(1,steps.length-1);
  steps.forEach((st, i)=>{
    const x=pad + i*gap, y = H/2 + Math.sin(i/2)*60;
    ctx.fillStyle = st.kind==='say' ? '#4da3ff' : st.kind==='decree' ? '#ff86c8' : st.kind==='wait' ? '#ffd166' : st.kind==='node' ? '#9cff66' : '#eaeaea';
    ctx.beginPath(); ctx.arc(x,y,14,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#000'; ctx.font='10px serif'; ctx.textAlign='center'; ctx.fillText(String(i+1), x, y+3);
    if (i>0){ ctx.strokeStyle='rgba(255,255,255,.3)'; ctx.beginPath(); ctx.moveTo(pad + (i-1)*gap, H/2 + Math.sin((i-1)/2)*60); ctx.lineTo(x,y); ctx.stroke(); }
  });
  ctx.fillStyle='#9ad5ff'; ctx.font='12px serif'; ctx.fillText('Nodes: '+steps.length, 10, 16);
}
export function bootstrapScriptGraph(){
  const ref=document.getElementById('sg-refresh'); const exp=document.getElementById('sg-export');
  function run(){ const view=document.getElementById('script-view'); draw(parseScript(view?.textContent||'')); }
  ref?.addEventListener('click', run); run();
  exp?.addEventListener('click', ()=>{ const c=document.getElementById('sg-canvas'); const a=document.createElement('a'); a.href=c.toDataURL('image/png'); a.download='script_graph.png'; a.click(); });
}
document.addEventListener('DOMContentLoaded', bootstrapScriptGraph);
