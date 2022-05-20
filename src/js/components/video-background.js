(function($) {
  function scaleToFill(first) {
    $('.video-bg .box-video-bg').each((index, videoTag) => {
      let $video = $(videoTag),
        videoRatio = videoTag.videoWidth / videoTag.videoHeight,
        tagRatio = $video.width() / $video.height(),
        val;

      if (videoRatio < tagRatio) {
        val = (tagRatio / videoRatio) * 1.02;
      } else if (tagRatio < videoRatio) {
        val = (videoRatio / tagRatio) * 1.02;
      }

      $video.css('transform', 'scale(' + val + ',' + val + ')');
    });
  }

  $(function() {
    $('.video-bg video').on('loadeddata', e => {
      scaleToFill(true);
      $(e.target).addClass('ready-js');
    });

    $(window).resize(() => {
      scaleToFill();
    });

    $(document).ready(() => {
      scaleToFill();
    });
  });
})(Cog.jQuery());
