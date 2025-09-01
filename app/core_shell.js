(function(){
  const CORE = new Set(['sanctum-v2','global-gallery','settings-pane','consent-sigil-gate','password-gate','ritual-overlay','area-overlay','rune-bg-canvas','core-nav']);
  function ensureNav(){
    if (document.getElementById('core-nav')) return;
    const nav = document.createElement('nav');
    nav.id='core-nav';
    nav.style.cssText='position:fixed;top:10px;left:10px;z-index:1000;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:6px 8px;display:flex;gap:8px;align-items:center';
    nav.innerHTML = `
      <button class="btn" data-target="sanctum-v2" title="Sanctum" style="font-size:18px">⟡</button>
      <button class="btn" data-target="global-gallery" title="Global Gallery" style="font-size:18px">ᛝ</button>
      <button class="btn" data-target="settings-pane" title="Settings" style="font-size:18px">⚙</button>
    `;
    nav.addEventListener('click', (e)=>{
      const b = e.target.closest('button[data-target]'); if(!b) return;
      showOnly(b.getAttribute('data-target'));
    });
    document.body.appendChild(nav);
  }
  function showOnly(id){
    if (id==='sanctum-v2') window.dispatchEvent(new CustomEvent('mgd:area',{detail:'sanctum'}));
    if (id==='global-gallery') window.dispatchEvent(new CustomEvent('mgd:area',{detail:'gallery'}));
    Array.from(document.body.children).forEach(el=>{
      if (!CORE.has(el.id)) { el.style.display='none'; return; }
      if (/-(gate|overlay)$/.test(el.id) || el.id==='rune-bg-canvas' || el.id==='core-nav'){
        el.style.display='block';
      } else {
        el.style.display = (el.id===id? 'block':'none');
      }
    });
    const tgt = document.getElementById(id); if (tgt) tgt.scrollIntoView({behavior:'smooth'});
  }
  function init(){
    ensureNav();
    showOnly('sanctum-v2');
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
