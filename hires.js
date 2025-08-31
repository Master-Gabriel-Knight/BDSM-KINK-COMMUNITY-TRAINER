
export function bootstrapHires(){
  const btn=document.getElementById('sigil-export-hires');
  btn?.addEventListener('click', ()=>{
    const cv = document.getElementById('sigil-canvas') || document.querySelector('#sg-canvas') || document.querySelector('canvas');
    if (!cv) return alert('No canvas found.');
    const scale = 3;
    const tmp=document.createElement('canvas'); tmp.width=cv.width*scale; tmp.height=cv.height*scale;
    const ctx=tmp.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.drawImage(cv, 0,0,tmp.width,tmp.height);
    const a=document.createElement('a'); a.href=tmp.toDataURL('image/png'); a.download='sigil_hires.png'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapHires);
