"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    var $notification = element.$scope,
        notificationId = $notification.data('id'),
        gracePeriod = $notification.data('gracePeriod'),
        visibilityPeriod = $notification.data('visibilityPeriod'),
        behaviorType = $notification.data('behaviorType');

    if (behaviorType === 'defined') {
      this.setUpAutoBehavior($notification, notificationId, visibilityPeriod, gracePeriod);
    }

    $notification.on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      api.external.notificationManager.showNotification(notificationId);
    });
  };

  api.setUpAutoBehavior = function ($notification, notificationId, visibilityPeriod, gracePeriod) {
    setTimeout(function () {
      var notificationCloseTimeout;
      $notification.click();

      if (visibilityPeriod) {
        notificationCloseTimeout = setTimeout(function () {
          api.external.notificationManager.hideNotification(notificationId);
        }, visibilityPeriod * 1000);

        if (notificationCloseTimeout) {
          $(document).find('.notification-content.' + notificationId).on("keypress click change", function () {
            clearTimeout(notificationCloseTimeout);
          });
        }
      }
    }, gracePeriod * 1000);
  };

  Cog.registerComponent({
    name: "siteNotification",
    api: api,
    selector: "a.site-notification-trigger",
    requires: [{
      name: 'siteNotificationManager',
      apiId: 'notificationManager'
    }]
  });
})(Cog.jQuery());