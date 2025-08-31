
const LS = { qz:'mgd.quiz.progress' };
const BANK = {
  signals: [
    {q:'What does YELLOW signal mean?', a:['Slow/check in','All good','Stop'], ok:0},
    {q:'What is RED for?', a:['Pause and cuddle','Safe to continue','Stop now'], ok:2},
    {q:'GREEN means…', a:['Go with care','All good','Ask a question'], ok:1}
  ],
  limits: [
    {q:'A hard limit is…', a:['A preference','A negotiable boundary','A non‑negotiable no'], ok:2},
    {q:'A curiosity is…', a:['Something you might explore','A permanent boundary','A safeword'], ok:0}
  ],
  aftercare: [
    {q:'Aftercare is…', a:['Optional for beginners only','Useful for many scenes','Not part of consent'], ok:1},
    {q:'Check‑ins help by…', a:['Creating pressure','Offering support/info','Replacing safewords'], ok:1}
  ]
};
function el(id){ return document.getElementById(id); }
function load(){ try{return JSON.parse(localStorage.getItem(LS.qz)||'{}')}catch(e){return {}} }
function save(x){ localStorage.setItem(LS.qz, JSON.stringify(x)); }
let state = { deck:'signals', i:0, score:0 };
function renderCard(){
  const card = el('qz-card'); if(!card) return;
  const items = BANK[state.deck]; if (!items || !items[state.i]){ card.innerHTML = '<p>Done ✓</p>'; el('qz-score').textContent = 'Score: '+state.score+'/'+(items?items.length:0); const p=load(); p[state.deck]=true; save(p); return; }
  const item = items[state.i];
  const opts = item.a.map((t,j)=> `<button class="navbtn qz-ans" data-i="${j}">${t}</button>`).join(' ');
  card.innerHTML = `<strong>${item.q}</strong><div class="row" style="margin-top:8px;gap:6px;flex-wrap:wrap">${opts}</div>`;
  card.querySelectorAll('.qz-ans').forEach(b => b.addEventListener('click', ()=>{
    if (parseInt(b.dataset.i,10)===item.ok){ state.score++; }
    state.i++; renderCard();
  }));
}
export function bootstrapQuiz(){
  const btn = el('qz-start'); const sel = el('qz-select');
  btn?.addEventListener('click', ()=>{ state = { deck: sel.value||'signals', i:0, score:0 }; renderCard(); });
}
document.addEventListener('DOMContentLoaded', bootstrapQuiz);
