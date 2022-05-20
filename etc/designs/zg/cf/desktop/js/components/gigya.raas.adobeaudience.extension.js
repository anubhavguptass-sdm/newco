"use strict";

(function ($) {
  "use strict";

  var visitorSyncUtil = window.GSKTECH.CF.visitorSyncUtil,
      authState;

  if (typeof gigyaraas !== 'undefined') {
    gigyaraas.registerAction('onAfterSubmit', 'sync-mcids', function (response, config, promise) {
      if (config.formType !== 'login') {
        visitorSyncUtil.getInstance().syncByGigyaResponse(response);
      }

      promise.resolve();
    });
    gigyaraas.registerAction('onLogin', 'sync-mcids', function (response) {
      var instance = visitorSyncUtil.getInstance();

      if (isVisitorProperlyInitialized(instance)) {
        authState = Visitor.AuthState.AUTHENTICATED;
        instance.syncByGigyaResponse(response);
      }
    });
  }

  $(window).on('load', function () {
    if (typeof Visitor !== 'undefined') {
      var instance = visitorSyncUtil.getInstance(),
          params = cf.getMultiValuedQueryParameters(),
          names = params["syncIdName"],
          ids = params["syncIdValue"];

      if (names && ids && names.length === ids.length && isVisitorProperlyInitialized(instance)) {
        if (!authState) {
          authState = Visitor.AuthState.LOGGED_OUT;
        }

        names.forEach(function (name, index) {
          instance.genericSync(name, ids[index], authState);
        });
      }
    }
  });

  var isVisitorProperlyInitialized = function isVisitorProperlyInitialized(instance) {
    return typeof Visitor !== 'undefined' && Visitor && Visitor.AuthState && instance.getVisitor();
  };
})(Cog.jQuery());