/* CF JS - v1.0.0 */
var cf = (function (document, $, _) {
  'use strict';
  var api = {};

  api.utils = {};

  api.logLevel = Cog.Cookie.read('logLevel');

  api.csrfToken = '';

  /**
   *** CSRF Token Implementation
   **/
  api.loadCsrfToken = function (cssSelector) {
      $.get(window.location.pathname.split('.')[0] + '.token.json').done(function (json) {
          var csrfToken = '';
          if (json.token) {
              csrfToken = json.token;
          }
          $(cssSelector).append('<input id="cq_csrf_token" name=":cq_csrf_token" type="hidden" value="' + csrfToken + '"/>');
      });
  };

  api.refreshToken = function () {
      $.get(window.location.pathname.split('.')[0] + '.token.json').done(function (response) {
          $('form').each(function () {
              //check to not apply csrf token to gigya based forms
              if (!$(this).parent().hasClass('gigya-screen') && $(this).attr('method') && $(this).attr('method').toLowerCase !== "get") {
                  if ($(this).find('input[name=":cq_csrf_token"]').length > 0) {
                      $(this).find('input[name=":cq_csrf_token"]').val(response.token);
                  } else {
                      $(this).append('<input name=":cq_csrf_token" type="hidden" value="' + response.token + '"/>');
                  }
              }
          });
          api.csrfToken = response.token;
      });
  };

  api.utils.browser = (function () {
      var matched, browser,
          uaMatch = function (ua) {
              ua = ua.toLowerCase();

              var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                  /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                  /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                  /(msie) ([\w.]+)/.exec(ua) ||
                  ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

              return {
                  browser: match[1] || "",
                  version: match[2] || "0"
              };
          };

      matched = uaMatch(navigator.userAgent);
      browser = {};

      if (matched.browser) {
          browser[matched.browser] = true;
          browser.version = matched.version;
      }

      // Chrome is Webkit, but Webkit is also Safari.
      if (browser.chrome) {
          browser.webkit = true;
      } else if (browser.webkit) {
          browser.safari = true;
      }
      return browser;
  }());

  api.getGigyaValue = function (response, key) {
      var value = '',
          keyPath = key.split('.'),
          pointer = response;
      keyPath.forEach(function (currentKey) {
          if (typeof pointer[currentKey] === 'object') {
              pointer = pointer[currentKey];
          } else if (typeof pointer[currentKey] !== 'undefined' && pointer[currentKey] !== '') {
              value = pointer[currentKey];
          }
      });
      return value;
  };

  //loggers
  function Logger(name) {
      this.component = name;
      this.error = function (msg) {
          if (api.logLevel > 0) {
              console.info('Component : ' + this.component);
              console.error(msg);
          }
      };
      this.warn = function (msg) {
          if (api.logLevel > 1) {
              console.info('Component : ' + this.component);
              console.warn(msg);
          }
      };
      this.info = function (msg) {
          if (api.logLevel > 2) {
              console.info('Component : ' + this.component);
              console.info(msg);
          }
      };
  }

  api.setLogLevel = function (level) {
      api.logLevel = level;
      Cog.Cookie.create('logLevel', level);
  };

  api.getLogger = function (name) {
      return new Logger(name);
  };

  api.refreshToken();

  setInterval(function () {
      api.refreshToken();
  }, 300 * 1000); //5 mins

  api.getParameterByName = function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
          results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

  api.getSiteLocale = function () {
      var localePath;
      var windowPathName = window.location.pathname;
      if (windowPathName.indexOf('/content') === 0) {
          localePath = windowPathName.split('/')[4];
          localePath = localePath.replace('_', '-');
      } else {
          localePath = windowPathName.split('/')[1];
      }
      if (/^[A-Za-z]{2}-[A-Za-z]{2}$/.test(localePath)) {
          return localePath.toLowerCase();
      } else {
          return '';
      }
  };

  api.getPagePath = function () {
      return window.location.pathname.split('.')[0];
  };

  return api;

}(document, Cog.jQuery(), _));

(function ($) {
  'use strict';
  $('.sso-link .richText-content a').click(function (e) {
      e.preventDefault();
      var element = $(this),
          currentHref = $(this).attr('href');
      gigya.accounts.getAccountInfo({
          callback: function (data) {
              currentHref += '?data[UID]=' + data.UID + '&data[UIDSignature]=' + data.UIDSignature + '&data[signatureTimestamp]=' + data.signatureTimestamp + '&sso=true';
              window.location.href = currentHref;
          }
      });
  });

  $('.external-link a').click(function (e) {
      e.preventDefault();
      var element = $(this),
          currentHref = $(this).attr('href');
      gigya.accounts.getAccountInfo({
          callback: function (data) {
              _.forEach(element.data(), function (value, key) {
                  if (currentHref.indexOf('?') === -1) {
                      currentHref += '?' + key + '=' + cf.getGigyaValue(data, value);
                  } else {
                      currentHref += '&' + key + '=' + cf.getGigyaValue(data, value);
                  }
              });
              window.location.href = currentHref;
          }
      });
  });

}(Cog.jQuery()));
