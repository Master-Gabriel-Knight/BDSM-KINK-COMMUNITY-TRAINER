
import { NODE_MAP } from './nodes.js';
function remember(title, content){
  const list = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
  list.unshift({ id: crypto.randomUUID(), time: new Date().toISOString(), title, content });
  localStorage.setItem('mgd.lore', JSON.stringify(list));
}
function addToGallery(text){
  const meta = { src: 'data:text/plain,'+encodeURIComponent(text), title: 'Scene', tag: 'scene' };
  window.MGD_addToGallery?.(meta);
}
export function bootstrapScene(){
  const nodeSel = document.getElementById('sc-node'); const nodes = NODE_MAP||{};
  if (nodeSel && !nodeSel.dataset.ready){
    Object.entries(nodes).forEach(([id, meta])=>{ const o = document.createElement('option'); o.value=id; o.textContent=`${meta.name} (${meta.hz} Hz)`; nodeSel.appendChild(o); });
    nodeSel.dataset.ready = '1';
  }
  document.getElementById('sc-compose')?.addEventListener('click', ()=>{
    const id = nodeSel?.value||''; const meta = nodes[id]||{};
    const title = document.getElementById('sc-title')?.value||('Scene — '+(meta.name||'Spiral'));
    const cad = document.getElementById('sc-cadence')?.value||'4,4,4,4';
    const kink = document.getElementById('sc-kink')?.checked;
    const intensity = document.getElementById('sc-intensity')?.value||'1';
    const notes = document.getElementById('sc-notes')?.value||'';
    const body = `Node: ${meta.name||'—'} (${meta.hz||'?'} Hz)\nCadence: ${cad}\nFlavor: ${kink?'Kink on':'Soft'} · Intensity ${intensity}\nNotes: ${notes}`;
    remember(title, body);
    addToGallery(`${title}\n\n${body}`);
    alert('Scene saved to Lore + Gallery.');
  });
}
document.addEventListener('DOMContentLoaded', bootstrapScene);

function exportLastScene(){
  const lore = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
  const last = lore.find(x => (x.title||'').toLowerCase().startsWith('scene')) || lore[0];
  const blob = new Blob([JSON.stringify(last||{}, null, 2)], {type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='scene.mgdscene'; a.click();
}
function importSceneFile(file){
  const r = new FileReader(); r.onload = ()=>{ try{ const obj = JSON.parse(r.result); const list = JSON.parse(localStorage.getItem('mgd.lore')||'[]'); list.unshift(obj); localStorage.setItem('mgd.lore', JSON.stringify(list)); alert('Scene imported to Lore.'); }catch(e){ alert('Invalid scene file'); } }; r.readAsText(file);
}
document.getElementById('sc-export')?.addEventListener('click', exportLastScene);
document.getElementById('sc-import')?.addEventListener('change', (e)=>{ const f=e.target.files[0]; if(f) importSceneFile(f); });
