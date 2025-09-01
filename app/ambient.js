(function(){
  const LS = { on:'mgd.ambience.on', area:'mgd.area' };
  const TRACKS = {
    sanctum: 'ambient_sanctum.mp3',
    stage: 'ambient_stage.mp3',
    guardian: 'ambient_guardian.mp3',
    workshop: 'ambient_workshop.mp3',
    vault: 'ambient_vault.mp3',
    'sigil-studio': 'ambient_sigil.mp3'
  };
  let audio=null, ready=false, current='';
  function ensureUI(){
    if (document.getElementById('amb-bar')) return;
    const bar=document.createElement('div'); bar.id='amb-bar';
    bar.style.cssText='position:fixed;right:10px;bottom:10px;z-index:50;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:6px 10px;display:flex;gap:8px;align-items:center';
    bar.innerHTML = `<button id="amb-toggle" class="btn">${localStorage.getItem(LS.on)==='1'?'Mute':'Ambience'}</button><span class="sub" style="opacity:.85">♪</span>`;
    document.body.appendChild(bar);
    bar.querySelector('#amb-toggle').addEventListener('click', ()=>{
      localStorage.setItem(LS.on, localStorage.getItem(LS.on)==='1' ? '0':'1');
      bar.querySelector('#amb-toggle').textContent = (localStorage.getItem(LS.on)==='1'?'Mute':'Ambience');
      if (localStorage.getItem(LS.on)==='1'){ playForArea(localStorage.getItem(LS.area)||'sanctum'); } else { stop(); }
    });
  }
  function setup(){
    ensureUI();
    if (!audio){ audio = new Audio(); audio.loop=true; audio.volume=0.45; document.addEventListener('click', ()=>{ ready=true; if (localStorage.getItem(LS.on)==='1'){ playForArea(localStorage.getItem(LS.area)||'sanctum'); } }, {once:true}); }
  }
  function asset(name){ return (window.MGD_AMBIENT_BASE||'app/audio/') + name; }
  function playForArea(area){
    setup();
    localStorage.setItem(LS.area, area);
    if (!ready || localStorage.getItem(LS.on)!=='1') return;
    const file = TRACKS[area] || TRACKS['sanctum'];
    if (current===file) return;
    current=file;
    audio.src = asset(file);
    audio.play().catch(()=>{});
  }
  function stop(){ try{ audio && audio.pause(); }catch(e){} }
  window.MGD_AMBIENT = { playForArea, stop };
  document.addEventListener('DOMContentLoaded', setup);
  window.addEventListener('mgd:area', (e)=> playForArea(String(e.detail||'sanctum')));
})();
