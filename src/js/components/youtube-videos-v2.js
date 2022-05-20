// old deprecated YTv2 component
// can be used, but without any operable methods (has no YT API)
(function($) {
  $(document).ready(e => {
    // get all occurences of the YT videos on the page
    $('.youtube-player').each((ind, el) => {
      let element = $(el),
        did = element.attr('data-id'),
        dtit = element.attr('data-title'),
        div = $('<div/>')
          .attr({
            'data-id': did,
            'data-title': dtit
          })
          .html(
            placeholderImg(
              element.attr('data-id'),
              element.attr('data-img'),
              element.attr('data-alt')
            )
          )
          .appendTo(element)
          .on('click', e => {
            loadIframe(did, dtit, element, div);
          });
    });
  });

  // create a placeholder element with an image
  // load a custom image of default from YT, add alt to img
  function placeholderImg(id, img, alt) {
    let thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg" alt="ALT">',
      play = '<div class="play"></div>',
      local = '<img src="ID" alt="ALT">';
    if (img == '$yt_placeholder_img') {
      return thumb.replace('ID', id).replace('ALT', alt) + play;
    } else {
      return local.replace('ID', img).replace('ALT', alt) + play;
    }
  }

  // create iframe with specified attributes using "div" variable from the start
  function loadIframe(vidid, title, parent, placeholder) {
    let embed = `https://www.youtube.com/embed/${vidid}?autoplay=1`,
      iframe = $(
        `<iframe frameborder="0" allowfullscreen="1" src="${embed}" title="${title}"></iframe>`
      );
    iframe.appendTo(parent);
    $(placeholder).remove();
  }
})(Cog.jQuery());
