"use strict";

(function ($) {
  'use strict';

  var api = {};

  api.onRegister = function (element) {
    var $component = element.$scope,
        $meetings = $component.find('.meeting-list-entry'),
        meetingStatusManager = api.external.meetingStatusManager,
        meetingListFilter = api.external.meetingListFilter,
        appliedTimeFilter = $component.find('.meeting-list-content').data('timeFilter'),
        $vmRegistrationContext = $component.find('.virtual-meeting-registration-context'),
        fetchStatusFromDms = $vmRegistrationContext.data('fetchRegistrationStatus');
    meetingListFilter.getPastMeetings($meetings).each(function (index, meeting) {
      $(meeting).find('.section--registerButton:first .meeting-registration-button.virtual-meeting-registration-trigger').addClass('meeting-registration-button--disabled');
    });

    if (appliedTimeFilter === 'upcoming') {
      meetingListFilter.hidePastMeetings($meetings);
    } else if (appliedTimeFilter === 'past') {
      meetingListFilter.hideUpcomingMeetings($meetings);
    }

    meetingStatusManager.handleMeetingStatus($vmRegistrationContext, $meetings, fetchStatusFromDms);
  };

  Cog.registerComponent({
    name: 'virtualMeetingList',
    api: api,
    sharedApi: api,
    selector: '.virtualMeetingList',
    requires: [{
      name: 'virtualMeetingsStatusManager',
      apiId: 'meetingStatusManager'
    }, {
      name: 'virtualMeetingListFilter',
      apiId: 'meetingListFilter'
    }]
  });
  return api;
})(Cog.jQuery());