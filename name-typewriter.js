/* A quiet bilingual name animation for the profile only. */
(function () {
  'use strict';
  const targets = Array.from(document.querySelectorAll('.profile-details [data-name-typing]'));
  if (!targets.length) return;
  const toggle = document.getElementById('nameAnimationToggle');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const names = [
    { text: 'Xiaoxi Kong', lang: 'en' },
    { text: '孔小茜', lang: 'zh-CN' }
  ];
  let nameIndex = 0;
  let letters = Array.from(names[0].text).length;
  let deleting = true;
  let timer = null;
  let paused = false;

  function render() {
    const name = names[nameIndex];
    const text = Array.from(name.text).slice(0, letters).join('');
    document.documentElement.classList.toggle('name-is-typing', !paused && !preference.matches && letters < Array.from(name.text).length);
    targets.forEach(function (target) {
      target.textContent = text;
      target.setAttribute('lang', name.lang);
    });
  }

  function stopTimer() {
    window.clearTimeout(timer);
    timer = null;
  }

  function schedule(delay) {
    stopTimer();
    if (!paused && !preference.matches && !document.hidden) {
      timer = window.setTimeout(step, delay);
    }
  }

  function step() {
    timer = null;
    if (paused || preference.matches || document.hidden) return;
    if (deleting) {
      letters -= 1;
      render();
      if (letters === 0) {
        nameIndex = (nameIndex + 1) % names.length;
        deleting = false;
        schedule(100);
      } else {
        schedule(45);
      }
    } else {
      letters += 1;
      render();
      if (letters === Array.from(names[nameIndex].text).length) {
        deleting = true;
        schedule(4500);
      } else {
        schedule(nameIndex === 1 ? 240 : 130);
      }
    }
  }

  function reset() {
    stopTimer();
    nameIndex = 0;
    letters = Array.from(names[0].text).length;
    deleting = true;
    render();
    const enabled = !paused && !preference.matches;
    document.documentElement.classList.toggle('name-animation-enabled', enabled);
    if (toggle) {
      toggle.hidden = preference.matches;
      toggle.setAttribute('aria-pressed', String(paused));
      toggle.setAttribute('aria-label', paused ? 'Resume name animation' : 'Pause name animation');
      toggle.title = paused ? 'Resume name animation' : 'Pause name animation';
      toggle.querySelector('span').textContent = paused ? '▶' : 'Ⅱ';
    }
    if (enabled) schedule(4500);
  }

  if (toggle) {
    toggle.addEventListener('click', function () { paused = !paused; reset(); });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopTimer();
    else schedule(800);
  });
  if (preference.addEventListener) preference.addEventListener('change', reset);
  else if (preference.addListener) preference.addListener(reset);
  window.addEventListener('pagehide', stopTimer);
  window.addEventListener('pageshow', reset);
  reset();
})();
