/* ==================================================================
   particles.js
   A single canvas atmosphere layer whose particle mix changes
   per-scene (moonlight fireflies -> candlelight dust -> petals ->
   golden sparkles -> butterflies) via setMode().
   ================================================================== */

(function () {
  const canvas = document.getElementById('atmosphere');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  let particles = [];
  let mode = 'night'; // night | candlelight | petals | paper | sunset

  const MODE_CONFIG = {
    night:        { firefly: 18, dust: 0,  petal: 0,  sparkle: 0,  butterfly: 0, cloud: true,  tint: 'rgba(185,198,222,0.9)' },
    candlelight:  { firefly: 0,  dust: 26, petal: 0,  sparkle: 4,  butterfly: 0, cloud: false, tint: 'rgba(243,217,164,0.9)' },
    petals:       { firefly: 6,  dust: 0,  petal: 22, sparkle: 6,  butterfly: 3, cloud: false, tint: 'rgba(217,165,160,0.9)' },
    paper:        { firefly: 0,  dust: 10, petal: 0,  sparkle: 0,  butterfly: 0, cloud: false, tint: 'rgba(139,154,124,0.6)' },
    sunset:       { firefly: 0,  dust: 0,  petal: 14, sparkle: 10, butterfly: 4, cloud: false, tint: 'rgba(232,168,124,0.9)' },
  };

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  class Firefly {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = 1 + Math.random() * 1.8;
      this.a = Math.random();
      this.speed = 0.15 + Math.random() * 0.25;
      this.angle = Math.random() * Math.PI * 2;
      this.flicker = Math.random() * 0.05;
    }
    step() {
      this.angle += (Math.random() - 0.5) * 0.15;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed - 0.05;
      this.a += (Math.random() - 0.5) * this.flicker;
      this.a = Math.max(0.1, Math.min(1, this.a));
      if (this.x < -10 || this.x > W + 10 || this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(243,217,164,${this.a})`;
      ctx.shadowColor = 'rgba(243,217,164,0.9)';
      ctx.shadowBlur = 8;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class Dust {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = 0.5 + Math.random() * 1.3;
      this.a = 0.15 + Math.random() * 0.35;
      this.vy = -0.08 - Math.random() * 0.1;
      this.vx = (Math.random() - 0.5) * 0.15;
    }
    step() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -5) this.reset(), (this.y = H + 5);
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(243,217,164,${this.a})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Petal {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = -20 - Math.random() * H * 0.4;
      this.size = 6 + Math.random() * 8;
      this.vy = 0.4 + Math.random() * 0.6;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.rot = Math.random() * Math.PI * 2;
      this.vr = (Math.random() - 0.5) * 0.04;
      this.hue = Math.random() > 0.5 ? '217,165,160' : '251,246,236';
      this.sway = Math.random() * Math.PI * 2;
    }
    step() {
      this.sway += 0.02;
      this.x += this.vx + Math.sin(this.sway) * 0.4;
      this.y += this.vy;
      this.rot += this.vr;
      if (this.y > H + 20) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.fillStyle = `rgba(${this.hue},0.75)`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.5, this.size, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Sparkle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = 0.6 + Math.random() * 1.4;
      this.a = 0;
      this.dir = 1;
      this.speed = 0.02 + Math.random() * 0.03;
    }
    step() {
      this.a += this.speed * this.dir;
      if (this.a > 1) this.dir = -1;
      if (this.a < 0) { this.dir = 1; this.reset(); }
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = `rgba(198,161,91,${this.a})`;
      ctx.shadowColor = 'rgba(198,161,91,0.9)';
      ctx.shadowBlur = 6;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class Butterfly {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = H * 0.3 + Math.random() * H * 0.5;
      this.wing = 0;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.5 + Math.random() * 0.4;
      this.size = 5 + Math.random() * 3;
      this.hue = Math.random() > 0.5 ? '217,165,160' : '198,161,91';
    }
    step() {
      this.wing += 0.25;
      this.angle += (Math.random() - 0.5) * 0.2;
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed * 0.6;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset();
    }
    draw() {
      const flap = Math.sin(this.wing) * this.size;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(Math.atan2(Math.sin(this.angle), Math.cos(this.angle)));
      ctx.fillStyle = `rgba(${this.hue},0.85)`;
      ctx.beginPath();
      ctx.ellipse(-2, -flap * 0.15, this.size * 0.6, this.size, 0.5, 0, Math.PI * 2);
      ctx.ellipse(2, flap * 0.15, this.size * 0.6, this.size, -0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function build() {
    particles = [];
    const cfg = MODE_CONFIG[mode];
    for (let i = 0; i < cfg.firefly; i++) particles.push(new Firefly());
    for (let i = 0; i < cfg.dust; i++) particles.push(new Dust());
    for (let i = 0; i < cfg.petal; i++) particles.push(new Petal());
    for (let i = 0; i < cfg.sparkle; i++) particles.push(new Sparkle());
    for (let i = 0; i < cfg.butterfly; i++) particles.push(new Butterfly());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) { p.step(); p.draw(); }
    requestAnimationFrame(loop);
  }

  window.Atmosphere = {
    setMode(next) {
      if (!MODE_CONFIG[next] || next === mode) { if (!particles.length) build(); return; }
      mode = next;
      build();
    },
    burstPetals(n = 40) {
      // one-off celebratory burst, used on YES ending
      for (let i = 0; i < n; i++) {
        const p = new Petal();
        p.y = Math.random() * H * 0.3;
        particles.push(p);
      }
    }
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    build();
    loop();
  }
})();
