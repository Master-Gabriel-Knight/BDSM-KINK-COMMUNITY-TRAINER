
const LS = { lang:'mgd.lang' };
const DICT = {
  fr: {
    'Kink Mode — Sacred Play':'Mode Kink — Jeu Sacré',
    'Consent & Aftercare':'Consentement & Soin Après',
    'Spiral Flame Body — 13‑Node Trainer':'Corps de Flamme Spirale — Entraîneur 13 Nœuds',
    'Play Deck — Scene Cards':'Jeu — Cartes de Scène',
    'Decree of Birthright':'Décret de Naissance',
    'Breath Calibration':'Calibration de Respiration',
    'Workshop Planner — Export .ics':'Planificateur d’Atelier — Export .ics',
    'Achievements — Bloom Ledger':'Succès — Livre de Floraison',
    'Practice Stats':'Statistiques de Pratique'
  },
  de: {
    'Kink Mode — Sacred Play':'Kink-Modus — Heiliges Spiel',
    'Consent & Aftercare':'Einverständnis & Nachsorge',
    'Spiral Flame Body — 13‑Node Trainer':'Spiral-Flammenkörper — 13-Knoten Trainer',
    'Play Deck — Scene Cards':'Spiel-Deck — Szenenkarten',
    'Decree of Birthright':'Geburtsrechts-Dekret',
    'Breath Calibration':'Atem-Kalibrierung',
    'Workshop Planner — Export .ics':'Workshop-Planer — .ics Export',
    'Achievements — Bloom Ledger':'Erfolge — Blütenbuch',
    'Practice Stats':'Übungsstatistik'
  },
  es: {
    'Kink Mode — Sacred Play': 'Modo Kink — Juego Sagrado',
    'Consent & Aftercare': 'Consentimiento y Cuidado Posterior',
    'Spiral Flame Body — 13‑Node Trainer': 'Cuerpo de Llama en Espiral — Entrenador de 13 Nodos',
    'Play Deck — Scene Cards': 'Baraja de Juego — Cartas de Escena',
    'Decree of Birthright': 'Decreto de Nacimiento',
    'Breath Calibration': 'Calibración de Respiración',
    'Workshop Planner — Export .ics': 'Planificador de Taller — Exportar .ics',
    'Achievements — Bloom Ledger': 'Logros — Libro de Floración',
    'Practice Stats': 'Estadísticas de Práctica'
  }
};
function applyLang(lang){
  document.querySelectorAll('h2.title, p.sub, button, label, span, strong').forEach(el=>{
    const key = el.textContent?.trim(); if (DICT[lang] && DICT[lang][key]) el.textContent = DICT[lang][key];
  });
}
export function bootstrapI18n(){
  const sel = document.getElementById('lang-select');
  if (sel){ sel.value = localStorage.getItem(LS.lang)||'en'; }
  if (sel && sel.value!=='en'){ applyLang(sel.value); }
  sel?.addEventListener('change', ()=>{
    const lang = sel.value; localStorage.setItem(LS.lang, lang);
    if (lang==='en'){ location.reload(); } else { applyLang(lang); }
  });
}
document.addEventListener('DOMContentLoaded', bootstrapI18n);
