
import { openBreathRitual, setToneHz } from './breath.js';

const LS = { stage:'mgd.stage.editor' };

function el(id){ return document.getElementById(id); }
function stepRow(idx, step){
  const div = document.createElement('div');
  div.style.cssText = 'border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25);display:flex;gap:8px;align-items:center;justify-content:space-between';
  const label = document.createElement('div');
  label.textContent = `${idx+1}. ${Object.keys(step)[0]} → ${Object.values(step)[0]}`;
  const ctr = document.createElement('div');
  ctr.innerHTML = '<button data-act="up" class="navbtn">↑</button> <button data-act="down" class="navbtn">↓</button> <button data-act="del" class="navbtn">Delete</button>';
  div.appendChild(label); div.appendChild(ctr);
  div.dataset.step = JSON.stringify(step);
  return div;
}
function load(){ try{ return JSON.parse(localStorage.getItem(LS.stage)||'[]'); }catch(e){ return []; } }
function save(list){ localStorage.setItem(LS.stage, JSON.stringify(list)); }
function render(list){
  const mount = el('se-list'); if (!mount) return;
  mount.innerHTML = '';
  list.forEach((s,i)=> mount.appendChild(stepRow(i,s)));
  // wire controls
  mount.querySelectorAll('button[data-act]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('div[data-step]'); const idx = [...mount.children].indexOf(row);
      const list = load();
      if (btn.dataset.act==='up' && idx>0){ const t=list[idx-1]; list[idx-1]=list[idx]; list[idx]=t; }
      if (btn.dataset.act==='down' && idx<list.length-1){ const t=list[idx+1]; list[idx+1]=list[idx]; list[idx]=t; }
      if (btn.dataset.act==='del'){ list.splice(idx,1); }
      save(list); render(list);
    });
  });
}
function addStep(){
  const type = el('se-type')?.value||'say';
  const raw = (el('se-value')?.value||'').trim();
  if (!raw) return;
  let step = {};
  if (type==='say'){ step = { say: raw }; }
  if (type==='tone'){ step = { tone: parseFloat(raw)||432 }; }
  if (type==='cadence'){ step = { cadence: raw }; }
  if (type==='breath'){ const n = parseInt(raw.replace(/[^0-9]/g,''),10)||3; step = { breath: n }; }
  if (type==='decree'){ step = { decree: raw }; }
  if (type==='wait'){ const ms = parseInt(raw.replace(/[^0-9]/g,''),10)||1000; step = { wait: ms }; }
  if (type==='node'){ step = { node: raw.trim() }; }
  const list = load(); list.push(step); save(list); render(list);
}
let timer = null;
function play(list){
  stop();
  const lead = document.getElementById('se-lead')?.checked;
  let i=0;
  function applyStep(s){
    if (s.tone){ try{ setToneHz(+s.tone); }catch(e){} }
    if (s.cadence || s.breath){ const cust = document.getElementById('breath-custom'); if (cust && s.cadence) cust.value = s.cadence; openBreathRitual(null); }
    if (s.decree){ const d = document.getElementById('birthright-decree'); if (d) d.style.display='flex'; }
    if (s.say){ try{ const u = new SpeechSynthesisUtterance(s.say); u.rate=.95; speechSynthesis.speak(u);}catch(e){} }
    if (s.node){ window.dispatchEvent(new CustomEvent('mgd:selectNode', {detail:s.node})); }
  }
  function tick(){
    if (i>=list.length){ stop(); return; }
    const s = list[i++];
    applyStep(s);
    if (lead){ try{ window.dispatchEvent(new CustomEvent('mgd:scriptStep', {detail:s})); }catch(e){} }
    const tempo = parseFloat(document.getElementById('se-tempo')?.value||'1');
    const delay = (s.wait ? s.wait : 2500) * tempo;
    timer = setTimeout(tick, delay);
  }
  tick();
}
function stop(){ if (timer){ clearTimeout(timer); timer=null; } } if (timer){ clearTimeout(timer); timer=null; } }

export function bootstrapStageEditor(){
  render(load());
  el('se-add')?.addEventListener('click', addStep);
  el('se-save')?.addEventListener('click', ()=> save(load())); // no-op but confirms
  el('se-load')?.addEventListener('click', ()=> render(load()));
  el('se-export')?.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(load(),null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download='mgd_stage.json'; a.click();
  });
  el('se-import')?.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = ()=>{ try{ const obj = JSON.parse(r.result); save(obj); render(obj); }catch(e){ alert('Invalid file'); } }; r.readAsText(f);
  });
  el('se-play')?.addEventListener('click', ()=> play(load()));
  el('se-stop')?.addEventListener('click', stop);
}
document.addEventListener('DOMContentLoaded', bootstrapStageEditor);
