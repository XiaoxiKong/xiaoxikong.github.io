/* A quiet bilingual name animation for the profile only. */
(function () {
  'use strict';
  const targets = Array.from(document.querySelectorAll('.profile-details [data-name-typing]'));
  if (!targets.length) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const names = [
    { text: 'Xiaoxi Kong', lang: 'en' },
    { text: '孔小茜', lang: 'zh-CN' }
  ];
  let nameIndex = 0;
  let letters = Array.from(names[0].text).length;
  let deleting = true;
  let timer = null;

  function render() {
    const name = names[nameIndex];
    const text = Array.from(name.text).slice(0, letters).join('');
    document.documentElement.classList.toggle('name-is-typing', !preference.matches && letters < Array.from(name.text).length);
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
    if (!document.hidden) {
      timer = window.setTimeout(step, delay);
    }
  }

  function step() {
    timer = null;
    if (document.hidden) return;
    if (preference.matches) {
      nameIndex = (nameIndex + 1) % names.length;
      letters = Array.from(names[nameIndex].text).length;
      render();
      schedule(4500);
      return;
    }
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
    document.documentElement.classList.add('name-animation-enabled');
    schedule(4500);
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
