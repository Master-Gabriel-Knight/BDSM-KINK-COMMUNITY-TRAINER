import { NODE_MAP } from './nodes.js';

import { openBreathRitual, setToneHz } from './breath.js';
const LS = {
  intensity: 'mgd.kink.intensity',
  kink: 'mgd.kink.enabled',
  consent: 'mgd.kink.consent',
  node: 'mgd.node.progress'
};

const NODES = [
  {id:'ha-valen', name:'Ha’Valen — Hara (Lower Belly)', tone:'HAAAH', hz:396, cue:'Ground & release fear', micro:'Hands on lower belly; circle hips slowly ±2cm. Spine tall.'},
  {id:'sa-thriel', name:'Sa’Thriel — Throat/Neck', tone:'SAAAH', hz:741, cue:'Truth & purification', micro:'Slow head arcs (yes/no). Tongue soft, jaw unclenched.'},
  {id:'lu-emra', name:'Lu’Emra — Heart', tone:'LUUUU', hz:639, cue:'Love & connection', micro:'Palm-to-sternum, shoulder rolls, soften between blades.'},
  {id:'re-anar', name:'Re’Anar — Solar Plexus', tone:'REHH', hz:528, cue:'Memory & empowerment', micro:'Tiny belly pumps on exhale; micro‑twists left/right.'},
  {id:'yu-zhal', name:'Yu’Zhal — Third Eye', tone:'YUUU', hz:852, cue:'Inner vision', micro:'Gaze soft; trace small infinity sign with nose.'},
  {id:'om-veyah', name:'Om’Veyah — Crown', tone:'OMMM', hz:963, cue:'Divine unity', micro:'Lengthen spine; imagine thread lifting crown gently.'},
  {id:'tu-ruun', name:'Tu’Ruun — Feet/Root', tone:'TUHH', hz:174, cue:'Stability', micro:'Press feet evenly; bend/straighten knees 10% range.'},
  {id:'shen-thav', name:'Shen’Thav — Sternum/Heart Flame', tone:'SHEHN', hz:417, cue:'Transformation', micro:'Sternum lifts on inhale; soften on exhale.'},
  {id:'ma-vira', name:'Ma’Vira — Womb/Sacral', tone:'MAAAH', hz:417, cue:'Creativity', micro:'Pelvic bowl sways; imagine warm arc across pelvis.'},
  {id:'ka-tor', name:'Ka’Tor — Lower Spine', tone:'KAHH', hz:285, cue:'Protection', micro:'Tiny tailbone tucks/untucks; 1‑cm range.'},
  {id:'za-leth', name:'Za’Leth — Navel', tone:'ZAAAH', hz:528, cue:'Trickster/duality', micro:'Belly draws in/out with playful pulses.'},
  {id:'vi-serel', name:'Vi’Serel — Eyebrows', tone:'VEEEE', hz:963, cue:'Signal & clarity', micro:'Lift/soften brow; widen peripheral vision.'},
  {id:'no-vaun', name:'No’Vaun — Base of Skull', tone:'NOHHH', hz:432, cue:'Silence & reset', micro:'Micro‑nods “yes”; place tongue to soft palate gently.'}
];

