/* ==================================================================
   audio.js
   Handles the intro "Play our song" gate and the persistent
   glassmorphism music player (play/pause, volume, looping).
   ================================================================== */

(function () {
  const audio = document.getElementById('bg-audio');
  const gateBtn = document.getElementById('play-music-btn');
  const player = document.getElementById('music-player');
  const toggleBtn = document.getElementById('music-toggle');
  const volumeSlider = document.getElementById('music-volume');

  audio.volume = 0.5;
  audio.loop = true;

  function startMusic() {
    audio.play().catch(() => {
      // Autoplay-safe fallback: user can still hit the player toggle.
      console.warn('Audio could not autoplay; waiting for user interaction.');
    });
    player.classList.add('is-visible');
    player.setAttribute('aria-hidden', 'false');
    window.dispatchEvent(new CustomEvent('music:started'));
  }

  gateBtn.addEventListener('click', startMusic);

  toggleBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      player.classList.remove('is-paused');
    } else {
      audio.pause();
      player.classList.add('is-paused');
    }
  });

  volumeSlider.addEventListener('input', (e) => {
    audio.volume = Number(e.target.value) / 100;
  });
})();
