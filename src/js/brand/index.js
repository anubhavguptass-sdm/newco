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
    console.log('JS Working');
    if ($('.template-standard-content-v2-profile').length) {
      $('.title').remove();
    }

    $('.card-content-container').each((ind, el) => {
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
          `<h3><a href="${dlink}">${dtitle}</a></h3><p>${dsubtitle}</p>`
        );
      } else {
        if (ddesc.trim().length)
          contentelement.html(
            `<h1>${dtitle}</h1><p class="h2">${dsubtitle}</p><p class="desc">${ddesc}</p>`
          );
        else
          contentelement.html(
            `<h1>${dtitle}</h1><p class="h2">${dsubtitle}</p>`
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
      $('.navigation-branch li.page-our-brands a').removeAttr('href');
      $('.navigation-branch li.page-who-we-are a').removeAttr('href');
      $('.navigation-branch li.page-planet-and-people a').removeAttr('href');
      $('.navigation-branch li.page-careers a').removeAttr('href');
    } else {
      $('.navigation-branch li.page-our-brands a').attr('href', '/our-brands/');
      $('.navigation-branch li.page-who-we-are a').attr('href', '/who-we-are/');
      $('.navigation-branch li.page-planet-and-people a').attr(
        'href',
        '/planet-and-people/'
      );
      $('.navigation-branch li.page-careers a').attr('href', '/careers/');
    }
  }

  $(document).ready(function() {
    megaMenuMobile();
  });
  window.addEventListener('orientationchange', function() {
    $(document).ready(function() {
      megaMenuMobile();
    });
  });

  $(
    'li.page-our-brands , li.page-who-we-are , li.page-planet-and-people , li.page-careers'
  ).click(function() {
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

  // Show More Filter
  $(document).ready(function() {
    // it for scroll section based on href
    $('.scrollPage').on('click', function(e) {
      var href = $(this).attr('href');
      let height = $(href).offset().top - 300;
      $('html, body').animate(
        {
          scrollTop: height
        },
        '300'
      );
      e.preventDefault();
    });

    $('.megamenu-navigation .searchBox button').click(function() {
      $('.searchBox-label').toggleClass('is-search-open');
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
  // Show More Filter
})(Cog.jQuery());
/*eslint-enable*/
