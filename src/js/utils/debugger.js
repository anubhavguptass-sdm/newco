const loadDev = location.hash === '#dev',
  pathPrefix = loadDev ? '_dev_' : '',
  head = document.head,
  phrase = 'bpdebug';

let int = null,
  isInUse = localStorage.getItem('BPDebugger') !== null,
  typed = '';

loadDebugger = () => {
  if (!isInUse) return;
  const path = `${
    document.body.dataset.themePath
  }/assets/debugger/${pathPrefix}debugger.js?r=${new Date().getTime()}${Math.round(
    Math.random() * 100000
  )}`;
  document
    .querySelectorAll('a')
    .forEach(link => (link.href = link.href.replace(/\%23/gim, '#')));
  if (loadDev) {
    document
      .querySelectorAll('a:not(.external)')
      .forEach(link =>
        link.href && !/#/gi.test(link.href)
          ? (link.href = `${link.href}#dev`)
          : void 0
      );
  }

  let st = document.createElement('link'),
    isDev = location.hash === '#dev';

  document.head.appendChild(st);
  st.rel = 'stylesheet';
  st.href = `${document.body.dataset.themePath}/assets/debugger/${
    isDev ? '_dev_' : ''
  }debugger.css?r=${new Date().getTime()}`;

  st.addEventListener('load', e => {
    document.body.classList.add('loading');
    let s = document.createElement('script');
    s.src = path;
    head.appendChild(s);
  });
};

checkPhrase = () => {
  if (typed !== phrase) {
    typed = '';
  } else {
    isInUse = true;
    loadDebugger();
  }
};

window.addEventListener('keyup', e => {
  try {
    clearInterval(int);
  } catch (error) {}
  typed += e.key;
  int = setTimeout(checkPhrase, 500);
});

window.addEventListener('load', e => {
  setTimeout(loadDebugger, 2000);
});
