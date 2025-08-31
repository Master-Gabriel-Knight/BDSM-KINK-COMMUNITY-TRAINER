
function card(name, pulse, consent, t){
  const d=document.createElement('div'); d.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
  d.innerHTML = `<div style="font-weight:600">${name||'Unknown'}</div><div style="opacity:.85">Pulse: ${pulse||'—'} • Consent: ${consent||'—'}</div><div style="opacity:.6;font-size:12px">${t? new Date(t).toLocaleTimeString(): ''}</div>`;
  return d;
}
export function bootstrapRooms(){
  let chan=null, roomName='';
  const grid=document.getElementById('room-grid');
  const map=new Map();
  function render(){
    if(!grid) return; grid.innerHTML='';
    Array.from(map.entries()).sort((a,b)=> (b[1].t||0)-(a[1].t||0)).forEach(([k,v])=> grid.appendChild(card(v.name, v.pulse, v.consent, v.t)));
  }
  function send(msg){ try{ chan && chan.postMessage(msg); }catch(e){} }
  function safeName(){ return (roomName||'default').replace(/[^A-Za-z0-9_-]/g,''); }
  document.getElementById('room-join')?.addEventListener('click', ()=>{
    try{ chan && chan.close(); }catch(e){}
    roomName = document.getElementById('room-name')?.value || 'Studio';
    chan = new BroadcastChannel('mgd-room-'+safeName());
    chan.onmessage = (ev)=>{
      const d=ev.data||{}; if (!d.kind) return;
      if (d.kind==='pulse' || d.kind==='consent'){
        map.set(d.id||d.name||('peer-'+Math.random().toString(36).slice(2)), {name:d.name||'Peer', pulse:d.kind==='pulse'? d.value: (map.get(d.id||'')?.pulse||'—'), consent:d.kind==='consent'? d.value: (map.get(d.id||'')?.consent||'—'), t:Date.now()});
        render();
      }
    };
    render();
  });
  document.getElementById('room-leave')?.addEventListener('click', ()=>{ try{ chan && chan.close(); }catch(e){} chan=null; });
  // Bridge local events to room channel
  window.addEventListener('mgd:safetyPulse', e=> send({kind:'pulse', value:e.detail?.value, name:'This Device'}));
  window.addEventListener('mgd:applyScriptControl', e=>{ const d=e.detail||{}; if (d.type==='pulse') send({kind:'pulse', value:d.value, name:'Partner'}); if (d.type==='consent') send({kind:'consent', value:d.value, name:'Partner'}); });
  // local consent prompt
  window.addEventListener('mgd:scriptControl', e=>{ const d=e.detail||{}; if (d.type==='consent') send({kind:'consent', value:d.value, name:'This Device'}); if (d.type==='pulse') send({kind:'pulse', value:d.value, name:'This Device'}); });
}
document.addEventListener('DOMContentLoaded', bootstrapRooms);
