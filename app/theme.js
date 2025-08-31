
const LS = { theme: 'mgd.theme' };
const THEMES = {
  rose: {'--accent':'#ff1e8a','--bg':'#0a0006','--fg':'#ffffff'},
  obsidian: {'--accent':'#9ad5ff','--bg':'#000000','--fg':'#ffffff'},
  lapis: {'--accent':'#4da3ff','--bg':'#020611','--fg':'#eaf5ff'},
  ember: {'--accent':'#ff824d','--bg':'#120603','--fg':'#fff3e9'}
};
function applyTheme(name){
  const t = THEMES[name] || THEMES.rose;
  Object.entries(t).forEach(([k,v])=> document.documentElement.style.setProperty(k, v));
  localStorage.setItem(LS.theme, name);
}
export function bootstrapTheme(){
  const saved = localStorage.getItem(LS.theme) || 'rose';
  applyTheme(saved);
  document.querySelectorAll('.theme-apply').forEach(b => b.addEventListener('click', ()=> applyTheme(b.dataset.theme)));
}
document.addEventListener('DOMContentLoaded', bootstrapTheme);
