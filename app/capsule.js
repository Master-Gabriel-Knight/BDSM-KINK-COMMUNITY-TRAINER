
function esc(s){ return (s||'').replace(/[&<>]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]); }
function lore(){ try{return JSON.parse(localStorage.getItem('mgd.lore')||'[]')}catch(e){return[]} }
function transcriptText(){ try{ const L=JSON.parse(localStorage.getItem('mgd.transcript')||'[]'); return L.map(x=> `[${new Date(x.t).toLocaleTimeString()}] ${x.line}`).join('\n'); }catch(e){return ''} }
function pulseLog(){ try{ return JSON.parse(localStorage.getItem('mgd.pulse.log')||'[]'); }catch(e){ return []; } }
function redact(s){ if (document.getElementById('capsule-redact')?.checked){ return (s||'').replace(/[A-Z][a-z]+\s+[A-Z][a-z]+/g,'[name]').replace(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,'[phone]').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+/gi,'[email]'); } return s; }
export function bootstrapCapsule(){
  document.getElementById('capsule-export')?.addEventListener('click', ()=>{
    const deb = lore().find(x=> /Debrief/i.test(x.title||'')) || {content:''};
    const script = document.getElementById('script-view')?.textContent||'';
    const transcript = transcriptText();
    const pulses = pulseLog();
    const html = `<!doctype html><meta charset="utf-8"><title>MGD Session Capsule</title>
    <style>body{font-family:serif;padding:24px;max-width:860px;margin:auto} pre{white-space:pre-wrap}</style>
    <h1>Session Capsule</h1>
    <h2>Debrief</h2><pre>${esc(redact(deb.content||''))}</pre>
    <h2>Script Snapshot</h2><pre>${esc(redact(script))}</pre>
    <h2>Pulses</h2>${pulses.length? '<ul>'+pulses.map(p=> '<li>'+new Date(p.t).toLocaleTimeString()+': '+p.v+'</li>').join('')+'</ul>' : '<p><em>No pulses recorded.</em></p>'}
    <h2>Transcript</h2><pre>${esc(redact(transcript))}</pre>
    <script>window.onload=()=>window.print()</script>`;
    const w=window.open('about:blank'); w.document.write(html); w.document.close();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCapsule);
