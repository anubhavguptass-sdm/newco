"use strict";

(function ($) {
  var api = {};

  api.onRegister = function (element) {
    //if (elements.length > 0) {
    var isauthor = $(".passcodeContainer").data("isauthor");
    var configpage = $(".passcodeContainer").data("configpage");
    var loginpage = $(".passcodeContainer").data("loginpage");

    if (isauthor != undefined && !isauthor && configpage != null && configpage != '' && loginpage != null && loginpage != '') {
      $(".component-content").hide();
      var passcodeObj = $(".passcodeContainer");
      var configpage = passcodeObj.data("configpage");
      var loginpage = passcodeObj.data("loginpage");
      var url = passcodeObj.data("resourcepath") + '.verify';
      var currentpage = passcodeObj.data("currentpage");
      var isAuthor = passcodeObj.data("isauthor");
      var passcode = passcodeObj.data("passcode");
      var operation = "verify";
      if (passcode != undefined && passcode != '') operation = "submit";
      $.post(url, {
        configPage: configpage,
        loginPage: loginpage,
        currentPage: currentpage + '.html',
        resource: currentpage + '.html',
        operation: operation,
        passcode: passcode
      }, function (data, status) {
        if (data == 'false') {
          window.location.href = loginpage + '.html?resource=' + currentpage + '.html';
        } else {
          $(".component-content").show();
        }
      });
    } //}

  };

  Cog.registerComponent({
    name: "passcode",
    api: api,
    selector: ".passcodeContainer"
  });
})(Cog.jQuery());