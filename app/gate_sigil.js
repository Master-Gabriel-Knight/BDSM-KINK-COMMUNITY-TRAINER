(function(){
  const KEY_OK = 'mgd.consent.given';
  const KEY_GALLERY = 'mgd.sigil.gallery';
  function hasConsent(){ return localStorage.getItem(KEY_OK)==='1'; }
  function saveSigil(dataUrl){
    try{
      const now = Date.now();
      const item = { id:'consent_'+now, title:'Consent Sigil', when:now, data:dataUrl, tags:['consent','gate'] };
      const L = JSON.parse(localStorage.getItem(KEY_GALLERY)||'[]');
      L.unshift(item);
      localStorage.setItem(KEY_GALLERY, JSON.stringify(L));
    }catch(e){}
  }
  function buildUI(){
    const box = document.createElement('div');
    box.id = 'consent-sigil-gate';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-modal','true');
    box.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:10050;display:flex;align-items:center;justify-content:center;color:#fff;';
    box.innerHTML = `
      <div class="dialog-card" style="max-width:720px;width:95%;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(0,0,0,.4)">
        <h2 style="margin:0 0 6px">One‑Time Consent</h2>
        <p class="sub" style="opacity:.9;margin:0 0 8px">Draw a sigil to grant one‑time consent to store your settings <em>locally</em>. This also unlocks the site. Your sigil goes to the Global Gallery.</p>
        <canvas id="cs-canvas" width="640" height="300" style="width:100%;height:auto;border:1px dashed rgba(255,255,255,.25);border-radius:10px;background:#000"></canvas>
        <div class="row" style="gap:8px;margin-top:8px;flex-wrap:wrap;align-items:center">
          <button id="cs-clear" class="btn secondary">Clear</button>
          <button id="cs-consent" class="btn">I Consent</button>
          <label class="sub"><input id="cs-also-amb" type="checkbox" checked> Enable ambience</label>
        </div>
        <p class="sub" style="opacity:.8;margin-top:6px">This consent is stored only on your device. You can revoke it anytime by clearing site data.</p>
      </div>`;
    document.body.appendChild(box);
    const cv = box.querySelector('#cs-canvas');
    const ctx = cv.getContext('2d');
    ctx.strokeStyle = '#9ad5ff'; ctx.lineWidth = 2; ctx.lineCap='round';
    let drawing=false, last=null;
    function pos(e){ const r=cv.getBoundingClientRect(); const x=(e.touches? e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches? e.touches[0].clientY:e.clientY)-r.top; return {x:x*(cv.width/r.width), y:y*(cv.height/r.height)}; }
    function down(e){ drawing=true; last=pos(e); e.preventDefault(); }
    function move(e){ if(!drawing) return; const p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; e.preventDefault(); }
    function up(){ drawing=false; }
    cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    cv.addEventListener('touchstart', down, {passive:false}); cv.addEventListener('touchmove', move, {passive:false}); cv.addEventListener('touchend', up);
    box.querySelector('#cs-clear').addEventListener('click', ()=>{ ctx.clearRect(0,0,cv.width,cv.height); });
    box.querySelector('#cs-consent').addEventListener('click', ()=>{
      const data = cv.toDataURL('image/png');
      saveSigil(data);
      localStorage.setItem(KEY_OK,'1');
      if (box.querySelector('#cs-also-amb')?.checked){ localStorage.setItem('mgd.ambience.on','1'); }
      box.remove();
      document.dispatchEvent(new CustomEvent('mgd:consentGiven'));
    });
  }
  function init(){
    if (hasConsent()) return;
    setTimeout(buildUI, 100);
  }
  document.addEventListener('DOMContentLoaded', init);
})();
