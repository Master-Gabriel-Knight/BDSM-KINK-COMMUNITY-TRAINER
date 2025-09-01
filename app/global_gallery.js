(function(){
  const KEY='mgd.sigil.gallery';
  function ensureSection(){
    let sec=document.getElementById('global-gallery');
    if (!sec){
      sec=document.createElement('section'); sec.id='global-gallery';
      sec.style.cssText='max-width:1100px;margin:24px auto;padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(0,0,0,.25)';
      sec.innerHTML='<h2 style="margin:0 0 6px">Global Gallery</h2><div class="row" style="gap:8px;align-items:center;flex-wrap:wrap"><input id="gg-upload" type="file" accept="image/*" multiple><button id="gg-clear-hidden" class="btn secondary">Reveal All</button></div><div id="gg-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-top:8px"></div>';
      document.body.appendChild(sec);
    }
    return sec;
  }
  function get(){ try{ return JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){ return []; } }
  function put(L){ localStorage.setItem(KEY, JSON.stringify(L)); render(); }
  function render(){
    const grid=ensureSection().querySelector('#gg-grid'); grid.innerHTML='';
    const L=get();
    L.forEach((it, idx)=>{
      const card=document.createElement('div'); card.className='gcard'; card.draggable=true;
      card.style.cssText='position:relative;border:1px solid rgba(255,255,255,.15);border-radius:8px;overflow:hidden;height:140px;background:#000;display:flex;align-items:center;justify-content:center';
      if (it.hidden){
        card.innerHTML = '<div style="font-size:42px;opacity:.6">ᛝ</div><button class="btn" style="position:absolute;bottom:6px;left:6px" data-show>Show</button>';
      }else{
        const img=document.createElement('img'); img.src=it.data; img.alt=it.title||''; img.style='width:100%;height:100%;object-fit:cover;';
        const hide=document.createElement('button'); hide.className='btn'; hide.textContent='Hide'; hide.style.cssText='position:absolute;bottom:6px;left:6px';
        hide.addEventListener('click', ()=>{ const L=get(); L[idx].hidden=true; put(L); });
        card.appendChild(img); card.appendChild(hide);
      }
      card.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', String(idx)); });
      card.addEventListener('dragover', e=> e.preventDefault());
      card.addEventListener('drop', e=>{
        e.preventDefault();
        const from = parseInt(e.dataTransfer.getData('text/plain'),10);
        const to = idx; if (from===to) return;
        const L=get(); const [m]=L.splice(from,1); L.splice(to,0,m); put(L);
      });
      card.querySelector('[data-show]')?.addEventListener('click', ()=>{ const L=get(); L[idx].hidden=false; put(L); });
      grid.appendChild(card);
    });
  }
  ensureSection();
  render();
  ensureSection().querySelector('#gg-upload').addEventListener('change', (e)=>{
    const files = Array.from(e.target.files||[]).slice(0, 100);
    if (!files.length) return;
    const L = get();
    let i=0;
    function next(){
      const f = files[i++]; if (!f){ put(L); return; }
      const r = new FileReader(); r.onload=ev=>{ L.unshift({id:'gg_'+Date.now()+'_'+i, data:ev.target.result, hidden:false}); next(); }; r.readAsDataURL(f);
    }
    next();
  });
  ensureSection().querySelector('#gg-clear-hidden').addEventListener('click', ()=>{
    const L=get().map(x=> ({...x, hidden:false})); put(L);
  });
})();
