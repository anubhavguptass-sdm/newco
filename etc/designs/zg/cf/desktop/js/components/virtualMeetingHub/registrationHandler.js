"use strict";

(function ($) {
  var api = {};

  api.onRegister = function (element) {
    var $component = element.$scope;
    $component.on('click', function (event) {
      event.preventDefault();
      var $meetingInfo = $(event.target).closest('.virtual-meeting-info'),
          eventId = $meetingInfo.data('meetingId'),
          platform = $meetingInfo.data('platform'),
          providerName = $meetingInfo.data('providerName'),
          spotMeWorkspaceId = $meetingInfo.data('spotMeWorkspaceId');

      if (eventId && platform && providerName) {
        api.registerToEvent(eventId, platform, providerName, spotMeWorkspaceId, $component);
      }
    });
  };

  api.registerToEvent = function (eventId, platform, providerName, spotMeWorkspaceId, $component) {
    var $spinner = $(document).find('.virtual-meeting-spinner'),
        path = window.location.pathname.split('.')[0],
        csrfToken = cf.csrfToken;

    if (!csrfToken) {
      cf.refreshToken();
      csrfToken = cf.csrfToken;
    }

    $spinner.show();
    $.ajax({
      type: "POST",
      url: path + '.virtualMeetingRegistration.json',
      data: {
        ':cq_csrf_token': csrfToken,
        'eventId': eventId,
        'platform': platform,
        'providerName': providerName,
        'spotMeWorkspaceId': spotMeWorkspaceId
      },
      dataType: 'json',
      success: function success(data) {
        if (data.status === 200 && data.eventRegistrationResponseModel.statusCode === 200) {
          Cog.fireEventAsync('virtualMeetingRegistrationHandler', 'vmh-registration-completed-internal', {
            eventId: eventId,
            success: true,
            $scope: $component
          });
        } else {
          Cog.fireEventAsync('virtualMeetingRegistrationHandler', 'vmh-registration-completed-internal', {
            eventId: eventId,
            success: false,
            reason: data.error || data.eventRegistrationResponseModel.statusReason,
            $scope: $component
          });
        }
      },
      complete: function complete() {
        $spinner.hide();
      }
    });
  };

  Cog.registerComponent({
    name: 'virtualMeetingRegistrationHandler',
    api: api,
    sharedApi: api,
    selector: '.virtual-meeting-registration-trigger'
  });
})(Cog.jQuery());