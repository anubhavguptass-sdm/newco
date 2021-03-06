/* eslint-disable eslint-comments/no-unlimited-disable */

const { all } = require('core-js/fn/promise');

/*eslint-disable*/
(function($) {
  var mobileTarget = $('.tabs-nav-list');
  var desktopTarget = $('.tabs > .component-content');
  var productTabs = $('.tabs-wrapper');
  function moveTabs(target) {
    $('.tabs-content').each(function(i, v) {
      target.append($(this));
    });
  }
  function tabsReWrap() {
    if ($(window).width() < 768) {
      moveTabs(mobileTarget);
      productTabs.addClass('mobile-tabs');
    } else {
      moveTabs(desktopTarget);
      productTabs.removeClass('mobile-tabs');
    }
  }
  if ($('.tabs-wrapper').length) {
    $(document).ready(function() {
      tabsReWrap();
    });

    $(window).resize(function() {
      tabsReWrap();
    });
  }

  $(document).ready(e => {
    if ($('.template-standard-content-v2-profile').length) {
      $('.title').remove();
    }

    $('.profile-card-content').each((ind, el) => {
      let contentelement = $(el),
        dtitle = contentelement.attr('data-title'),
        dsubtitle = contentelement.attr('data-subtitle'),
        ddesc = contentelement.attr('data-desc'),
        dlink = contentelement.attr('data-link');
      if (
        contentelement.parents('.carousel').length ||
        contentelement.parents('.leader-cards').length
      ) {
        contentelement.html(
          `<h3><a href="${dlink}">${dtitle}</a></h3><p class="m-d-b-0 m-m-b-0">${dsubtitle}</p>`
        );
      } else {
        if (ddesc.trim().length)
          contentelement.html(
            `<h1 class="strong">${dtitle}</h1><p class="h2">${dsubtitle}</p><p class="desc">${ddesc}</p>`
          );
        else
          contentelement.html(
            `<h1 class="strong">${dtitle}</h1><p class="h2">${dsubtitle}</p>`
          );
      }
    });

    $('#header').wrapAll('<header></header>');
    $('.megamenu-navigation nav').attr('role', 'navigation');
    $('#content').wrapAll('<main></main>');
    $('#footer').wrapAll('<footer></footer>');
  });

  // Mobile Menu
  function megaMenuMobile() {
    var width = $(window).width();
    if (width < 1024) {
      $('.navigation-branch li.page-who-we-are a').removeAttr('href');
      $('.navigation-branch li.page-planet-and-people a').removeAttr('href');
    } else {
      $('.navigation-branch li.page-who-we-are a').attr('href', '/who-we-are/');
      $('.navigation-branch li.page-planet-and-people a').attr(
        'href',
        '/planet-and-people/'
      );
    }
  }

  $(document).ready(function() {
    // Form required active/error status start
    $(this)
      .find('input , textarea , select')
      .on('blur , change , keydown', function(e) {
        var req = $(this).attr('required');
        if (req) {
          if ($(this).val() == '') {
            $(this).removeClass('success');
            $(this).addClass('error');
          } else {
            $(this).removeClass('error');
            $(this).addClass('success');
          }
        }
      });
    // Form required active/error status end
    megaMenuMobile();
  });
  window.addEventListener('orientationchange', function() {
    $(document).ready(function() {
      megaMenuMobile();
    });
  });

  $('li.page-who-we-are , li.page-planet-and-people').click(function() {
    $(
      '.navigation-branch , .megamenu-top-bar-left , .megamenu-top-bar-right'
    ).addClass('megamenu-remove');
    $('.megamenu-submenu-item').removeClass('megamenu-remove');
  });

  $(
    '.back-button-desktop-hide , .navigation-mobile-menu  , .searchBox button .button '
  ).click(function() {
    $(
      '.navigation-branch , .megamenu-top-bar-left , .megamenu-top-bar-right'
    ).removeClass('megamenu-remove');
    $('.megamenu-submenu-item').addClass('megamenu-remove');
  });

  // Mobile Menu

  // filter display block start

  $(document).ready(function() {
    setTimeout(function() {
      $('.filter-item-js').on('click', function(e) {
        if ($(this).hasClass('default-state-js')) {
          $('.location-result-wrapper').css('display', 'none');
        } else {
          $('.location-result-wrapper').css('display', 'block');
        }
      });
    }, 200);
  });

  // filter display block end
  // Show More Filter
  $(document).ready(function() {
    var r = $(
      '<button type="submit" class="header-search icon-search-line" value="new button"> </button>'
    );
    $('.megamenu-search.search-block .searchBox-label').append(r);
    Array.from(document.querySelectorAll('a.external')).forEach(el =>
      el.classList.remove('external')
    );

    $('.megamenu-navigation .searchBox button').click(function() {
      $('.searchBox-label').toggleClass('is-search-open');
      $('.search-query').focus();
    });

    setTimeout(function() {
      $('.lSPager.lSpg li a').attr('href', 'javascript:void(0)');
    }, 2000);
    $('.searchBox .button').on('click', function(e) {
      $('.searchBox .search-query').addClass('searchInput');
      $('.megamenu--newco').toggleClass('mobile-megamenu-search');
    });
    $('.navigation-mobile-menu').on('click', function(e) {
      $('.searchBox-label').removeClass('is-search-open');
      $('.searchBox .search-query').removeClass('searchInput');
    });
  });

  $(document).ready(function() {
    setTimeout(function() {
      $('.filter-item-js').keydown(function(e) {
        if (e.keyCode == 13) {
          console.log('Filter 1');
          $('.filter-list-js li:focus').click();
        }
      });
    }, 200);
  });

  // Show More Filter
})(Cog.jQuery());
/*eslint-enable*/
