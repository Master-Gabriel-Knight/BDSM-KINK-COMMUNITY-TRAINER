
const LS = { v:'mgd.tts.voice', r:'mgd.tts.rate', cues:'mgd.tts.cues', coach:'mgd.tts.coach', steps:'mgd.tts.steps' };
function speak(text){
  try{
    const u=new SpeechSynthesisUtterance(text);
    const vId=localStorage.getItem(LS.v); const rate=parseFloat(localStorage.getItem(LS.r)||'0.95');
    const voices=speechSynthesis.getVoices(); if (vId){ const v=voices.find(x=> x.name===vId); if (v) u.voice=v; }
    u.rate = isNaN(rate)? 0.95 : rate; speechSynthesis.speak(u);
  }catch(e){}
}
function readyVoices(sel){
  function fill(){ const vs=speechSynthesis.getVoices(); sel.innerHTML=''; vs.forEach(v=>{ const o=document.createElement('option'); o.value=v.name; o.textContent=v.name + ' — ' + v.lang; sel.appendChild(o); }); const cur=localStorage.getItem(LS.v); if(cur) sel.value=cur; }
  speechSynthesis.onvoiceschanged = fill; fill();
}
export function bootstrapTTS(){
  const sel=document.getElementById('tts-voice'); const rate=document.getElementById('tts-rate'); const cues=document.getElementById('tts-cues'); const coach=document.getElementById('tts-coach'); const steps=document.getElementById('tts-steps');
  readyVoices(sel);
  rate.value = localStorage.getItem(LS.r)||'0.95'; cues.checked = localStorage.getItem(LS.cues)!=='0'; coach.checked = localStorage.getItem(LS.coach)!=='0'; steps.checked = localStorage.getItem(LS.steps)==='1';
  sel?.addEventListener('change', ()=> localStorage.setItem(LS.v, sel.value)); rate?.addEventListener('input', ()=> localStorage.setItem(LS.r, rate.value));
  cues?.addEventListener('change', ()=> localStorage.setItem(LS.cues, cues.checked?'1':'0')); coach?.addEventListener('change', ()=> localStorage.setItem(LS.coach, coach.checked?'1':'0')); steps?.addEventListener('change', ()=> localStorage.setItem(LS.steps, steps.checked?'1':'0'));
  document.getElementById('tts-test')?.addEventListener('click', ()=> speak('Voice test. Presence is the kink.'));
  window.addEventListener('mgd:cue', e=>{ if (localStorage.getItem(LS.cues)!=='0') speak(String(e.detail||'')); });
  window.addEventListener('mgd:coach', e=>{ if (localStorage.getItem(LS.coach)!=='0') speak(String(e.detail||'')); });
  window.addEventListener('mgd:scriptStep', e=>{ if (localStorage.getItem(LS.steps)==='1'){ const d=e.detail||{}; speak(String(d.say||d.decree||d.text||'')); } });
}
document.addEventListener('DOMContentLoaded', bootstrapTTS);
