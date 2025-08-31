import { WHISPERS, pickWhisper } from './whispers.js';
let currentNodeId = null;

const LS = { unlocks: 'mgd.sanctum.unlocks' };
function loadUnlocks(){ return JSON.parse(localStorage.getItem(LS.unlocks)||'{}'); }
function saveUnlocks(x){ localStorage.setItem(LS.unlocks, JSON.stringify(x)); }

function pulse(el, seconds){
  el.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}], {duration:seconds*1000, iterations:1});
}

export function openBreathRitual(targetNode){
  currentNodeId = targetNode || currentNodeId;
  const overlay = document.getElementById('breath-overlay');
  const visual = document.getElementById('breath-visual');
  const caption = document.getElementById('breath-caption');
  const start = document.getElementById('breath-start');
  const close = document.getElementById('breath-close');
  if(!overlay) return;
  overlay.style.display='flex';
  visual.textContent = 'Ready';
  caption.textContent = 'Inhale 4 · Hold 4 · Exhale 4 · Rest 4 (3 cycles)';
  let running = false;

  function runCycle(){
    running = true;
    const phases = [
      ['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Rest', 4],
      ['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Rest', 4],
      ['Inhale', 4], ['Hold', 4], ['Exhale', 4], ['Rest', 4]
    ];
    let i=0;
    function step(){
      const prog = document.getElementById('breath-progress');
      if (i>=phases.length){ done(); return; }
      const [label, secs] = phases[i++];
      // Glide tone if enabled
      try{
        const g = document.getElementById('breath-glide');
        if (g && g.checked && osc){
          const target = (label==='Inhale'||label==='Hold') ? baseHz+8 : baseHz-8;
          const now = audioCtx.currentTime;
          osc.frequency.cancelScheduledValues(now);
          osc.frequency.linearRampToValueAtTime(target, now + Math.max(0.1, secs));
        } else if (osc) { osc.frequency.value = baseHz; }
      }catch(e){}

      visual.textContent = label;
      try{ window.dispatchEvent(new CustomEvent('mgd:phase', {detail: label})); }catch(e){}
      try{ if (document.getElementById('breath-chime')?.checked){ chime(label==='Inhale'?780:(label==='Hold'?640:(label==='Exhale'?520:440)), 150); } }catch(e){}
      if (prog){ prog.style.transition='none'; prog.style.width='0%'; requestAnimationFrame(()=>{ prog.style.transition='width '+Math.max(0.1, secs)+'s linear'; prog.style.width='100%'; }); }
      try{ window.dispatchEvent(new CustomEvent('mgd:cue', {detail: label})); }catch(e){}
      speak(label);
      // whisper on Exhale/Rest
      try{
        const wchk = document.getElementById('breath-whispers');
        if (wchk && wchk.checked && (label==='Exhale' || label==='Rest') && currentNodeId && WHISPERS[currentNodeId]){
          const msg = pickWhisper(currentNodeId);
          speak(msg);
        }
      }catch(e){}

      hapticPulse(visual);
      try{ if (navigator.vibrate && document.getElementById('breath-haptic')?.checked){ navigator.vibrate([80,40,80]); } }catch(e){}
      pulse(visual, secs);
      setTimeout(step, secs*1000);
    }
    step();
  }
  function done(){
    visual.textContent = 'Complete ✓';
    const u = loadUnlocks(); if (targetNode) u[targetNode] = true; saveUnlocks(u);
    setTimeout(()=> { overlay.style.display='none'; window.dispatchEvent(new CustomEvent('mgd:ritualComplete')); }, 900);
  }

  start.onclick = ()=>{ if(!running) runCycle(); };
  close.onclick = ()=>{ overlay.style.display='none'; };
}

export function crestPulse(){
  const crest = document.getElementById('tier-crest');
  if(!crest) return;
  crest.animate(
    [{boxShadow:'0 0 0 rgba(255,30,138,0)'},{boxShadow:'0 0 28px rgba(255,30,138,.6)'},{boxShadow:'0 0 0 rgba(255,30,138,0)'}],
    { duration: 1600, iterations: 3, easing: 'ease-in-out' }
  );
}

// Cadence + WebAudio tone
let audioCtx = null, osc = null, gain = null, baseHz = 396;
function tone(on){
  try{
    if (on){
      if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
      if (!osc){
        osc = audioCtx.createOscillator(); gain = audioCtx.createGain();
        osc.type='sine'; osc.frequency.value = 396; // default, node can override
        gain.gain.value = 0.001; osc.connect(gain).connect(audioCtx.destination); osc.start();
      }
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + .05);
    } else {
      if (gain && audioCtx) gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + .1);
    }
  }catch(e){}
}

export function setToneHz(hz){
  baseHz = hz;
  try{ if (osc) osc.frequency.value = hz; }catch(e){}
}

