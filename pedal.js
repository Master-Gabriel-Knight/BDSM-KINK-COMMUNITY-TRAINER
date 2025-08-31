
export function bootstrapPedal(){
  const btn=document.getElementById('pedal-connect'); const out=document.getElementById('pedal-status'); if (!btn) return;
  if (!('hid' in navigator)){ out.textContent='WebHID not supported in this browser.'; return; }
  btn.addEventListener('click', async ()=>{
    try{
      const devices = await navigator.hid.requestDevice({filters: []});
      const dev = devices[0]; if (!dev){ out.textContent='No device chosen.'; return; }
      await dev.open(); out.textContent = 'Connected: '+(dev.productName||'HID');
      dev.addEventListener('inputreport', e=>{
        // naive: if any nonzero data arrives, toggle or next; alternate behavior
        const first = e.data?.getUint8(0)||0;
        if (first % 2 === 0){ window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'teleprompter', value:'start'}})); }
        else { window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'teleprompter', value:'pause'}})); }
        // Also step chapter
        window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail:{type:'teleprompter', value:'speed', speed: parseInt(document.getElementById('tp-speed')?.value||'60',10)} }));
        document.getElementById('tp-next')?.click();
      });
    }catch(e){ out.textContent='Failed to connect.'; }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapPedal);
