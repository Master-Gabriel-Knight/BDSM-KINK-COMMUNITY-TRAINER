
let pc = null, dc = null, isHost = false;
function logStatus(t){ const s = document.getElementById('sync-status'); if (s) s.textContent = 'Status: ' + t; }
function show(on){ const ov = document.getElementById('sync-overlay'); if (ov) ov.style.display = on?'flex':'none'; }
async function makePC(){
  pc = new RTCPeerConnection();
  pc.onicecandidate = e => { /* rely on trickle end */ };
  pc.ondatachannel = e => { dc = e.channel; wireDC(); };
  pc.onconnectionstatechange = ()=> logStatus(pc.connectionState);
}
function wireDC(){
  if (!dc) return;
  dc.onopen = ()=> logStatus('connected');
  dc.onclose = ()=> logStatus('closed');
  dc.onmessage = (e)=>{
    let msg = {}; try{ msg = JSON.parse(e.data||'{}'); }catch(err){}
    // parsed above
    if (msg.type==='cue'){ try{ window.dispatchEvent(new CustomEvent('mgd:cue', {detail: msg.value})); }catch(e){} }
    if (msg.type==='script_step'){ try{ window.dispatchEvent(new CustomEvent('mgd:applyScriptStep', {detail: msg.value})); }catch(e){} }
    if (msg.type==='thermo'){ try{ window.dispatchEvent(new CustomEvent('mgd:partnerThermo', {detail: msg.value})); }catch(e){} }
    if (msg.type==='script_ctl'){ try{ window.dispatchEvent(new CustomEvent('mgd:applyScriptControl', {detail: msg.value})); }catch(e){} }
    if (msg.type==='say'){ try{ const u = new SpeechSynthesisUtterance(msg.value); speechSynthesis.speak(u);}catch(e){} }
  };
  // forward local cues
  window.addEventListener('mgd:cue', ev => { try{ dc.readyState==='open' && dc.send(JSON.stringify({type:'cue', value: ev.detail})); }catch(e){} });
  window.addEventListener('mgd:scriptStep', ev => { try{ dc.readyState==='open' && dc.send(JSON.stringify({type:'script_step', value: ev.detail})); }catch(e){} });
  window.addEventListener('mgd:scriptControl', ev => { try{ dc.readyState==='open' && dc.send(JSON.stringify({type:'script_ctl', value: ev.detail})); }catch(e){} });
  window.addEventListener('mgd:thermo', ev => { try{ dc.readyState==='open' && dc.send(JSON.stringify({type:'thermo', value: ev.detail})); }catch(e){} });
}
export function bootstrapSync(){
  const openBtn = document.getElementById('sync-open');
  const overlay = document.getElementById('sync-overlay');
  const hostBtn = document.getElementById('rtc-host');
  const joinBtn = document.getElementById('rtc-join');
  const closeBtn = document.getElementById('rtc-close');
  const offerTA = document.getElementById('rtc-offer');
  const answerTA = document.getElementById('rtc-answer');
  const copyL = document.getElementById('rtc-copy-offer');
  const copyR = document.getElementById('rtc-copy-answer');
  const connect = document.getElementById('rtc-connect');

  openBtn?.addEventListener('click', ()=> show(true));
  closeBtn?.addEventListener('click', ()=> show(false));

  hostBtn?.addEventListener('click', async ()=>{
    await makePC();
    isHost = true;
    dc = pc.createDataChannel('mgd'); wireDC();
    const offer = await pc.createOffer(); await pc.setLocalDescription(offer);
    offerTA.value = JSON.stringify(pc.localDescription);
  });
  joinBtn?.addEventListener('click', async ()=>{
    await makePC(); isHost = false;
  });
  copyL?.addEventListener('click', ()=>{ offerTA.select(); document.execCommand('copy'); });
  copyR?.addEventListener('click', ()=>{ answerTA.select(); document.execCommand('copy'); });

  connect?.addEventListener('click', async ()=>{
    if (isHost){
      // host expects answer pasted into right box
      const ans = JSON.parse(answerTA.value||'{}');
      await pc.setRemoteDescription(ans);
    }else{
      // joiner has offer in left, creates answer
      const off = JSON.parse(offerTA.value||'{}');
      await pc.setRemoteDescription(off);
      const ans = await pc.createAnswer(); await pc.setLocalDescription(ans);
      answerTA.value = JSON.stringify(pc.localDescription);
    }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapSync);


// MGD patch: bridge outgoing messages
try{
  window.mgdSync = window.mgdSync || {};
  const sendAny = (msg)=>{
    try{
      if (typeof dc !== 'undefined' && dc && dc.readyState==='open'){ dc.send(JSON.stringify(msg)); return true; }
      if (typeof channel !== 'undefined' && channel && channel.readyState==='open'){ channel.send(JSON.stringify(msg)); return true; }
      if (typeof dataChannel !== 'undefined' && dataChannel && dataChannel.readyState==='open'){ dataChannel.send(JSON.stringify(msg)); return true; }
    }catch(e){}
    return false;
  };
  window.mgdSync.send = (msg)=> sendAny(msg);
  window.addEventListener('mgd:syncSend', (e)=> sendAny(e.detail||{}));
}catch(e){}
