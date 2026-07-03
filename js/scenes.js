/* ==================================================================
   scenes.js
   Drives the story: a gated sequence (intro -> keypad -> curtain ->
   bouquet -> letter) followed by a free, Lenis-smoothed scroll
   through (scrapbook -> map -> final question -> ending).
   ================================================================== */

(function () {
  gsap.registerPlugin(ScrollTrigger);

  const PASSWORD = '1501';
  const LETTER_TEXT = `these 6 months or we say half a year... have been the happiest... most fun 6 months of my entire life... you bought my lost smile back you gave me hope in this hopeless world... you made me realise that patience pays off and that some loses are fine cuz they might lead to better... but the only one that i never want to lose is you... cuz i dont want better i want you i only want you Nishtha... i wanna be your forever... i wanna be your husband one day... i wanna marry you take you on world tour with me... give you the life you deserve give you the happiness you deserve... I just want you always by my side... having you makes me realise that i have everything and that i dont need anyone else... i have my home... i wasn't searching but deep down i had something missing... deep down i thought theres a piece of that with someone else... so i was searching for that... it all started with a crush... someone i liked... You... went from just a crush i didn't talk to, to a friend then the best friend... then i fell in love... you fell harder... i kept falling harder and we still are falling in love more and more since these 6 months... Our half year anniversary... became the love of my life... became my... Everything.
we had our ups and downs... moments that felt like its the end... but our love... its stronger than any of those, we always find a way to make that problem go away and get back... fall harder everytime in love... we never stop loving, we might get mad, sad, upset, annoyed but in the end our love wins over everything... its that strong sweety... been 6 Months of falling in love... im still falling... still learning to love you... learning to love you better, cuz you deserve better... only from Me`;
  const LETTER_PS = `And if I had to choose again...\nI'd still choose you.\nEvery single time.`;

  /* ---------------------------------- helpers ---------------------------------- */
  function show(el) { el.hidden = false; }
  function hide(el) { el.hidden = true; }

  function crossfade(fromEl, toEl, onMid) {
    const tl = gsap.timeline();
    tl.to(fromEl, { opacity: 0, duration: 0.7, ease: 'power2.inOut' })
      .add(() => { hide(fromEl); if (onMid) onMid(); show(toEl); gsap.set(toEl, { opacity: 0 }); })
      .to(toEl, { opacity: 1, duration: 0.9, ease: 'power2.out' });
    return tl;
  }

  /* ---------------------------------- 0. INTRO ---------------------------------- */
  const sceneIntro = document.getElementById('scene-intro');
  const sceneKeypad = document.getElementById('scene-keypad');

  window.addEventListener('music:started', () => {
    Atmosphere.setMode('night');
    crossfade(sceneIntro, sceneKeypad, () => buildKeypad());
  });

  /* ---------------------------------- 1. KEYPAD ---------------------------------- */
  const keypadGrid = document.getElementById('keypad-grid');
  const keypadDisplay = document.getElementById('keypad-display');
  const keypadMessage = document.getElementById('keypad-message');
  const keypadCard = document.querySelector('.keypad-card');
  let entered = '';
  let keypadBuilt = false;

  function buildKeypad() {
    if (keypadBuilt) return;
    keypadBuilt = true;
    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'];
    keys.forEach((k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'keypad-btn' + (k === 'clear' ? ' key-clear' : k === 'back' ? ' key-back' : '');
      btn.textContent = k === 'clear' ? 'clear' : k === 'back' ? '⌫' : k;
      btn.addEventListener('click', () => handleKey(k));
      keypadGrid.appendChild(btn);
    });
  }

  function updateDots() {
    const dots = keypadDisplay.querySelectorAll('.keypad-dot');
    dots.forEach((d, i) => d.classList.toggle('filled', i < entered.length));
  }

  function handleKey(k) {
    if (k === 'clear') { entered = ''; updateDots(); keypadMessage.textContent = '\u00A0'; return; }
    if (k === 'back') { entered = entered.slice(0, -1); updateDots(); return; }
    if (entered.length >= 4) return;
    entered += k;
    updateDots();
    if (entered.length === 4) checkPassword();
  }

  function checkPassword() {
    if (entered === PASSWORD) {
      keypadMessage.textContent = 'yes... it\'s you 💗';
      keypadMessage.style.color = 'var(--sage)';
      setTimeout(() => goToCurtain(), 900);
    } else {
      keypadMessage.textContent = 'Try Again 💗';
      keypadMessage.style.color = 'var(--dusty-rose)';
      keypadCard.classList.remove('shake');
      void keypadCard.offsetWidth;
      keypadCard.classList.add('shake');
      setTimeout(() => { entered = ''; updateDots(); }, 500);
    }
  }

  /* ---------------------------------- 2. CURTAIN ---------------------------------- */
  const sceneCurtain = document.getElementById('scene-curtain');
  const sceneBouquet = document.getElementById('scene-bouquet');
  const curtainLeft = document.querySelector('.curtain-left');
  const curtainRight = document.querySelector('.curtain-right');

  function goToCurtain() {
    crossfade(sceneKeypad, sceneCurtain, () => {
      Atmosphere.setMode('petals');
    });
    setTimeout(playCurtainOpen, 800);
  }

  function playCurtainOpen() {
    const tl = gsap.timeline({ onComplete: goToBouquet });
    tl.fromTo([curtainLeft, curtainRight], { x: 0 }, {
      x: (i) => (i === 0 ? '-105%' : '105%'),
      duration: 1.8,
      ease: 'power3.inOut',
      stagger: 0
    }, 1.0)
    .to('.curtain-caption', { opacity: 0, duration: 0.6 }, 1.0);
  }

  function goToBouquet() {
    crossfade(sceneCurtain, sceneBouquet, () => {
      buildBouquet();
    });
  }

  /* ---------------------------------- 3. BOUQUET ---------------------------------- */
  const bouquetSvg = document.getElementById('bouquet-svg');
  const bouquetWrap = document.getElementById('bouquet-wrap');
  let bouquetBuilt = false;

  function buildBouquet() {
    if (bouquetBuilt) return;
    bouquetBuilt = true;
    BouquetSVG.build(bouquetSvg, { animate: true, delay: 0.2 });
  }

  function openLetter() {
    gsap.to(bouquetWrap, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    setTimeout(goToLetter, 350);
  }
  bouquetWrap.addEventListener('click', openLetter);
  bouquetWrap.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openLetter(); });

  /* ---------------------------------- 4. LETTER ---------------------------------- */
  const sceneLetter = document.getElementById('scene-letter');
  const letterBody = document.getElementById('letter-body');
  const letterPs = document.getElementById('letter-ps');
  const letterContinue = document.getElementById('letter-continue');
  const letterBook = document.getElementById('letter-book');
  let letterTyped = false;

  function goToLetter() {
    crossfade(sceneBouquet, sceneLetter, () => {
      Atmosphere.setMode('candlelight');
      gsap.fromTo(letterBook, { rotateY: -90, opacity: 0 }, { rotateY: 0, opacity: 1, duration: 1.1, ease: 'power2.out', onComplete: typeLetter });
    });
  }

  function typeLetter() {
    if (letterTyped) return;
    letterTyped = true;
    const chars = LETTER_TEXT.split('');
    let i = 0;
    const speed = 9; // ms per character — fast enough not to feel like a wait, still handwritten-ink feel
    function tick() {
      letterBody.textContent += chars[i];
      i++;
      if (i < chars.length) {
        setTimeout(tick, speed);
      } else {
        typePs();
      }
    }
    tick();
  }

  function typePs() {
    let i = 0;
    function tick() {
      letterPs.textContent += LETTER_PS[i];
      i++;
      if (i < LETTER_PS.length) {
        setTimeout(tick, 28);
      } else {
        letterContinue.classList.add('is-ready');
      }
    }
    setTimeout(tick, 500);
  }

  letterContinue.addEventListener('click', enterFreeScroll);

  /* ---------------------------------- PHASE B: FREE SCROLL ---------------------------------- */
  const sceneScrapbook = document.getElementById('scene-scrapbook');
  const sceneMap = document.getElementById('scene-map');
  const sceneFinal = document.getElementById('scene-final');
  const sceneEnding = document.getElementById('scene-ending');
  let lenis;
  let scrollUnlocked = false;

  function enterFreeScroll() {
    if (scrollUnlocked) return;
    scrollUnlocked = true;
    gsap.to(sceneLetter, {
      opacity: 0, duration: 0.7, ease: 'power2.inOut', onComplete: () => {
        hide(sceneLetter);
        [sceneScrapbook, sceneMap, sceneFinal, sceneEnding].forEach(show);
        document.body.classList.add('is-scrolling');
        initLenis();
        initScrapbookAnimations();
        initMapScene();
        initFinalScene();
        window.scrollTo(0, sceneScrapbook.offsetTop);
        Atmosphere.setMode('paper');
      }
    });
  }

  function initLenis() {
    lenis = new Lenis({ smoothWheel: true, lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function smoothScrollTo(target) {
    if (lenis) lenis.scrollTo(target, { duration: 1.2 });
    else target.scrollIntoView({ behavior: 'smooth' });
  }

  /* ---------------------------------- 5. SCRAPBOOK ---------------------------------- */
  function initScrapbookAnimations() {
    const pages = gsap.utils.toArray('.sb-page');
    pages.forEach((page, i) => {
      gsap.set(page, { '--page-rot': (i % 2 === 0 ? -3 : 3) + 'deg' });
      gsap.from(page, {
        opacity: 0,
        y: 60,
        rotate: i % 2 === 0 ? -8 : 8,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: page, start: 'top 82%' }
      });
    });

    document.getElementById('scrapbook-continue').addEventListener('click', () => smoothScrollTo(sceneMap));

    ScrollTrigger.create({
      trigger: sceneScrapbook,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => Atmosphere.setMode('paper'),
      onEnterBack: () => Atmosphere.setMode('paper'),
    });
  }

  /* ---------------------------------- 6. MAP ---------------------------------- */
  function initMapScene() {
    // Two entirely separate maps — each iframe just centers on its own
    // location with its own pin. Nothing connects them on the map itself;
    // the dotted line + heart between the two cards is purely a decorative
    // "these two places belong to the same story" flourish.
    document.querySelectorAll('.map-iframe').forEach((iframe) => {
      const lat = iframe.dataset.lat, lng = iframe.dataset.lng;
      iframe.src = `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
    });

    document.querySelectorAll('.open-maps-btn--small').forEach((link) => {
      const lat = link.dataset.lat, lng = link.dataset.lng;
      link.href = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    });

    gsap.to('.map-connector-heart', {
      left: '92%',
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    ScrollTrigger.create({
      trigger: sceneMap,
      start: 'top center',
      onEnter: () => Atmosphere.setMode('paper'),
    });

    document.getElementById('map-continue').addEventListener('click', () => smoothScrollTo(sceneFinal));
  }

  /* ---------------------------------- 7. FINAL QUESTION ---------------------------------- */
  function initFinalScene() {
    const line1 = document.querySelector('.final-line--1');
    const line2 = document.querySelector('.final-line--2');
    const question = document.querySelector('.final-question');
    const buttons = document.querySelector('.final-buttons');
    const yesBtn = document.getElementById('btn-yes');
    const noBtn = document.getElementById('btn-no');
    let noClicked = false;
    let played = false;

    ScrollTrigger.create({
      trigger: sceneFinal,
      start: 'top 60%',
      onEnter: () => {
        if (played) return;
        played = true;
        Atmosphere.setMode('sunset');
        gsap.set(question, { y: 24 });
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.to(line1, { opacity: 1, duration: 1 })
          .to(line1, { opacity: 0.4, duration: 0.6 }, '+=1.2')
          .to(line2, { opacity: 1, duration: 1 }, '-=0.2')
          .to(question, { opacity: 1, y: 0, duration: 1 }, '+=0.6')
          .to(buttons, { opacity: 1, duration: 0.8 }, '-=0.3');
      }
    });

    noBtn.addEventListener('click', () => {
      if (!noClicked) {
        noClicked = true;
        noBtn.textContent = 'I think you meant Yes 💗';
        gsap.fromTo(noBtn, { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' });
        return;
      }
      goToYes();
    });

    yesBtn.addEventListener('click', goToYes);
  }

  /* ---------------------------------- 8. YES ENDING ---------------------------------- */
  let endingPlayed = false;
  function goToYes() {
    smoothScrollTo(sceneEnding);
    if (endingPlayed) return;
    endingPlayed = true;
    setTimeout(playEnding, 900);
  }

  function playEnding() {
    Atmosphere.setMode('sunset');
    Atmosphere.burstPetals(50);

    const bloomSvg = document.getElementById('ending-bloom-svg');
    BouquetSVG.build(bloomSvg, { animate: true, centerX: 200, baseY: 470 });
    gsap.to(bloomSvg, { opacity: 1, duration: 1 });

    const whiteout = document.getElementById('ending-whiteout');
    const content = document.querySelector('.ending-content');
    const cat = document.getElementById('ending-cat');

    const tl = gsap.timeline({ delay: 1.6 });
    tl.to(whiteout, { opacity: 1, duration: 1.1, ease: 'power2.inOut' })
      .to(content, { opacity: 1, duration: 1 }, '-=0.3')
      .to(whiteout, { opacity: 0, duration: 1.2 }, '-=0.2')
      .to(cat, { opacity: 1, left: '105%', duration: 6, ease: 'none' }, '+=1');
  }

  /* ---------------------------------- expose for easter-eggs.js ---------------------------------- */
  window.LunaStory = { smoothScrollTo: (el) => smoothScrollTo(el) };
})();
