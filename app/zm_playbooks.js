import { enableVoice, setSpeak, speak, listVoices } from './zm_tts.js';
function el(id){ return document.getElementById(id); }
function button(label, on){ const b=document.createElement('button'); b.className='btn'; b.textContent=label; b.addEventListener('click', on); return b; }
function sanctum(){
  const has = (q)=> !!document.querySelector(q);
  if (has('#tp-open') || has('#teleprompter') || has('#tp-overlay')) return 'stage';
  if (has('#rooms') || has('#wallboard-overlay') || has('#rehearsal') || has('#playlist-runner')) return 'workshop';
  if (has('#risk') || has('#checklists') || has('#aftercare') || has('#emergency')) return 'guardian';
  if (has('#lore') || has('#sigil') || has('#privacy-capsule') || has('#portfolio-export')) return 'vault';
  return 'home';
}
function showTools(list){
  const drawer=el('tools-drawer'); const row=el('tools-suggest');
  if (!drawer || !row) return;
  row.innerHTML='';
  list.forEach(b=> row.appendChild(b));
  drawer.style.display = list.length? 'block':'none';
}
function loadScript(text){
  const v = el('script-view'); if (!v) return;
  v.textContent = text.trim();
  el('tp-open')?.click();
}
const MICRO = {
  breath101: `title: Breath 101
say: Inhale for four. Hold two. Exhale for six.
wait: 0:30
say: Loosen your jaw. Lower your shoulders.
wait: 0:30`,
  boundaries101: `title: Boundaries 101
say: Name one YES, one NO, one MAYBE.
wait: 0:45
say: Trade and repeat. Breathe after each share.
wait: 0:45`,
  aftercare101: `title: Aftercare 101
say: Water. Warmth. Words of celebration.
wait: 0:20
say: Notice what you need next—rest, food, or alone time.
wait: 0:30`,
};
function toolsFor(s){
  const list=[];
  if (s==='stage'){
    const openTP = el('tp-open'); if (openTP) list.push(button('Teleprompter', ()=> openTP.click()));
    const consent = document.querySelector('[data-action="consent"]') || document.getElementById('consent-open') || document.getElementById('consent-prompt');
    if (consent) list.push(button('Consent Prompt', ()=> consent.click()));
    const freeze = el('freeze-btn'); if (freeze) list.push(button('Freeze', ()=> freeze.click()));
    list.push(button('Breath 101', ()=> loadScript(MICRO.breath101)));
  }
  else if (s==='guardian'){
    const lists = el('checklists-open') || document.querySelector('[data-action="checklists"]'); if (lists) list.push(button('Consent Checklists', ()=> lists.click()));
    const aftercare = el('aftercare-export') || document.getElementById('packet-export'); if (aftercare) list.push(button('Aftercare Packet', ()=> aftercare.click()));
    list.push(button('Boundaries 101', ()=> loadScript(MICRO.boundaries101)));
  }
  else if (s==='workshop'){
    const reh = el('rehearsal-open') || document.getElementById('rehearsal-start'); if (reh) list.push(button('Rehearsal Runner', ()=> reh.click()));
    const wall = el('wb-open'); if (wall) list.push(button('Wallboard', ()=> wall.click()));
    const chain = document.getElementById('plr-start'); if (chain) list.push(button('Playlist Chain', ()=> chain.click()));
  }
  else if (s==='vault'){
    const lore = el('lore-open') || document.querySelector('[data-action="lore"]'); if (lore) list.push(button('Lore Vault', ()=> lore.click()));
    const sig = el('sigil-canvas'); if (sig) list.push(button('Draw Sigil', ()=> sig.scrollIntoView({behavior:'smooth'})));
    const enc = el('pc-export'); if (enc) list.push(button('Encrypted Capsule', ()=> enc.click()));
    const port = el('portfolio-export'); if (port) list.push(button('Portfolio PDF', ()=> port.click()));
    list.push(button('Aftercare 101', ()=> loadScript(MICRO.aftercare101)));
  } else {
    const tp = el('tp-open'); if (tp) list.push(button('Start Teleprompter', ()=> tp.click()));
    const debrief = el('debrief-open') || document.querySelector('[data-action="debrief"]'); if (debrief) list.push(button('Debrief', ()=> debrief.click()));
  }
  return list;
}
function metrics(){
  function get(k, d){ try{ return JSON.parse(localStorage.getItem(k)||JSON.stringify(d)); }catch(e){ return d; } }
  const pulses = get('mgd.pulse.log', []);
  const yellows = pulses.filter(p=> String(p.v).toLowerCase().includes('yellow')).length;
  const reds = pulses.filter(p=> String(p.v).toLowerCase().includes('red')).length;
  const lore = get('mgd.lore', []);
  const hasDebrief = lore.some(x=> /Debrief/i.test(x.title||''));
  const lastDebriefAt = (lore.find(x=> /Debrief/i.test(x.title||''))||{}).time || 0;
  const minutesSinceDebrief = lastDebriefAt? Math.round((Date.now()-lastDebriefAt)/60000) : null;
  return { yellows, reds, hasDebrief, minutesSinceDebrief };
}
function trailheads(m){
  const items=[];
  if (m.yellows>=2 && m.reds===0){ items.push({title:'Soften the edge', body:'Try Breath 101 or reduce pace 15%.', say:'Two yellows; soften the edge. Breath first.'}); }
  if (!m.hasDebrief){ items.push({title:'No debrief yet', body:'Write three lines in Lore → Debrief to anchor aftercare.', say:'Close the circle with a short debrief.'}); }
  else if (m.minutesSinceDebrief!==null && m.minutesSinceDebrief>120){ items.push({title:'It has been a while', body:'Consider a reflection note in Lore.', say:'A quick reflection nourishes the roots.'}); }
  if (m.reds>=1){ items.push({title:'Red observed', body:'Review boundaries and Aftercare 101.', say:'Red was seen. Review boundaries and rest.'}); }
  return items;
}
function pushInsights(list){
  const box=document.getElementById('zm-insight-list'); if(!box) return;
  list.forEach(it=>{
    const d=document.createElement('div'); d.className='zm-card';
    d.innerHTML = `<div style="font-weight:600">${it.title}</div><div class="sub" style="opacity:.9">${it.body}</div>`;
    box.prepend(d);
  });
}
function bootstrapPlaybooks(){
  setInterval(()=>{
    const m = metrics(); const th = trailheads(m);
    if (th.length){ pushInsights(th.slice(0,2)); }
  }, 15000);
}
document.addEventListener('DOMContentLoaded', bootstrapPlaybooks);
