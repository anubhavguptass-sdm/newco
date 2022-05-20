/**
 * Video
 */

(function() {
	"use strict";

	var api = {},
		features = [
			"playpause",
			"progress",
			"current",
			"duration",
			"tracks",
			"volume",
			"fullscreen"
		];

	function Video($el) {
		this.$el = $el;
		this.$video = $el.find("video");
		this.imageAlt = $el.find(".component-content").data("imagealt");

		this.initialize();
		this.bindEvents();
	}

	Video.prototype = {
		initialize: function() {
			this.$video.mediaelementplayer({
				features: api.external.status.isAuthor() ? _.without(features, "progress", "current", "duration") : features,
				enableAutosize: false,
				plugins: ["flash", "youtube"],
				pluginPath: api.external.settings.themePath + "/assets/swf/",
				flashName: "flashmediaelement.swf",
				videoHeight: this.$video.attr("height"),
				success: this.onMejsSuccess.bind(this)
			});
		},

		bindEvents: function() {
			Cog.addListener("overlay", "close", this.onOverlayClose, {scope: this, disposable: true});
		},

		onOverlayClose: function() {
			if (this.$el.parents(".overlay-container").size()) {
				this.mediaElement.stop();
				this.mediaElement.remove();
				Cog.finalize(this.$el);
			}
		},

		onMejsSuccess: function(mediaElement) {
			this.mediaElement = mediaElement;
			var image = this.$el.find(".mejs-poster > img")[0];
			if (image) {
				image.alt = this.imageAlt;
			}
		}
	};

	api.onRegister = function(scope) {
		new Video(scope.$scope);
	};

	Cog.registerComponent({
		name: "videoplayer",
		api: api,
		selector: ".video",
		requires: [
			{
				name: "utils.settings",
				apiId: "settings"
			},
			{
				name: "utils.status",
				apiId: "status"
			}
		]
	});
})();
