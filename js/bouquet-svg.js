/* ==================================================================
   bouquet-svg.js
   Builds a more realistic layered-illustration bouquet: frangipani,
   tulips, carnations, lilies, eucalyptus-style leaves, and baby's
   breath filler — with soft gradients and a drop shadow for depth.
   Exposes window.BouquetSVG.build(svgEl, opts).
   ================================================================== */

(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  function injectDefs(svgEl) {
    const defs = el('defs', {});

    // Petal gradients — soft light-to-shadow so petals feel dimensional
    const grads = [
      { id: 'grad-frangipani', stops: [['0%', '#FFFFFF'], ['55%', '#FFFDF6'], ['100%', '#F6D8B0']] },
      { id: 'grad-tulip',      stops: [['0%', '#EFC2BC'], ['60%', '#D9A5A0'], ['100%', '#B97D77']] },
      { id: 'grad-carnation',  stops: [['0%', '#F3D7D1'], ['55%', '#E7BFB8'], ['100%', '#CE9C93']] },
      { id: 'grad-lily',       stops: [['0%', '#FBF0D8'], ['55%', '#F3E2C5'], ['100%', '#DCBD87']] },
      { id: 'grad-leaf',       stops: [['0%', '#A2B48F'], ['100%', '#71875C']] },
      { id: 'grad-stem',       stops: [['0%', '#8AA070'], ['100%', '#5C7448']] },
    ];
    grads.forEach((g) => {
      const grad = el('linearGradient', { id: g.id, x1: '0%', y1: '0%', x2: '100%', y2: '100%' });
      g.stops.forEach(([off, color]) => grad.appendChild(el('stop', { offset: off, 'stop-color': color })));
      defs.appendChild(grad);
    });

    // Soft drop shadow for the whole bouquet
    const filter = el('filter', { id: 'bq-shadow', x: '-40%', y: '-40%', width: '180%', height: '180%' });
    filter.appendChild(el('feDropShadow', { dx: '0', dy: '6', stdDeviation: '7', 'flood-color': '#5B4132', 'flood-opacity': '0.28' }));
    defs.appendChild(filter);

    svgEl.appendChild(defs);
  }

  function leaf(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-leaf' });
    g.appendChild(el('path', {
      d: 'M0,0 C13,-16 15,-40 0,-58 C-15,-40 -13,-16 0,0 Z',
      fill: 'url(#grad-leaf)'
    }));
    g.appendChild(el('path', {
      d: 'M0,-4 C1,-20 0,-38 0,-52',
      stroke: 'rgba(255,255,255,0.35)', 'stroke-width': '1', fill: 'none'
    }));
    return g;
  }

  function babysBreath(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-filler' });
    const sprigs = [[0, 0], [8, -10], [-7, -14], [3, -22], [-4, -30]];
    sprigs.forEach(([dx, dy]) => {
      g.appendChild(el('circle', { cx: dx, cy: dy, r: 2.6, fill: '#FBF6EC', opacity: '0.9' }));
    });
    return g;
  }

  function frangipani(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-flower bq-frangipani' });
    for (let i = 0; i < 5; i++) {
      g.appendChild(el('path', {
        d: 'M0,0 C7,-11 7,-26 0,-33 C-7,-26 -7,-11 0,0 Z',
        fill: 'url(#grad-frangipani)',
        transform: `rotate(${i * 72 + 18}) scale(0.92)`,
        opacity: '0.85'
      }));
    }
    for (let i = 0; i < 5; i++) {
      g.appendChild(el('path', {
        d: 'M0,0 C6,-10 6,-24 0,-30 C-6,-24 -6,-10 0,0 Z',
        fill: 'url(#grad-frangipani)',
        transform: `rotate(${i * 72})`
      }));
    }
    g.appendChild(el('circle', { r: 4, fill: '#E9B85B' }));
    g.appendChild(el('circle', { r: 1.6, fill: '#C6862F' }));
    return g;
  }

  function tulip(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-flower bq-tulip' });
    g.appendChild(el('path', { d: 'M-13,6 C-15,-12 -9,-26 -3,-32 C-1,-18 -3,-4 -13,6 Z', fill: 'url(#grad-tulip)', opacity: '0.9' }));
    g.appendChild(el('path', { d: 'M13,6 C15,-12 9,-26 3,-32 C1,-18 3,-4 13,6 Z', fill: 'url(#grad-tulip)', opacity: '0.9' }));
    g.appendChild(el('path', { d: 'M-9,4 C-11,-13 -5,-25 0,-30 C5,-25 11,-13 9,4 C5,-3 -5,-3 -9,4 Z', fill: 'url(#grad-tulip)' }));
    g.appendChild(el('path', { d: 'M-5,2 C-6,-11 -2,-21 0,-25 C1,-13 1,-3 -5,2 Z', fill: '#a9695f', opacity: '0.45' }));
    return g;
  }

  function carnation(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-flower bq-carnation' });
    const rings = [
      { count: 12, radius: 10, r: 6.5, opacity: 0.75 },
      { count: 10, radius: 6.5, r: 6,  opacity: 0.9 },
      { count: 8,  radius: 3,  r: 5,  opacity: 1 },
    ];
    rings.forEach((ring) => {
      for (let i = 0; i < ring.count; i++) {
        const a = (i / ring.count) * Math.PI * 2;
        g.appendChild(el('circle', {
          cx: Math.cos(a) * ring.radius,
          cy: Math.sin(a) * ring.radius - 14,
          r: ring.r,
          fill: 'url(#grad-carnation)',
          opacity: String(ring.opacity)
        }));
      }
    });
    return g;
  }

  function lily(x, y, rot, scale) {
    const g = el('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${scale})`, class: 'bq-flower bq-lily' });
    for (let i = 0; i < 6; i++) {
      g.appendChild(el('path', {
        d: 'M0,0 C5,-17 4,-32 0,-38 C-4,-32 -5,-17 0,0 Z',
        fill: 'url(#grad-lily)',
        transform: `rotate(${i * 60})`
      }));
      g.appendChild(el('path', {
        d: 'M0,-2 C1,-15 0,-28 0,-34',
        stroke: '#C6A15B', 'stroke-width': '0.6', fill: 'none', opacity: '0.6',
        transform: `rotate(${i * 60})`
      }));
    }
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      g.appendChild(el('line', { x1: 0, y1: 0, x2: Math.cos(a) * 9, y2: Math.sin(a) * 9 - 4, stroke: '#C6A15B', 'stroke-width': '0.8' }));
      g.appendChild(el('circle', { cx: Math.cos(a) * 9, cy: Math.sin(a) * 9 - 4, r: 1.3, fill: '#9C6B2E' }));
    }
    g.appendChild(el('circle', { r: 2, fill: '#DCBD87' }));
    return g;
  }

  const BUILDERS = { frangipani, tulip, carnation, lily };

  /**
   * Builds a bouquet inside the provided <svg> element.
   * opts.animate: if true, GSAP-staggers each stem growing from the base.
   * opts.centerX/baseY: layout anchor (defaults tuned to viewBox="0 0 400 500").
   */
  function build(svgEl, opts = {}) {
    const centerX = opts.centerX ?? 200;
    const baseY = opts.baseY ?? 480;
    svgEl.innerHTML = '';
    injectDefs(svgEl);

    const wrap = el('g', { id: 'bq-wrap', filter: 'url(#bq-shadow)' });
    svgEl.appendChild(wrap);

    const stemGroup = el('g', { class: 'bq-stems' });
    wrap.appendChild(stemGroup);
    for (let i = -3; i <= 3; i++) {
      stemGroup.appendChild(el('path', {
        d: `M${centerX + i * 4},${baseY} C${centerX + i * 7},${baseY - 90} ${centerX + i * 2},${baseY - 160} ${centerX + i * 11},${baseY - 220}`,
        stroke: 'url(#grad-stem)', 'stroke-width': '4.2', fill: 'none', 'stroke-linecap': 'round'
      }));
    }
    const ribbon = el('g', {});
    ribbon.appendChild(el('rect', { x: centerX - 24, y: baseY - 8, width: 48, height: 16, rx: '4', fill: '#D9A5A0' }));
    ribbon.appendChild(el('path', { d: `M${centerX - 24},${baseY - 8} l-10,20 l14,-4 Z`, fill: '#c98f89' }));
    ribbon.appendChild(el('path', { d: `M${centerX + 24},${baseY - 8} l10,20 l-14,-4 Z`, fill: '#c98f89' }));
    wrap.appendChild(ribbon);

    const filler = [
      { x: centerX - 55, y: baseY - 210, rot: -20, scale: 1 },
      { x: centerX + 58, y: baseY - 240, rot: 15, scale: 0.9 },
      { x: centerX - 15, y: baseY - 300, rot: -5, scale: 0.85 },
      { x: centerX + 45, y: baseY - 300, rot: 10, scale: 0.8 },
    ];
    filler.forEach((f) => wrap.appendChild(babysBreath(f.x, f.y, f.rot, f.scale)));

    const leaves = [
      { x: centerX - 42, y: baseY - 55, rot: -38, scale: 1.05 },
      { x: centerX + 46, y: baseY - 52, rot: 38, scale: 1.05 },
      { x: centerX - 14, y: baseY - 25, rot: -12, scale: 0.85 },
      { x: centerX + 18, y: baseY - 24, rot: 14, scale: 0.85 },
      { x: centerX, y: baseY - 15, rot: 0, scale: 0.7 },
    ];
    leaves.forEach((l) => wrap.appendChild(leaf(l.x, l.y, l.rot, l.scale)));

    // back row first (partly hidden), then front row on top — creates depth
    const layout = [
      { type: 'carnation',  x: centerX - 78, y: baseY - 205, rot: -14, scale: 0.85 },
      { type: 'lily',       x: centerX + 80, y: baseY - 200, rot: 14,  scale: 0.95 },
      { type: 'frangipani', x: centerX - 8,  y: baseY - 300, rot: -3,  scale: 0.9 },
      { type: 'lily',       x: centerX - 58, y: baseY - 232, rot: -16, scale: 1.1 },
      { type: 'lily',       x: centerX + 60, y: baseY - 228, rot: 16,  scale: 1.05 },
      { type: 'tulip',      x: centerX - 28, y: baseY - 262, rot: -8,  scale: 1.0 },
      { type: 'tulip',      x: centerX + 30, y: baseY - 260, rot: 8,   scale: 1.0 },
      { type: 'carnation',  x: centerX,      y: baseY - 250, rot: 0,   scale: 1.18 },
      { type: 'frangipani', x: centerX + 72, y: baseY - 186, rot: 10,  scale: 1.12 },
      { type: 'frangipani', x: centerX - 20, y: baseY - 292, rot: -4,  scale: 1.0 },
      { type: 'frangipani', x: centerX + 22, y: baseY - 290, rot: 4,   scale: 1.0 },
    ];

    const flowerNodes = [];
    layout.forEach((f) => {
      const node = BUILDERS[f.type](f.x, f.y, f.rot, f.scale);
      wrap.appendChild(node);
      flowerNodes.push(node);
    });

    if (opts.animate && window.gsap) {
      gsap.set(flowerNodes, { transformOrigin: '0px 0px', scale: 0, opacity: 0 });
      gsap.set(stemGroup, { scaleY: 0, transformOrigin: `${centerX}px ${baseY}px` });
      gsap.set(ribbon, { opacity: 0 });
      const tl = gsap.timeline({ delay: opts.delay || 0 });
      tl.to(stemGroup, { scaleY: 1, duration: 0.9, ease: 'power2.out' })
        .to(ribbon, { opacity: 1, duration: 0.4 }, '-=0.3')
        .to(flowerNodes, {
          scale: (i) => (layout[i] ? layout[i].scale : 1),
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.6)'
        }, '-=0.3');
      return tl;
    }

    return null;
  }

  window.BouquetSVG = { build };
})();
