"use strict";

(function ($) {
  var api = {};
  var resPath;
  var mailLabel, tempLabel, subLabel;

  api.onRegister = function (element) {
    resPath = $(".component-content-notification").attr("data-res-path");
    var $notification = element.$scope;
    $notification.each(function () {
      $(this).on("click", "button", api.onNotificationsubmitClick);
      $(this).on("load", cf.loadCsrfToken('.notification.component'));
    });
  };

  api.onNotificationsubmitClick = function (event, triggered) {
    $(".notificationSuccessBox").hide();
    $(".notificationFailureBox").hide();
    mailLabel = $(".notificationFormElement #mailLabel").val();
    tempLabel = $(".notificationFormElement #tempLabel").val();
    subLabel = $(".notificationFormElement #subLabel").val();
    var csrfToken = $("#cq_csrf_token").val();
    $.ajax({
      url: resPath,
      type: "POST",
      data: {
        "mailLabel": mailLabel,
        "tempLabel": tempLabel,
        "subLabel": subLabel,
        ":cq_csrf_token": csrfToken
      },
      success: function success(data) {
        if (data == 'true') {
          $(".notificationSuccessBox").show();
        } else if (data == 'false') {
          $(".notificationFailureBox").show();
        }
      },
      dataType: 'html'
    });
  };

  Cog.registerComponent({
    name: "notification",
    api: api,
    selector: ".notification"
  });
})(Cog.jQuery());