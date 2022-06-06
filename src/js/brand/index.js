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

// default megamenu js start

$(".megamenu-navigation .megamenu-main-nav .component-content .navigation-root.navigation-level1 .navigation-item").hover(
  function() {
    $(this).addClass("current");
    var hoverType = $(this).find('> a').attr('title');
    var str = 'body .megamenu-navigation .megamenu-submenu-items-container .megamenu-submenu-item[data-link-title= "' + hoverType + '"]';
    $(str).addClass("openedNew");
  },
  function() {
    setTimeout(function() {
    $(this).removeClass("current");
    var hoverType = $(this).find('> a').attr('title');
    var str = 'body .megamenu-navigation .megamenu-submenu-items-container .megamenu-submenu-item[data-link-title= "' + hoverType + '"]';
    $(str).removeClass('openedNew');
    }.bind(this), 500)
  });

  //end    

  // Megamenu

  if ($(window).width() > 992) {
  var filteredContent = $('body .megamenu-navigation .megamenu-submenu-items-container .megamenu-submenu-item');
  $('.megamenu-navigation .megamenu-main-nav .component-content .navigation-root.navigation-level1 .navigation-item .navigation-item-title').on('focus', function () {
    var isFocused = $(this).is(":focus");
    if (isFocused) {
      $('.megamenu-navigation .megamenu-main-nav .component-content .navigation-root.navigation-level1 .navigation-item').removeClass('is-active');
      $(this).parent().addClass('is-active');
      var dataType = $(this).attr('title');
      var str = 'body .megamenu-navigation .megamenu-submenu-items-container .megamenu-submenu-item[data-link-title= "' + dataType + '"]';
      setTimeout(function () {
         filteredContent.removeClass('opened openedNew');
                 $(str).addClass("opened openedNew");
         $(str).find(".default-style .btn.btn-black").focus();
              }, 500);
    }
  });
}

  $(document).on("keydown", ".megamenu-submenu-items-container .megamenu-submenu-item", function (d) {
  
  var b = d.keyCode || d.which;
  var c = $(this).attr("title");
  if ($(window).width() > 992) {
    if (b === 9) {
      if ($(this).find(".default-style.last ul li").last().find("a").is(":focus")) {
        $("body .megamenu-navigation .megamenu-main-nav>.component-content>.navigation-root.navigation-level1>.navigation-item.is-active>a").parent("li").next().find("a").focus();
        $(this).removeClass("opened openedNew");
        $(this).find("body .megamenu-navigation .megamenu-submenu-items-container .megamenu-submenu-item .default-style .btn.btn-black").focus();
        return false;
      }
    }
    if (d.shiftKey && d.keyCode == 9) {
      if ($(this).find(".navigation-root.navigation-branch.navigation-level1>li > a[title]").is(":focus")) {
        $('body .megamenu-navigation .megamenu-main-nav>.component-content>.navigation-root.navigation-level1>.navigation-item > a[title="' + c + '"]').focus();

      }
    } else {
      if (d.shiftKey && d.keyCode == 9) {
        if ($(this).find(".navigation-root.navigation-branch.navigation-level1>li > a[title]").is(":focus")) {
          //empty
        }
      }
    }
  }
});

// default megamenu js End
    
    Array.from(document.querySelectorAll('a.external')).forEach(el =>
      el.classList.remove('external')
    );
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
