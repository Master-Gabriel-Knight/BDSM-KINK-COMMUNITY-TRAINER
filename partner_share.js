
function currentCode(){
  const box = document.getElementById('partner-code'); return (box?.value||'').trim();
}
export function bootstrapPartnerShare(){
  const btn=document.getElementById('partner-share'); if(!btn) return;
  btn.addEventListener('click', async ()=>{
    const code = currentCode(); if (!code) return alert('Generate a code first.');
    const text = 'MGD Partner Code (paste into Partner Link → Import):\n'+code;
    try{
      if (navigator.share){ await navigator.share({title:'MGD Partner Code', text}); }
      else{ await navigator.clipboard.writeText(text); alert('Copied to clipboard.'); }
    }catch(e){ try{ await navigator.clipboard.writeText(text); alert('Copied to clipboard.'); }catch(e2){ alert('Could not share.'); } }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPartnerShare);
