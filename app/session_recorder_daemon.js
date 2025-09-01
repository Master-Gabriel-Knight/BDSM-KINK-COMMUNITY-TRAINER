(function(){
  const KEY='mgd.session.record';
  function push(type, payload){
    try{
      const L = JSON.parse(localStorage.getItem(KEY)||'[]');
      L.push({t:Date.now(), type, ...payload});
      localStorage.setItem(KEY, JSON.stringify(L.slice(-5000)));
    }catch(e){}
  }
  window.addEventListener('mgd:safetyPulse', e=> push('pulse',{v:e.detail?.value||e.detail}));
  window.addEventListener('mgd:applyScriptControl', e=>{
    const d=e.detail||{};
    if (d.type==='consent') push('consent',{v:d.value});
    if (d.type==='teleprompter') push('tp',{v:d.value, speed:d.speed});
    if (d.type==='chapter') push('chapter',{v:d.value});
  });
  document.addEventListener('DOMContentLoaded', ()=>{
    Array.from(document.querySelectorAll('[id*="recorder" i], [id*="record" i]')).forEach(el=> el.setAttribute('data-zm-hide','1'));
  });
})();
