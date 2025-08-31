
function getLore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
const LS = { plr:'mgd.playlist.runner' };
function load(){ try{return JSON.parse(localStorage.getItem(LS.plr)||'[]')}catch(e){return[]} }
function save(x){ localStorage.setItem(LS.plr, JSON.stringify(x)); }
function render(){
  const list=load(); const ol=document.getElementById('plr-list'); if(!ol) return; ol.innerHTML=''; list.forEach((it,i)=>{ const li=document.createElement('li'); li.textContent = `${it.name||('Item '+(i+1))} — ${it.min||5} min (${it.source})`; ol.appendChild(li); });
}
let idx=0, timer=null, endAt=0;
function status(t){ const el=document.getElementById('plr-status'); if(el) el.textContent=t; }
function applyScript(text){
  const view=document.getElementById('script-view'); if(!view) return; view.textContent = text||''; // basic: replace content
  // notify anyone listening
  window.dispatchEvent(new CustomEvent('mgd:scriptLoaded', {detail:{len:(text||'').length}}));
}
function start(){
  const list=load(); if(!list.length) return status('Add items first.');
  idx=0; runItem(list[idx]);
}
function next(){
  const list=load(); if (++idx >= list.length){ clearInterval(timer); status('Chain complete.'); return; }
  runItem(list[idx]);
}
function runItem(it){
  let text='';
  if (it.source==='current'){ text = document.getElementById('script-view')?.textContent||''; }
  else if (it.source==='lore0'){ text = (getLore()[0]?.content)||''; }
  applyScript(text);
  // open teleprompter if available
  document.getElementById('tp-open')?.click();
  // schedule next
  clearInterval(timer); endAt = Date.now() + (it.min||5)*60000;
  timer = setInterval(()=>{
    const s = Math.max(0, Math.floor((endAt - Date.now())/1000)); const m=Math.floor(s/60), ss=String(s%60).padStart(2,'0');
    status(`Now: ${it.name} — ${m}:${ss}`);
    if (s<=0){ next(); }
  }, 500);
}
function add(){
  const name=document.getElementById('plr-name')?.value||'Untitled';
  const min=parseInt(document.getElementById('plr-min')?.value||'5',10);
  const source=document.getElementById('plr-source')?.value||'current';
  const list=load(); list.push({name, min, source}); save(list); render();
}
function clearAll(){ save([]); render(); status('Idle.'); }
export function bootstrapPlaylistRunner(){
  document.getElementById('plr-add')?.addEventListener('click', add);
  document.getElementById('plr-start')?.addEventListener('click', start);
  document.getElementById('plr-clear')?.addEventListener('click', clearAll);
  render(); status('Idle.');
}
document.addEventListener('DOMContentLoaded', bootstrapPlaylistRunner);
