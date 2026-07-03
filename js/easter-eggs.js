/* ==================================================================
   easter-eggs.js
   Small hidden delights:
   - tap "Q2" three times -> reveals a P.S. note
   - moon / butterfly / cat are clickable with tiny toasts
   - six hidden frangipani flowers scattered through the site
   ================================================================== */

(function () {
  function toast(message, duration = 3200) {
    const el = document.createElement('div');
    el.className = 'easter-toast';
    el.textContent = message;
    el.style.cssText = `
      position: fixed; left: 50%; bottom: 90px; transform: translateX(-50%) translateY(10px);
      background: var(--ivory); color: var(--warm-brown); font-family: var(--font-hand);
      font-size: 1.15rem; padding: 0.7em 1.2em; border-radius: 999px; box-shadow: var(--shadow-soft);
      z-index: 60; opacity: 0; transition: opacity .4s ease, transform .4s ease; pointer-events: none;
      max-width: 80vw; text-align: center;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
    setTimeout(() => {
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 400);
    }, duration);
  }

  /* ---- tap Q2 three times ---- */
  const q2 = document.getElementById('tap-q2');
  const psNote = document.getElementById('easter-ps');
  let q2Taps = 0;
  if (q2) {
    q2.addEventListener('click', () => {
      q2Taps++;
      if (q2Taps === 3) {
        psNote.hidden = false;
        requestAnimationFrame(() => psNote.classList.add('is-visible'));
        setTimeout(() => {
          psNote.classList.remove('is-visible');
          setTimeout(() => { psNote.hidden = true; }, 500);
        }, 4200);
        q2Taps = 0;
      }
    });
  }

  /* ---- clickable moon ---- */
  const moon = document.getElementById('moon-easter');
  if (moon) {
    const trigger = () => toast('you are my favorite thing in the night sky 🌙');
    moon.addEventListener('click', trigger);
    moon.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') trigger(); });
  }

  /* ---- clickable butterfly ---- */
  const butterfly = document.getElementById('tap-butterfly');
  if (butterfly) {
    butterfly.addEventListener('click', () => toast('even the butterflies came to see you 🦋'));
  }

  /* ---- clickable cat paw ---- */
  const cat = document.getElementById('ending-cat');
  if (cat) {
    cat.style.pointerEvents = 'auto';
    cat.style.cursor = 'pointer';
    cat.addEventListener('click', () => toast('even our future cat approves of you 🐾'));
  }

  /* ---- six hidden frangipani flowers ---- */
  const HIDDEN_SPOTS = [
    { sceneId: 'scene-intro', top: '14%', left: '10%' },
    { sceneId: 'scene-bouquet', top: '8%', left: '85%' },
    { sceneId: 'scene-letter', top: '90%', left: '8%' },
    { sceneId: 'scene-scrapbook', top: '4%', left: '88%' },
    { sceneId: 'scene-map', top: '92%', left: '90%' },
    { sceneId: 'scene-ending', top: '10%', left: '12%' },
  ];
  let found = 0;

  HIDDEN_SPOTS.forEach((spot) => {
    const scene = document.getElementById(spot.sceneId);
    if (!scene) return;
    const flower = document.createElement('button');
    flower.type = 'button';
    flower.className = 'hidden-frangipani';
    flower.style.top = spot.top;
    flower.style.left = spot.left;
    flower.setAttribute('aria-label', 'a tiny hidden frangipani');
    flower.addEventListener('click', (e) => {
      e.stopPropagation();
      if (flower.dataset.found) return;
      flower.dataset.found = 'true';
      flower.style.opacity = '0';
      found++;
      toast(found >= 6 ? 'you found all six frangipani 🤍 just like i found you' : `a little frangipani, hidden for you (${found}/6)`);
    });
    scene.appendChild(flower);
  });
})();
