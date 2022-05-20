"use strict";

(function ($) {
  var api = {};

  api.handleMeetingStatus = function ($vmRegistrationContext, $meetings, fetchRegistrationStatusFromDms, $spinner) {
    var path = window.location.pathname.split('.')[0],
        meetingIds = [];

    if (!$spinner) {
      $spinner = $vmRegistrationContext.closest('.virtual-meeting-component').find('.virtual-meeting-spinner');
    }

    $.each($meetings, function (index, element) {
      if (!$(element).hasClass('meeting-entry--cancelled')) {
        meetingIds.push($(element).data('meetingId'));
      }
    });
    $.ajax({
      type: "GET",
      url: path + '.virtualMeetingRegistrationStatus.json',
      data: {
        'eventIds': JSON.stringify({
          'eventIds': meetingIds
        }),
        'fetchFromDms': fetchRegistrationStatusFromDms
      },
      dataType: 'json'
    }).done(function (data) {
      if (data.error === '') {
        var statusList = data.registrationStatusList;

        if (fetchRegistrationStatusFromDms) {
          statusList.forEach(function (status) {
            var $meeting = $vmRegistrationContext.find('.virtual-meeting-info[data-meeting-id="' + status.eventId + '"]');
            $meeting.find('.registration-section-item:not(.registration-section--cancelled)').hide();

            if (status.isRegistered) {
              $meeting.find('.registration-section-item.registration-section--registered').show();
            } else {
              $meeting.find('.registration-section-item.registration-section--register').show();
            }
          });
        } else {
          meetingIds.forEach(function (meetingId) {
            var $meeting = $vmRegistrationContext.find('.virtual-meeting-info[data-meeting-id="' + meetingId + '"]');
            $meeting.find('.registration-section-item:not(.registration-section--cancelled)').hide();
            $meeting.find('.registration-section-item.registration-section--register').show();
          });
        }

        Cog.fireEventAsync('virtualMeetingsStatusManager', 'vmh-status-fetch-completed-internal', {
          success: true,
          $scope: $vmRegistrationContext
        });
      } else if (data.error === 'unauthorized') {
        $('.registration-section-item:not(.registration-section--cancelled)').hide();
        $('.registration-section-item.registration-section--loginToRegister').show();
        Cog.fireEventAsync('virtualMeetingsStatusManager', 'vmh-status-fetch-completed-internal', {
          success: false,
          reason: data.error,
          $scope: $vmRegistrationContext
        });
      } else {
        Cog.fireEventAsync('virtualMeetingsStatusManager', 'vmh-status-fetch-completed-internal', {
          success: false,
          reason: data.error,
          $scope: $vmRegistrationContext
        });
      }

      $spinner.hide();
      $vmRegistrationContext.removeClass('virtual-meeting-content--initializing');
    });
  };

  Cog.registerStatic({
    name: 'virtualMeetingsStatusManager',
    api: api,
    sharedApi: api
  });
})(Cog.jQuery());