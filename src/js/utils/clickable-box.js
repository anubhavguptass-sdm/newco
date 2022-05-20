($ => {
  const selectorBox = '.clickable-box';

  $(() => {
    $(selectorBox)
      .on('mouseenter', e => {
        $(e.currentTarget).css('cursor', 'pointer');
      })
      .on('mouseleave', e => {
        $(e.currentTarget).css('cursor', '');
      })
      .on('mousedown', e => {
        let codeClickRight = 3;
        let codeClickMiddle = 2;
        if (e.which === codeClickRight || e.button === codeClickMiddle) {
          return;
        }
        $(e.currentTarget).on('mouseup', emulateClick);
        let timeout = 200;
        setTimeout(() => {
          $(e.currentTarget).off('mouseup', emulateClick);
        }, timeout);
      });
  });

  function emulateClick(e) {
    let $linkElem = $(e.currentTarget).find('a[href]');
    let link = $linkElem.attr('href');
    if (e.ctrlKey) {
      window.open(link, '_blank');
      return;
    }
    if ($linkElem.hasClass('lightbox')) {
      $linkElem.trigger('click');
      return;
    }
    window.location.href = link;
  }
})(Cog.jQuery());
