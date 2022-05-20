try {
  bpComponents.isIE = false;
  bpComponents.ieVersion = null;
} catch (error) {
  console.warn(error);
}

(window.getIeVersion = uaString => {
  try {
    uaString = uaString || navigator.userAgent;
    let match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(uaString);
    if (match) {
      let version = parseInt(match[2]),
        body = document.querySelector('html'),
        cList = body.classList;

      if (!/browser-ie/i.test(cList))
        body.className = (() => {
          return `${cList.toString()} browser-ie ie-${version}`;
        })();
      if (!bpComponents.isIE) {
        bpComponents.isIE = true;
        bpComponents.ieVersion = version;
      }
      return version;
    } else return false;
  } catch (error) {
    console.warn(error);
  }
})();
