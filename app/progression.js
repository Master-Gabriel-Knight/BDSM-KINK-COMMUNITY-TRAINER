(function(){
  const KEY='mgd.progress.level';
  const AREA_KEY='mgd.progress.areas';
  function level(){ return parseInt(localStorage.getItem(KEY)||'0',10) || 0; }
  function setLevel(n){ localStorage.setItem(KEY, String(n)); }
  function areas(){ try{ return JSON.parse(localStorage.getItem(AREA_KEY)||'{}'); }catch(e){ return {}; } }
  function bumpArea(a){
    const A=areas(); A[a]=(A[a]||0)+1; localStorage.setItem(AREA_KEY, JSON.stringify(A));
    const visits = Object.values(A).reduce((x,y)=> x+y, 0);
    const newLevel = Math.min(10, Math.floor(visits/3));
    if (newLevel>level()) setLevel(newLevel);
    window.dispatchEvent(new CustomEvent('mgd:progress',{detail:{level:newLevel, area:a}}));
  }
  window.addEventListener('mgd:area', e=> bumpArea(String(e.detail||'sanctum')));
  window.MGD_PROGRESS = { level, areas };
})();
