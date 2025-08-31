
export function setupCrest(){
  const btn = document.getElementById('crest-show');
  const box = document.getElementById('crest-svg');
  if (!btn || !box) return;
  btn.addEventListener('click', ()=>{
    box.style.display = box.style.display==='none' ? 'block' : 'none';
    if (box.style.display==='block') renderHelix();
  });
}
function renderHelix(){
  const g = document.getElementById('omegas'); if (!g) return;
  g.innerHTML = '';
  const N = 18;
  for (let i=0;i<N;i++){
    const t = i/(N-1);
    const x = 60 + 480*t;
    const y = 120 + 70*Math.sin(t*4*Math.PI);
    const size = 16 + 10*(0.5 - Math.abs(t-0.5));
    const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
    txt.setAttribute('x', x); txt.setAttribute('y', y);
    txt.setAttribute('text-anchor','middle');
    txt.setAttribute('fill', 'url(#g1)');
    txt.setAttribute('font-size', size.toString());
    txt.setAttribute('font-family', 'serif');
    txt.textContent = 'Ω';
    g.appendChild(txt);
  }
}
