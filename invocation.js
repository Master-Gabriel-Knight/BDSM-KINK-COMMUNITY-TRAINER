
const LS = { inv:'mgd.inv.list' };
const SEED = [
  'I am safe, sovereign, and open to play.',
  'We honor boundaries, we choose joy.',
  'Our breath is the container; our care is the crown.',
  'We consent to this moment and each other.'
];
function load(){ try{return JSON.parse(localStorage.getItem(LS.inv)||'[]')}catch(e){return []} }
function save(list){ localStorage.setItem(LS.inv, JSON.stringify(list)); }
function speak(t){ try{ const u=new SpeechSynthesisUtterance(t); u.rate=.95; speechSynthesis.speak(u);}catch(e){} }
function render(){
  const list = load(); const mount=document.getElementById('inv-list'); if(!mount) return; mount.innerHTML='';
  list.forEach((t,i)=>{ const card=document.createElement('div'); card.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)'; card.innerHTML=`<p>${t}</p><div class="row" style="gap:6px"><button class="navbtn" data-act="speak" data-i="${i}">Speak</button><button class="navbtn" data-act="del" data-i="${i}">Delete</button></div>`; mount.appendChild(card); });
  mount.querySelectorAll('button[data-act="speak"]').forEach(b=> b.addEventListener('click', ()=> speak(load()[parseInt(b.dataset.i,10)])));
  mount.querySelectorAll('button[data-act="del"]').forEach(b=> b.addEventListener('click', ()=>{ const i=parseInt(b.dataset.i,10); const list=load(); list.splice(i,1); save(list); render(); }));
}
export function bootstrapInvocations(){
  if (load().length===0) save(SEED);
  render();
  document.getElementById('inv-speak')?.addEventListener('click', ()=>{ const t=document.getElementById('inv-text')?.value||''; if(t) speak(t); });
  document.getElementById('inv-save')?.addEventListener('click', ()=>{ const t=document.getElementById('inv-text')?.value||''; if(!t) return; const list=load(); list.unshift(t); save(list); render(); });
  document.getElementById('inv-random')?.addEventListener('click', ()=>{ const all=load(); if(all.length) { const t=all[Math.floor(Math.random()*all.length)]; document.getElementById('inv-text').value=t; speak(t); } });
}
document.addEventListener('DOMContentLoaded', bootstrapInvocations);
