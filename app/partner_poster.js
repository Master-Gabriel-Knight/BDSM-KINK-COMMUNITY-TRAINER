
export function bootstrapPartnerPoster(){
  const big = document.getElementById('partner-bigcode'); const box=document.getElementById('partner-code');
  if (!big || !box) return;
  function upd(){ big.textContent = box.value||''; }
  box.addEventListener('input', upd); upd();
}
document.addEventListener('DOMContentLoaded', bootstrapPartnerPoster);
