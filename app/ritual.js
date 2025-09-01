import { } from './tools_registry.js'; // ensure registry side-effects load (RITUAL_OVERRIDES + helpers)

export const RITUAL_DEFAULTS = { breathCycles: 3, recitations: 3, strokes: 60 };

export const RITUAL_OVERRIDES = (window.RITUAL_OVERRIDES || {});

function reqFor(area){ const o = RITUAL_OVERRIDES[area] || {}; return { ...RITUAL_DEFAULTS, ...o }; }

function localSpeak(text){
  try{
    const u = new SpeechSynthesisUtterance(String(text||''));
    const vs = speechSynthesis.getVoices();
    const v = vs.find(x=> /^en(-|_)/i.test(x.lang)) || vs[0];
    if (v) u.voice=v;
    u.rate=0.98; u.pitch=1.0;
    speechSynthesis.speak(u);
  }catch(e){}
}

export function openRitual(areaId, onComplete){
  const req = reqFor(areaId);
  const box = document.createElement('div'); box.id='ritual-overlay'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
  box.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:10060;color:#fff;display:flex;align-items:center;justify-content:center';
  const reciteText = (req.recitationText || '').trim();
  box.innerHTML = `
  <div class="dialog-card" style="max-width:820px;width:96%;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(0,0,0,.45)">
    <h2 style="margin:0 0 6px">Spiral Flame Ritual</h2>
    <p class="sub" style="opacity:.85;margin:0 0 8px">Complete the three paths to unlock this area.</p>
    <div class="grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px">
      <section class="box" style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 4px">Breath — 4‑7‑8</h3>
        <p class="sub" id="breath-label">0 / ${req.breathCycles} cycles</p>
        <div id="breath-orb" style="height:140px;border-radius:50%;border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:600">Ready</div>
        <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">
          <button id="breath-start" class="btn">Start</button>
          <button id="breath-stop" class="btn secondary">Stop</button>
          <span class="sub">Space = pause/resume</span>
        </div>
      </section>
      <section class="box" style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 4px">Recitations</h3>
        <p class="sub" id="rec-label">0 / ${req.recitations}</p>
        ${reciteText ? `<blockquote id="recitation-box" style="margin:6px 0;padding:8px;border-left:3px solid rgba(255,255,255,.3);background:rgba(255,255,255,.06)">${reciteText}</blockquote>` : ''}
        <div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap">
          ${reciteText ? `<button id="rec-speak" class="btn secondary">Speak</button>` : ''}
          <button id="rec-mark" class="btn">Mark Recited</button>
        </div>
      </section>
      <section class="box" style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px">
        <h3 style="margin:0 0 4px">Micro‑Sigil</h3>
        <p class="sub" id="stroke-label">0 / ${req.strokes} strokes</p>
        <canvas id="stroke-canvas" width="360" height="160" style="width:100%;height:auto;border:1px dashed rgba(255,255,255,.25);border-radius:8px;background:#000"></canvas>
      </section>
    </div>
    <div class="row" style="gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap">
      <button id="ritual-close" class="btn secondary">Close</button>
      <button id="ritual-complete" class="btn" disabled>Complete Ritual</button>
    </div>
  </div>`;
  document.body.appendChild(box);
  let cycles=0, phase='idle', t=0, timer=null, paused=false;
  const orb = box.querySelector('#breath-orb'), bl = box.querySelector('#breath-label');
  function setOrb(txt, scale){ orb.textContent=txt; orb.style.transform=`scale(${scale})`; orb.style.transition='transform 0.2s ease'; }
  function tick(){
    if (paused) return;
    t++;
    if (phase==='inhale' && t>=4){ phase='hold'; t=0; setOrb('Hold 7', 1.15); }
    else if (phase==='hold' && t>=7){ phase='exhale'; t=0; setOrb('Exhale 8', 0.85); }
    else if (phase==='exhale' && t>=8){ cycles++; bl.textContent = cycles + ' / ' + req.breathCycles + ' cycles'; if (cycles>=req.breathCycles){ stopBreath(); doneCheck(); return; } phase='inhale'; t=0; setOrb('Inhale 4', 1.05); }
  }
  function startBreath(){ if (timer) return; phase='inhale'; t=0; setOrb('Inhale 4', 1.05); timer=setInterval(tick, 1000); }
  function stopBreath(){ clearInterval(timer); timer=null; phase='idle'; setOrb('Ready', 1.0); }
  box.querySelector('#breath-start').addEventListener('click', startBreath);
  box.querySelector('#breath-stop').addEventListener('click', stopBreath);
  window.addEventListener('keydown', (e)=>{ if (e.code==='Space'){ e.preventDefault(); if (!timer) startBreath(); else paused=!paused; } });

  let rec=0; const rl=box.querySelector('#rec-label');
  if (box.querySelector('#rec-speak')) box.querySelector('#rec-speak').addEventListener('click', ()=> localSpeak(reciteText));
  box.querySelector('#rec-mark').addEventListener('click', ()=>{ rec++; rl.textContent = rec + ' / ' + req.recitations; doneCheck(); });

  let strokes=0, drawing=false, last=null;
  const cv=box.querySelector('#stroke-canvas'), ctx=cv.getContext('2d'); ctx.strokeStyle='#ffc9f0'; ctx.lineWidth=2; ctx.lineCap='round';
  function pos(e){ const r=cv.getBoundingClientRect(); const x=(e.touches? e.touches[0].clientX:e.clientX)-r.left; const y=(e.touches? e.touches[0].clientY:e.clientY)-r.top; return {x:x*(cv.width/r.width), y:y*(cv.height/r.height)}; }
  function down(e){ drawing=true; last=pos(e); e.preventDefault(); }
  function move(e){ if(!drawing) return; const p=pos(e); ctx.beginPath(); ctx.moveTo(last.x,last.y); ctx.lineTo(p.x,p.y); ctx.stroke(); last=p; strokes++; box.querySelector('#stroke-label').textContent = strokes + ' / ' + req.strokes; doneCheck(); e.preventDefault(); }
  function up(){ drawing=false; }
  cv.addEventListener('mousedown', down); cv.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
  cv.addEventListener('touchstart', down, {passive:false}); cv.addEventListener('touchmove', move, {passive:false}); cv.addEventListener('touchend', up);

  function doneCheck(){
    const ok = cycles>=req.breathCycles && rec>=req.recitations && strokes>=req.strokes;
    box.querySelector('#ritual-complete').disabled = !ok;
  }
  box.querySelector('#ritual-close').addEventListener('click', ()=> box.remove());
  box.querySelector('#ritual-complete').addEventListener('click', ()=>{
    localStorage.setItem('areaUnlocked_'+areaId, '1');
    box.remove();
    if (typeof onComplete==='function') onComplete();
    try{ window.dispatchEvent(new CustomEvent('mgd:areaUnlocked', {detail:areaId})); }catch(e){}
  });
}
