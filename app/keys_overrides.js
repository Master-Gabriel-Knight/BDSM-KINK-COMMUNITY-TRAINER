(function(){
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform);
  function isEditingTarget(t){
    const tag = (t?.tagName||'').toLowerCase();
    return tag==='input' || tag==='textarea' || (t?.isContentEditable);
  }
  function norm(e){
    const mods = [];
    if (e.ctrlKey || e.metaKey) mods.push('CTRL');
    if (e.altKey) mods.push('ALT');
    if (e.shiftKey) mods.push('SHIFT');
    const base = (e.code || e.key || '').toUpperCase();
    const map = { 'KEYK':'K','KEYP':'P','KEYC':'C','KEYF':'F','KEYG':'G','KEYR':'R','KEYY':'Y','ARROWRIGHT':'RIGHT','ARROWLEFT':'LEFT','SPACE':'SPACE' };
    const key = map[base] || base.replace(/^KEY/, '');
    return mods.join('+') + (mods.length?'+':'') + key;
  }
  function click(idOrSel){
    const el = document.getElementById(idOrSel) || document.querySelector(idOrSel);
    if (el) { el.click(); return true; }
    return false;
  }
  function openCommand(){
    if (click('cmd-open')) return;
    if (click('[data-action="command"')) return;
    const drawer = document.getElementById('tools-drawer');
    if (drawer){
      drawer.style.display = drawer.style.display==='block' ? 'none':'block';
      return true;
    }
    return false;
  }
  function pulse(v){
    try{ window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'pulse', value:v}})); }catch(e){}
    try{ window.dispatchEvent(new CustomEvent('mgd:safetyPulse', {detail:{value:v}})); }catch(e){}
  }
  function consent(v){
    try{ window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'consent', value:v}})); }catch(e){}
  }
  const BINDINGS = {
    'CTRL+K': ()=> openCommand() || click('tp-open'),
    'CTRL+SHIFT+K': ()=> openCommand() || click('tp-open'),
    'CTRL+ALT+P': ()=> click('tp-open'),
    'CTRL+ALT+SPACE': ()=> window.dispatchEvent(new CustomEvent('mgd:applyScriptControl',{detail:{type:'teleprompter', value:'toggle'}})),
    'CTRL+ALT+RIGHT': ()=> window.dispatchEvent(new CustomEvent('mgd:applyScriptControl',{detail:{type:'chapter', value:'next'}})),
    'CTRL+ALT+LEFT': ()=> window.dispatchEvent(new CustomEvent('mgd:applyScriptControl',{detail:{type:'chapter', value:'prev'}})),
    'CTRL+ALT+G': ()=> pulse('green'),
    'CTRL+ALT+Y': ()=> pulse('yellow'),
    'CTRL+ALT+R': ()=> pulse('red'),
    'CTRL+ALT+F': ()=> click('freeze-btn') || window.dispatchEvent(new CustomEvent('mgd:applyScriptControl',{detail:{type:'teleprompter', value:'pause'}})),
    'CTRL+ALT+C': ()=> click('consent-open') || click('#consent-prompt') || consent('unsure'),
    'CTRL+ALT+W': ()=> click('wb-open'),
    'CTRL+ALT+V': ()=> { const box=document.getElementById('zm-speak'); if (box){ box.checked=!box.checked; const evt=new Event('change'); box.dispatchEvent(evt);} }
  };
  window.addEventListener('keydown', (e)=>{
    if (isEditingTarget(e.target) && !(e.ctrlKey||e.metaKey||e.altKey)) return;
    const key = norm(e);
    const fn = BINDINGS[key];
    if (fn){
      e.preventDefault();
      e.stopPropagation();
      try{ fn(); }catch(err){ console && console.warn('hotkey error', err); }
    }
  }, true);
  window.MGD_KEYS = { BINDINGS, set:(combo, fn)=>{ BINDINGS[combo.toUpperCase()] = fn; }, remove:(combo)=>{ delete BINDINGS[combo.toUpperCase()]; } };
})();
