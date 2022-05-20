"use strict";

(function ($) {
  var api = {};

  api.onRegister = function (element) {
    var $coupons = element.$scope;
    $coupons.each(function () {
      $(this).find('input[type=submit]').click(function (e) {
        e.preventDefault();
        api.onAjaxsubmitClick($(this).parents('.couponDetails'));
      });
    });
  };

  api.onAjaxsubmitClick = function (coupon) {
    var formURL = coupon.data("pagePath");
    var customerId = coupon.data("customerId");
    $.get(window.location.pathname.split('.')[0] + '.token.json').done(function (json) {
      var csrfToken = '';

      if (json.token) {
        csrfToken = json.token;
      }

      $.ajax({
        url: formURL + '.getcoupons.html',
        type: "POST",
        data: {
          "emailAddress": customerId,
          ":cq_csrf_token": csrfToken
        },
        success: function success(data) {
          window.location.href = data;
        }
      });
    });
  };

  Cog.registerComponent({
    name: "coupons",
    api: api,
    selector: ".coupons"
  });
})(Cog.jQuery());