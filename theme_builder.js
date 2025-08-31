
const LS = { theme:'mgd.theme.custom' };
function apply(obj){ const r=document.documentElement; Object.entries(obj||{}).forEach(([k,v])=> r.style.setProperty(k, v)); }
export function bootstrapThemeBuilder(){
  const acc=document.getElementById('tb-accent'); const bg=document.getElementById('tb-bg'); const fg=document.getElementById('tb-fg');
  const applyBtn=document.getElementById('tb-apply'); const saveBtn=document.getElementById('tb-save');
  const saved = JSON.parse(localStorage.getItem(LS.theme)||'{}'); if (saved['--accent']){ apply(saved); }
  applyBtn?.addEventListener('click', ()=> apply({'--accent':acc.value,'--bg':bg.value,'--fg':fg.value}));
  saveBtn?.addEventListener('click', ()=>{ const obj={'--accent':acc.value,'--bg':bg.value,'--fg':fg.value}; localStorage.setItem(LS.theme, JSON.stringify(obj)); alert('Theme saved.'); });
}
document.addEventListener('DOMContentLoaded', bootstrapThemeBuilder);