const PLAY_CARDS = [
  {k:'mirror-throne', title:'Mirror Throne', node:'Vi’Serel', base:'Sit tall; meet your gaze with kindness.', kink:'Seat yourself like a monarch; your reflection kneels to your truth.'},
  {k:'tricksters-game', title:'Trickster’s Game', node:'Za’Leth', base:'Smile at a playful thought; flip it twice.', kink:'Set a playful rule you can break later—on purpose.'},
  {k:'ground-leash', title:'Grounded Leash', node:'Tu’Ruun', base:'Stand rooted; breathe 4·4·4·4. Imagine a silk leash to gravity.', kink:'Add a gentle command: “Heel to joy.” Your feet obey with pleasure.'},
  {k:'heart-oath', title:'Heart Oath', node:'Lu’Emra', base:'Palm to sternum; speak a vow of care.', kink:'Seal with a kiss to your own palm; let it radiate.'},
  {k:'voice-collar', title:'Voice Collar', node:'Sa’Thriel', base:'Whisper your truth on exhale.', kink:'A velvet collar of consent appears around your throat; you choose the rules.'},
  {k:'crown-kneel', title:'Crown Kneel', node:'Om’Veyah', base:'Spine tall, imagine a crown of light.', kink:'Kneel to your own divinity; command the room with silence.'},
  {k:'navel-coin', title:'Navel Coin', node:'Za’Leth', base:'Play with belly pulses; tease a smile.', kink:'Flip a phantom coin over your navel; the winner writes the next move.'},
  {k:'womb-ink', title:'Womb Ink', node:'Ma’Vira', base:'Pelvic sway; breathe into creativity.', kink:'Trace a secret glyph over your pelvis (clothed); it tingles when you tell the truth.'},
  {k:'spine-guard', title:'Spine Guard', node:'Ka’Tor', base:'Tailbone tucks protect; feel shielded.', kink:'A hand at your lower back says: “I’ve got you.”'},
  {k:'skull-still', title:'Skull Stillpoint', node:'No’Vaun', base:'Micro-nods set stillness.', kink:'A hush falls—every request arrives as an offering.'}
];

function el(id){ return document.getElementById(id); }
function show(id, on=true){ const x = el(id); if (!x) return; x.style.display = on ? (x.style.display||'flex') : 'none'; }
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key, def){ try { return JSON.parse(localStorage.getItem(key)) ?? def; } catch(e){ return def; } }

function renderNodes(){
  const wrap = el('node-buttons'); if (!wrap) return;
  wrap.innerHTML = '';
  NODES.forEach(n => {
    const b = document.createElement('button');
    b.className = 'navbtn'; b.textContent = n.name; b.dataset.node = n.id;
    b.addEventListener('click', ()=> selectNode(n.id));
    wrap.appendChild(b);
  });
}

let currentNode = null, timer = null;
function selectNode(id){
  currentNode = NODES.find(n => n.id === id) || null;
  const box = el('node-instructions'); if (!box || !currentNode) return;
  box.innerHTML = `
    <strong>${currentNode.name}</strong>
    <p><em>Tone:</em> ${currentNode.tone} • <em>${currentNode.hz} Hz</em></p>
    <p>${currentNode.cue}</p>
    <p><strong>Micro‑motion:</strong> ${currentNode.micro}</p>
    <p id="kink-suggestion" style="opacity:.8"></p>
  `;
  // If kink mode on, auto-suggest a playful prompt tied to node
  if (load(LS.kink, false)){
    const hit = PLAY_CARDS.find(c => (c.node && currentNode.name.includes(c.node)));
    if (hit){ el('kink-suggestion').textContent = 'Kink flavor: ' + hit.kink; }
  }
}

function startPractice(){
  if (!currentNode){ alert('Choose a node first'); return; }
  const hz = NODE_MAP[currentNode.id]?.hz || 396;
  try { setToneHz(hz); } catch(e){}
  openBreathRitual(currentNode.id);
}
  const box = el('node-instructions');
  let phase = 0;
  const phases = ['Inhale','Hold','Exhale','Rest'];
  const secs = 4;
  if (timer) clearInterval(timer);
  timer = setInterval(()=>{
    const label = phases[phase % 4];
    box.style.boxShadow = label==='Inhale' ? '0 0 18px rgba(255,30,138,.4)' :
                        label==='Exhale' ? '0 0 18px rgba(30,138,255,.3)' : 'none';
    box.setAttribute('data-phase', label);
    box.querySelector('strong').textContent = currentNode.name + ' — ' + label;
    phase++;
    if (phase >= 4*3){ clearInterval(timer); box.style.boxShadow='none'; }
  }, secs*1000);
}

function markComplete(){
  if (!currentNode) return;
  const prog = load(LS.node, {}); prog[currentNode.id] = (prog[currentNode.id]||0)+1; save(LS.node, prog);
  // Gentle acknowledgement
  const decree = el('birthright-decree');
  if (decree){ decree.style.display='flex'; } window.dispatchEvent(new CustomEvent('mgd:nodeComplete'));
}

