
export function bootstrapManifestSwitcher(){
  const els = document.querySelectorAll('.man-apply');
  els.forEach(btn => btn.addEventListener('click', ()=>{
    const href = btn.dataset.man;
    let link = document.querySelector('link[rel="manifest"]'); if (!link){ link = document.createElement('link'); link.rel='manifest'; document.head.appendChild(link); }
    link.href = href;
    const st = document.getElementById('man-status'); if (st) st.textContent = 'Manifest set to '+href+'. Now use Install (PWA).';
  }));
}
document.addEventListener('DOMContentLoaded', bootstrapManifestSwitcher);
