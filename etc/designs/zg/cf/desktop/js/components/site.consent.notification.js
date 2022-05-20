"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function () {
    var notificationId = cf.getParameterByName("notify");

    if (notificationId) {
      api.external.notificationManager.showNotification(notificationId);
    }
  };

  Cog.registerComponent({
    name: "consentSiteNotification",
    selector: ".site-notification",
    api: api,
    requires: [{
      name: 'siteNotificationManager',
      apiId: 'notificationManager'
    }]
  });
})(Cog.jQuery());