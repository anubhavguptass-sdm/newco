"use strict";

(function ($) {
  var api = {},
      $component,
      $customDateInputFrom,
      $customDateInputTo,
      $customDateSearchButton,
      prepareCustomDateValue = function prepareCustomDateValue(input) {
    var value = input.val();

    if (value) {
      value += "T00:00:00Z";
    } else {
      value = "*";
    }

    return value;
  };

  api.onRegister = function (element) {
    $component = element.$scope;
    $customDateInputFrom = $component.find("input#sb-customdate-from");
    $customDateInputTo = $component.find("input#sb-customdate-to");
    $customDateSearchButton = $component.find("button.custom-date-trigger");
    api.updateCustomDateInputs();
    $customDateSearchButton.click(function () {
      var fromValue, toValue, filterValue;
      fromValue = prepareCustomDateValue($customDateInputFrom);
      toValue = prepareCustomDateValue($customDateInputTo);
      filterValue = "[" + fromValue + "TO" + toValue + "]";
      api.updateFacets("lastmodified", filterValue);
    });
    $component.find('.facet-value.facet-value--trigger').click(function () {
      var $element = $(this),
          facetKey = $element.data('facetKey'),
          facetValue = $element.data('facetFilterValue');
      api.updateFacets(facetKey, facetValue);
    });
    $component.find(".facet-value--active").click(function () {
      api.updateFacets($(this).data('facetKey'), null);
    });
  };

  api.updateFacets = function (facetType, facetValue) {
    var decodedQueryString = decodeURIComponent(window.location.search),
        facetRegexp = new RegExp("f\\." + facetType + "\\.filter=" + "[\\w\\s:\\[\\]\\-\\*=\\.]+").exec(decodedQueryString),
        newSearch = decodedQueryString;

    if (facetRegexp && facetRegexp.length) {
      if (facetValue) {
        newSearch = decodedQueryString.replace(facetRegexp[0], "f." + facetType + ".filter=" + facetValue);
      } else {
        newSearch = decodedQueryString.replace("&" + facetRegexp[0], "");
        newSearch = newSearch.replace("?" + facetRegexp[0], "");
      }
    } else if (facetType && facetValue) {
      if (window.location.search.endsWith("&")) {
        newSearch = window.location.search + "f." + facetType + ".filter=" + facetValue;
      } else {
        newSearch = window.location.search + "&f." + facetType + ".filter=" + facetValue;
      }
    }

    newSearch = newSearch.replace(/p=\d+/, "p=1");
    window.location.search = newSearch;
  };

  api.updateCustomDateInputs = function () {
    var decodedQuery = decodeURIComponent(window.location.search),
        lastModifiedFilterGroups;

    if (decodedQuery.match(/f.lastmodified.filter=\[.*TO.*\]/)) {
      lastModifiedFilterGroups = new RegExp("f.lastmodified.filter=\\[(.*)TO(.*)\\]").exec(decodedQuery);

      if (lastModifiedFilterGroups && lastModifiedFilterGroups.length === 3) {
        $customDateInputFrom.val(lastModifiedFilterGroups[1].split("T")[0]);
        $customDateInputTo.val(lastModifiedFilterGroups[2].split("T")[0]);
        $customDateInputTo.closest("li").addClass("facet-value--active");
      }
    }
  };

  Cog.registerComponent({
    name: "Search Results",
    api: api,
    selector: ".searchResults"
  });
})(Cog.jQuery());