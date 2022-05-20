"use strict";

(function ($) {
  var api = {};

  api.onRegister = function (element) {
    var $passcodelogin = element.$scope;
    ;
    $passcodelogin.each(function () {
      $(this).on("click", ".component-content .passcodeButton", api.onPasscodeSubmitClick);
    });
  };

  api.onPasscodeSubmitClick = function (event, triggered) {
    var passcodeValue = $("#passcodeInput").val();

    if (passcodeValue != "") {
      $(".pcodeloginpanel form.passCodeForm").submit();
    } else {
      $(".pcodeloginpanel form.passCodeForm .errorPasscode").show();
    }
  };

  Cog.registerComponent({
    name: "pcodeloginpanel",
    api: api,
    selector: ".pcodeloginpanel"
  });
})(Cog.jQuery());