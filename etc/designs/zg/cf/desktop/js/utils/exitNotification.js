"use strict";

(function ($) {
  "use strict";

  var api = {},
      hiddenClass = "is-hidden",
      anchorClickEvent,
      alreadyProcessed = false;

  function openDialog(event) {
    //CF5-1069 - when clicking accept button, the behavior is default and rel-noopener and rel-noreferred are passed
    if (alreadyProcessed) {
      alreadyProcessed = false;
      return true;
    } else {
      anchorClickEvent = $.extend({}, event);
      api.scope.removeClass(hiddenClass);
      return false;
    }
  }

  function acceptButton() {
    alreadyProcessed = true;
    anchorClickEvent.target.click();
    api.scope.addClass(hiddenClass);
  }

  function denyButton() {
    api.scope.addClass(hiddenClass);
  }

  api.init = function (scope) {
    api.scope = scope;
    api.scope.find(".exit-notification-accept").click(acceptButton);
    api.scope.find(".exit-notification-deny").click(denyButton);
    $("body").on("click", "a.external", openDialog);
  };

  Cog.register({
    name: "exitNotification",
    api: api,
    selector: "#exit-notification"
  });
})(Cog.jQuery());