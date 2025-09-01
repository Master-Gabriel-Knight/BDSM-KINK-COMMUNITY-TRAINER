(function(){
  function pane(){
    const sec=document.createElement('section'); sec.id='settings-pane';
    sec.style.cssText='max-width:1100px;margin:24px auto;padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:12px;background:rgba(0,0,0,.25)';
    sec.innerHTML = `
      <h2 style="margin:0 0 6px">Settings</h2>
      <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
        <label><input id="set-remember" type="checkbox"> Remember me (skip password)</label>
        <label><input id="set-mute" type="checkbox"> Mute ambience</label>
        <label><input id="set-reduce" type="checkbox"> Reduce motion</label>
        <label>Theme <select id="set-theme"><option value="dark">Dark</option><option value="light">Light</option></select></label>
        <button id="set-reset" class="btn secondary">Reset All Ritual Progress & Relock Areas</button>
      </div>`;
    document.body.appendChild(sec);
    const remember = localStorage.getItem('mgd.gate.ok')==='1';
    const mute = localStorage.getItem('mgd.ambience.on')!=='1';
    const reduce = localStorage.getItem('mgd.set.reduce')==='1';
    const theme = localStorage.getItem('mgd.set.theme')||'dark';
    sec.querySelector('#set-remember').checked = remember;
    sec.querySelector('#set-mute').checked = mute;
    sec.querySelector('#set-reduce').checked = reduce;
    sec.querySelector('#set-theme').value = theme;
    sec.querySelector('#set-remember').addEventListener('change', e=> localStorage.setItem('mgd.gate.ok', e.target.checked ? '1':'0'));
    sec.querySelector('#set-mute').addEventListener('change', e=> localStorage.setItem('mgd.ambience.on', e.target.checked ? '0':'1'));
    sec.querySelector('#set-reduce').addEventListener('change', e=> localStorage.setItem('mgd.set.reduce', e.target.checked ? '1':'0'));
    sec.querySelector('#set-theme').addEventListener('change', e=> localStorage.setItem('mgd.set.theme', e.target.value));
    sec.querySelector('#set-reset').addEventListener('click', ()=>{
      Object.keys(localStorage).filter(k=> k.startsWith('areaUnlocked_')).forEach(k=> localStorage.removeItem(k));
      alert('Ritual progress reset. Cards will show as Locked again.');
      location.reload();
    });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', pane);
  else pane();
})();
