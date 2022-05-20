"use strict";

(function ($) {
  'use strict';

  var api = {};

  api.onRegister = function (element) {
    var $component = element.$scope.find('.virtual-meeting-registration-context'),
        statusManager = api.external.statusManager,
        $meeting = $component.find('.virtual-meeting-info'),
        $spinner = $(document).find('.virtual-meeting-spinner'),
        fetchStatusFromDms = $component.data('fetchRegistrationStatus');
    statusManager.handleMeetingStatus($component, $meeting, fetchStatusFromDms, $spinner);
  };

  Cog.registerComponent({
    name: 'virtualMeetingRegistration',
    api: api,
    selector: '.virtualMeetingRegistration',
    requires: [{
      name: 'virtualMeetingsStatusManager',
      apiId: 'statusManager'
    }]
  });
  return api;
})(Cog.jQuery());