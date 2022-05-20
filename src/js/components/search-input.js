/*
 ** handles searchbox in megamenu
 */
(function($) {
  $(document).ready(function() {
    var $searchFields = $('.searchBox .form-search .search-query');
    $searchFields.val('');
    // ensure execution only on search results page template
    if ($('body.page-search-results').length === 0) {
      return;
    }
    var $searchPageFormQuery = $(
      '.search-page-form .form-search .search-query'
    );
    if ($searchPageFormQuery.length > 0) {
      var url = new URL(window.location.href);
      var searchParams = new URLSearchParams(url.search);
      $searchPageFormQuery.val(searchParams.get('q'));
    }
  });

  $('.search-block .form-search button').click(function(e) {
    e.preventDefault();
    let $searchBlock = $(this).closest('.search-block');
    if (screen.width >= 992) {
      $searchBlock.addClass('is-open');
      if ($searchBlock.find('.search-query').val() !== '') {
        $searchBlock.find('.form-search').submit();
      }
    } else if (screen.width < 992) {
      let $btn = $('.searchBox button[type=submit]');
      let $btnMobNav = $('.navigation-mobile-menu');
      let $nav = $('.megamenu');

      $nav.removeClass('nav-opened').toggleClass('search-opened');
      $('body').removeClass('no-scrolling');
      $btn.toggleClass('opened');
      $btnMobNav.removeClass('opened');

      if ($searchBlock.find('.search-query').val() !== '') {
        $searchBlock.find('.form-search').submit();
      }
    }
  });

  $(document).click(function(event) {
    if (!$(event.target).closest('.form-search').length) {
      $('.search-block').removeClass('is-open');
      $('.search-block .search-query').val('');
    }
  });
})(Cog.jQuery());
