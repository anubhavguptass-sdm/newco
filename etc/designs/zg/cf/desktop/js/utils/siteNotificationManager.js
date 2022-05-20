"use strict";

(function ($) {
  "use strict";

  var api = {},
      sharedApi = {},
      mobile = Cog.Cookie.read("device-group") === 'mobile';

  sharedApi.showNotification = function (notificationId) {
    var triggerSelector = 'a.site-notification-trigger.' + notificationId,
        $notificationLoading = $('.notification-loading.' + notificationId),
        $notificationBackground = $('.notification-background.' + notificationId),
        $notificationContainer = $('.notification-container.' + notificationId),
        $notificationContent = $('.notification-content.' + notificationId),
        $notificationClose = $('.notification-close.' + notificationId),
        $notificationContentInner = $('.notification-content-inner.' + notificationId),
        displayOnce = $(triggerSelector).data('displayOnce'),
        cookieName = 'notification-' + notificationId,
        displayedAlready = Cog.Cookie.read(cookieName) != null;

    if (displayOnce && displayedAlready) {
      return;
    }

    if (!mobile) {
      api.showLoadingContainer($notificationClose, $notificationBackground, $notificationContainer, $notificationLoading, $notificationContent);
    } else {
      window.open($(triggerSelector).attr('data-href'), "_blank");
    }

    if (!$notificationContent.hasClass('populated')) {
      api.loadNotificationContent($notificationLoading, $notificationClose, $notificationContent, $notificationContentInner, $notificationBackground);
    }

    api.attachEvents($notificationContent, $notificationBackground, $notificationContainer, $notificationClose, notificationId);
  };

  sharedApi.hideNotification = function (notificationId) {
    var $notificationBackground = $('.notification-background.' + notificationId),
        $notificationContainer = $('.notification-container.' + notificationId);
    $notificationContainer.fadeOut();
    $notificationBackground.fadeOut();
  };

  api.buildnotification = function ($notificationLoading, $notificationClose, $notificationContent, $notificationContentInner, response) {
    $notificationLoading.hide();
    $notificationClose.show();
    $notificationContentInner.append(response);
  };

  api.showLoadingContainer = function ($notificationClose, $notificationBackground, $notificationContainer, $notificationLoading, $notificationContent) {
    if (!$notificationContent.hasClass('populated')) {
      $notificationClose.hide();
      $notificationLoading.show();
    }

    $notificationBackground.show();
    $notificationContainer.css({
      "top": $(window).scrollTop() + 100 + "px"
    });
    $notificationContainer.show();
  };

  api.loadNotificationContent = function ($notificationLoading, $notificationClose, $notificationContent, $notificationContentInner, $notificationBackground) {
    var trigger = $notificationClose.closest('.site-notification').find('a.site-notification-trigger'),
        url = trigger.data('href'),
        id = trigger.data('id');
    url = api.external.url.setSelector(url, 'lightbox');
    $.ajax({
      type: "GET",
      url: url,
      dataType: "html",
      success: function success(response) {
        api.buildnotification($notificationLoading, $notificationClose, $notificationContent, $notificationContentInner, response);
        Cog.init({
          $element: $notificationContentInner
        });
        $notificationContent.addClass('populated');
        Cog.Cookie.create('notification-' + id, "true", 365);
      },
      error: function error() {
        $notificationLoading.hide();
        $notificationBackground.hide();
        $notificationContent.hide();
      }
    });
  };

  api.attachEvents = function ($notificationContent, $notificationBackground, $notificationContainer, $notificationClose, notificationId) {
    $(document).on("click touchstart", $notificationContent, function (event) {
      event.stopPropagation();
    }).on("click touchstart", [$notificationBackground, $notificationClose], function (event) {
      if ($(event.target).closest('.notification-content-inner').length === 0) {
        sharedApi.hideNotification(notificationId);
      }
    }).on("keydown", function (event) {
      if (event.keyCode === 27) {
        sharedApi.hideNotification(notificationId);
      }
    });
  };

  Cog.registerStatic({
    name: "siteNotificationManager",
    api: api,
    sharedApi: sharedApi,
    requires: [{
      name: "utils.url",
      apiId: "url"
    }]
  });
})(Cog.jQuery());