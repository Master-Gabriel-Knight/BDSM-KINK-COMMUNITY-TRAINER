
const LS = { demo:'mgd.demo.mode' };
function setDemo(on){
  localStorage.setItem(LS.demo, on?'1':'');
  // Guardian on, Kink off, sample lore + script
  try{ const g=document.getElementById('guardian-enable'); if(g){ g.checked=on; g.dispatchEvent(new Event('change')); } }catch(e){}
  if (on){
    const lore = JSON.parse(localStorage.getItem('mgd.lore')||'[]');
    lore.unshift({id:crypto.randomUUID(), time:new Date().toISOString(), title:'Sample Scene', content:'Node: Om’Veyah (Crown)\nCadence: 4,7,8,0\nFlavor: Soft · Intensity 0\nNotes: Public demo profile.'});
    localStorage.setItem('mgd.lore', JSON.stringify(lore));
  }
}
export function bootstrapDemo(){
  const box = document.getElementById('demo-toggle');
  if (box){ box.checked = localStorage.getItem(LS.demo)==='1'; }
  setDemo(box?.checked||false);
  box?.addEventListener('change', ()=> setDemo(box.checked));
}
document.addEventListener('DOMContentLoaded', bootstrapDemo);
