
const LS = { forge:'mgd.badgeforge', badges:'mgd.badges' };
function loadForge(){ try{return JSON.parse(localStorage.getItem(LS.forge)||'[]')}catch(e){return[]} }
function saveForge(list){ localStorage.setItem(LS.forge, JSON.stringify(list)); }
function lore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function pulses(){ try{return parseInt(localStorage.getItem('mgd.pulse.count')||'0',10)}catch(e){return 0} }
function practice(){ try{return parseInt(localStorage.getItem('mgd.practice.min')||'0',10)}catch(e){return 0} }
function playlist(){ try{return JSON.parse(localStorage.getItem('mgd.playlist')||'[]')}catch(e){return[]} }
function meets(rule){
  const n=parseInt(rule.N||'0',10);
  if (rule.metric==='lore') return lore().length >= n;
  if (rule.metric==='pulse') return pulses() >= n;
  if (rule.metric==='practice') return practice() >= n;
  if (rule.metric==='playlist') return playlist().length >= n;
  return false;
}
function render(){
  const grid=document.getElementById('bf-grid'); if(!grid) return;
  const list=loadForge(); grid.innerHTML='';
  list.forEach((r,i)=>{
    const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
    d.innerHTML = `<div style="font-size:22px">${r.emoji||'🏅'}</div><div style="font-weight:600">${r.name||('Badge '+(i+1))}</div><div class="sub" style="opacity:.8">${r.metric} ≥ ${r.N}</div>`;
    grid.appendChild(d);
  });
}
function checkAward(){
  const list=loadForge(); let changed=false; let unlocked={};
  try{ unlocked=JSON.parse(localStorage.getItem(LS.badges)||'{}'); }catch(e){ unlocked={}; }
  list.forEach(r=>{
    const id='cf_'+(r.name||'badge').toLowerCase().replace(/[^a-z0-9]+/g,'_');
    if (!unlocked[id] && meets(r)){ unlocked[id]=Date.now(); changed=true; }
  });
  if (changed){ localStorage.setItem(LS.badges, JSON.stringify(unlocked)); }
}
export function bootstrapBadgeForge(){
  render(); checkAward();
  document.getElementById('bf-add')?.addEventListener('click', ()=>{
    const item={ name: (document.getElementById('bf-name')?.value||'Custom Badge'), metric: document.getElementById('bf-metric')?.value||'lore', N: document.getElementById('bf-N')?.value||'3', emoji: document.getElementById('bf-emoji')?.value||'🏅' };
    const list=loadForge(); list.push(item); saveForge(list); render(); checkAward();
  });
  document.getElementById('bf-clear')?.addEventListener('click', ()=>{ saveForge([]); render(); });
  window.addEventListener('mgd:safetyPulse', ()=> checkAward());
  window.addEventListener('mgd:cue', ()=> checkAward());
}
document.addEventListener('DOMContentLoaded', bootstrapBadgeForge);
