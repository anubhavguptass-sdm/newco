"use strict";

(function ($, document, _) {
  'use strict';

  var api = {};

  api.onRegister = function (elements) {
    var $element = elements.$scope,
        path = cf.getPagePath(),
        offerName = $element.find('.component-content').data('offerName'),
        couponId = cf.getParameterByName('couponid'),
        token = cf.csrfToken;

    if (couponId !== '') {
      $.ajax({
        type: 'POST',
        url: path + '.generatewallettoken.json',
        data: {
          ':cq_csrf_token': token,
          '_charset_': 'utf-8',
          'couponId': couponId,
          'offerName': offerName
        },
        success: function success(response) {
          $element.find('.coupon-id').text(couponId);
          $element.find('.coupon-link').attr('href', response.result);
          $element.find('.component-content').removeClass('hidden');
        }
      });
      $element.find('.coupon-submit').on('click', function () {
        var phoneNumber = $element.find('.coupon-sms-input').val();

        if (phoneNumber !== '') {
          $.ajax({
            type: 'POST',
            url: path + '.sendwalletlinktophone.json',
            data: {
              ':cq_csrf_token': cf.csrfToken,
              '_charset_': 'utf-8',
              'mobileNumber': phoneNumber,
              'couponId': couponId,
              'offerName': offerName
            },
            success: function success() {
              $element.find('.success-message').removeClass('hidden');
            }
          });
        }
      });
    }
  };

  Cog.registerComponent({
    name: 'digitalWallet',
    selector: '.digitalWallet',
    api: api
  });
})(Cog.jQuery());