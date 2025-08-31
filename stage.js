
import { openBreathRitual, setToneHz } from './breath.js';

const SCRIPTS = {
  'crown-claim': [
    {say:'We begin.'},
    {tone:963, say:'Crown tone set.'},
    {cadence:'4,4,4,4', breath:3, say:'Box breath — three rounds.'},
    {decree:'It was always mine.'},
    {say:'Anchor this: I choose my shape.'}
  ],
  'soft-opening': [
    {tone:432, say:'Soft grounding.'},
    {cadence:'4,7,8,0', breath:2},
    {say:'You are safe.'}
  ]
};

const LS = { script:'mgd.script.custom' };

function toText(steps){ return steps.map(s=> JSON.stringify(s)).join('\n'); }
function fromText(txt){ return txt.split(/\n+/).map(l=> l.trim()).filter(Boolean).map(x=> JSON.parse(x)); }

let timer = null;
function play(steps){
  stop();
  let i=0;
  function step(){
    if (i>=steps.length){ stop(); return; }
    const s = steps[i++];
    if (s.tone){ try{ setToneHz(+s.tone); }catch(e){} }
    if (s.cadence || s.breath){ 
      const cust = document.getElementById('breath-custom'); if (cust && s.cadence) cust.value = s.cadence;
      openBreathRitual(null);
    }
    if (s.decree){
      const d = document.getElementById('birthright-decree'); if (d) d.style.display='flex';
    }
    if (s.say){ try{ const u = new SpeechSynthesisUtterance(s.say); speechSynthesis.speak(u);}catch(e){} }
    timer = setTimeout(step, 2500);
  }
  step();
}
function stop(){ if (timer){ clearTimeout(timer); timer=null; } }

export function bootstrapStage(){
  const sel = document.getElementById('script-select');
  const view = document.getElementById('script-view');
  const playBtn = document.getElementById('script-play');
  const stopBtn = document.getElementById('script-stop');
  const exp = document.getElementById('script-export');

  const steps = SCRIPTS[sel?.value||'crown-claim'] || [];
  if (view) view.textContent = toText(steps);

  sel?.addEventListener('change', ()=>{
    const steps = SCRIPTS[sel.value] || [];
    view.textContent = toText(steps);
  });
  playBtn?.addEventListener('click', ()=>{
    const steps = fromText(view.textContent||'[]');
    play(steps);
  });
  stopBtn?.addEventListener('click', stop);
  exp?.addEventListener('click', ()=>{
    const blob = new Blob([view.textContent||''], {type:'text/plain'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='mgd_script.txt'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapStage);

// Follow incoming script steps
window.addEventListener('mgd:applyScriptStep', (e)=>{
  const s = e.detail||{};
  try{
    if (s.tone){ setToneHz(+s.tone); }
    if (s.cadence || s.breath){ const cust = document.getElementById('breath-custom'); if (cust && s.cadence) cust.value = s.cadence; openBreathRitual(null); }
    if (s.decree){ const d = document.getElementById('birthright-decree'); if (d) d.style.display='flex'; }
    if (s.say){ const u = new SpeechSynthesisUtterance(s.say); speechSynthesis.speak(u); }
    if (s.node){ window.dispatchEvent(new CustomEvent('mgd:selectNode', {detail:s.node})); }
  }catch(err){}
});
