(function(){
  function unlock(){
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.classList.remove('no-scroll','locked','lock');
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', unlock);
  else unlock();
})();
