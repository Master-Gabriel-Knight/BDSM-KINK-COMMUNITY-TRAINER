(function(){
  const KEY_GALLERY='mgd.sigil.gallery';
  function build(){
    if (document.getElementById('sigil-studio-section')) return;
    const sec=document.createElement('section'); sec.id='sigil-studio-section'; sec.setAttribute('data-area','sigil-studio');
    sec.style.cssText='max-width:980px;margin:24px auto;padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(0,0,0,.35)';
    sec.innerHTML = `
      <h2 class="title" style="margin:0 0 6px">Sigil Studio — Sex Magick</h2>
      <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
        <input id="ss-intent" class="input" placeholder="Intent (e.g., safety, intimacy, courage)" style="min-width:280px">
        <input id="ss-mantra" class="input" placeholder="Mantra (optional)">
        <button id="ss-clear" class="btn secondary">Clear</button>
        <button id="ss-save" class="btn">Save to Gallery</button>
      </div>
      <canvas id="ss-canvas" width="980" height="360" style="display:block;width:100%;height:auto;margin-top:8px;border:1px dashed rgba(255,255,255,.25);border-radius:12px;background:#000"></canvas>
      <p class="sub" style="opacity:.85;margin-top:6px">Tip: draw from breath; exhale through the stroke. The Studio is local‑only unless you export.</p>
    `;
    document.body.appendChild(sec);
    const cv=sec.querySelector('#ss-canvas'), ctx=cv.getContext('2d');
    ctx.strokeStyle='#ffb4f0'; ctx.lineWidth=2; ctx.lineCap='round';
    let drawing=false,last=null;
    function pos(e){ const r=cv.getBoundingClientRect(); const x=(e.touches? e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches? e.touches[0].clientY:e.clientY)-r.top; return {x:x*(cv.width/r.width), y:y*(cv.height/r.height)}; }
    function down(e){ drawing=true; last=pos(e); e.preventDefault(); }
    function move(e){ if(!drawing) return; const p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; e.preventDefault(); }
    function up(){ drawing=false; }
    cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    cv.addEventListener('touchstart', down, {passive:false}); cv.addEventListener('touchmove', move, {passive:false}); cv.addEventListener('touchend', up);
    sec.querySelector('#ss-clear').addEventListener('click', ()=> ctx.clearRect(0,0,cv.width,cv.height));
    sec.querySelector('#ss-save').addEventListener('click', ()=>{
      const intent = (sec.querySelector('#ss-intent')?.value||'').trim();
      const mantra = (sec.querySelector('#ss-mantra')?.value||'').trim();
      const data = cv.toDataURL('image/png');
      const item = { id:'sigil_'+Date.now(), title:intent||'Sigil', mantra, data, when:Date.now(), tags:['sigil','studio','sex-magick'] };
      try{ const L=JSON.parse(localStorage.getItem(KEY_GALLERY)||'[]'); L.unshift(item); localStorage.setItem(KEY_GALLERY, JSON.stringify(L)); alert('Saved to Gallery'); }catch(e){}
    });
  }
  document.addEventListener('DOMContentLoaded', build);
})();
