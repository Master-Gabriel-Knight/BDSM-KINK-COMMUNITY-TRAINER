
function partnerLink(){
  const code = (document.getElementById('partner-code')?.value||'').trim();
  return 'mgd-partner:'+encodeURIComponent(code);
}
function drawPoster(canvas){
  const ctx=canvas.getContext('2d'); const W=canvas.width, H=canvas.height;
  ctx.fillStyle='#000'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff'; ctx.textAlign='center';
  ctx.font='bold '+Math.floor(W*0.08)+'px serif';
  ctx.fillText('Partner Link Code', W/2, H*0.22);
  ctx.font='bold '+Math.floor(W*0.16)+'px serif';
  const code = (document.getElementById('partner-code')?.value||'').trim() || '—';
  ctx.fillText(code, W/2, H*0.45);
  ctx.font='italic '+Math.floor(W*0.04)+'px serif';
  ctx.fillText('Paste this into: Partner Link → Import', W/2, H*0.6);
  ctx.font='normal '+Math.floor(W*0.035)+'px serif';
  ctx.fillText(partnerLink(), W/2, H*0.7);
}
export function bootstrapPosterTools(){
  const big=document.getElementById('partner-bigcode'); if (!big) return;
  const qr=document.getElementById('partner-qr'); const btnQR=document.getElementById('poster-qr'); const btnSave=document.getElementById('poster-save');
  btnQR?.addEventListener('click', ()=>{
    const link = partnerLink();
    // Try online QR service; if offline, just show the link.
    const url = 'https://api.qrserver.com/v1/create-qr-code/?size=240x240&data='+encodeURIComponent(link);
    qr.style.display='block'; qr.src = url;
    qr.onerror = ()=>{ qr.style.display='none'; alert('QR not available offline. Link copied to clipboard instead.'); try{ navigator.clipboard.writeText(link); }catch(e){} };
  });
  btnSave?.addEventListener('click', ()=>{
    const cv=document.createElement('canvas'); cv.width=1200; cv.height=1600; drawPoster(cv);
    const a=document.createElement('a'); a.href=cv.toDataURL('image/png'); a.download='MGD_partner_poster.png'; a.click();
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPosterTools);
