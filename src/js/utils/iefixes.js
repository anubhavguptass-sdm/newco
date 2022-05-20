($ => {
  $(document).ready(e => {
    //fix ie 11 < svg images
    if (
      navigator.appVersion.indexOf('MSIE 10') !== -1 ||
      (!!window.MSInputMethodContext && !!document.documentMode)
    ) {
      $('img[src$="svg"]').css({
        width: '100%'
      });
    }
  });
})(Cog.jQuery());
