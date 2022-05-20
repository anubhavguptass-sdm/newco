"use strict";

if (typeof window.GSKTECH === 'undefined') {
  window.GSKTECH = {};
}

if (typeof window.GSKTECH.CF === 'undefined') {
  window.GSKTECH.CF = {};
}

window.GSKTECH.CF.visitorSyncUtil = function ($) {
  var instance,
      visitor = null,
      isVisitorLibAvailable = typeof Visitor !== 'undefined' && Visitor,
      obtainVisitor = function obtainVisitor() {
    $.ajax({
      // TODO: Avoid using async in scope of CF5-917
      async: false,
      url: window.location.pathname.replace('.html', '') + '.aamanagerconfig.json',
      success: function success(data) {
        var configModel = data.configurationModel;

        if (data.status === 200) {
          if (isVisitorLibAvailable && configModel.mangerIdSync && configModel.managerInstance && configModel.managerTrackingServer) {
            visitor = Visitor.getInstance(configModel.managerInstance, {
              trackingServer: configModel.managerTrackingServer
            });
          }
        }
      }
    });
  };

  function VisitorSyncUtil() {
    var visitorSyncUtil = {},
        syncId = function syncId(id, authState, npi) {
      if (npi) {
        visitor.setCustomerIDs({
          "UID": {
            "id": id,
            "authState": authState
          },
          "NPI": {
            "id": npi,
            "authState": authState
          }
        });
      } else {
        visitor.setCustomerIDs({
          "UID": {
            "id": id,
            "authState": authState
          }
        });
      }
    };

    visitorSyncUtil.syncByEmail = function (email, npi) {
      if (visitor) {
        $.ajax({
          // TODO: Avoid using sync in scope of CF5-917
          async: false,
          url: window.location.pathname.replace('.html', '') + '.uidlookup.json?email=' + email,
          success: function success(data) {
            if (data.uid) {
              syncId(data.uid, Visitor.AuthState.LOGGED_OUT, npi);
            }
          }
        });
      }
    };

    visitorSyncUtil.syncByUID = function (uid, npi) {
      if (visitor) {
        syncId(uid, Visitor.AuthState.AUTHENTICATED, npi);
      }
    };

    visitorSyncUtil.genericSync = function (name, id, authState) {
      if (visitor) {
        var customerIdObj = {};
        customerIdObj[name] = {};
        customerIdObj[name]["id"] = id;
        customerIdObj[name]["authState"] = authState;
        visitor.setCustomerIDs(customerIdObj);
      }
    };

    visitorSyncUtil.syncByGigyaResponse = function (response, npi) {
      if (response) {
        if (response.UID) {
          this.syncByUID(response.UID, npi);
        } else if (response.response && response.response.UID) {
          this.syncByUID(response.response.UID, npi);
        } else if (response.profile.email) {
          this.syncByEmail(response.profile.email, npi);
        }
      }
    };

    visitorSyncUtil.getVisitor = function () {
      return visitor;
    };

    return visitorSyncUtil;
  }

  return {
    getInstance: function getInstance() {
      isVisitorLibAvailable = typeof Visitor !== 'undefined' && Visitor;

      if (!visitor && isVisitorLibAvailable) {
        obtainVisitor();
      }

      if (!instance) {
        instance = new VisitorSyncUtil();
      }

      return instance;
    }
  };
}(Cog.jQuery());