"use strict";

var userbox = function ($) {
  'use strict';

  var api = {};
  api.config = {};

  api.getProfile = function () {
    if (api.profile) {
      return api.profile;
    }
  };

  function initComponent(element) {
    var loggedOut = element.$scope.find(".logged-out"),
        loginOverlayLink = loggedOut.find('.gigyaraas-login .gigya-raas-link'),
        registrationOverlayLink = loggedOut.find('.registration-text .gigya-raas-link'),
        logoutButton = element.$scope.find(".logged-in form button[type='submit']");
    logoutButton.click(function () {
      if (window.Modernizr.localstorage) {
        window.localStorage.removeItem('profile' + cf.getSiteLocale());
      }
    });
    api.getAccountInfo();

    if (cf.csrfToken) {
      cf.updateToken(cf.csrfToken);
    }

    Cog.addListener("gigyaEventHandler", "userProfileChanged", function (event) {
      api.profile = event.eventData;
      api.config = element.$scope.find('.user-box').data();

      if (window.Modernizr.localstorage && event.eventData && event.eventData.errorCode === 0) {
        var userProfile = event.eventData;
        var allowedKeys = ['profile', 'data', 'UID'];
        var filteredProfile = {};

        for (var _i = 0, _allowedKeys = allowedKeys; _i < _allowedKeys.length; _i++) {
          var key = _allowedKeys[_i];
          filteredProfile[key] = userProfile[key];
        }

        window.localStorage.removeItem('profile' + cf.getSiteLocale());
        window.localStorage['profile' + cf.getSiteLocale()] = JSON.stringify(filteredProfile);
      }

      if (api.config.loginOverlay) {
        loginOverlayLink.closest('.gigyaraas').removeClass('col-xs-12').removeClass('component');
      }

      if (api.config.registrationOverlay) {
        registrationOverlayLink.closest('.gigyaraas').removeClass('col-xs-12').removeClass('component');
      }

      if (event.eventData && event.eventData.eventName === 'afterSubmit') {
        event.eventData = event.eventData.response;
      }
    });

    if (window.Modernizr.localstorage) {
      var storedProfile = '{}';

      if (window.localStorage['profile' + cf.getSiteLocale()]) {
        storedProfile = window.localStorage['profile' + cf.getSiteLocale()];
      }

      Cog.fireEvent('gigyaEventHandler', 'userProfileChanged', JSON.parse(storedProfile));
    } else {
      api.getAccountInfo();
    }
  }

  function deferredRegister(element, counter) {
    var data = element.$scope.find('.user-box').data();

    if (typeof data !== 'undefined') {
      initComponent(element);
    } else {
      counter++;

      if (counter <= 10) {
        setTimeout(function () {
          deferredRegister(element, counter);
        }, 100);
      }
    }
  }

  api.onRegister = function (element) {
    var counter = 0;
    deferredRegister(element, counter);
  };

  api.getAccountInfoResponse = function (response) {
    if (response) {
      Cog.fireEvent('gigyaEventHandler', 'userProfileChanged', response);
    }
  };

  api.getAccountInfo = function () {
    var $getAccountInfoResponse = api.getAccountInfoResponse;

    if (typeof gigya !== 'undefined') {
      gigya.accounts.getAccountInfo({
        callback: $getAccountInfoResponse
      });
    }
  };

  Cog.registerComponent({
    name: "userBox",
    api: api,
    selector: ".userBox"
  });
  return api;
}(Cog.jQuery());