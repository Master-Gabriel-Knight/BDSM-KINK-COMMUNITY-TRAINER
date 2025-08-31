
const COLORS = { Inhale:'#14213d', Hold:'#0f4c5c', Exhale:'#5b0e2d', Rest:'#1b1b1b' };
export function bootstrapAmbient(){
  window.addEventListener('mgd:phase', (e)=>{ if (localStorage.getItem('mgd.perf')==='1') return;
    const c = COLORS[e.detail] || '#000';
    document.body.style.transition='background .6s ease'; document.body.style.background=c;
  });
}
document.addEventListener('DOMContentLoaded', bootstrapAmbient);
