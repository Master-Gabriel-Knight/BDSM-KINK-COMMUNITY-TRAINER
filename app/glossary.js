
const TERMS = [
  ['SSC','Safe, Sane, Consensual — a classic safety ethos.'],
  ['RACK','Risk-Aware Consensual Kink — focus on informed choice.'],
  ['Safewords','Agreed signals (e.g., Green/Yellow/Red) that override everything.'],
  ['Aftercare','Support and check-ins after a scene to integrate and soothe.'],
  ['Negotiation','Discussing limits, desires, and plans before you play.']
];
export function bootstrapGlossary(){
  const mount=document.getElementById('gloss-list'); if(!mount) return;
  TERMS.forEach(([k,v])=>{ const d=document.createElement('div'); d.style.cssText='border-bottom:1px dashed rgba(255,255,255,.15);padding:6px 0'; d.innerHTML=`<strong>${k}</strong><div style="opacity:.9">${v}</div>`; mount.appendChild(d); });
}
document.addEventListener('DOMContentLoaded', bootstrapGlossary);
