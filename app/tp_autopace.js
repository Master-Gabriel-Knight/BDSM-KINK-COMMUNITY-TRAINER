
let autopace=false;
function parseWaits(text){
  const lines=(text||'').split(/\n/);
  const marks=[]; let pos=0;
  for(let i=0;i<lines.length;i++){
    const s=lines[i]; const m=s.match(/wait\s*[:=]?\s*(\d+)\s*(ms|s|m)?/i);
    if(m){ const n=parseInt(m[1],10); const u=(m[2]||'s').toLowerCase(); const sec = u==='m'? n*60 : u==='ms'? Math.max(1,Math.round(n/1000)) : n; marks.push({pos, sec}); }
    pos += s.length+1;
  }
  return marks;
}
function adjustSpeed(){
  if(!autopace) return;
  const txt = document.getElementById('script-view')?.textContent||'';
  const marks = parseWaits(txt);
  if (!marks.length) return;
  const totalLen = txt.length||1; const y = Math.abs(window.__tp_y||0); const scroller=document.getElementById('tp-scroll'); if(!scroller) return;
  const ratio = y / (scroller.scrollHeight||1000);
  // find the next mark ahead
  let next = null;
  for (const m of marks){ if ((m.pos/totalLen) > ratio){ next = m; break; } }
  const speed = document.getElementById('tp-speed');
  if (!speed) return;
  if (next){ // if the next wait is very close, slow down; farther away, speed up slightly
    const delta = (m.pos/totalLen) - ratio;
  }
}
export function bootstrapTPAutoPace(){
  const box=document.getElementById('tp-autopace');
  if (!box) return;
  box.addEventListener('change', ()=> autopace=box.checked);
  // gently modulate speed as we scroll
  function loop(){
    if (autopace){
      try{
        const txt = document.getElementById('script-view')?.textContent||'';
        const marks = parseWaits(txt);
        const sc=document.getElementById('tp-scroll'); const speed=document.getElementById('tp-speed');
        if (marks.length && sc && speed){
          const total = txt.length||1; const ratio = Math.abs(window.__tp_y||0) / (sc.scrollHeight||1000);
          let ahead = marks.find(m => (m.pos/total) > ratio);
          if (ahead){
            const dist = (ahead.pos/total) - ratio; // 0..1
            const base = 60; // baseline
            const target = Math.max(20, Math.min(140, Math.round(base + (dist-0.2)*120)));
            if (Math.abs(parseInt(speed.value||'60',10) - target) > 2){ speed.value = String(target); }
          }
        }
      }catch(e){}
    }
    requestAnimationFrame(loop);
  }
  loop();
}
document.addEventListener('DOMContentLoaded', bootstrapTPAutoPace);
