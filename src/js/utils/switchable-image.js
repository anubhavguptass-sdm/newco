($ => {
  const SCREEN_WIDTH_BREAKPOINT = 768;
  const SELECTOR_SWITCHABLE_IMAGE =
    '.switchable-image img, .switchable-image > .component-content';

  $(() => {
    let windowWidth = window.innerWidth;
    let previousWidth = windowWidth;

    if (windowWidth < SCREEN_WIDTH_BREAKPOINT) {
      fromDesktopToMobile();
    }

    $(window).on('resize', () => {
      previousWidth = windowWidth;
      windowWidth = window.innerWidth;
      if (
        previousWidth >= SCREEN_WIDTH_BREAKPOINT &&
        windowWidth < SCREEN_WIDTH_BREAKPOINT
      ) {
        fromDesktopToMobile();
      }
      if (
        previousWidth < SCREEN_WIDTH_BREAKPOINT &&
        windowWidth >= SCREEN_WIDTH_BREAKPOINT
      ) {
        fromMobileToDesktop();
      }
    });
  });

  $(window).on('image-changed', () => {
    if (window.innerWidth < SCREEN_WIDTH_BREAKPOINT) {
      fromDesktopToMobile();
    }
    if (window.innerWidth >= SCREEN_WIDTH_BREAKPOINT) {
      fromMobileToDesktop();
    }
  });

  function switcherToDesk(el, attr, addedString) {
    if (el.attr(attr).match(/_mobile\./gi)) {
      el.attr(
        attr,
        el
          .attr(attr)
          .replace(/\/mobile\//gi, '/desktop/')
          .replace(/_mobile\./gi, (addedString || '') + '.')
      );
    }
  }

  function switcherToMob(el, attr, addedString) {
    if (!el.attr(attr).match(/_mobile\./gi)) {
      el.attr(
        attr,
        el
          .attr(attr)
          .replace(addedString, '')
          .replace(/\/desktop\//, '/mobile/')
          .replace(/()\.(jpg|png|svg)/gi, a => {
            return '_mobile' + a;
          })
      );
    }
  }

  function fromMobileToDesktop() {
    $(SELECTOR_SWITCHABLE_IMAGE)
      .hide()
      .each((_, elem) => {
        let $elem = $(elem);
        let attr =
          $elem.hasClass('component-content') && elem.hasAttribute('style')
            ? 'style'
            : $elem.hasClass('lazyload')
            ? 'data-src'
            : 'src';
        switcherToDesk($elem, attr);
        if ($elem.hasClass('component-content') || elem.complete) {
          $elem.show();
        } else {
          $elem.on('load', () => {
            $elem.show();
          });
        }
      });
  }

  function fromDesktopToMobile() {
    $(SELECTOR_SWITCHABLE_IMAGE)
      .hide()
      .each((_, elem) => {
        let $elem = $(elem);
        let attr =
          $elem.hasClass('component-content') && elem.hasAttribute('style')
            ? 'style'
            : $elem.hasClass('lazyload')
            ? 'data-src'
            : 'src';
        switcherToMob($elem, attr);
        if ($elem.hasClass('component-content') || elem.complete) {
          $elem.show();
        } else {
          $elem.on('load', () => {
            $elem.show();
          });
        }
      });
  }
})(Cog.jQuery());
