import { loadAreas } from './areas_config.js';
import { openRitual } from './ritual.js';

function fireArea(a){ window.dispatchEvent(new CustomEvent('mgd:area',{detail:a})); }
function isUnlocked(a){ return !!localStorage.getItem('areaUnlocked_'+a.id); }

function runToolAction(tool, areaId){
  try{ window.MGD_TOOLS && window.MGD_TOOLS.runAction(tool.action, {areaId}); }catch(e){}
}

function card(a){
  const s=document.createElement('div'); s.className='area-card';
  s.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.35);min-height:120px;display:flex;flex-direction:column;justify-content:space-between;cursor:pointer;';
  const status = document.createElement('div'); status.className='sub'; status.style.opacity='.8'; status.dataset.status='';
  status.textContent = isUnlocked(a) ? 'Unlocked' : 'Locked';
  s.innerHTML = `<div style="font-weight:700">${a.title}</div><div class="sub" style="opacity:.85;margin:6px 0">${a.blurb||''}</div>`;
  s.appendChild(status);
  s.dataset.areaId = a.id;
  s.addEventListener('click', ()=>{
    if (isUnlocked(a)){ openArea(a); }
    else { lockMsg(a, status); }
  });
  return s;
}

function lockMsg(a, statusEl){
  const box=document.createElement('div'); box.id='lock-overlay'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
  box.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:10052;display:flex;align-items:center;justify-content:center;color:#fff;';
  box.innerHTML = `<div class="dialog-card" style="max-width:640px;width:95%;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(0,0,0,.45)">
    <h3 style="margin:0 0 6px">${a.title}</h3>
    <p class="sub" style="opacity:.9;margin:0 0 8px">This area is locked — perform the Master’s ritual to unlock.</p>
    <div class="row" style="gap:8px;flex-wrap:wrap">
      <button id="begin-ritual" class="btn">Begin Ritual</button>
      <button id="close" class="btn secondary">Close</button>
    </div>
  </div>`;
  document.body.appendChild(box);
  box.querySelector('#close').addEventListener('click', ()=> box.remove());
  box.querySelector('#begin-ritual').addEventListener('click', ()=>{
    box.remove();
    openRitual(a.id, ()=>{
      localStorage.setItem('areaUnlocked_'+a.id,'1');
      if (statusEl) statusEl.textContent='Unlocked';
      openArea(a);
    });
  });
}

function areaSection(){
  const s=document.createElement('section'); s.id='sanctum-v2';
  s.style.cssText='max-width:1100px;margin:24px auto;padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(0,0,0,.25)';
  s.innerHTML='<h2 style="margin:0 0 6px">Sanctum</h2><p class="sub" style="opacity:.85;margin:0 0 8px">Choose an area. Tools appear within; the path remembers you.</p><div id="areas-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px"></div>';
  return s;
}

function renderAreaTools(wrap, a){
  const lvl = (window.MGD_PROGRESS && typeof window.MGD_PROGRESS.level==='function') ? window.MGD_PROGRESS.level() : 0;
  const tools = (window.MGD_TOOLS && window.MGD_TOOLS.choose) ? window.MGD_TOOLS.choose(a.id, lvl) : [];
  const sec = document.createElement('section');
  sec.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px';
  sec.innerHTML = `<h3 style="margin:0 0 6px">Area Tools</h3><div class="row" style="gap:8px;flex-wrap:wrap" id="tool-row"></div>`;
  wrap.appendChild(sec);
  const row = sec.querySelector('#tool-row');
  tools.forEach(t=>{
    const b=document.createElement('button'); b.className='btn'; b.textContent=t.label;
    b.addEventListener('click', ()=> runToolAction(t, a.id));
    row.appendChild(b);
  });
  if (!tools.length){
    const p=document.createElement('p'); p.className='sub'; p.style.opacity='.8'; p.textContent='Tools will appear as you progress.'; sec.appendChild(p);
  }
}