function openConsent(){
  const ov = el('consent-overlay'); if (!ov) return;
  // Load existing
  const cfg = load(LS.consent, {green:'Yes', yellow:'Slow', red:'Stop', limits:'', desires:''});
  ['sf-green','sf-yellow','sf-red','limits','desires'].forEach(id => {
    const n = el(id); if(!n) return;
    n.value = cfg[ id.replace('sf-','') ] ?? cfg[id];
  });
  show('consent-overlay', true);
}

function saveConsent(){
  const cfg = {
    green: el('sf-green')?.value||'Yes',
    yellow: el('sf-yellow')?.value||'Slow',
    red: el('sf-red')?.value||'Stop',
    limits: el('limits')?.value||'',
    desires: el('desires')?.value||''
  };
  save(LS.consent, cfg);
  alert('Consent & Aftercare saved locally.');
}

function renderPlayDeck(){
  const mount = el('play-cards'); if(!mount) return;
  const flavor = el('kink-flavor')?.checked;
  const q = (el('play-search')?.value||'').toLowerCase();
  mount.innerHTML = '';
  PLAY_CARDS.filter(c => (c.title+c.base+c.kink).toLowerCase().includes(q)).forEach(c => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
    card.innerHTML = `<strong>${c.title}</strong><br><small>Node: ${c.node}</small><p>${flavor?flavorText(c):c.base}</p>
      <div class="row" style="gap:6px"><button class="navbtn" data-act="breathe" data-node="${c.node}">Run Breath</button>
      <button class="navbtn" data-act="add" data-node="${c.node}">Add to Gallery</button></div>`;
    // Add to gallery: creates a minimal text-image (data url)
    card.querySelector('[data-act="add"]').addEventListener('click', () => {
      const src = `data:text/plain,${encodeURIComponent(`${c.title} — ${flavor?c.kink:c.base}`)}`;
      window.MGD_addToGallery?.({ src, title: c.title, tag: 'play' });
    });
    card.querySelector('[data-act="breathe"]').addEventListener('click', () => openBreathRitual(null));
    mount.appendChild(card);
  });
}

function init(){
  // Kink toggle
  const box = el('kink-enabled');
  if (box){ box.checked = !!load(LS.kink,false); box.addEventListener('change', ()=>{ save(LS.kink, box.checked); }); }
  // Consent center
  el('open-consent')?.addEventListener('click', openConsent);
  el('consent-save')?.addEventListener('click', saveConsent);
  el('consent-close')?.addEventListener('click', ()=> show('consent-overlay', false));
  // Play deck
  el('open-playdeck')?.addEventListener('click', ()=>{ show('playdeck-overlay', true); renderPlayDeck(); });
  el('playdeck-close')?.addEventListener('click', ()=> show('playdeck-overlay', false));
  el('play-search')?.addEventListener('input', renderPlayDeck);
  el('kink-flavor')?.addEventListener('change', renderPlayDeck);
el('kink-intensity')?.addEventListener('input', renderPlayDeck);

  // Birthright decree close
  el('birthright-close')?.addEventListener('click', ()=> show('birthright-decree', false));

  // Trainer
  renderNodes();
  el('node-start')?.addEventListener('click', startPractice);
  el('node-complete')?.addEventListener('click', markComplete);
}

document.addEventListener('DOMContentLoaded', init);

// Intensity slider affects copy in Play Deck (0=soft,1=playful,2=spicy)
function intensity(){
  return parseInt(document.getElementById('kink-intensity')?.value||'1',10);
}
function guardianOn(){ return localStorage.getItem('mgd.guardian.enabled')==='1'; }
function flavorText(card){
  const level = intensity();
  if (level<=0 || guardianOn()) return card.base;
  if (level===1) return card.kink.replace(/collar|leash|kneel/gi, m => ({collar:'ribbon',leash:'silk thread',kneel:'bow'})[m.toLowerCase()]||m);
  return card.kink; // spicy
}

// Follow Stage Editor node selection
window.addEventListener('mgd:selectNode', (e)=>{
  const id = (e.detail||'').trim();
  const btn = Array.from(document.querySelectorAll('#node-buttons .navbtn')).find(b => (b.dataset.node===id));
  if (btn) btn.click();
});
