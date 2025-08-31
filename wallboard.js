
function tile(room, data){
  const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
  const entries = Object.values(data||{}).sort((a,b)=> (b.t||0)-(a.t||0)).slice(0,6);
  d.innerHTML = `<div style="font-weight:600">${room}</div>` + entries.map(v=> `<div class="sub" style="opacity:.9">${v.name||'Peer'} — pulse:${v.pulse||'—'} • consent:${v.consent||'—'} <span style="opacity:.7">(${new Date(v.t||Date.now()).toLocaleTimeString()})</span></div>`).join('');
  return d;
}
export function bootstrapWallboard(){
  const open=document.getElementById('wb-open'); const box=document.getElementById('wallboard-overlay'); const close=document.getElementById('wb-close'); const grid=document.getElementById('wb-grid');
  const input=document.getElementById('wb-rooms'); const start=document.getElementById('wb-start'); const stop=document.getElementById('wb-stop');
  let chans=[]; const map=new Map();
  function render(){ if(!grid) return; grid.innerHTML=''; for (const [room, data] of map.entries()){ grid.appendChild(tile(room, data)); } }
  open?.addEventListener('click', ()=> box.style.display='flex');
  close?.addEventListener('click', ()=> box.style.display='none');
  start?.addEventListener('click', ()=>{
    // close old
    chans.forEach(c=>{ try{ c.close(); }catch(e){} }); chans=[]; map.clear(); render();
    const rooms=(input?.value||'Studio').split(',').map(s=> s.trim()).filter(Boolean);
    rooms.forEach(r=>{
      const ch = new BroadcastChannel('mgd-room-'+r.replace(/[^A-Za-z0-9_-]/g,''));
      ch.onmessage = (ev)=>{
        const d=ev.data||{}; if (!d.kind) return;
        const bag = map.get(r) || {};
        const id = (d.id || d.name || Math.random().toString(36).slice(2));
        bag[id] = {...(bag[id]||{}), name:d.name||('Peer '+id.slice(-4)), t:Date.now(), pulse: d.kind==='pulse'? d.value : (bag[id]?.pulse||'—'), consent: d.kind==='consent'? d.value : (bag[id]?.consent||'—') };
        map.set(r, bag); render();
      };
      chans.push(ch);
    });
  });
  stop?.addEventListener('click', ()=>{ chans.forEach(c=>{ try{c.close();}catch(e){} }); chans=[]; map.clear(); render(); });
}
document.addEventListener('DOMContentLoaded', bootstrapWallboard);
