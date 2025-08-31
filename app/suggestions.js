
function topType(){
  try{ const m=JSON.parse(localStorage.getItem('mgd.eros.compass')||'{}'); let k=null, v=-1; for (const [kk,val] of Object.entries(m)){ if (val>v){ v=val; k=kk; } } return k; }catch(e){ return null; }
}
const RECS = {
  Sovereign: ['Praxis: Awakening','Script: Crown Claim','Decree: It was always mine.'],
  Devotee: ['Praxis: Devotion','Script: Heart Tending','Decree: Care and consent crown us.'],
  Trickster: ['Praxis: Mischief','Script: Playful Rule','Decree: Joy is a sovereign right.'],
  Hunter: ['Praxis: Focused Breath','Script: Seek & See','Decree: I focus and choose.'],
  Muse: ['Praxis: Soft Opening','Script: Adoration Mirror','Decree: I am seen, safe, and radiant.']
};
export function bootstrapSuggestions(){
  const mount=document.getElementById('sug-list'); if(!mount) return;
  const t=topType(); const list = t? RECS[t] : ['Take Eros Compass to get tailored ideas.'];
  mount.innerHTML = list.map(x=> `<div style="border:1px solid rgba(255,255,255,.15);border-radius:10px;padding:10px;background:rgba(0,0,0,.25);margin-bottom:6px">${x}</div>`).join('');
}
document.addEventListener('DOMContentLoaded', bootstrapSuggestions);
