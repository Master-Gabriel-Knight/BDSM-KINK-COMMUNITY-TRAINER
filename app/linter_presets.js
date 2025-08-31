
const PRESETS = {
  solo:  {require:['aftercare','safeword'], warn:['forever'], maxWaitMin:12, requireBreath:true},
  partner:{require:['aftercare','safeword'], warn:['always','punish'], maxWaitMin:10, requireBreath:true},
  workshop:{require:['aftercare','safeword','check-in'], warn:['forever','must','force'], maxWaitMin:6, requireBreath:true}
};
export function bootstrapLinterPresets(){
  const open=document.getElementById('lr-presets-open'); const box=document.getElementById('lr-presets-overlay'); const close=document.getElementById('lr-presets-close');
  open?.addEventListener('click', ()=> box.style.display='flex');
  close?.addEventListener('click', ()=> box.style.display='none');
  document.querySelectorAll('.lr-apply').forEach(b=> b.addEventListener('click', ()=>{
    const p = PRESETS[b.dataset.pack]; if (!p) return;
    localStorage.setItem('mgd.lint.rules', JSON.stringify(p));
    alert('Applied '+b.dataset.pack+' preset. Open Rules to adjust.');
    box.style.display='none';
  }));
}
document.addEventListener('DOMContentLoaded', bootstrapLinterPresets);
