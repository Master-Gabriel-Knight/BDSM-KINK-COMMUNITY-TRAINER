
import { bootstrapTheme } from './theme.js';
// Extend themes with colorblind-friendly palettes
const root = document.documentElement;
const THEMES = {
  'cb-prot': {'--accent':'#ff9f1c','--bg':'#0b0c10','--fg':'#eaeaea'},
  'cb-deut': {'--accent':'#2ec4b6','--bg':'#0b0c10','--fg':'#eaeaea'}
};
function applyTheme(name){
  const t = THEMES[name]; if (!t) return;
  Object.entries(t).forEach(([k,v])=> root.style.setProperty(k, v));
}
export function bootstrapCBThemes(){
  document.querySelectorAll('.theme-apply').forEach(b => {
    b.addEventListener('click', ()=>{
      if (b.dataset.theme && THEMES[b.dataset.theme]) applyTheme(b.dataset.theme);
    });
  });
}
document.addEventListener('DOMContentLoaded', bootstrapCBThemes);
