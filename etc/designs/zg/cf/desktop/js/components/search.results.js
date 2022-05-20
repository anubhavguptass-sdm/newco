"use strict";

(function ($, document, _) {
  var api = {};

  api.onRegister = function (elements) {
    "use strict";

    var resultElements = elements.$scope;
    var stickyTemplate = $('.searchResults-stickyTemplate').html();
    var activeStickyNav = [];
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;

    var compiled = _.template(stickyTemplate);

    $('.searchResults-title a').each(function (da) {
      activeStickyNav.push($(this).html().charAt(0).toLowerCase());
    });
    var stickyNavChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    _.forEach(stickyNavChars, function (n) {
      var clazz = '';

      if (_.contains(activeStickyNav, n.toLowerCase())) {
        clazz = 'active';
      }

      resultElements.find('.searchResults-stickyNav-list').append(compiled({
        'searchChar': n,
        'clazz': clazz
      }));
    });

    resultElements.find('.searchResults-stickyNav-list li a').click(function (e) {
      e.preventDefault();
      var text = $(this).html().toLowerCase();
      var values = $('.searchResults-title a').each(function (da) {
        if ($(this).html().charAt(0).toLowerCase() == text) {
          $('html').animate({
            scrollTop: $(this).offset().top
          }, 500);
          return false;
        }
      });
    }); //update search count

    var searchCount = $('.searchResults-number').html();
    $('.richtext-searchCount .search-productCount').text(searchCount);
  };

  Cog.registerComponent({
    selector: ".searchResults",
    name: "searchresults",
    api: api
  });
})(Cog.jQuery(), document, _);