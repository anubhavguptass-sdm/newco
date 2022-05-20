(function($) {
  // fullbox height fixer
  $(document).ready(e => {
    $(window)
      .on('resize', e => {
        try {
          let fullboxes = $(`[class*='fullbox-d'],[class*='fullbox-m']`);
          fullboxes.each((ind, el) => {
            let t = $(el);
            let mh = `${t.find('.fullbox').get(0).scrollHeight}px`;
            t.css({
              'min-height': mh
            });
          });
        } catch (error) {}
      })
      .trigger('resize');
  });
})(Cog.jQuery());
