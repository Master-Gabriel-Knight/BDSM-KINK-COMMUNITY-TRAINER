
export function bootstrapThermoIntensity(){
  window.addEventListener('mgd:thermo', (e)=>{
    const {a,s}=e.detail||{}; const slider=document.getElementById('kink-intensity'); const kink=document.getElementById('kink-enabled');
    if (!slider || !kink || !kink.checked) return;
    // If safety trails arousal, gently reduce intensity; if safety >= arousal and both mid, allow rise.
    const cur = parseInt(slider.value||'0',10);
    let target = cur;
    if (s < a) target = Math.max(0, cur-1);
    else if (s >= a && s >=6 && a>=5) target = Math.min(10, cur+1);
    if (target !== cur){ slider.value = String(target); slider.dispatchEvent(new Event('input')); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapThermoIntensity);
