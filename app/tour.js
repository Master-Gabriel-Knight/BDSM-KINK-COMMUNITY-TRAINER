
const STEPS = [
  {id:'theme-switcher', text:'Pick a Skin. Themes are instant and local.'},
  {id:'stage-scripts', text:'Run or design a ritual. Player + Editor + Tempo.'},
  {id:'breath-visual', text:'Breath Engine: cadence, chime, glide, whispers.'},
  {id:'guardian-section', text:'Guardian Mode: public-safe defaults & Demo.'},
  {id:'consent-checklists', text:'Consent Checklists, Risk Register, and printables.'}
];
let i=0;
function show(on){ const o=document.getElementById('tour-overlay'); if(o) o.style.display=on?'block':'none'; }
function step(){
  const t=document.getElementById('tour-text'); const item=STEPS[i]; if(!item){ show(false); i=0; return; }
  t.textContent = item.text;
  const el=document.getElementById(item.id); if (el){ el.scrollIntoView({behavior:'smooth', block:'center'}); el.style.outline='2px solid #ff1e8a'; setTimeout(()=> el.style.outline='none', 1400); }
  i++;
}
export function bootstrapTour(){
  document.getElementById('open-tour')?.addEventListener('click', ()=>{ i=0; show(true); });
  document.getElementById('tour-next')?.addEventListener('click', step);
  document.getElementById('tour-close')?.addEventListener('click', ()=> show(false));
}
document.addEventListener('DOMContentLoaded', bootstrapTour);
