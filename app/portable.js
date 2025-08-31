
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]); }
export function bootstrapPortable(){
  document.getElementById('portable-export')?.addEventListener('click', ()=>{
    const txt = document.getElementById('script-view')?.textContent||'';
    const html = `<!doctype html><meta charset="utf-8"><title>Standalone Ritual</title>
    <style>body{font-family:serif;background:#000;color:#eaeaea;margin:0} #bar{position:fixed;left:0;right:0;top:0;padding:8px;background:#111;display:flex;gap:8px;align-items:center} #view{padding:64px 6vw;white-space:pre-wrap;font-size:22px;line-height:1.5} button{padding:6px 10px}</style>
    <div id="bar"><button id="start">Start</button><button id="pause">Pause</button><label>Speed <input id="speed" type="range" min="10" max="200" value="60"></label><label>Size <input id="size" type="range" min="18" max="72" value="22"></label></div>
    <div id="view">${esc(txt)}</div>
    <script>
      let run=false, y=0; function tick(){ if(run){ y-= (parseInt(document.getElementById('speed').value||'60',10))/100; document.getElementById('view').style.transform='translateY('+y+'px)'; } requestAnimationFrame(tick); }
      document.getElementById('start').onclick=()=> run=true; document.getElementById('pause').onclick=()=> run=false;
      document.getElementById('size').oninput=()=> document.getElementById('view').style.fontSize = document.getElementById('size').value+'px'; tick();
    </script>`;
    const blob = new Blob([html], {type:'text/html'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='MGD_standalone_ritual.html'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPortable);
