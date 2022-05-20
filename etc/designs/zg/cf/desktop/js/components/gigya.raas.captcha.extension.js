"use strict";

(function ($) {
  if (typeof gigyaraas !== 'undefined') {
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      var currentContext = gigyaraas.getCurrentContext();

      if (typeof grecaptcha !== 'undefined' && grecaptcha && currentContext && currentContext.config.captchaEnabled === true) {
        if (originalOptions.type === "POST") {
          options.data += "&challenge=" + grecaptcha.getResponse();
        }
      }
    });
    $(document).ajaxComplete(function () {
      var currentContext = gigyaraas.getCurrentContext();

      if (typeof grecaptcha !== 'undefined' && grecaptcha && currentContext && currentContext.config && currentContext.config.captchaEnabled === true) {
        grecaptcha.reset();
      }
    });
    gigyaraas.registerAction('onAfterScreenLoad', 'captcha-rearrange', function (response, config) {
      if (typeof grecaptcha !== 'undefined' && grecaptcha && config.captchaEnabled === true && config.captchaType === 'RECAPTCHA_V2_CHECKBOX') {
        var $visibleScreen = gigyaraas.getVisibleScreen(response),
            $recaptcha = $visibleScreen.closest('.gigyaraas').find('.g-recaptcha-non-initialized'),
            $submitControl = $visibleScreen.find('.gigya-composite-control-submit'),
            $captchaControl = $('<div class="gigya-composite-control gigya-composite-control-captcha-widget"/>'),
            $captchaWrapper = $('<div class="gigya-captcha-wrapper"/>');
        $recaptcha.detach();
        $captchaWrapper.appendTo($captchaControl);
        $submitControl.before($captchaControl);
        $recaptcha.appendTo($captchaWrapper);
        $recaptcha.attr('class', 'g-recaptcha');
        grecaptcha.render($recaptcha[0], {
          sitekey: $recaptcha.data('sitekey')
        });
      }
    });
    gigyaraas.registerAction("onBeforeValidation", 'captcha-required-check', function (response, config) {
      if (typeof grecaptcha !== 'undefined' && grecaptcha && config.captchaEnabled === true && config.captchaType === 'RECAPTCHA_V2_CHECKBOX') {
        if (!grecaptcha.getResponse()) {
          return {
            form: config.captchaValidationMsg
          };
        }
      }
    });
    gigyaraas.registerAction("onBeforeSubmit", 'execute-invisible-captcha', function (response, config) {
      if (typeof grecaptcha !== 'undefined' && grecaptcha && config.captchaEnabled && config.captchaType === 'RECAPTCHA_V2_INVISIBLE') {
        grecaptcha.execute();
      }

      return true;
    });
  }
})(Cog.jQuery());