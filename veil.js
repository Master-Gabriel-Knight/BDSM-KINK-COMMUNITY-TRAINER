
export function bootstrapVeil(){
  const veil = document.getElementById('veil-overlay');
  window.addEventListener('keydown', (e)=>{ if (e.key==='V' || e.key==='v'){ e.preventDefault(); veil.style.display = (veil.style.display==='block'?'none':'block'); } });
}
document.addEventListener('DOMContentLoaded', bootstrapVeil);
