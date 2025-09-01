import { speak } from './zm_tts.js';
const LS = { zmOn:'mgd.zm.on' };
function card(title, body){
  const d=document.createElement('div'); d.className='zm-card';
  d.innerHTML = `<div style="font-weight:600;margin-bottom:4px">${title}</div><div class="sub" style="opacity:.9">${body}</div>`;
  return d;
}
function pushInsight(title, body, sayLine){
  if (localStorage.getItem(LS.zmOn)==='0') return;
  const list=document.getElementById('zm-insight-list'); if(!list) return;
  list.prepend(card(title, body));
  if (sayLine) speak(sayLine);
}
let stats = { pulses:{green:0,yellow:0,red:0}, consent:{yes:0,no:0,unsure:0}, tp:{speedSamples:[], lastSpeed:60}, start: Date.now() };
function onPulse(v){
  v=String(v||'').toLowerCase();
  if (v.includes('green')) stats.pulses.green++;
  if (v.includes('yellow')) stats.pulses.yellow++;
  if (v.includes('red')) stats.pulses.red++;
  if (stats.pulses.yellow>=2 && stats.pulses.red===0){
    pushInsight('Soften the edge', 'Two yellow pulses so far — consider breath pacing or dropping intensity 10–20%.', 'Two yellow pulses: soften the edge. Slow your breath. Drop ten percent.');
  }
  if (stats.pulses.red>=1){
    pushInsight('Red observed', 'Freeze recommended. Offer water and grounding.', 'Red signal observed. Pause. Offer water. Breathe with me.');
  }
}
function onConsent(v){
  if (v==='yes') stats.consent.yes++;
  if (v==='no') stats.consent.no++;
  if (v==='unsure') stats.consent.unsure++;
  if (v==='no' || v==='unsure'){
    pushInsight('Consent hesitation', 'Invite a micro‑pause and check boundaries.', 'I hear hesitation. Let us pause for clarity and care.');
  }
}
function onTPSpeed(sp){
  stats.tp.lastSpeed = sp;
  stats.tp.speedSamples.push(sp);
  if (stats.tp.speedSamples.length>40) stats.tp.speedSamples.shift();
  const avg = stats.tp.speedSamples.reduce((a,b)=>a+b,0)/stats.tp.speedSamples.length;
  const dev = Math.abs(sp-avg);
  if (dev>30){
    pushInsight('Pace swings detected', 'Your scroll speed is oscillating. Try Auto‑pace or Gesture pacing.', 'Your pace is swinging. Let me help modulate.');
  }
}
function onPhase(phase){
  if (/aftercare/i.test(phase)){
    pushInsight('Aftercare time', 'Export Aftercare Packet or start the Debrief.', 'Let us tend the afterglow. Water, warmth, and words.');
  }
}
function suggestNext(){
  const mins = (Date.now()-stats.start)/60000;
  if (mins>20 && stats.consent.no===0 && stats.pulses.red===0){
    pushInsight('Time check', 'You have been in flow for 20+ minutes. Consider a state‑change cue.', 'Twenty minutes in flow. Stretch. Sip. Shift.');
  }
}
export function bootstrapZM(){
  window.addEventListener('mgd:safetyPulse', e=> onPulse(e.detail?.value||e.detail));
  window.addEventListener('mgd:applyScriptControl', e=>{
    const d=e.detail||{};
    if (d.type==='consent') onConsent(d.value);
    if (d.type==='pulse') onPulse(d.value);
    if (d.type==='teleprompter' && typeof d.speed==='number') onTPSpeed(d.speed);
  });
  window.addEventListener('mgd:phase', e=> onPhase(String(e.detail||'')));
  window.addEventListener('mgd:cue', e=>{
    const t=String(e.detail||'');
    if (/hydrate|water/i.test(t)) pushInsight('Hydration', 'Sip water now.', 'Sip water.');
  });
  setInterval(()=>{
    const sp = parseInt(document.getElementById('tp-speed')?.value||'0',10);
    if (sp>0) onTPSpeed(sp);
    suggestNext();
  }, 5000);
}
document.addEventListener('DOMContentLoaded', bootstrapZM);
