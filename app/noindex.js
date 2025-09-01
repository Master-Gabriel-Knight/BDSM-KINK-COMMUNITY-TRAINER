(function(){
  function addMeta(){
    if (document.querySelector('meta[name="robots"]')) return;
    const m=document.createElement('meta'); m.name='robots'; m.content='noindex, nofollow';
    document.head.appendChild(m);
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', addMeta);
  else addMeta();
})();
