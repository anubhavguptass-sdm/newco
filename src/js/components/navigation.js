/*
 ** OPERATES MEGAMENU & SIMPLE NAVIGATION
 */
(function($) {
  // try counter for navigation to check whether languages are loaded
  let languageLoadTryCounter = 0,
    // maximmum try load
    maxLanguageLoadTryCount = 1000,
    // navigation should switch to mobile or back
    // this ensures that nav is closeed when switching back to desktop
    switchBreakpoint = 991,
    initiateMenuItems = (items, dropDowns) => {
      if (!bpComponents.bpLanguages.loaded) {
        window.bpComponents.bpMegaMenu.menuItems = null;
        if (languageLoadTryCounter <= maxLanguageLoadTryCount)
          setTimeout(() => {
            initiateMenuItems(items, dropDowns);
          }, 10);
        else
          console.warn(
            'SLUGIFY::Some or all language files probably not loaded correctly!'
          );
        return;
      }

      let menu = {};
      items.each((ind, el) => {
        let e = $(el),
          sluged = slug(e.attr('title')),
          dropDown = $(`.content-${sluged}`);
        e.attr('data-content-class', `content-${sluged}`);

        if (dropDown.length > 0) {
          dropDown.get(0).open = function() {
            $(this).addClass('opened');
          };
          dropDown.get(0).close = function() {
            $(this).removeClass('opened');
          };
        }

        if (dropDown.length > 0) {
          window.bpComponents.bpMegaMenu.dropDownsUsed++;
          window.bpComponents.bpMegaMenu.dropDownsUnUsed--;
        }

        menu[sluged.camelize()] = {
          original: e.attr('title'),
          slug: sluged,
          contentClass: `content-${sluged}`,
          menuItem: $(el)
            .closest('li')
            .get(0),
          menuDropDown: dropDown.length > 0 ? dropDown.get(0) : null
        };
      });
      window.bpComponents.bpMegaMenu.menuItems = menu;
    };

  //mega menu navigation
  $(document).ready(function() {
    $('.megamenu-main-nav li.is-active').addClass('current-js');
    initNav();
    // register navigation to bpComponents and add desired infos
    let items = $(
        '.megamenu-main-nav > .component-content > ul > li.navigation-item > a'
      ),
      dropDowns = $(
        '.megamenu-submenu-items-container .box[class*="content-"]'
      );
    window.bpComponents.bpMegaMenu.dropDowns = dropDowns.length;
    window.bpComponents.bpMegaMenu.dropDownsUsed = 0;
    window.bpComponents.bpMegaMenu.dropDownsUnUsed = dropDowns.length;
    window.bpComponents.bpMegaMenu.itemsCount = items.length;
    initiateMenuItems(items, dropDowns);
    window.bpComponents.bpMegaMenu.getContentClasses = () => {
      let w = window.bpComponents.bpMegaMenu.menuItems;
      for (let i in w) {
        if (w.hasOwnProperty(i) && w[i].hasOwnProperty('contentClass')) {
          console.log(w[i].contentClass);
        }
      }
      return;
    };
  });

  $(window).resize(function() {
    if ($(window).width() > switchBreakpoint) {
      var $navWrapper = $('.navigation-mobile-menu').siblings(
        '.navigation-root'
      );
      $navWrapper.removeClass('is-open');
      $('.mobile-nav').removeClass('is-open');
      $('body').css('position', 'static');
    }
  });

  function initNav() {
    const linkSelector =
        '.megamenu-main-nav > .component-content > ul > li.navigation-item, .megamenu-main-nav > .component-content > ul > li.navigation-item *',
      submenuItemSelector = '.megamenu-submenu-item, .megamenu-submenu-item *';

    function unbindAll() {
      $('.megamenu-submenu-item.opened')
        .removeClass('opened')
        .off('mouseout.onetime', unbindAll);
      $(
        '.megamenu-main-nav > .component-content > ul > li.is-active'
      ).removeClass('is-active');
    }

    $('body')
      .on('mouseover', e => {
        let t = $(e.target);
        let isLink = t.is(linkSelector);
        let isContentMenu = t.is(submenuItemSelector);
        if (isLink) {
          $('.megamenu-submenu-item.opened').removeClass('opened');
          t = t.closest('li.navigation-item');
          t.addClass('is-active');
          let lTitle = t.find('> a').attr('title');
          let contentClass = slug(lTitle);
          let subMenuItem = $(`.megamenu-submenu-item.content-${contentClass}`);
          subMenuItem.addClass('opened').one('mouseout.onetime', unbindAll);
          subMenuItem.attr('data-link-title', lTitle);
        }
        if (isContentMenu) {
          t = t.closest('.megamenu-submenu-item');
          let linkTitle = t.attr('data-link-title');
          try {
            $(`li.navigation-item > a[title="${linkTitle}" i]`)
              .parent()
              .addClass('is-active'); //i @ title selectoer is for ASCII-case-insensitive matching
            t.addClass('opened');
          } catch (e) {
            $(`li.navigation-item > a[title="${linkTitle}"]`)
              .parent()
              .addClass('is-active'); //i @ title selectoer is for ASCII-case-insensitive matching
            t.addClass('opened');
          }
        }
      })
      .on('mouseout', e => {
        let t = $(e.target);
        let isLink = t.is(linkSelector);
        let isContentMenu = t.is(submenuItemSelector);
        if (isLink || isContentMenu) {
          unbindAll();
        }
      });
  }

  $('.navigation-item-decoration').on('click', e => {
    e.preventDefault();
    e.stopImmediatePropagation();
    let t = $(e.target),
      li = t.closest('li');
    li.siblings('.is-active,.is-open').removeClass('is-active is-open');
    li.toggleClass('is-active is-open');
  });

  $('.navigation-mobile-menu').on('click', e => {
    let languageListOpened = $('.megamenu-language-list.opened');
    if (languageListOpened.length > 0) {
      languageListOpened.removeClass('opened');
      return;
    }

    let $btn = $('.navigation-mobile-menu'),
      $nav = $('.megamenu');

    $nav.removeClass('search-opened').toggleClass('nav-opened');
    $('.megamenu-main-nav')
      .find('.is-open')
      .removeClass('is-active is-open');
    $('body').toggleClass('no-scrolling');
    $btn.toggleClass('opened');
  });
})(Cog.jQuery());
