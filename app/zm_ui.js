import { enableVoice, setSpeak, speak, listVoices } from './zm_tts.js';
function hideNonfunctional(){
  const suspects = Array.from(document.querySelectorAll('[id*="recorder" i], [id*="record" i], section, div')).filter(el=>{
    const t = (el.querySelector('h2,h3')?.textContent||'') + ' ' + (el.id||'') + ' ' + (el.className||'');
    return /recorder|recording/i.test(t) && !el.closest('[data-zm-keep]');
  });
  suspects.forEach(el=> el.setAttribute('data-zm-hide','1'));
}
function suggestButton(label, id, click){
  const b=document.createElement('button'); b.textContent=label; b.className='btn'; b.addEventListener('click', click);
  b.id=id; return b;
}
function surfaceTools(sugs){
  const box=document.getElementById('tools-drawer'); const row=document.getElementById('tools-suggest');
  if (!box || !row) return;
  row.innerHTML=''; (sugs||[]).forEach(s=> row.appendChild(s));
  box.style.display = sugs && sugs.length ? 'block':'none';
}
export function bootstrapZM_UI(){
  hideNonfunctional();
  const on=document.getElementById('zm-on');
  const speakBox=document.getElementById('zm-speak');
  const voice=document.getElementById('zm-voice');
  const status=document.getElementById('zm-status');
  if (on){ if (localStorage.getItem('mgd.zm.on')!=='0'){ on.checked=true; } else { on.checked=false; } }
  if (speakBox){ if (localStorage.getItem('mgd.zm.speak')==='1'){ speakBox.checked=true; setSpeak(true); } }
  on?.addEventListener('change', ()=>{
    localStorage.setItem('mgd.zm.on', on.checked?'1':'0');
    const zmi=document.getElementById('zm-insights'); if (zmi) zmi.style.display = on.checked ? 'block':'none';
  });
  voice?.addEventListener('click', ()=>{
    const ok = enableVoice();
    if (ok){ status.textContent='voice ready — '+ (listVoices()[0]||'default'); } else { status.textContent='voice not available'; }
  });
  speakBox?.addEventListener('change', ()=>{
    setSpeak(speakBox.checked);
    localStorage.setItem('mgd.zm.speak', speakBox.checked?'1':'0');
  });
  const zmi=document.getElementById('zm-insights'); if (zmi) zmi.style.display = on?.checked ? 'block':'none';
}
document.addEventListener('DOMContentLoaded', bootstrapZM_UI);
