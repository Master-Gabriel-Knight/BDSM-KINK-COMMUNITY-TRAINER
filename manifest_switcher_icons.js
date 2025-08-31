
export function bootstrapManifestSwitcherIcons(){
  document.querySelectorAll('.man-apply').forEach(btn=> btn.addEventListener('click', ()=>{
    const prof = btn.dataset.man.includes('solo')?'solo':btn.dataset.man.includes('partner')?'partner':'workshop';
    const i192 = localStorage.getItem(`mgd.icon.${prof}.192`); const i512 = localStorage.getItem(`mgd.icon.${prof}.512`);
    // fetch the base manifest file then splice icons
    fetch(btn.dataset.man).then(r=>r.json()).then(obj=>{
      obj.icons = [];
      if (i192) obj.icons.push({src:i192, sizes:'192x192', type:'image/png'});
      if (i512) obj.icons.push({src:i512, sizes:'512x512', type:'image/png'});
      const blob = new Blob([JSON.stringify(obj)], {type:'application/manifest+json'});
      const url = URL.createObjectURL(blob);
      let link = document.querySelector('link[rel="manifest"]'); if (!link){ link = document.createElement('link'); link.rel='manifest'; document.head.appendChild(link); }
      link.href = url;
      const st=document.getElementById('man-status'); if (st) st.textContent='Manifest set with custom icons. Now Install.';
    }).catch(()=>{});
  }));
}
document.addEventListener('DOMContentLoaded', bootstrapManifestSwitcherIcons);
