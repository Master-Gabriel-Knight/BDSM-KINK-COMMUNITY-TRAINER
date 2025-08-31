
function draw(canvas, emoji, bg, accent){
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=bg; ctx.fillRect(0,0,canvas.width,canvas.height);
  // accent ring
  ctx.strokeStyle=accent; ctx.lineWidth=canvas.width*0.08; ctx.strokeRect(ctx.lineWidth/2, ctx.lineWidth/2, canvas.width-ctx.lineWidth, canvas.height-ctx.lineWidth);
  ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.textBaseline='middle';
  const text = emoji || 'MGD';
  const fontSize = Math.floor(canvas.width * (text.length>3?0.26:0.38));
  ctx.font = `bold ${fontSize}px serif`;
  ctx.fillText(text, canvas.width/2, canvas.height/2+fontSize*0.05);
}
function saveIcons(profile){
  const c192=document.getElementById('if-192'); const c512=document.getElementById('if-512');
  localStorage.setItem(`mgd.icon.${profile}.192`, c192.toDataURL('image/png'));
  localStorage.setItem(`mgd.icon.${profile}.512`, c512.toDataURL('image/png'));
  alert('Icons saved to localStorage for '+profile+'. Use Manifest Switcher to apply.');
}
export function bootstrapIconForge(){
  const emoji=document.getElementById('if-emoji'); const bg=document.getElementById('if-bg'); const accent=document.getElementById('if-accent'); const profile=document.getElementById('if-profile');
  function preview(){ const e=emoji.value||'MGD'; const b=bg.value; const a=accent.value; draw(document.getElementById('if-192'), e, b, a); draw(document.getElementById('if-512'), e, b, a); }
  document.getElementById('if-preview')?.addEventListener('click', preview);
  document.getElementById('if-save')?.addEventListener('click', ()=> saveIcons(profile.value||'solo'));
  preview();
}
document.addEventListener('DOMContentLoaded', bootstrapIconForge);
