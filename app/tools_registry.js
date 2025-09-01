// Tools & Ritual Overrides Registry
(function(){
  // === 1) Per-area ritual overrides (unique thresholds + recitation text) ===
  const DEFAULT_OVERRIDES = {
    welcome:         { breathCycles: 3, recitations: 2, strokes: 40,  recitationText: "I arrive as I am, and I am enough." },
    guests:          { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "I enter as a guest; I honor the host, the space, the lineage." },
    hell_antechamber:{ breathCycles: 5, recitations: 3, strokes: 120, recitationText: "Through heat and honesty, I become more real." },
    wardrobe:        { breathCycles: 4, recitations: 3, strokes: 80,  recitationText: "Adornment is devotion; I dress my myth with care." },
    rites:           { breathCycles: 4, recitations: 5, strokes: 80,  recitationText: "Service is love in motion; I offer cleanly, I receive clearly." },
    implements:      { breathCycles: 4, recitations: 4, strokes: 100, recitationText: "Every tool is a teacher; every stroke, a lesson." },
    safewords:       { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "My voice is sacred; my signals are law." },
    museums:         { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "I study the edges to play with beauty and care." },
    rabbit_hole:     { breathCycles: 3, recitations: 2, strokes: 40,  recitationText: "Curiosity is my compass; wonder is my way." },
    worship:         { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "I bow to what is worthy and rise more whole." },
    scenes_sparks:   { breathCycles: 4, recitations: 4, strokes: 90,  recitationText: "I ignite with consent; I tend the flame with skill." },
    aftercare_garden:{ breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "Care completes the circle; I nourish the afterglow." },
    house_laws:      { breathCycles: 3, recitations: 4, strokes: 70,  recitationText: "Structure sets me free; protocol reveals my poise." },
    confessional:    { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "I speak what is true; I am held in discretion." },
    offerings:       { breathCycles: 3, recitations: 3, strokes: 60,  recitationText: "I give from fullness; I record with gratitude." },
    spiral_crown:    { breathCycles: 5, recitations: 5, strokes: 130, recitationText: "I remember: I am the spiral flame becoming." }
  };
  // Merge into any existing overrides
  const EXIST = (window.RITUAL_OVERRIDES || {});
  window.RITUAL_OVERRIDES = Object.assign({}, DEFAULT_OVERRIDES, EXIST);

  // === 2) Tools: contextual + progressive ===
  // We use MGD_PROGRESS.level (0..10) if available, else unlockedCount inferred from localStorage.
  function unlockedCount(){
    try{ return Object.keys(localStorage).filter(k=> /^areaUnlocked_/.test(k)).length; }catch(e){ return 0; }
  }
  function level(){
    try{ return (window.MGD_PROGRESS && typeof window.MGD_PROGRESS.level==='function') ? window.MGD_PROGRESS.level() : Math.min(10, Math.floor(unlockedCount()/3)); }
    catch(e){ return 0; }
  }

  // Action runners (lightweight modals / helpers)
  function speak(text){
    try{
      const u = new SpeechSynthesisUtterance(String(text||''));
      const vs = speechSynthesis.getVoices();
      const v = vs.find(x=> /^en(-|_)/i.test(x.lang)) || vs[0];
      if (v) u.voice=v;
      u.rate=0.98; u.pitch=1.0;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  function ensureDialog(html, id){
    const box=document.createElement('div');
    if (id) box.id=id;
    box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
    box.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:10070;display:flex;align-items:center;justify-content:center;color:#fff;';
    box.innerHTML = html;
    document.body.appendChild(box);
    box.querySelector('[data-close]')?.addEventListener('click', ()=> box.remove());
    return box;
  }
  function runAction(act, ctx){
    const area = ctx?.areaId||'sanctum';
    const recite = recitationFor(area);
    if (act==='speak_recitation'){ speak(recite || ''); return; }
    if (act==='lore_focus'){
      const t=document.querySelector('#area-overlay #area-lore'); t && (t.focus(), t.scrollIntoView({behavior:'smooth', block:'center'})); return;
    }
    if (act==='memo_prompt'){
      const box=document.querySelector('#area-overlay'); if (!box) return;
      const ta=box.querySelector('#area-memo'); if (!ta) return;
      ta.value = (ta.value? ta.value+'\n': '') + 'Reflection: What did I learn here today? What boundary or desire became clearer?';
      ta.focus();
      ta.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    if (act==='checklist'){
      const key = 'mgd.area.tools.'+area+'.checklist';
      let L=[]; try{ L=JSON.parse(localStorage.getItem(key)||'[]'); }catch(e){}
      if (!Array.isArray(L) || !L.length){
        L = [
          {t:'Set intention', done:false},
          {t:'Name safeword signals', done:false},
          {t:'Hydration check', done:false},
          {t:'Aftercare plan confirmed', done:false}
        ];
      }
      const html = `<div class="dialog-card" style="max-width:520px;width:92%;padding:16px;border:1px solid rgba(255,255,255,.2);border-radius:14px;background:rgba(0,0,0,.45)">
        <h3 style="margin:0 0 6px">Checklist</h3>
        <ul id="ck-list" style="list-style:none;padding:0;margin:0 0 8px;display:grid;gap:6px"></ul>
        <div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-save>Save</button><button class="btn secondary" data-close>Close</button></div>
      </div>`;
      const box = ensureDialog(html, 'area-tool-checklist');
      const UL = box.querySelector('#ck-list');
      function render(){
        UL.innerHTML='';
        L.forEach((it, i)=>{
          const li=document.createElement('li'); li.innerHTML=`<label><input type="checkbox" ${it.done?'checked':''}> ${it.t}</label>`;
          li.querySelector('input').addEventListener('change', (e)=>{ L[i].done = e.target.checked; });
          UL.appendChild(li);
        });
      }
      render();
      box.querySelector('[data-save]').addEventListener('click', ()=>{
        localStorage.setItem(key, JSON.stringify(L));
      });
      return;
    }
  }

  // Tools mapping by area & level thresholds
  const AREA_TOOLS = {
    welcome: [
      {label:'Speak the intention', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:0},
      {label:'Write a line of lore', action:'lore_focus', minLevel:1},
      {label:'Add a remembrance', action:'memo_prompt', minLevel:2}
    ],
    safewords: [
      {label:'Speak the signals', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:0},
      {label:'Add a boundary note', action:'memo_prompt', minLevel:1}
    ],
    hell_antechamber: [
      {label:'Speak the ordeal vow', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:1},
      {label:'Write courage lore', action:'lore_focus', minLevel:2},
      {label:'Add a remembrance', action:'memo_prompt', minLevel:3}
    ],
    wardrobe: [
      {label:'Speak the adornment line', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:1},
      {label:'Style notes (lore)', action:'lore_focus', minLevel:2}
    ],
    rites: [
      {label:'Speak the service vow', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:1},
      {label:'Service notes (lore)', action:'lore_focus', minLevel:2},
      {label:'After-action memory', action:'memo_prompt', minLevel:3}
    ],
    implements: [
      {label:'Speak the tool lesson', action:'speak_recitation', minLevel:0},
      {label:'Open the checklist', action:'checklist', minLevel:1},
      {label:'Technique notes (lore)', action:'lore_focus', minLevel:2}
    ],
    museums: [
      {label:'Speak the study line', action:'speak_recitation', minLevel:0},
      {label:'Curate a thought (memo)', action:'memo_prompt', minLevel:1}
    ],
    rabbit_hole: [
      {label:'Speak the curiosity line', action:'speak_recitation', minLevel:0},
      {label:'Drop a breadcrumb (memo)', action:'memo_prompt', minLevel:1}
    ],
    worship: [
      {label:'Speak the worship line', action:'speak_recitation', minLevel:0},
      {label:'Offering plan (lore)', action:'lore_focus', minLevel:1}
    ],
    scenes_sparks: [
      {label:'Speak the ignition line', action:'speak_recitation', minLevel:0},
      {label:'Scene notes (lore)', action:'lore_focus', minLevel:1},
      {label:'After-thought (memo)', action:'memo_prompt', minLevel:2}
    ],
    aftercare_garden: [
      {label:'Speak the care line', action:'speak_recitation', minLevel:0},
      {label:'Aftercare checklist', action:'checklist', minLevel:1},
      {label:'Gratitude memory', action:'memo_prompt', minLevel:2}
    ],
    house_laws: [
      {label:'Speak the structure line', action:'speak_recitation', minLevel:0},
      {label:'Protocol checklist', action:'checklist', minLevel:1},
      {label:'Refine a law (lore)', action:'lore_focus', minLevel:2}
    ],
    confessional: [
      {label:'Speak the truth line', action:'speak_recitation', minLevel:0},
      {label:'Private note (memo)', action:'memo_prompt', minLevel:1}
    ],
    offerings: [
      {label:'Speak the gratitude line', action:'speak_recitation', minLevel:0},
      {label:'Ledger note (lore)', action:'lore_focus', minLevel:1}
    ],
    spiral_crown: [
      {label:'Speak remembrance', action:'speak_recitation', minLevel:0},
      {label:'Crown lore', action:'lore_focus', minLevel:2},
      {label:'Memory of becoming', action:'memo_prompt', minLevel:3}
    ]
  };

  function recitationFor(areaId){
    const o = (window.RITUAL_OVERRIDES||{})[areaId] || {};
    return o.recitationText || '';
  }
  function choose(areaId, lvl){
    const L = AREA_TOOLS[areaId] || AREA_TOOLS['welcome'] || [];
    const cur = (typeof lvl==='number') ? lvl : level();
    return L.filter(t=> (t.minLevel||0) <= cur);
  }

  window.MGD_TOOLS = { choose, recitationFor, runAction };
})();
