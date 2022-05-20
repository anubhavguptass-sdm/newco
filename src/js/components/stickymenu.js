// handles docked
(function($) {
  let $navbar = $('.megamenu-nav-container'),
    y_pos,
    dockedNav = null;

  $(document)
    .ready(() => {
      $navbar = $('.megamenu-nav-container');
      dockedNav =
        $(
          '.simple-navigation.navigation-docked, .megamenu-navigation.navigation-docked'
        ).length > 0;
    })
    .on('scroll', e => {
      let scrollTop = $(this).scrollTop();
      if (scrollTop > y_pos && !dockedNav) {
        $navbar.addClass('sticked-js');
      } else if (scrollTop <= y_pos) {
        $navbar.removeClass('sticked-js');
      }
    });
  //fix navbar initial position
  $(window).on('resize', e => {
    try {
      y_pos = $navbar.offset().top;
    } catch (err) {
      //do nothing
    }
  });
})(Cog.jQuery());
