($ => {
  const stickyfill = require('stickyfill')();
  const SELECTOR_STICKY = '.sticky';

  $(() => {
    $(SELECTOR_STICKY).each((_ind, elem) => {
      stickyfill.add(elem);
    });
  });
})(Cog.jQuery());