function miniSanctum(a){
  const box=document.createElement('div'); box.id='area-overlay'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
  box.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:10054;color:#fff;overflow:auto';
  box.innerHTML = `
  <div style="max-width:980px;margin:24px auto;padding:12px">
    <div class="row" style="justify-content:space-between;align-items:center">
      <h2 style="margin:0">${a.title}</h2>
      <button id="area-close" class="btn secondary">Return to Sanctum</button>
    </div>
    <p class="sub" style="opacity:.9;margin:6px 0 12px">${a.blurb||''}</p>
    <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px">
      <section style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 6px">Area Lore</h3>
        <textarea id="area-lore" style="width:100%;min-height:120px" class="input" placeholder="Notes, teachings, quotes..."></textarea>
        <div class="row" style="gap:8px;margin-top:6px"><button id="save-lore" class="btn">Save</button></div>
      </section>
      <section style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 6px">Area Gallery</h3>
        <input id="area-upload" type="file" accept="image/*" multiple>
        <div id="area-gallery" class="gallery-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:8px"></div>
      </section>
      <section style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 6px">Area Memories</h3>
        <textarea id="area-memo" style="width:100%;min-height:120px" class="input" placeholder="Add a remembrance..."></textarea>
        <div class="row" style="gap:8px;margin-top:6px"><button id="add-memo" class="btn">Add</button></div>
        <ul id="memo-list" style="margin-top:6px"></ul>
      </section>
    </div>
    <div id="area-tools-wrap" style="margin-top:12px"></div>
  </div>`;
  document.body.appendChild(box);
  fireArea(a.id);

  // Wire Lore/Gallery/Memories like before
  const loreKey='mgd.area.lore.'+a.id, galKey='mgd.area.gallery.'+a.id, memKey='mgd.area.mem.'+a.id;
  const loreBox=box.querySelector('#area-lore'); loreBox.value = localStorage.getItem(loreKey)||'';
  box.querySelector('#save-lore').addEventListener('click', ()=> localStorage.setItem(loreKey, loreBox.value||''));
  function readGallery(){ try{ return JSON.parse(localStorage.getItem(galKey)||'[]'); }catch(e){ return []; } }
  function writeGallery(L){ localStorage.setItem(galKey, JSON.stringify(L)); renderGallery(); }
  function renderGallery(){
    const wrap=box.querySelector('#area-gallery'); wrap.innerHTML='';
    const L=readGallery();
    L.forEach((it, idx)=>{
      const card=document.createElement('div'); card.className='gcard'; card.draggable=true;
      card.style.cssText='position:relative;border:1px solid rgba(255,255,255,.15);border-radius:8px;overflow:hidden;height:120px;background:#000;display:flex;align-items:center;justify-content:center';
      if (it.hidden){
        card.innerHTML = '<div style="font-size:42px;opacity:.6">ᛝ</div><button class="btn" style="position:absolute;bottom:6px;left:6px" data-show>Show</button>';
      }else{
        const img=document.createElement('img'); img.src=it.data; img.alt=it.title||''; img.style='width:100%;height:100%;object-fit:cover;';
        const hide=document.createElement('button'); hide.className='btn'; hide.textContent='Hide'; hide.style.cssText='position:absolute;bottom:6px;left:6px';
        hide.addEventListener('click', ()=>{ const L=readGallery(); L[idx].hidden=true; writeGallery(L); });
        card.appendChild(img); card.appendChild(hide);
      }
      card.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', String(idx)); });
      card.addEventListener('dragover', e=> e.preventDefault());
      card.addEventListener('drop', e=>{
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'),10);
        const to = idx;
        if (from===to) return;
        const L=readGallery(); const [m]=L.splice(from,1); L.splice(to,0,m); writeGallery(L);
      });
      card.querySelector('[data-show]')?.addEventListener('click', ()=>{ const L=readGallery(); L[idx].hidden=false; writeGallery(L); });
      wrap.appendChild(card);
    });
  }
  box.querySelector('#area-upload').addEventListener('change', (e)=>{
    const files = Array.from(e.target.files||[]).slice(0, 50);
    if (!files.length) return;
    const acc = readGallery(); let i=0;
    function next(){
      const f=files[i++]; if (!f) { writeGallery(acc); return; }
      const r=new FileReader(); r.onload=ev=>{ acc.unshift({id:'img_'+Date.now()+'_'+i, data:ev.target.result, hidden:false}); next(); }; r.readAsDataURL(f);
    }
    next();
  });
  function readM(){ try{ return JSON.parse(localStorage.getItem(memKey)||'[]'); }catch(e){ return []; } }
  function writeM(L){ localStorage.setItem(memKey, JSON.stringify(L)); renderM(); }
  function renderM(){
    const list=box.querySelector('#memo-list'); list.innerHTML='';
    readM().forEach(m=>{
      const li=document.createElement('li'); li.textContent = new Date(m.t).toLocaleString() + ': ' + m.text; list.appendChild(li);
    });
  }
  renderGallery(); renderM();
  box.querySelector('#add-memo').addEventListener('click', ()=>{
    const v = (box.querySelector('#area-memo').value||'').trim(); if (!v) return;
    const L=readM(); L.unshift({t:Date.now(), text:v}); writeM(L); box.querySelector('#area-memo').value='';
  });
  box.querySelector('#area-close').addEventListener('click', ()=> box.remove());

  // Render Area Tools (contextual, progressive)
  renderAreaTools(box.querySelector('#area-tools-wrap'), a);
}

function openArea(a){ miniSanctum(a); }

export async function buildSanctum(){
  const conf = await loadAreas();
  const sec = areaSection();
  const grid = sec.querySelector('#areas-grid');
  conf.areas.forEach(a=> grid.appendChild(card(a)));
  document.body.insertBefore(sec, document.body.firstChild);
}
document.addEventListener('DOMContentLoaded', ()=> buildSanctum());
