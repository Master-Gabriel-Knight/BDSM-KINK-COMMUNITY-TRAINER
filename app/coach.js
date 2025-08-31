
const PACKS = {
  sovereign: ['Soften your jaw. Lift your crown.', 'Check consent. You are allowed to adjust.', 'Presence is the kink.'],
  devotion: ['Breathe kindness into your heart.', 'Offer a small act of care.', 'Ask: What would feel nourishing?'],
  play: ['Add one playful beat.', 'Smile. Let joy be easy.', 'Invite a light rule to bend later—with consent.']
};
let timer=null;
function show(on){ const o=document.getElementById('coach-overlay'); if(o) o.style.display=on?'flex':'none'; }
function speakLine(t){ try{ const u=new SpeechSynthesisUtterance(t); u.rate=.95; speechSynthesis.speak(u);}catch(e){} }
export function bootstrapCoach(){
  document.getElementById('coach-open')?.addEventListener('click', ()=> show(true));
  document.getElementById('coach-stop')?.addEventListener('click', ()=>{ clearInterval(timer); document.getElementById('coach-line').textContent='Stopped.'; });
  document.getElementById('coach-start')?.addEventListener('click', ()=>{
    clearInterval(timer);
    const sec = Math.max(15, parseInt(document.getElementById('coach-sec')?.value||'90',10));
    const pack = PACKS[document.getElementById('coach-pack')?.value||'sovereign'];
    function fire(){ const line = pack[Math.floor(Math.random()*pack.length)]; document.getElementById('coach-line').textContent=line; speakLine(line); window.dispatchEvent(new CustomEvent('mgd:cue', {detail: line})); }
    fire(); timer=setInterval(fire, sec*1000);
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCoach);
