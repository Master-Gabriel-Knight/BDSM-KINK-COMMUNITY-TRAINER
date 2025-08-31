
const LS = { badges:'mgd.badges', skin:'mgd.skin.unlocked' };
const BADGES = [
  {id:'first_debrief', name:'First Debrief', emoji:'📝', test:()=> JSON.parse(localStorage.getItem('mgd.lore')||'[]').some(x=> /Debrief/i.test(x.title||''))},
  {id:'pulse_trio', name:'Pulse Trio', emoji:'🟢🟡🔴', test:()=>{ try{ return (JSON.parse(localStorage.getItem('mgd.pulse.count')||'0')||0) >= 3; }catch(e){ return false; } }},
  {id:'playlist_maker', name:'Playlist Maker', emoji:'🎛️', test:()=> (JSON.parse(localStorage.getItem('mgd.playlist')||'[]')||[]).length>=3},
  {id:'coach_listener', name:'Coach Listener', emoji:'🎤', test:()=> localStorage.getItem('mgd.coach.used')==='1'}
];
function load(){ try{ return JSON.parse(localStorage.getItem(LS.badges)||'{}'); }catch(e){ return {}; } }
function save(x){ localStorage.setItem(LS.badges, JSON.stringify(x)); }
function render(){
  const grid=document.getElementById('badges-grid'); if(!grid) return;
  const unlocked = load();
  grid.innerHTML='';
  BADGES.forEach(b=>{
    const got = !!unlocked[b.id];
    const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:'+(got?'rgba(0,80,0,.35)':'rgba(0,0,0,.25)');
    d.innerHTML = `<div style="font-size:28px">${b.emoji}</div><div style="font-weight:600">${b.name}</div><div class="sub" style="opacity:.8">${got? 'Unlocked' : 'Locked'}</div>`;
    grid.appendChild(d);
  });
}
function check(){
  const unlocked = load(); let changed=false;
  BADGES.forEach(b=>{ try{ if (!unlocked[b.id] && b.test()){ unlocked[b.id]=Date.now(); changed=true; } }catch(e){} });
  if (changed){ save(unlocked); render(); // unlock a bonus skin on first set
    localStorage.setItem(LS.skin, 'aurora'); }
}
export function bootstrapBadges(){
  render(); check();
  // Increment pulse counter when pulse occurs
  window.addEventListener('mgd:safetyPulse', ()=>{ const n=parseInt(localStorage.getItem('mgd.pulse.count')||'0',10)+1; localStorage.setItem('mgd.pulse.count', String(n)); check(); });
  // Coach usage mark
  window.addEventListener('mgd:cue', ()=>{ localStorage.setItem('mgd.coach.used','1'); check(); });
  // Debrief save is handled by checking lore
  // When a bonus skin is unlocked, you could switch CSS vars here if desired.
}
document.addEventListener('DOMContentLoaded', bootstrapBadges);
