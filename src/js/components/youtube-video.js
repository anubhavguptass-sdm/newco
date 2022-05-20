// old deprecated YT component
// can be used, but without any operable methods (has no YT API)
(function($) {
  $('.reference-youtube-video').on('click', function(e) {
    let $root = $(e.currentTarget);
    let $placeholderImage = $root.find('.placeholder-img');
    let $iframeContainer = $root.find('.iframe-container');

    let width = $placeholderImage.width();
    let height = $placeholderImage.height();

    let url = decodeURIComponent($iframeContainer.attr('data-v-src'));
    $iframeContainer.html(
      '<iframe id="ytplayer" type="text/html" width="' +
        $placeholderImage.width() +
        '" height="' +
        $placeholderImage.height() +
        '" src="' +
        url +
        '?autoplay=1" frameborder="0" allowfullscreen></iframe>'
    );

    $root.find('.icon-video-play').hide();

    $iframeContainer.find('#ytplayer').on('load', function() {
      $placeholderImage.css('display', 'none');
      $root
        .find('.iframe-container, iframe')
        .height(height)
        .width(width)
        .css('display', 'inline-block');
    });
  });
})(Cog.jQuery());
