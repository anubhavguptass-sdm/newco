"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    api.prComponentExistsOnPage = true;
  };

  api.init = function (element) {
    if (api.prComponentExistsOnPage) {
      var apiUrl,
          paramsArray = [];
      $.each(element, function (key, elementItem) {
        var dataset = elementItem.dataset;

        if (!apiUrl) {
          apiUrl = dataset.apiUrl;
        }

        var prVariables = JSON.parse(dataset.prVariables),
            prType = dataset.prType,
            prPlaceholder = dataset.prPlaceholder,
            pr40Feedless = dataset.prFeedless,
            component = {},
            filteredParamsArray;

        if (pr40Feedless && prVariables.review_wrapper_url) {
          prVariables.product = JSON.parse(dataset.prProductVariables);
        }

        filteredParamsArray = paramsArray.filter(function (e) {
          return e.page_id === prVariables.page_id;
        });

        if (filteredParamsArray.length > 0) {
          filteredParamsArray[0].components[prType] = prPlaceholder;
        } else {
          component[prType] = prPlaceholder;
          prVariables.components = component;
          paramsArray.push(prVariables);
        }
      });
      $.getScript(apiUrl).done(function () {
        if (paramsArray.length === 1) {
          POWERREVIEWS.display.render(paramsArray[0]);
        } else if (paramsArray.length > 1) {
          POWERREVIEWS.display.render(paramsArray);
        }
      });
    }
  };

  Cog.registerComponent({
    name: "powerreviews40",
    selector: ".powerreviews40",
    api: api
  });
})(Cog.jQuery());
