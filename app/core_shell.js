// Minimal Core Shell — keep only Sanctum grid + Core Nav; hide everything else by default.
// Nav has 3 glyph buttons: Sanctum (⟡), Gallery (ᛝ), Settings (⚙).
// Allows overlays: consent/password/ritual/area, and rune background.
(function(){
  const KEEP_STATIC = new Set(['sanctum-v2','global-gallery','settings-pane','consent-sigil-gate','password-gate','ritual-overlay','area-overlay','rune-bg-canvas']);
  let nav=null;
  function ensureNav(){
    if (document.getElementById('core-nav')) return;
    nav = document.createElement('nav');
    nav.id='core-nav';
    nav.style.cssText='position:fixed;top:10px;left:10px;z-index:1000;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:6px 8px;display:flex;gap:8px;align-items:center';
    nav.innerHTML = `
      <button class="btn" data-target="sanctum-v2" title="Sanctum" style="font-size:18px">⟡</button>
      <button class="btn" data-target="global-gallery" title="Global Gallery" style="font-size:18px">ᛝ</button>
      <button class="btn" data-target="settings-pane" title="Settings" style="font-size:18px">⚙</button>
    `;
    document.body.appendChild(nav);
    nav.addEventListener('click', (e)=>{
      const btn = e.target.closest('button[data-target]'); if (!btn) return;
      showOnly(btn.getAttribute('data-target'));
    });
  }
  function keepId(el){ return KEEP_STATIC.has(el.id) || el.id==='core-nav'; }
  function showOnly(targetId){
    // Set area for ambience/runes
    if (targetId==='sanctum-v2'){ window.dispatchEvent(new CustomEvent('mgd:area', {detail:'sanctum'})); }
    else if (targetId==='global-gallery'){ window.dispatchEvent(new CustomEvent('mgd:area', {detail:'gallery'})); }
    else if (targetId==='settings-pane'){ window.dispatchEvent(new CustomEvent('mgd:area', {detail:'sanctum'})); }
    // Toggle visibility
    Array.from(document.body.children).forEach(el=>{
      if (keepId(el)){
        if (el.id===targetId || el.id==='core-nav' || el.id==='rune-bg-canvas'){
          el.style.display = (el.id==='rune-bg-canvas') ? 'block' : 'block';
        } else if (!/-(gate|overlay)$/.test(el.id)){
          el.style.display = 'none';
        }
      }else{
        // everything else is non-core → hide
        el.setAttribute('data-noncore','1');
        el.style.display='none';
      }
    });
    // Focus scroll
    const tgt = document.getElementById(targetId);
    if (tgt) tgt.scrollIntoView({behavior:'smooth', block:'start'});
  }
  function liftSanctum(){
    const s = document.getElementById('sanctum-v2');
    if (s){ s.style.position='relative'; s.style.zIndex='5'; }
  }
  function prune(){
    ensureNav(); liftSanctum();
    // First render: show Sanctum only
    showOnly('sanctum-v2');
  }
  // Watch for late-added sections (global gallery & settings create themselves)
  const mo = new MutationObserver(()=> prune());
  mo.observe(document.documentElement, {childList:true, subtree:true});

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', prune);
  else prune();
})();
