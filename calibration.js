
let running = false, events = [];
function show(id,on=true){ const x=document.getElementById(id); if (x) x.style.display=on?'flex':'none'; }
function phaseName(i){ return ['Inhale','Hold','Exhale','Rest'][i%4]; }
function start(){
  running = true; events = [{t:performance.now(), p:0}];
  const s = document.getElementById('calib-status'); s.innerHTML = 'Recording… Press <kbd>Space</kbd> at each phase change. Current: <strong>Inhale</strong>';
  function onKey(e){ if (!running) return; if (e.code!=='Space') return; e.preventDefault(); const t=performance.now(); const last=events[events.length-1]; events.push({t, p:(last.p+1)%4}); s.innerHTML = 'Marked → '+phaseName(last.p+1)+' ('+(Math.round((t-last.t)/100)/10)+' s)'; }
  window.addEventListener('keydown', onKey, {once:false});
  s.dataset.handler='1';
  s._off = ()=> window.removeEventListener('keydown', onKey);
}
function stop(){
  if (!running) return; running=false;
  const s=document.getElementById('calib-status'); if (s && s._off) s._off();
  // compute averages per phase
  const deltas=[]; for (let i=1;i<events.length;i++){ deltas.push({p:events[i-1].p, d:(events[i].t-events[i-1].t)/1000}); }
  const acc=[0,0,0,0], cnt=[0,0,0,0]; deltas.forEach(x=>{ acc[x.p]+=x.d; cnt[x.p]++; });
  const avg = acc.map((a,i)=> Math.max(1, Math.round( (cnt[i]? (a/cnt[i]):0) )) ); // whole seconds
  const text = avg.join(','); s.innerHTML = 'Suggested cadence: <strong>'+text+'</strong>';
  s.dataset.avg=text;
}
function apply(){
  const s=document.getElementById('calib-status'); const avg=s?.dataset.avg; if (!avg) return alert('Calibrate first'); const box=document.getElementById('breath-custom'); if (box){ box.value=avg; alert('Cadence applied to Breath Engine.'); }
}
export function bootstrapCalibration(){
  document.getElementById('breath-calibrate')?.addEventListener('click', ()=> show('calib-overlay', true));
  document.getElementById('calib-start')?.addEventListener('click', start);
  document.getElementById('calib-stop')?.addEventListener('click', stop);
  document.getElementById('calib-apply')?.addEventListener('click', apply);
  document.getElementById('calib-close')?.addEventListener('click', ()=> show('calib-overlay', false));
}
document.addEventListener('DOMContentLoaded', bootstrapCalibration);
