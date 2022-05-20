(function($) {
  $(window).on('load', e => {
    $('[tabindex]').removeAttr('tabindex');

    let index = 0;

    $(
      'a:not([style^="visibility:hidden"]):not([style^="visibility: hidden"]), button, div, input, select, textarea, .filter-container-js li, .anchor-box, .anchor-sibling'
    ).each((ind, el) => {
      let t = $(el);
      if (t.is('.navigation.class-filter li, .navigation.class-filter ul'))
        return;
      if (!t.is('[tabindex]')) {
        if (t.is('.select-country')) {
          el.tabIndex = index;
          index++;
          $(
            '.megamenu-language-list a:not([style^="visibility:hidden"]):not([style^="visibility: hidden"])'
          ).each((i, a) => {
            a.tabIndex = index;
            index++;
          });
          return;
        } else if (
          t.is('.navigation-item-title') &&
          t.closest('.megamenu-main-nav').length > 0 &&
          $(`.content-${slug(t.attr('title'))}`).length > 0 &&
          typeof $(`.content-${slug(t.attr('title'))}`)
            .eq(0)
            .attr('tabindex') === 'undefined'
        ) {
          let content = $(`.content-${slug(t.attr('title'))}`);

          el.tabIndex = index;
          index++;
          content.find('a, button, input, textarea, select').each((i, ele) => {
            ele.tabIndex = index;
            index++;
          });

          return;
        } else if (t.is('div[role], div[aria-describedby]')) {
          el.tabIndex = index;
          index++;
        } else if (!t.is('div') && !t.is('.filter-container-js p')) {
          el.tabIndex = index;
        }

        index++;
      }
    });

    $('body')
      .on('keyup', e => {
        if (bpComponents.isIE) {
          let t = $(e.target);
          $('.outlined').removeClass('outlined');
          t.addClass('outlined');
          if (e.keyCode === 9) {
            if (t.closest('.filter-container-js').length > 0) {
              t.closest('.filter-container-js').addClass('opened-js');
            } else {
              $('.filter-container-js.opened-js').removeClass('opened-js');
            }

            if (t.closest('.accordion-slide').length > 0) {
              $('.accordion-slide.is-active').removeClass('is-active');
              t.closest('.accordion-slide').addClass('is-active');
            }

            if (t.closest('.megamenu-language-list').length > 0) {
              $('.accordion-slide.is-active').removeClass('is-active');
              t.closest('.accordion-slide').addClass('is-active');
            }

            if (t.closest('.megamenu-search').length > 0) {
              t.closest('.megamenu-search').addClass('is-open');
            } else {
              $('.megamenu-search.is-open').removeClass('is-open');
            }

            $('.ie-active-js').removeClass('ie-active-js');

            if (
              t.closest('.megamenu-main-nav').length > 0 &&
              t.is('.megamenu-main-nav > .component-content > ul > li *')
            ) {
              t.closest('li').addClass('ie-active-js');
            }

            $(
              '.megamenu-submenu-item.opened,.megamenu-language-list.opened'
            ).removeClass('opened');
            if (
              t.closest('.megamenu-submenu-item,.megamenu-language-list')
                .length > 0
            ) {
              t.closest(
                '.megamenu-submenu-item,.megamenu-language-list'
              ).addClass('opened');
            }
          }
          return;
        }
        let t = $(e.target);
        $('.outlined').removeClass('outlined');
        t.addClass('outlined');
        if (e.keyCode === 9) {
          if (
            t.is(
              '.carousel-slide a, .carousel-slide button, .carousel-slide input, .carousel-slide textarea, .carousel-slide select'
            ) &&
            t.closest('.carousel-slide').siblings('.carousel-slide').length > 0
          ) {
            try {
              let carousel = t.closest('.carousel-slides'),
                slides = carousel.find('.carousel-slide'),
                slide = t.closest('.carousel-slide').get(0),
                index = slides.index(slide),
                translate3D = carousel
                  .css('transform')
                  .split(/\(|\)/g)[1]
                  .split(',')[4];

              for (let i in window.bpComponents.bpCarousels) {
                if ($(window.bpComponents.bpCarousels[i][0]).is(carousel)) {
                  carousel.css(
                    'tranform',
                    `translate3d(${translate3D}px, 0px, 0px)`
                  );
                  setTimeout(() => {
                    window.bpComponents.bpCarousels[i].goToSlide(index);
                  }, 1);
                }
              }
            } catch (err) {}
          }
        }
      })
      .on('click', e => {
        $('.outlined').removeClass('outlined');
      });
  });
})(Cog.jQuery());
