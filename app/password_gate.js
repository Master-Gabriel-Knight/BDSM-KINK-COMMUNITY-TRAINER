(function(){
  const KEY_OK='mgd.gate.ok', KEY_WORD='mgd.gate.word';
  function ok(){ return localStorage.getItem(KEY_OK)==='1'; }
  function word(){ return localStorage.getItem(KEY_WORD) || 'iremember'; }
  function build(){
    if (ok()) return;
    const box=document.createElement('div');
    box.id='password-gate';
    box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
    box.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:10040;display:flex;align-items:center;justify-content:center;color:#fff;';
    box.innerHTML=`
      <div class="dialog-card" style="max-width:520px;width:92%;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(0,0,0,.45)">
        <h2 style="margin:0 0 6px">Word of Power</h2>
        <p class="sub" style="opacity:.85;margin:0 0 8px">Enter the word to enter. Default is <code>iremember</code>.</p>
        <input id="pg-in" class="input" placeholder="word" style="width:100%">
        <div class="row" style="gap:8px;margin-top:8px;align-items:center;flex-wrap:wrap">
          <button id="pg-enter" class="btn">Enter</button>
          <label class="sub"><input id="pg-remember" type="checkbox" checked> Remember me</label>
        </div>
      </div>`;
    document.body.appendChild(box);
    const i=box.querySelector('#pg-in');
    function tryEnter(){
      const v=(i.value||'').trim();
      if (!v) return;
      if (v===word()){
        if (box.querySelector('#pg-remember')?.checked){ localStorage.setItem(KEY_OK,'1'); }
        box.remove();
        document.dispatchEvent(new CustomEvent('mgd:gateOpen'));
      } else { i.value=''; i.placeholder='try again'; }
    }
    box.querySelector('#pg-enter').addEventListener('click', tryEnter);
    i.addEventListener('keydown', (e)=>{ if(e.key==='Enter') tryEnter(); });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    if (document.getElementById('consent-sigil-gate')){
      document.addEventListener('mgd:consentGiven', build, {once:true});
    } else { build(); }
  });
})();
