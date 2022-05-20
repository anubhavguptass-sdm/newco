"use strict";

(function ($) {
  "use strict";

  if (typeof gigyaraas !== 'undefined') {
    gigyaraas.registerAction('onBeforeSubmit', 'data-store', function (response, config) {
      if (config.formType === 'datastore') {
        var datastoreType,
            datastore = {},
            numberOfUpdates,
            numberCompleted = 0;

        if (!config.userEmail) {
          config.userEmail = response.profile.email;
        }

        _.each(response.formData, function (value, key) {
          if (key.indexOf(config.datastorePattern) !== -1) {
            var datakey = key.replace(config.datastorePattern, ''),
                splitdata = datakey.split('.');
            datastoreType = splitdata[0];

            if (typeof datastore[datastoreType] === 'undefined') {
              datastore[datastoreType] = {};
            }

            datastore[datastoreType][splitdata[1]] = value;
          }
        });

        numberOfUpdates = _.size(datastore);

        _.each(datastore, function (data, type) {
          $.post(window.location.pathname.split('.')[0] + '.dscallback.json', {
            'type': type,
            'email': config.userEmail,
            'data': encodeURIComponent(JSON.stringify(data)),
            'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
            ':cq_csrf_token': cf.csrfToken
          }).done(function (data) {
            if (data.statusReason === 'OK') {
              numberCompleted = numberCompleted + 1;
            }

            if (numberCompleted === numberOfUpdates) {
              var params = {
                screenSet: config.screenSet,
                containerID: config.componentId,
                startScreen: config.successScreenSet
              };
              gigya.accounts.showScreenSet(params);
            }
          }).fail(function () {
            window.location = config.errorPage;
          });
        });

        return false;
      }
    });
    gigyaraas.registerAction('onBeforeSubmit', 'webshop', function (response, config) {
      if (config.formType === 'webshop') {
        var webshopData = {},
            productList,
            quantityList,
            loadValue = Cog.component.webshop.readWebshopCookie(),
            loadJson = JSON.parse(loadValue);

        _.each(response.formData, function (value, key) {
          var splitdata = key.split('.');
          webshopData[splitdata[1]] = value;
        });

        _.forEach(loadJson, function (product, productId) {
          productList = typeof productList === 'undefined' ? productId : productList + ',' + productId;
          quantityList = typeof quantityList === 'undefined' ? product.count : quantityList + ',' + product.count;
        });

        webshopData[':cq_csrf_token'] = cf.csrfToken;
        webshopData.product = productList;
        webshopData.quantity = quantityList;
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: window.location.pathname.split('.')[0] + '.createOrder.json',
          data: webshopData,
          success: function success(data) {
            if (data.order_number !== '') {
              Cog.Cookie.erase(Cog.component.webshop.cookieName);
            }

            var params = {
              screenSet: config.screenSet,
              containerID: config.componentId,
              startScreen: config.successScreenSet
            };
            gigya.accounts.showScreenSet(params);
          }
        });
        return false;
      }
    });
    gigyaraas.registerAction('onBeforeSubmit', 'change-email', function (response, config) {
      if (config.formType === 'change-email') {
        config.formError = false;
        config.newLoginId = response.formData["profile.email"];

        if (config.newLoginId && !config.formError) {
          $.ajax({
            type: "POST",
            url: window.location.pathname.split('.')[0] + ".changeloginemail.json",
            dataType: "json",
            data: {
              ":cq_csrf_token": cf.csrfToken,
              "newEmail": config.newLoginId
            },
            success: function success() {
              //logout
              var params = {
                screenSet: config.screenSet,
                containerID: config.componentId,
                startScreen: config.successScreenSet
              };
              gigya.accounts.showScreenSet(params);
            },
            error: function error() {
              window.location = config.errorPage;
            }
          });
        }

        return false;
      }
    });
    gigyaraas.registerAction('onBeforeSubmit', 'prepare-consent', function (response, config) {
      if (config.formType === 'profile') {
        if (gigyaraas.getVisibleScreen(response).find('.consent-update').length > 0) {
          config.consentArray = [];
          var uid = userbox.getProfile().UID;
          gigyaraas.getVisibleScreen(response).find('.consent-update').each(function () {
            var classPrint = $(this).attr('class').split(' '),
                consentType,
                consentValue,
                matchconsentType = /consentType-/,
                matchconsentvalue = /consentValue-/,
                consentValueList,
                consentVal = response;
            classPrint.forEach(function (element) {
              if (matchconsentType.test(element)) {
                consentType = element.split('-')[1].replace('_', ' ');
              }

              if (matchconsentvalue.test(element)) {
                consentValue = element.split('-')[1];
              }
            });
            consentValueList = consentValue.split('.');
            consentValueList.forEach(function (element) {
              consentVal = typeof consentVal[element] === 'undefined' ? 'NO DATA' : consentVal[element];
            });
            config.consentArray.push({
              gigyaId: uid,
              consentType: consentType,
              channelValue: consentVal,
              optStatus: $(this).find('input[type=checkbox]').is(':checked')
            });
          });
        }
      }
    });
    gigyaraas.registerAction('onBeforeSubmit', 'delete-gigya', function (response, config) {
      if (config.formType === 'deleteAccount' || gigyaraas.getVisibleScreen(response).find('.delete-user-account').length > 0) {
        var path = window.location.pathname.split('.')[0];
        $.ajax({
          type: 'POST',
          url: path + '.hardDelete.html',
          data: {
            'datastoreType': 'DeleteAccountData',
            ':cq_csrf_token': cf.csrfToken
          },
          success: function success() {
            window.location.pathname = config.resource;
          },
          error: function error() {
            window.location = config.errorPage;
          }
        });
        return false;
      }
    });
    gigyaraas.registerAction('onAfterSubmit', 'veeva-tracking', function (response, config, promise) {
      if (response.response && response.response.UID) {
        response = response.response;
      } else if (userbox.getProfile() && userbox.getProfile().UID) {
        response = userbox.getProfile();
      }

      if (response.UID) {
        if (cf.veevaSiteMode === "multiple") {
          config.veevaBuId = response.data.ADDRESS.COUNTRY;
        }

        if (config.trackingname && config.trackingname.length) {
          Cog.fireEvent('submitEventTracker', 'eventToTrack', {
            userBuId: config.veevaBuId,
            userUid: response.UID,
            userCrmId: response.data.CRMID,
            gzgEvent: config.gzgevent,
            gzgscEvent: config.gzgscevent,
            brandId: config.brandid,
            trackingName: config.trackingname
          });
        }
      }

      promise.resolve();
    });
    gigyaraas.registerAction('onAfterSubmit', 'profile-update', function (response, config, promise) {
      if (config.formType === 'profile') {
        Cog.fireEvent('gigyaEventHandler', 'userProfileChanged', response);
        $.ajax({
          type: 'POST',
          url: window.location.pathname.split('.')[0] + '.gigyaprofileupdate.json',
          data: {
            ':cq_csrf_token': cf.csrfToken
          },
          success: function success() {
            promise.resolve();
          }
        });
      } else {
        promise.resolve();
      }
    });
    gigyaraas.registerAction('onAfterSubmit', 'coupon-request', function (response, config, promise) {
      if (config.formType === 'coupon') {
        $.ajax({
          type: 'POST',
          url: config.resourcePath + '.coupon.html',
          data: {
            ':cq_csrf_token': cf.csrfToken,
            'data': response.data,
            'profile': response.profile,
            '_charset_': 'utf-8'
          },
          success: function success(response) {
            promise.resolve();
            var url = response;
            $(location).attr('href', url);
          }
        });
      } else {
        promise.resolve();
      }
    });
    gigyaraas.registerAction('onAfterSubmit', 'user-invalidation', function (response, config, promise) {
      if (config.formType === 'registration' && config.allowLogin !== true) {
        var path = window.location.pathname.split('.')[0];
        $.ajax({
          type: 'POST',
          url: path + '.lookupcallback.json',
          async: false,
          data: {
            'UID': response.UID,
            'isActive': config.allowLoginStatus,
            ':cq_csrf_token': cf.csrfToken
          },
          success: function success() {
            promise.resolve();
          }
        });
      } else {
        promise.resolve();
      }
    });
    gigyaraas.registerAction('onAfterSubmit', 'email-notification', function (response, config, promise) {
      if ((response.response.status === 'OK' || response.response.errorCode === 206002) && config.notificationEnabled) {
        $.ajax({
          type: 'POST',
          url: config.resourcePath + '.notify.json',
          data: {
            ':cq_csrf_token': cf.csrfToken,
            'data': response.data,
            'profile': response.profile,
            'uid': response.response.UID,
            '_charset_': 'utf-8'
          },
          success: function success() {
            promise.resolve();
          }
        });
      } else {
        promise.resolve();
      }
    });
    gigyaraas.registerAction('onBeforeSubmit', 'lookup-validate', function (response, config, promise) {
      if (config.formType === 'registration' && config.lookupValidate) {
        gigyaraas.getVisibleScreen(response).find('.gigya-input-submit').prop('disabled', true);
        var lookUpData = {},
            classPrint,
            matchString,
            lookUpAttribute,
            lookUpValue;
        gigyaraas.getVisibleScreen(response).find('.lookUp-validate').each(function () {
          classPrint = $(this).attr('class').split(' ');
          lookUpValue = $(this).find('input').val();
          classPrint.forEach(function (element) {
            matchString = /lookUpField-/;

            if (matchString.test(element)) {
              lookUpAttribute = element.split('-')[1];

              if (lookUpValue) {
                lookUpData[lookUpAttribute] = encodeURIComponent(lookUpValue);
              }
            }
          });
        });
        var selector = config.mdmValidate ? "mdmvalidate" : "lookupvalidate";
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: window.location.pathname.split('.')[0] + '.' + selector + '.json',
          data: lookUpData,
          success: function success(data) {
            var lookUpRecords = data.hcps,
                classPrint;

            if (lookUpRecords) {
              if (lookUpRecords.length === 1) {
                gigyaraas.getVisibleScreen(response).find('.lookUp-populate').each(function () {
                  var classPrint = $(this).attr('class').split(' ');
                  classPrint.forEach(function (element) {
                    var matchString = /lookUpField-/,
                        lookUpAttribute;

                    if (matchString.test(element)) {
                      lookUpAttribute = element.split('-')[1];
                      $(this).find('select').val(lookUpRecords[0][lookUpAttribute]).attr('selected', 'selected');
                    }
                  });
                });
                gigyaraas.getVisibleScreen(response).find('input[name="data.CRMID"]').val(lookUpRecords[0].rowId);
                response.context.allowLoginStatus = true;
              } else {
                gigyaraas.getVisibleScreen(response).find('input[name="data.CRMID"]').val('');

                if (!config.allowLogin) {
                  response.context.allowLoginStatus = false;
                }
              }
            }

            gigyaraas.getVisibleScreen(response).find('.gigya-input-submit').prop('disabled', false);
          }
        });
      }
    });
    gigyaraas.registerAction('onAfterScreenLoad', 'pre-populate-regmethod', function (response, config) {
      var chooseField = cf.getParameterByName('validationMethod'),
          classPrint;
      gigyaraas.getVisibleScreen(response).find('.lookUp-prePopulate').each(function () {
        if (chooseField) {
          var chooseClassName = 'validationMethod-' + chooseField;
          $('.' + chooseClassName + ' input[type=checkbox]').trigger('click');
        }

        classPrint = $(this).attr('class').split(' ');
        classPrint.forEach(function (element) {
          var matchString = /prePopulateParameter-/,
              prePopulateAttribute,
              prePopulateValue;

          if (matchString.test(element)) {
            prePopulateAttribute = element.split('-')[1];
            prePopulateValue = cf.getParameterByName(prePopulateAttribute);
            $(this).find('input').val(prePopulateValue);
            $(this).find('select').val(prePopulateValue).attr('selected', 'selected');
          }
        });
      });
    });
    gigyaraas.registerAction('onFieldChanged', 'change-email-function', function (response, config) {
      if (config.formType === 'change-email' && response.field === "profile.email") {
        var idParams = {};
        idParams.loginID = response.value;

        idParams.callback = function (loginAvailablityResponse) {
          if (loginAvailablityResponse.isAvailable === false) {
            gigyaraas.getVisibleScreen(response).find('.new-email-id-error').show();
            gigyaraas.getVisibleScreen(response).find('.gigya-input-submit').prop('disabled', true);
          } else {
            gigyaraas.getVisibleScreen(response).find('.new-email-id-error').hide();
            gigyaraas.getVisibleScreen(response).find('.gigya-input-submit').prop('disabled', false);
          }
        };

        gigya.accounts.isAvailableLoginID(idParams);
      }
    });
    gigyaraas.registerAction('onAfterScreenLoad', 'change-email-removes-prefilled', function (response, config) {
      if (config.formType === 'change-email') {
        gigyaraas.getVisibleScreen(response).find("input[name='username']").val("");
        gigyaraas.getVisibleScreen(response).find('.new-email-id-error').hide();
      }
    });
    gigyaraas.registerAction('onLogout', 'trigger-sling-logout', function (response, config) {
      $('.logged-in form').submit();
      Cog.fireEvent('gigyaEventHandler', 'userProfileChanged');
    });
    gigyaraas.registerAction("onAfterSubmit", "finalize-registration", function (response, config, promise) {
      var regToken = cf.getParameterByName("regToken");

      if (regToken && response.response.errorCode === 0) {
        gigya.accounts.finalizeRegistration({
          regToken: regToken
        });
      }

      promise.resolve();
    });
    gigyaraas.registerAction('onAfterScreenLoad', 'sso-with-browser-tracking-prevention', function (response, config) {
      if (config.formType === 'login') {
        var selector = '.gigyaraas [data-resource-path="{{path}}"]'.replace("{{path}}", config.resourcePath),
            $container = $(selector);
        $container.find('.link-sign-in-sso-component').on('click', function () {
          gigya.sso.login();
        });
      }
    });
    gigyaraas.registerAction('onAfterScreenLoad', 'input-autocomplete-handler', function (response, config) {
      var selector = '.gigyaraas [data-resource-path="{{path}}"]'.replace("{{path}}", config.resourcePath),
          $container = $(selector);
      $container.find('.input-autocomplete-handler input').attr('autocomplete', 'one-time-code');
    });
  }
})(Cog.jQuery());