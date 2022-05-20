"use strict";

(function ($) {
  var api = {};

  api.init = function () {
    Cog.addListener('virtualMeetingRegistrationHandler', 'vmh-registration-completed-internal', function (data) {
      var eventData = data.eventData,
          $component = eventData.$scope.closest('.virtual-meeting-registration-context'),
          registrationSuccessPage = $component.data('registrationSuccessPage'),
          registrationFailedPage = $component.data('registrationFailurePage');

      if (eventData.success) {
        if (registrationSuccessPage) {
          window.location = registrationSuccessPage;
        } else {
          var registerButtons = $component.find('.virtual-meeting-info[data-meeting-id="' + eventData.eventId + '"]').find('.section--registerButton');
          registerButtons.find('.registration-section--register').hide();
          registerButtons.find('.registration-section--registered').show();
          $component.trigger('vmh-registration-success', eventData.eventId);
        }
      } else {
        if (registrationFailedPage) {
          window.location = registrationFailedPage;
        } else {
          $component.trigger('vmh-registration-failure', eventData.eventId, eventData.reason);
        }
      }
    });
    Cog.addListener('virtualMeetingsStatusManager', 'vmh-status-fetch-completed-internal', function (data) {
      var eventData = data.eventData,
          $component = eventData.$scope;

      if (eventData.success) {
        $component.trigger('vmh-status-fetch-success');
      } else {
        $component.trigger('vmh-status-fetch-failure', eventData.reason);
      }
    });
  };

  Cog.registerStatic({
    name: 'dmsResponseHandler',
    api: api
  });
})(Cog.jQuery());