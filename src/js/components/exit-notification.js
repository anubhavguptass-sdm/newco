(function($) {
  const body = $('body'),
    notif = $('#exit-notification'),
    open = () => {
      body.addClass('scroll-stop');
      notif.removeClass('is-hidden');
    },
    close = () => {
      body.removeClass('scroll-stop');
      notif.addClass('is-hidden');
      $('.link-activated').removeClass('link-activated');
    };

  $(document).ready(e => {
    body
      .on('click', e => {
        let t = $(e.target);

        if (t.is('a.external, a.external *')) {
          e.preventDefault();
          t = t.closest('a').addClass('link-activated');
          open();
        }

        if (
          t.is(
            '#exit-notification .exit-notification-accept, #exit-notification .exit-notification-accept *'
          )
        ) {
          let link = $('.link-activated').attr('href');
          window.open(link);
          close();
        }
        if (
          t.is(
            '#exit-notification .exit-notification-deny, #exit-notification .exit-notification-deny *'
          )
        ) {
          close();
        }
      })
      .on('keydown', e => {
        if (e.keyCode === 27) close();
      });
  });
})(Cog.jQuery());
