
export function bootstrapWallboardSync(){
  const syncBox=()=> document.getElementById('wb-sync');
  // If sync mode is on, listen to applyScriptControl and treat partner pulses/consents as room 'Sync'
  function sendToWall(kind, value, name){
    const ev = new CustomEvent('mgd:wallboardSync', {detail:{kind, value, name}});
    window.dispatchEvent(ev);
  }
  window.addEventListener('mgd:applyScriptControl', (e)=>{
    if (!syncBox()?.checked) return;
    const d=e.detail||{}; if (d.type==='pulse') sendToWall('pulse', d.value, 'Sync Peer');
    if (d.type==='consent') sendToWall('consent', d.value, 'Sync Peer');
  });
  // Hook wallboard to consume these
  const grid=document.getElementById('wb-grid'); const map=new Map();
  function render(){ if(!grid) return; grid.innerHTML=''; const bag=map.get('Sync')||{}; const box=document.createElement('div'); box.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)'; box.innerHTML='<div style="font-weight:600">Sync</div>'+Object.values(bag).sort((a,b)=> (b.t||0)-(a.t||0)).slice(0,6).map(v=> `<div class="sub" style="opacity:.9">${v.name||'Peer'} — pulse:${v.pulse||'—'} • consent:${v.consent||'—'} <span style="opacity:.7">(${new Date(v.t||Date.now()).toLocaleTimeString()})</span></div>`).join(''); grid.prepend(box); }
  window.addEventListener('mgd:wallboardSync', (e)=>{
    const d=e.detail||{}; const bag = map.get('Sync') || {}; const id= (d.name || 'peer') + Math.random().toString(36).slice(2,6);
    bag[id] = {...(bag[id]||{}), name:d.name||'Peer', t:Date.now(), pulse: d.kind==='pulse'? d.value : (bag[id]?.pulse||'—'), consent: d.kind==='consent'? d.value : (bag[id]?.consent||'—') };
    map.set('Sync', bag); render();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapWallboardSync);
