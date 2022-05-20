/*
 ** font resizeer
 ** adds classes to body small | default | large
 ** setup the sizes in brand (default) folder (theme configuration)
 */

(function($) {
  const s = window.localStorage;

  function setFontSize(size) {
    $('body')
      .removeClass('default-font-size large-font-size larger-font-size')
      .addClass(`${size}-font-size`);
    s.setItem('bpFontSize', size);
    $('.bp-font-resizer')
      .find('.active-js')
      .removeClass('active-js');
    $('.bp-font-resizer')
      .find(`.${size}`)
      .addClass('active-js');
    $(window).trigger('resize');
  }

  if (
    s.getItem('bpFontSize') !== null &&
    /small|default|large/gi.test(s.getItem('bpFontSize'))
  )
    setFontSize(s.getItem('bpFontSize'));

  $('body').on('click', e => {
    let t = $(e.target);

    if (t.is('.bp-font-resizer-button, .bp-font-resizer-button *')) {
      e.preventDefault();
      t = t.closest('.bp-font-resizer-button');

      let fontSize = t.attr('class').split(/\s+/gi)[1];
      setFontSize(fontSize);
    }
  });

  $(document).ready(() => {
    window.bpComponents.bpFontResizer.setFontSize = setFontSize;
  });
})(Cog.jQuery());
