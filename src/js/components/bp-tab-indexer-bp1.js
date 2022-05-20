(function($) {
  $(window).on('load', e => {
    $('[tabindex]').removeAttr('tabindex');

    let index = 0;

    $(
      'a:not([style^="visibility:hidden"]):not([style^="visibility: hidden"]), button, div, input, select, textarea, .filter-container-js a, .filter-container-js li:not(.filter-group-label-js), .anchor-box, .anchor-sibling'
    ).each((ind, el) => {
      let t = $(el);
      if (!t.is('[tabindex]')) {
        if (t.is('.select-country')) {
          el.tabIndex = index;
          index++;
          $(
            '.megamenu-language-list a:not([style^="visibility:hidden"]):not([style^="visibility: hidden"]), .megamenu-language-list a'
          ).each((i, a) => {
            a.tabIndex = index;
            index++;
          });
          return;
        } else if (
          t.is('.navigation-item-title') &&
          $(`.${t.attr('data-content-class')}`).length > 0
        ) {
          let content = $(`.${t.attr('data-content-class')}`);

          el.tabIndex = index;
          index++;
          content.find('a, button, input, textarea, select').each((i, ele) => {
            ele.tabIndex = index;
            index++;
          });

          return;
        } else if (
          t.is(
            '.megamenu-main-nav > .component-content > ul > li > .navigation-item-title'
          ) &&
          $(`.${t.attr('data-content-class')}`).length < 1 &&
          t.parent('li[class*=page-]').length > 0
        ) {
          let cls = t
            .parent('li[class*=page-]')
            .attr('class')
            .match(/page\-[^ ]+/i)[0]
            .replace('page-', 'content-');

          let content = $(`.${cls}`);

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

          $(
            '.megamenu-submenu-item.opened,.megamenu-language-list.opened'
          ).removeClass('opened');
          if (
            t.closest('.megamenu-submenu-item,.megamenu-language-list').length >
            0
          ) {
            t.closest(
              '.megamenu-submenu-item,.megamenu-language-list'
            ).addClass('opened');
          }
        }
      })
      .on('click', e => {
        $('.outlined').removeClass('outlined');
      });
  });
})(Cog.jQuery());
