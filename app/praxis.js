
const LS = { px:'mgd.praxis.progress' };
const TRACKS = {
  awakening: [
    {say:'Meet your gaze with kindness.'},
    {cadence:'4,4,4,4', breath:2},
    {decree:'I choose my shape.'}
  ],
  devotion: [
    {tone:639, say:'Heart tone set.'},
    {say:'Offer one small act of care.'},
    {decree:'Care and consent crown us.'}
  ],
  mischief: [
    {say:'Smile at a playful thought.'},
    {cadence:'4,4,6,2', breath:2},
    {say:'Set a rule you may later bend—with consent.'}
  ]
};
function state(){ try{return JSON.parse(localStorage.getItem(LS.px)||'{}')}catch(e){return {}} }
function save(x){ localStorage.setItem(LS.px, JSON.stringify(x)); }
function runStep(step){
  if (step.tone){ try{ import('./breath.js').then(m=>m.setToneHz(step.tone)); }catch(e){} }
  if (step.cadence || step.breath){ const cust=document.getElementById('breath-custom'); if (cust && step.cadence) cust.value=step.cadence; import('./breath.js').then(m=>m.openBreathRitual(null)); }
  if (step.decree){ const d=document.getElementById('birthright-decree'); if (d) d.style.display='flex'; }
  if (step.say){ try{ const u=new SpeechSynthesisUtterance(step.say); u.rate=.95; speechSynthesis.speak(u);}catch(e){} }
}
export function bootstrapPraxis(){
  const sel = document.getElementById('px-track');
  const begin = document.getElementById('px-begin');
  const cont = document.getElementById('px-continue');
  const status = document.getElementById('px-status');
  function render(){
    const s=state()[sel?.value||'awakening']||{i:0};
    status.textContent = `Progress: step ${s.i||0}/3`;
  }
  begin?.addEventListener('click', ()=>{
    const key=sel?.value||'awakening'; const s=state(); s[key]={i:0}; save(s); render();
    const steps = TRACKS[key]; runStep(steps[0]); s[key].i=1; save(s); render();
  });
  cont?.addEventListener('click', ()=>{
    const key=sel?.value||'awakening'; const s=state(); const cur=s[key]?.i||0; const steps=TRACKS[key]; if(cur>=steps.length) return alert('Track complete'); runStep(steps[cur]); s[key].i=cur+1; save(s); render();
  });
  sel?.addEventListener('change', render); render();
}
document.addEventListener('DOMContentLoaded', bootstrapPraxis);
