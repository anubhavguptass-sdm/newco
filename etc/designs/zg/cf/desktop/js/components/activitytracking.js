"use strict";

//activitytracking.js
(function ($) {
  'use strict';

  var api = {};

  api.onRegister = function (elements) {
    var element = elements.$scope;
    var activity = element.find(".trackingdata");
    var url = activity.data('url');
    var pagePath = activity.data('pagepath');
    var pageTitle = activity.data('pagetitle');
    var trackingEnabled = activity.data('tracking');
    var trackingConfig = {
      url: url,
      pagePath: pagePath,
      pageTitle: pageTitle
    };

    if (trackingEnabled === true) {
      Cog.component.videoEventTracker.turnOnTracking(trackingConfig);
      Cog.component.linkEventTracker.turnOnTracking(trackingConfig);
      Cog.component.submitEventTracker.turnOnTracking(trackingConfig);
    }
  };

  Cog.registerComponent({
    name: "activityTracking",
    selector: ".activityTracking",
    api: api
  });
})(Cog.jQuery());