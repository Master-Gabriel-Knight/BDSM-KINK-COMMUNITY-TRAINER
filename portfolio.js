
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]); }
function lore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function pulseLog(){ try{ return JSON.parse(localStorage.getItem('mgd.pulse.log')||'[]'); }catch(e){ return []; } }
function sigils(){ try{ return JSON.parse(localStorage.getItem('mgd.sigil.gallery')||'[]'); }catch(e){ return []; } }
function transcriptText(){ try{ const L=JSON.parse(localStorage.getItem('mgd.transcript')||'[]'); return L.map(x=> `[${new Date(x.t).toLocaleTimeString()}] ${x.line}`).join('\n'); }catch(e){return ''} }
export function bootstrapPortfolio(){
  const btn=document.getElementById('portfolio-export'); if(!btn) return;
  btn.addEventListener('click', ()=>{
    const deb = lore().find(x=> /Debrief/i.test(x.title||'')) || {content:''};
    const script = document.getElementById('script-view')?.textContent||'';
    const pulses = pulseLog();
    const transcript = transcriptText();
    // capture timeline canvas if present
    let tlData=''; try{ const c=document.getElementById('tl-canvas'); if(c){ tlData=c.toDataURL('image/png'); } }catch(e){}
    // sigil thumbs
    const sg = sigils().slice(0,6);
    const html = `<!doctype html><meta charset="utf-8"><title>MGD Session Portfolio</title>
    <style>body{font-family:serif;padding:24px;max-width:900px;margin:auto} h1,h2,h3{{margin:0 0 8px}} .box{{border:1px solid #333;border-radius:8px;padding:12px;margin:10px 0}} .grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px}}</style>
    <h1>Session Portfolio</h1>
    <div class="box"><h2>Debrief</h2><pre>${esc(deb.content||'')}</pre></div>
    <div class="box"><h2>Script</h2><pre>${esc(script)}</pre></div>
    <div class="box"><h2>Timeline</h2>${tlData? '<img src="'+tlData+'" style="width:100%">' : '<p><em>No timeline captured.</em></p>'}</div>
    <div class="box"><h2>Pulses</h2>${pulses.length? '<ul>'+pulses.map(p=> '<li>'+new Date(p.t).toLocaleTimeString()+': '+p.v+'</li>').join('')+'</ul>' : '<p><em>No pulses recorded.</em></p>'}</div>
    <div class="box"><h2>Transcript</h2><pre>${esc(transcript)}</pre></div>
    <div class="box"><h2>Sigils</h2>${sg.length? '<div class="grid">'+sg.map(s=> '<img src="'+s.data+'" style="width:100%;border-radius:8px">').join('')+'</div>' : '<p><em>No sigils saved.</em></p>'}</div>
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
