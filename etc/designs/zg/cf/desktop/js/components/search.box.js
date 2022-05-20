"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    var options = element.$scope.data();

    if (options.searchSuggestionEnabled) {
      var limit = options.searchSuggestionLimit,
          autoCompleteOptions = {
        url: function url(phrase) {
          return cf.getPagePath() + ".autosuggest.json?limit=" + limit + "&q=" + phrase;
        }
      };
      element.$scope.find('input').easyAutocomplete(autoCompleteOptions);
    }
  };

  Cog.registerComponent({
    name: "searchbox",
    api: api,
    selector: ".cf-search-box"
  });
})(Cog.jQuery());