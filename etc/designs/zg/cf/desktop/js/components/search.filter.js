"use strict";

(function ($, _) {
  var api = {};

  api.onRegister = function (elements) {
    "use strict";

    var formElement = $(elements.$scope);
    var $formElement = elements.$scope;
    $formElement.each(function () {
      $(this).on("click", ".searchFilter-title", api.onFilterHeaderClick);
      $(this).on("click", ".tagRadioFilter legend", api.onFilterRadioClick);
      $(this).on("click", ".searchFilter-sorting legend", api.onFilterRadioClick);
    });

    if (formElement.find('.searchFilter-submit').length <= 0) {
      formElement.find('input').click(function () {
        formElement.submit();
      });
      formElement.find('select').change(function () {
        formElement.submit();
      });
    }

    formElement.find('.searchFilter-radio:eq(0) fieldset legend').after('<span class="search-productFilter" allvalue="All products">All products</span>');
    formElement.find('.searchFilter-radio:eq(1) fieldset legend').after('<span class="search-theraphyFilter" allvalue="All therapies">All therapies</span>');
    formElement.find('.searchFilter-radio:eq(2) fieldset legend').after('<span class="search-indicationFilter" allvalue="All indications">All Indications</span>');

    _($('.searchFilter-form').serializeArray()).forEach(function (n) {
      var name = n.name;

      if (name != 'r') {
        $('[name="' + name + '"]').parents('.searchFilterContent:eq(0),.searchFilter-content:eq(0)').show("400");
        $('[name="' + name + '"]').parents('.abstractTagListFilter,.searchFilter-sorting').find('legend').addClass('filter-active');
        var tagSelected = $('[name="' + name + '"]:checked').val();
        var nameSelected = $('[name="' + name + '"]:checked').siblings('.searchFilter-label').html();
        var elementsToChange;

        if (tagSelected) {
          if (tagSelected.indexOf('theraphy') != -1) {
            elementsToChange = $('.search-theraphyFilter');
          } else if (tagSelected.indexOf('product') != -1) {
            elementsToChange = $('.search-productFilter');
          } else if (tagSelected.indexOf('indication') != -1) {
            elementsToChange = $('.search-indicationFilter');
          }

          if (tagSelected.indexOf('/') != -1) {
            tagSelected = tagSelected.substring(tagSelected.lastIndexOf('/') + 1, tagSelected.length);
          }

          if (elementsToChange) {
            elementsToChange.attr('AllValue', elementsToChange.html());
            elementsToChange.html(nameSelected);
          }
        }
      }
    });
  };

  api.onFilterHeaderClick = function (event, triggered) {
    $(".searchFilter-controls .searchFilterContent").toggle("400");
  };

  api.onFilterRadioClick = function (event, triggered) {
    $(this).toggleClass("filter-active");
    $(this).next(".searchFilter-content").toggle("400");
    $(this).next().next(".searchFilter-content").toggle("400");
  };

  Cog.registerComponent({
    selector: ".searchFilter-form",
    name: "searchfilter",
    api: api
  });
})(Cog.jQuery(), _);