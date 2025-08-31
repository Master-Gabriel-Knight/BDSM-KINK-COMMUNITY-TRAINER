
// Chapter markers: lines starting with '### ' or 'Decree:' or 'Say:' create anchors
function getScript(){
  const raw = document.getElementById('script-view')?.textContent||'';
  return raw;
}
function chapters(text){
  const lines = (text||'').split(/\n/);
  const idx = [];
  let pos=0;
  for (let i=0;i<lines.length;i++){
    const s=lines[i];
    if (/^\s*###\s+/.test(s) || /^\s*(decree:|say:)/i.test(s)){ idx.push(pos); }
    pos += (s.length+1);
  }
  // always start at 0
  if (!idx.length || idx[0]!==0) idx.unshift(0);
  return idx;
}
let CHAP=[], current=0;
function scroller(){ return document.getElementById('tp-scroll'); }
function gotoChapter(n){
  if (!scroller()) return; const t=getScript(); CHAP = chapters(t);
  current = Math.max(0, Math.min(n, CHAP.length-1));
  // estimate y from proportion of text length (rough but effective)
  const totalLen = (t||'').length || 1;
  const targetRatio = CHAP[current] / totalLen;
  const contentHeight = scroller().scrollHeight || 1000;
  const y = -targetRatio * (contentHeight*0.9);
  scroller().style.transform = `translateY(${y}px)`;
  window.__tp_y = y;
}
function next(){ gotoChapter(current+1); }
function prev(){ gotoChapter(current-1); }
let autoTimer=null;
function autoChapter(on){
  clearInterval(autoTimer);
  if (!on) return;
  autoTimer = setInterval(()=> next(), 60*1000); // default 60s; instructor can nudge speed
}
export function bootstrapTPChapters(){
  document.getElementById('tp-next')?.addEventListener('click', next);
  document.getElementById('tp-prev')?.addEventListener('click', prev);
  document.getElementById('tp-autochap')?.addEventListener('change', (e)=> autoChapter(e.target.checked));
  // reset chapters when opening teleprompter
  document.getElementById('tp-open')?.addEventListener('click', ()=>{ CHAP = chapters(getScript()); current=0; gotoChapter(0); });
}
document.addEventListener('DOMContentLoaded', bootstrapTPChapters);