function parseCadence(){
  const sel = document.getElementById('breath-cadence');
  const custom = document.getElementById('breath-custom')?.value.trim();
  const val = custom || sel?.value || '4,4,4,4';
  const parts = val.split(',').map(x => Math.max(0, parseInt(x.trim(),10)||0));
  while (parts.length<4) parts.push(0);
  return parts.slice(0,4);
}

export function openBreathRitual(targetNode){
  currentNodeId = targetNode || currentNodeId;
  const overlay = document.getElementById('breath-overlay');
  const visual = document.getElementById('breath-visual');
  const caption = document.getElementById('breath-caption');
  const start = document.getElementById('breath-start');
  const close = document.getElementById('breath-close');
  const toneChk = document.getElementById('breath-tone');
  if(!overlay) return;
  overlay.style.display='flex';
  visual.textContent = 'Ready';
  caption.textContent = 'Follow the chosen cadence for 3 cycles.';
  let running = false;
  function runCycle(){
    running = true;
    const [a,b,c,d] = parseCadence();
    const phases = [];
    for (let k=0;k<3;k++){ phases.push(['Inhale',a],['Hold',b],['Exhale',c],['Rest',d]); }
    let i=0;
    function step(){
      const prog = document.getElementById('breath-progress');
      if (i>=phases.length){ done(); return; }
      const [label, secs] = phases[i++];
      // Glide tone if enabled
      try{
        const g = document.getElementById('breath-glide');
        if (g && g.checked && osc){
          const target = (label==='Inhale'||label==='Hold') ? baseHz+8 : baseHz-8;
          const now = audioCtx.currentTime;
          osc.frequency.cancelScheduledValues(now);
          osc.frequency.linearRampToValueAtTime(target, now + Math.max(0.1, secs));
        } else if (osc) { osc.frequency.value = baseHz; }
      }catch(e){}

      visual.textContent = label;
      try{ window.dispatchEvent(new CustomEvent('mgd:phase', {detail: label})); }catch(e){}
      try{ if (document.getElementById('breath-chime')?.checked){ chime(label==='Inhale'?780:(label==='Hold'?640:(label==='Exhale'?520:440)), 150); } }catch(e){}
      if (prog){ prog.style.transition='none'; prog.style.width='0%'; requestAnimationFrame(()=>{ prog.style.transition='width '+Math.max(0.1, secs)+'s linear'; prog.style.width='100%'; }); }
      try{ window.dispatchEvent(new CustomEvent('mgd:cue', {detail: label})); }catch(e){}
      speak(label);
      // whisper on Exhale/Rest
      try{
        const wchk = document.getElementById('breath-whispers');
        if (wchk && wchk.checked && (label==='Exhale' || label==='Rest') && currentNodeId && WHISPERS[currentNodeId]){
          const msg = pickWhisper(currentNodeId);
          speak(msg);
        }
      }catch(e){}

      hapticPulse(visual);
      try{ if (navigator.vibrate && document.getElementById('breath-haptic')?.checked){ navigator.vibrate([80,40,80]); } }catch(e){}
      if (toneChk?.checked){ tone(label==='Inhale' || label==='Hold'); } else { tone(false); }
      pulse(visual, Math.max(1, secs));
      setTimeout(step, Math.max(1, secs)*1000);
    }
    step();
  }
  function done(){
    tone(false);
    visual.textContent = 'Complete ✓';
    const u = loadUnlocks(); if (targetNode) u[targetNode] = true; saveUnlocks(u);
    setTimeout(()=> { overlay.style.display='none'; window.dispatchEvent(new CustomEvent('mgd:ritualComplete')); }, 900);
  }
  start.onclick = ()=>{ if(!running) runCycle(); };
  close.onclick = ()=>{ tone(false); overlay.style.display='none'; };
}
    
// Voice cues using Speech Synthesis
function speak(msg){
  try{
    const el = document.getElementById('breath-voice');
    if (!el || !el.checked) return;
    const u = new SpeechSynthesisUtterance(msg);
    u.rate = 0.95; u.pitch = 1.0; u.volume = 0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  }catch(e){}
}

function hapticPulse(el){
  const chk = document.getElementById('breath-haptic');
  if (!chk || !chk.checked) return;
  el.animate([{filter:'brightness(1)'},{filter:'brightness(1.6)'},{filter:'brightness(1)'}], {duration:600, iterations:1});
}

function chime(freq=660, ms=180){
  try{
    if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type='sine'; o.frequency.value=freq; g.gain.value=0.0001;
    o.connect(g).connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    g.gain.linearRampToValueAtTime(0.12, now + 0.02);
    g.gain.linearRampToValueAtTime(0.0001, now + (ms/1000));
    o.start(); o.stop(now + (ms/1000)+0.05);
  }catch(e){}
}
