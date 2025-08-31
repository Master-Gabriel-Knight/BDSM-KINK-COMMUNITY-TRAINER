
export const WHISPERS = {
  'ha-valen': ['Ground is your leash of choice.', 'You are held by gravity, not owned.', 'Root like a king who moves.'],
  'sa-thriel': ['Your voice wears the ribbon you choose.', 'Truth sits sweet on your tongue.', 'Each word arrives as an offering.'],
  'lu-emra': ['Your heart is a throne.', 'Vow care to the body you live in.', 'Let devotion move first.'],
  're-anar': ['Memory becomes power when you breathe it.', 'Your center is bright.', 'Heat your will with a smile.'],
  'yu-zhal': ['Vision is gentle and accurate.', 'You see through soft edges.', 'The path shows itself.'],
  'om-veyah': ['Kneel to your crown, rise as sovereign.', 'Silence obeys you.', 'You are the permission.'],
  'tu-ruun': ['Feet kiss the floor.', 'Stability tastes like velvet.', 'Every step is a choice.'],
  'shen-thav': ['Transformation loves you.', 'Let the sternum warm and bloom.', 'Shed with grace.'],
  'ma-vira': ['Creativity purrs in your pelvis.', 'Pleasure is a teacher.', 'Sway writes new law.'],
  'ka-tor': ['Your spine is guarded.', 'Tiny tucks, mighty shield.', 'You are safe to play.'],
  'za-leth': ['The trick is love playing with itself.', 'Smile at the flip.', 'Duality yields to choice.'],
  'vi-serel': ['Your signal is clean and bright.', 'Clarity winks across the mirror.', 'Claim the throne of sight.'],
  'no-vaun': ['Stillness is sovereign.', 'Quiet is a friend that kneels.', 'Reset lands like a kiss.']
};

export function pickWhisper(nodeId){
  const pack = WHISPERS[nodeId]||null;
  if (!pack) return null;
  const soft = localStorage.getItem('mgd.guardian.enabled')==='1';
  if (soft) return pack[0];
  return pack[Math.floor(Math.random()*pack.length)];
}
