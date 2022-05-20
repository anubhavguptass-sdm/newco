(function($) {
  const SELECTOR_ROOT_ELEMENT = '.video-youtube';
  const KEYCODE_ESC = 27;

  $(() => {
    let $rootElem = $(SELECTOR_ROOT_ELEMENT);

    $rootElem.find('a, button').click(e => {
      const youtubeId = decodeURIComponent(
        $(e.currentTarget).attr('data-v-src')
      );
      const url = 'https://www.youtube.com/embed/' + youtubeId;

      $rootElem
        .find('.video-content')
        .html(
          '<div class="video"><div class="close"></div><iframe id="ytplayer" type="text/html" width="720" height="405" src="' +
            url +
            '?autoplay=1&rel=0&loop=1&playlist=' +
            youtubeId +
            '" allow="autoplay" frameborder="0" allowfullscreen></iframe></div>'
        )
        .css('display', 'flex');

      $(window).on('click keyup', closeVideo);

      return false;
    });
  });

  function closeVideo(e) {
    if (e.type === 'keyup' && e.keyCode !== KEYCODE_ESC) {
      return;
    }
    $('.video-content').css('display', 'none');
    $('.video-content').html('');
    $(window).off('click keyup', closeVideo);
  }
})(Cog.jQuery());
