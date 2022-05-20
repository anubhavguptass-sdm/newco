/*
 ** share container
 ** container for share icons
 ** bpToggler could be used instead if custom styling is needed
 */

(function($) {
  const cssAnimationDuration = 250,
    inIframe = () => {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    };
  window.bpComponents.bpShareContainers = $([]);

  if (!inIframe()) {
    $(document).ready(e => {
      let shareLinks = $('.bp-share-contains .jv-share-link');

      $('body')
        .on('click', e => {
          let t = $(e.target);

          if (!t.is('.bp-share-container, .bp-share-container *')) {
            $('.bp-share-container')
              .addClass('closed')
              .find('.bp-share-container-content')
              .removeClass('content-visible')
              .addClass('content-hidden');
          }

          if (t.is('.bp-share-container-content-close')) {
            e.preventDefault();
            t.closest('.bp-share-container-content.content-visible')
              .removeClass('content-visible')
              .addClass('content-hidden');
            setTimeout(() => {
              t.closest('.bp-share-container').addClass('closed');
            }, 300);
          }
        })
        .on('keyup', e => {
          if (e.keyCode === 27) {
            $('.bp-share-container-content.content-visible')
              .removeClass('content-visible')
              .addClass('content-hidden');
            $('.bp-share-container').addClass('closed');
          }
        });

      $('.bp-share-container').each((ind, el) => {
        let rootSharer = $(el),
          content = rootSharer.find('.bp-share-container-content'),
          sharerData = rootSharer.attr('data-settings');
        sharerData = JSON.parse(sharerData.replace(/'/gi, '"'));
        content.addClass('content-hidden').append(shareLinks);

        rootSharer
          .attr({
            'data-display-mobile': sharerData.displayTypeMobile,
            'data-display-desktop': sharerData.displayTypeDesktop,
            'data-position-mobile': sharerData.positionMobile,
            'data-position-desktop': sharerData.positionDesktop,
            'data-animation': sharerData.animation
          })
          .removeAttr('data-settings')
          .addClass('closed');
        $('body').on(sharerData.trigger, e => {
          let t = $(e.target);
          if (
            t.is(
              '.bp-share-container:not(.closed), .bp-share-container:not(.closed) *'
            )
          ) {
            e.preventDefault();
            content.addClass('content-hidden').removeClass('content-visible');
            rootSharer.toggleClass('closed');
            return;
          }

          if (
            t.is('.bp-share-container.closed, .bp-share-container.closed *')
          ) {
            e.preventDefault();
            content.removeClass('content-hidden').addClass('content-visible');
            rootSharer.toggleClass('closed');
          }
        });

        if (sharerData.trigger === 'mouseover') {
          $(rootSharer).on('mouseout', e => {
            content.removeClass('content-visible').addClass('content-hidden');
            rootSharer.toggleClass('closed');
          });
        }
        window.bpComponents.bpShareContainers = window.bpComponents.bpShareContainers.add(
          rootSharer
        );
      });
      setTimeout(() => {
        $('.bp-share-container.initialising').removeClass('initialising');
      }, cssAnimationDuration);
    });
  }
})(Cog.jQuery());
