"use strict";

(function () {
  var api = {};

  api.onRegister = function (element) {
    var $component = element.$scope;
    var loadUrl = $component.data("src");

    if (typeof loadUrl != "undefined" && window.location.search) {
      var query = window.location.search;

      if (loadUrl.includes("?")) {
        loadUrl = loadUrl + "&" + query.substring(1);
      } else {
        loadUrl += query;
      }
    }

    $component.attr("src", loadUrl);
  };

  Cog.registerComponent({
    name: "aemForms",
    api: api,
    selector: "iframe#aemFormFrame"
  });
})();