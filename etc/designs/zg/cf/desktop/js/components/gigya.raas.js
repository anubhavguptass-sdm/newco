"use strict";

var gigyaraas = function ($) {
  'use strict';

  var api = {},
      log = cf.getLogger('gigya-raas'),
      initialConfig = {
    datastorePattern: 'data.ds.',
    veevaBuId: '',
    allowLoginStatus: true,
    consentArray: [],
    lookUpValidationStatus: 'not-started',
    trailcount: 0,
    showpanel: 0,
    isFirst: true,
    registrationStatus: 'not-started',
    loginMethod: 'default',
    consentCount: 0,
    profileAlterCnt: 0,
    CRMIDValue: ''
  };
  var onExecuteLoginCallbacks = [],
      executionStack = [];
  api.actions = [];

  api.onRegister = function (element) {
    if (typeof gigya !== 'undefined') {
      var initialConfigClone = $.extend(true, {}, initialConfig),
          $component = element.$scope,
          componentId = $component.data('componentId'),
          pageReload = $component.data('pageReload'),
          emptyResource = $component.data('emptyResource'),
          gigyaParams = {},
          localConfig = $.extend(true, initialConfigClone, $component.data());
      gigyaParams.screenSet = localConfig.screenSet;
      gigyaParams.mobileScreenSet = localConfig.mobileScreenSet;
      gigyaParams.startScreen = localConfig.startScreen;
      gigyaParams.containerID = localConfig.componentId;
      gigyaParams.customLang = window.gigyaCustomLang[gigyaParams.containerID];

      if (typeof localConfig.lang === 'undefined' || localConfig.lang === 'master') {
        gigyaParams.lang = 'default';
      } else {
        gigyaParams.lang = localConfig.lang;
      }

      if (localConfig.formType === 'login') {
        gigyaParams.customButtons = api.buildCustomButtons(localConfig);
      } //event handlers


      gigyaParams.onError = api.onError;
      gigyaParams.onBeforeSubmit = api.onBeforeSubmit;
      gigyaParams.onSubmit = api.onSubmit;
      gigyaParams.onBeforeValidation = api.onBeforeValidation;
      gigyaParams.onAfterSubmit = api.onAfterSubmit;
      gigyaParams.onBeforeScreenLoad = api.onBeforeScreenLoad;
      gigyaParams.onAfterScreenLoad = api.onAfterScreenLoad;
      gigyaParams.onFieldChanged = api.onFieldChanged;
      gigyaParams.onHide = api.onHide;
      gigyaParams.context = localConfig;
      gigyaParams.context.componentId = componentId;
      gigyaParams.context.pageReload = pageReload;
      gigyaParams.context.emptyResource = emptyResource;
      api.initializeGigyaScreens(gigyaParams, $component, localConfig);
    } else if (console && console.warn) {
      console.warn('Gigya is not defined!');
    }
  };

  api.initializeGigyaScreens = function (screensetParams, $component, config) {
    var regToken = cf.getParameterByName("regToken");

    if (regToken) {
      screensetParams.regToken = regToken;
    }

    if (config.screensetMethod === 'staticCacheScreenset') {
      $component.append('<style>' + config.screensetCache.css + '</style>' + '<div style="display:none;">' + config.screensetCache.html + '</div>');
      var translationValue = config.screensetCache.translations[screensetParams.lang];

      if (!translationValue) {
        translationValue = config.screensetCache.translations['default'];
      }

      screensetParams.customLang = $.extend(screensetParams.customLang, translationValue);
    }

    var formLink = $component.find('a.gigya-raas-link');

    if (formLink.length > 0) {
      formLink.click(function (e) {
        e.preventDefault();
        delete screensetParams.containerID;
        screensetParams.context.overlayMode = true;
        gigya.accounts.showScreenSet(screensetParams);
      });
    }

    gigya.accounts.showScreenSet(screensetParams);
  };

  api.getVisibleScreen = function (response) {
    var contextData = response.context,
        $component = $('div[data-component-id="' + response.context.componentId + '"]'),
        $visibleScreen;

    if (contextData.overlayMode) {
      $visibleScreen = $('#gigya-screen-dialog-page-overlay').parent();
    } else {
      $visibleScreen = $component.find('#' + contextData.componentId);
    }

    return $visibleScreen;
  };

  api.getComponent = function (response) {
    return $('div[data-component-id="' + response.context.componentId + '"]');
  };

  api.buildCustomButtons = function (config) {
    var customButtonArray = [],
        idpConfigs = config.idpConfigs;

    if (idpConfigs) {
      $.each(idpConfigs, function (index, element) {
        if (element.idpName) {
          var customButtonValues = {};
          customButtonValues.type = element.loginType;
          customButtonValues.providerName = element.providerName;
          customButtonValues.idpName = element.idpName;
          customButtonValues.iconURL = element.iconURL;
          customButtonValues.logoURL = element.logoURL;
          customButtonValues.lastLoginIconURL = element.lastLoginIconURL;
          customButtonValues.position = element.position;
          customButtonArray.push(customButtonValues);
        }
      });
    }

    return customButtonArray;
  };

  api.onError = function (response) {
    var onErrorActions = api.getActions('onError'),
        config = response.context;
    onErrorActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onBeforeSubmit = function (response) {
    var ret = true,
        beforeActions = api.getActions('onBeforeSubmit'),
        config = response.context;
    beforeActions.forEach(function (action, index) {
      executionStack.push({
        response: response,
        config: config
      });
      var returnval = action.callFunction.call(this, response, config, null, index);
      executionStack.pop();

      if (typeof returnval === 'undefined') {
        returnval = true;
      }

      ret = returnval && ret;
    });
    return ret;
  };

  api.onSubmit = function (response) {
    var onSubmitActions = api.getActions('onSubmit'),
        config = response.context;
    onSubmitActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onBeforeValidation = function (response) {
    var onBeforeValidationActions = api.getActions('onBeforeValidation'),
        config = response.context,
        result = {};

    for (var i = 0; i < onBeforeValidationActions.length; i++) {
      executionStack.push({
        response: response,
        config: config
      });
      var partialResult = onBeforeValidationActions[i].callFunction.call(this, response, config);
      executionStack.pop();

      if (partialResult) {
        Object.assign(result, partialResult);
      }
    }

    return result;
  };

  api.onAfterSubmit = function (response) {
    //optional functions
    var optionalAfterActions = api.getActions('optionalOnAfterSubmit'),
        afterActions = api.getActions('onAfterSubmit'),
        returns = [],
        config = response.context,
        onAllAfterActionsCalledDfrd = $.Deferred();
    optionalAfterActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
    afterActions.forEach(function (action) {
      returns.push($.Deferred(function (dfrd) {
        executionStack.push({
          response: response,
          config: config
        });
        action.callFunction.call(this, response, config, dfrd, onAllAfterActionsCalledDfrd);
        executionStack.pop();
      }));
    });
    $.when.apply(window, returns).then(onAllAfterActionsCalledDfrd.resolve).then(function () {
      if (config.formType === 'registration') {
        if (response.response.isRegistered && !config.emailVerification || response.response.isRegistered && response.response.isVerified && config.emailVerification) {
          response.response.context.registrationStatus = 'complete';
          api.loginEventHandler(response);
        }
      } else {
        api.redirect(response);
      }
    });
  };

  api.redirect = function (response) {
    if (response.context.resource && response.response.status === 'OK' && !(response.context.formType === 'registration' && response.context.autoLogin !== true) && response.context.formType !== 'login' && response.context.formType !== 'event-registration' && !response.context.emptyResource) {
      window.location.pathname = response.context.resource;
    }
  };

  api.onBeforeScreenLoad = function (response) {
    var onBeforeScreenLoadActions = api.getActions('onBeforeScreenLoad'),
        config = response.context;
    onBeforeScreenLoadActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onAfterScreenLoad = function (response) {
    var onAfterScreenLoadActions = api.getActions('onAfterScreenLoad'),
        config = response.context;

    if (response.context.formType === 'registration') {
      response.context.loginMethod = 'registration';
    }

    onAfterScreenLoadActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
    response.context.isFirst = false;

    if (response.context.registrationPage) {
      var registrationLinkId = 'a[href$=\"' + response.context.registrationPage + '.html\"]',
          mappedRegistrationLinkId = 'a[href$=\"' + response.context.registrationPageMapping + '.html\"]';
      $(registrationLinkId).add(mappedRegistrationLinkId).click(function (e) {
        e.originalEvent.currentTarget.href += "?resource=" + encodeURIComponent(response.context.resource);
      });
    }
  };

  api.onFieldChanged = function (response) {
    var onFieldChangedActions = api.getActions('onFieldChanged'),
        config = response.context;
    onFieldChangedActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onHide = function (response) {
    var onHideActions = api.getActions('onHide'),
        config = response.context;
    onHideActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onLogin = function (response) {
    var onLoginActions = api.getActions('onLogin'),
        config = response.context;
    onLoginActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.onLogout = function (response) {
    var onLogoutActions = api.getActions('onLogout'),
        config = response.context;
    onLogoutActions.forEach(function (action) {
      executionStack.push({
        response: response,
        config: config
      });
      action.callFunction.call(this, response, config);
      executionStack.pop();
    });
  };

  api.getActions = function (type) {
    return _.filter(api.actions, function (o) {
      return o.type === type;
    });
  };

  api.registerAction = function (type, name, func) {
    var gigyaAction = {};
    gigyaAction.callFunction = func;
    gigyaAction.type = type;
    gigyaAction.name = name;
    api.actions.push(gigyaAction);
  };

  api.logoutEventHandler = function (response) {
    api.onLogout(response);
  };

  api.onExecuteLogin = function (callback) {
    if (_.isFunction(callback)) {
      onExecuteLoginCallbacks.push(callback);
    }
  };

  api.executeLogin = function (response) {
    api.onLogin(response);

    if (!response.context.resource) {
      response.context.resource = $('.userBox input[name="resource"]').val() || window.location.pathname;
    }

    var modifiedResponse = {};
    modifiedResponse.UID = response.UID;
    modifiedResponse.UIDSignature = response.UIDSignature;
    modifiedResponse.signatureTimestamp = response.signatureTimestamp;
    modifiedResponse.remember = response.remember;
    var securityPath = window.location.pathname.split(".")[0];
    securityPath = securityPath.slice(-1) !== "/" ? securityPath += "/" : securityPath;
    var queryString = window.location.search.slice(1);
    var queryArray = queryString.split("&");
    var updatedQueryString = "";

    for (var i = 0; i < queryArray.length; i++) {
      var element = queryArray[i];

      if (element.indexOf("resource=") === -1) {
        updatedQueryString += "&" + element;
      }
    }

    if (updatedQueryString) {
      updatedQueryString = updatedQueryString.slice(1);

      if (response.context.resource.indexOf('?') === -1) {
        if (updatedQueryString.charAt(0) !== "?") {
          updatedQueryString = "?" + updatedQueryString;
        }
      } else if (updatedQueryString.charAt(0) !== "&") {
        updatedQueryString = "&" + updatedQueryString;
      }
    }

    securityPath += "j_security_check?resource=" + encodeURIComponent(response.context.resource + updatedQueryString);
    Cog.fireEvent('gigyaEventHandler', 'userProfileChanged', response);
    $.ajax({
      type: 'POST',
      dataType: 'json',
      async: false,
      url: securityPath,
      data: {
        'data': modifiedResponse
      },
      complete: function complete(res) {
        try {
          res = JSON.parse(res.responseText) || {}; // response data has to be an object
          // callbacks

          _.each(onExecuteLoginCallbacks, function (callback) {
            if (_.isFunction(callback)) {
              try {
                // do not trust external callbacks - try-catch
                callback(res);
              } catch (err) {
                console.error('gigya.raas executeLogin callback fail', err);
              }
            }
          }); // URL management


          if (!response.context.emptyResource && !response.context.pageReload) {
            // redirect to 'after login' page
            if (window.location.pathname !== res.redirectTarget) {
              window.location.href = res.redirectTarget;
            }
          } else if (response.context.pageReload) {
            // reload page
            location.reload();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  api.loginEventHandler = function (response) {
    if (response.eventName === 'afterSubmit') {
      response = response.response;
    }

    if (typeof response.context === 'undefined') {
      var initialConfigClone = $.extend(true, {}, initialConfig);
      response.context = $.extend(true, initialConfigClone, $('.gigya-raas[data-form-type="login"]').data());
    }

    if (response.context.loginMethod === 'default' && response.context.formType === 'login') {
      //allow j_security_check only if login was executed from a login form
      api.executeLogin(response);
    }

    if (response.context.loginMethod === 'registration' && response.context.registrationStatus === 'complete') {
      if (response.context.allowLogin) {
        api.executeLogin(response);
      } else if (response.context.allowLoginStatus) {
        api.executeLogin(response);
      }
    }
  };

  api.getParameterByName = function (name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  api.getCurrentContext = function () {
    return executionStack.length <= 0 ? null : executionStack[executionStack.length - 1];
  };

  var shared = api; // TODO separate internal api from shared api, i.e. onRegister shall not be shared (yet it is by line "return api")

  Cog.registerComponent({
    name: 'gigyaraas',
    api: api,
    selector: '.gigya-raas',
    sharedApi: shared
  });
  return shared;
}(Cog.jQuery());

(function ($) {
  "use strict";

  if (typeof gigya !== 'undefined') {
    gigya.accounts.addEventHandlers({
      onLogin: gigyaraas.loginEventHandler,
      onLogout: gigyaraas.logoutEventHandler
    });
    $(window).on('load', function () {
      $('body > iframe[src*="/gs/webSdk/Api.aspx?apiKey="]').attr('title', 'Customer Identity and Access Management Service');
    });
  } else if (console && console.warn) {
    console.warn('Gigya is not defined!');
  }
})(Cog.jQuery());