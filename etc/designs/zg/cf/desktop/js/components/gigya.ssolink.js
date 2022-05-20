"use strict";

(function ($) {
  "use strict";

  var api = {},
      hiddenClass = "is-hidden",
      $exitNotification = $("#exit-notification");

  api.acceptButton = function () {
    api.processSsoLink();
  };

  api.openExitNotification = function () {
    $exitNotification.removeClass(hiddenClass);
    $exitNotification.find(".exit-notification-accept").unbind("click").click(api.acceptButton);
  };

  api.processSsoLink = function () {
    api.ssoUrl = api.ssoUrl.indexOf("?") !== -1 ? api.ssoUrl + "&" : api.ssoUrl + "?";

    if ("samlType" === api.linkType) {
      var outputQueryParams = "";

      for (var i = 0; i < api.samlQueryParams.length; i++) {
        var samlQueryParamValue = getParameterByName(api.samlQueryParams[i]);

        if (samlQueryParamValue) {
          outputQueryParams += api.samlQueryParams[i] + "=" + samlQueryParamValue + "&";
        }
      }

      if (outputQueryParams.charAt(outputQueryParams.length - 1) == '&') {
        outputQueryParams = outputQueryParams.substr(0, outputQueryParams.length - 1);
      }

      if (typeof gigya !== 'undefined') {
        gigya.fidm.saml.initSSO({
          spName: api.consumerConfiguration,
          redirectURL: api.ssoUrl + outputQueryParams
        });
      } else if (console && console.warn) {
        console.warn('Gigya is not defined!');
      }
    } else {
      if (typeof gigya !== 'undefined') {
        gigya.accounts.getJWT({
          callback: function callback(response) {
            var idToken = "";

            if (response.id_token) {
              idToken = response.id_token;
            } else {
              idToken = "";
            }

            api.ssoUrl = api.ssoUrl + "apiKey=" + response.requestParams.APIKey + "&apiDomain=" + response.requestParams.apiDomain + "&id_token=" + idToken;

            if (api.newWindow) {
              // this is to make sure that Referer header is passed in IE
              var form = $("<form />").attr("action", api.ssoUrl).attr("target", "_blank"),
                  ssoQueryParams = api.ssoUrl.split('?')[1].split('&').reduce(acquireQueryParam, []);
              ssoQueryParams.forEach(function (element) {
                var input = $('<input />').attr('type', 'hidden').attr('name', element.name).attr('value', element.value);
                input.appendTo(form);
              });
              form.appendTo(document.body).submit();
              $exitNotification.addClass(hiddenClass);
            } else {
              window.location.href = api.ssoUrl;
            }
          },
          fields: api.ssoAttributes
        });
      } else if (console && console.warn) {
        console.warn('Gigya is not defined!');
      }
    }
  };

  var acquireQueryParam = function acquireQueryParam(q, query, index) {
    var chunks = query.split('=');
    var key = chunks[0];
    var value = chunks[1];
    q[index] = {
      name: key,
      value: value
    };
    return q;
  };

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  function processSsoLinkElement(element) {
    var warning = element.data("warning");
    api.ssoAttributes = element.data("attributes");
    api.ssoUrl = element.data("link");
    api.newWindow = element.attr("target");
    api.linkType = element.data("linkType");
    api.samlQueryParams = element.data("samlQueryParams").split(',');
    api.consumerConfiguration = element.data("consumerConfiguration");

    if (warning && confirm(warning) || element.data('warningPolicy') === 'noWarning') {
      api.processSsoLink();
    } else if ($exitNotification.length > 0) {
      api.openExitNotification();
    }
  }

  api.ssoLinkHandler = function (event) {
    event.preventDefault();
    processSsoLinkElement($(event.target));
  };

  api.onRegister = function (element) {
    var scopeElement = element.$scope;
    scopeElement.on("click", api.ssoLinkHandler);
  };

  api.init = function (elements) {
    var ssoLinksToTrigger = [];
    $.each(elements, function (index) {
      if ($(this).data("autoTrigger")) {
        ssoLinksToTrigger[ssoLinksToTrigger.length] = $(this);
        if (ssoLinksToTrigger.length > 1) return false;
      }
    });

    if (api.external.status.isPublish() && ssoLinksToTrigger.length == 1) {
      processSsoLinkElement(ssoLinksToTrigger[0]);
    }
  };

  Cog.registerComponent({
    name: "ssolink",
    api: api,
    selector: ".sso-link",
    requires: [{
      name: "utils.status",
      apiId: "status"
    }]
  });
})(Cog.jQuery());