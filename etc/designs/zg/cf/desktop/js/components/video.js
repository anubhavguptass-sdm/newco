"use strict";

(function ($) {
  var api = {},
      features = ["playpause", "progress", "current", "duration", "tracks", "volume", "fullscreen"],
      eventsToTrack = ["play", "pause", "ended", "progress"],
      progressPercentsToTrack = [25, 50, 75],
      dataGzgEvent,
      dataGzgscEvent,
      dataBrandId,
      dataTrackingName;

  api.eventHandler = function (element) {
    var $videocontainer = $(element).parents(".video.component").find(".video-video-container"),
        elementAttrs = {},
        title = $(element).parents(".video.component").find(".video-heading").text(),
        src = element.getAttribute("src");
    elementAttrs.dataGzgEvent = $videocontainer.data("gzgevent");
    elementAttrs.dataGzgscEvent = $videocontainer.data("gzgscevent");
    elementAttrs.dataBrandId = $videocontainer.data("brandid");
    elementAttrs.dataTrackingName = $videocontainer.data("trackingname");
    elementAttrs.elementTitle = title;
    elementAttrs.elementSrc = /([^/]+$)/.exec(src)[0];

    for (var i = 0; i < eventsToTrack.length; i++) {
      if (eventsToTrack[i] === "progress") {
        api.progressEventsAttacher(element, elementAttrs);
      } else {
        element.addEventListener(eventsToTrack[i], function (e) {
          api.fireVideoEvent(elementAttrs, e);
        });
      }
    }
  };

  api.fireVideoEvent = function (elementAttrs, e, progressValue) {
    var eventType = e.type,
        gzgEvent = elementAttrs.dataGzgEvent,
        gzgscEvent = elementAttrs.dataGzgscEvent,
        brandId = elementAttrs.dataBrandId,
        trackingName = elementAttrs.dataTrackingName;

    if (progressValue) {
      eventType += progressValue;
    }

    if (typeof trackingName != "undefined" && trackingName != null && trackingName != "") {
      Cog.fireEvent("videoEventTracker", "eventToTrack", _.extend({
        eventType: eventType,
        gzgEvent: gzgEvent,
        gzgscEvent: gzgscEvent,
        brandId: brandId,
        trackingName: trackingName
      }, elementAttrs));
    }
  };

  api.createProgressBreakpoints = function () {
    var progressBreakpoints = [];

    for (var i = 0; i < progressPercentsToTrack.length; i++) {
      progressBreakpoints.push({
        progress: progressPercentsToTrack[i]
      });
    }

    return progressBreakpoints;
  };

  api.progressEventsAttacher = function (element, elementAttrs) {
    var progressBreakpoints = api.createProgressBreakpoints();
    element.addEventListener("timeupdate", function (e) {
      var videoPlayed = parseInt(element.currentTime / element.duration * 100);

      for (var i = 0; i < progressBreakpoints.length; i++) {
        if (videoPlayed > progressBreakpoints[i].progress) {
          fireVideoEvent(elementAttrs, e, progressBreakpoints[i].progress);
          api.progressBreakpoints.splice(i, 1);
        }
      }
    });
  };

  function Video($el) {
    var $videoContainer = $el.find(".video-video-container");
    this.$el = $el;
    this.$video = $el.find("video");
    this.imageAlt = $el.find(".component-content").data("imageAlt");
    dataGzgEvent = $videoContainer.data("gzgevent");
    dataGzgscEvent = $videoContainer.data("gzgscevent");
    dataBrandId = $videoContainer.data("brandid");
    dataTrackingName = $videoContainer.data("trackingname");
    var videoType = $el.find(".video-video-container").data("videoType");

    if (videoType === "video360" || videoType === "hls") {
      var playerVideojs = videojs(this.$video[0]);

      if (videoType === "video360") {
        playerVideojs.mediainfo = playerVideojs.mediainfo || {};
        playerVideojs.mediainfo.projection = "360";
        playerVideojs.vr({
          projection: "AUTO",
          debug: false
        });
        playerVideojs.posterImage.off(["click", "tap"]);
        playerVideojs.bigPlayButton.off("click", "tap");
        playerVideojs.posterImage.on(["click", "tap"], function () {
          initMotionRequest();
          playerVideojs.posterImage.handleClick();
        });
        playerVideojs.bigPlayButton.on(["click", "tap"], function () {
          initMotionRequest();
          playerVideojs.bigPlayButton.handleClick();
        });
      }
    } else {
      if (mejs.i18n.locale.strings.en) {
        var ariaLabel = $videoContainer.data("roleLabel");
        mejs.i18n.locale.strings.en["mejs.video-player"] = ariaLabel ? ariaLabel : "Video Player";
      }

      this.initialize();
      this.bindEvents();
    }
  }

  function initMotionRequest() {
    try {
      DeviceMotionEvent.requestPermission().then(function (response) {
        if (response === "granted") {
          window.addEventListener("devicemotion", function (e) {
            console.info("Access granted!");
          });
        }
      });
    } catch (e) {
      console.warn("Motion and acceleration are not supported.");
    }
  }

  Video.prototype = {
    initialize: function initialize() {
      this.$video.mediaelementplayer({
        classPrefix: "mejs-",
        // CF-608 added for newer MediaElement readiness
        features: api.external.status.isAuthor() ? _.without(features, "progress", "current", "duration") : features,
        enableAutosize: false,
        plugins: ["youtube"],
        videoHeight: this.$video.attr("height"),
        success: this.onMejsSuccess.bind(this)
      });
    },
    bindEvents: function bindEvents() {
      Cog.addListener("overlay", "close", this.onOverlayClose, {
        scope: this,
        disposable: true
      });
    },
    onOverlayClose: function onOverlayClose() {
      if (this.$el.parents(".overlay-container").length) {
        this.mediaElement.stop();
        this.mediaElement.remove();
        Cog.finalize(this.$el);
      }
    },
    onMejsSuccess: function onMejsSuccess(mediaElement) {
      this.mediaElement = mediaElement;
      var image = this.$el.find(".mejs-poster > img")[0];

      if (image) {
        image.alt = this.imageAlt;
      } //fix for NaN in aria-valuemax as it is set before video metadata is available


      $(this.mediaElement).on("loadedmetadata", function (e) {
        var $slider = $(e.target).closest(".mejs-inner").find(".mejs-time-slider");
        $slider.attr("aria-valuemax", e.target.duration);
      });
      api.eventHandler(mediaElement);
    }
  };

  api.onRegister = function (scope) {
    new Video(scope.$scope);
  };

  Cog.registerComponent({
    name: "videoplayer",
    api: api,
    selector: ".video",
    requires: [{
      name: "utils.settings",
      apiId: "settings"
    }, {
      name: "utils.status",
      apiId: "status"
    }]
  });
})(Cog.jQuery());