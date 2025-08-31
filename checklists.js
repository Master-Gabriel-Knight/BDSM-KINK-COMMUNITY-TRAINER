
const LS = { cc:'mgd.consent.checklists' };
const BANK = {
  foundation: [
    'Blindfold / sensory play',
    'Gentle restraint (soft ties, safety scissors)',
    'Guided breath pacing',
    'Hands‑only impact (light taps)'
  ],
  impact: [
    'Light rhythmic impact (timed with breath)',
    'Implements with broad surface (paddle)',
    'Marks acceptable tomorrow? (yes/no/maybe)'
  ],
  roles: [
    'Service gestures (bringing water, blankets)',
    'Power exchange (verbal agreements)',
    'Public‑safe language only'
  ]
};
const STATES = ['No','Maybe','Curious','Yes'];
function load(){ try{return JSON.parse(localStorage.getItem(LS.cc)||'{}')}catch(e){return{}} }
function save(x){ localStorage.setItem(LS.cc, JSON.stringify(x)); }
function render(deck){
  const grid = document.getElementById('cc-grid'); if(!grid) return;
  const state = load(); const answers = state[deck]||{};
  grid.innerHTML='';
  (BANK[deck]||[]).forEach((label, idx)=>{
    const wrap = document.createElement('div'); wrap.style.cssText='border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25)';
    const sel = document.createElement('select'); STATES.forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; sel.appendChild(o); });
    sel.value = answers[idx]||'Maybe';
    sel.addEventListener('change', ()=>{ const st=load(); const deckAns=st[deck]||{}; deckAns[idx]=sel.value; st[deck]=deckAns; save(st); });
    const title = document.createElement('div'); title.textContent = label;
    wrap.appendChild(title); wrap.appendChild(sel); grid.appendChild(wrap);
  });
}
function pdf(deck){
  const st = load()[deck]||{}; const items = (BANK[deck]||[]).map((label,i)=> `• ${label} — ${st[i]||'Maybe'}`).join('\n');
  const html = `<!doctype html><meta charset="utf-8"><title>Consent Checklist</title>
  <style>body{font-family:serif;padding:24px}</style>
  <h1>Consent Checklist — ${deck}</h1><pre>${items.replace(/[&<>]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[s]))}</pre>
  <script>window.onload=()=>window.print()</script>`;
  const w = window.open('about:blank'); w.document.write(html); w.document.close();
}
export function bootstrapChecklists(){
  const sel = document.getElementById('cc-deck');
  document.getElementById('cc-start')?.addEventListener('click', ()=> render(sel.value));
  document.getElementById('cc-save')?.addEventListener('click', ()=> alert('Saved locally.'));
  document.getElementById('cc-export')?.addEventListener('click', ()=> pdf(sel.value));
}
document.addEventListener('DOMContentLoaded', bootstrapChecklists);
