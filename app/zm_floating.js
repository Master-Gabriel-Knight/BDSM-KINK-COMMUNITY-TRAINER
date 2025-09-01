(function(){
  const EXCLUDE = new Set(['sanctum','gallery']);
  const svg = `<svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/200/svg">
    <path d="M32 6 L58 54 H6 Z" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="32" cy="34" r="12" fill="none" stroke="currentColor" stroke-width="4"/>
    <circle cx="32" cy="34" r="4" fill="currentColor"/>
  </svg>`;
  let btn=null, area='sanctum';
  function ensure(){
    if (btn) return btn;
    btn=document.createElement('button'); btn.id='zm-float'; btn.title='ZM';
    btn.style.cssText='position:fixed;right:12px;bottom:64px;z-index:60;border:1px solid rgba(255,255,255,.3);border-radius:50%;width:44px;height:44px;background:rgba(0,0,0,.6);color:#fff;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(6px)';
    btn.innerHTML=svg;
    btn.addEventListener('click', ()=>{
      const speakBox=document.getElementById('zm-speak');
      if (speakBox){ speakBox.checked = !speakBox.checked; speakBox.dispatchEvent(new Event('change')); }
      const zmi=document.getElementById('zm-insights');
      if (zmi){ zmi.style.display = (zmi.style.display==='block'?'none':'block'); }
    });
    document.body.appendChild(btn);
    return btn;
  }
  function onArea(a){
    area=a;
    ensure();
    btn.style.display = EXCLUDE.has(a) ? 'none':'flex';
  }
  window.addEventListener('mgd:area', (e)=> onArea(String(e.detail||'sanctum')));
  document.addEventListener('DOMContentLoaded', ()=> onArea(localStorage.getItem('mgd.area')||'sanctum'));
})();
