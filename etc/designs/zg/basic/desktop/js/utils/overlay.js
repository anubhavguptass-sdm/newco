/**
 * Utils - Overlay
 */
(function($) {
	"use strict";

	var api = {},
		overlayContainer,
		overlayContent,
		overlayContentInner,
		overlayBackground,
		overlayLoading,
		overlayClose,
		mobileChecked = false,
		mobile = false,
		startingPositionTop = 100; //default top

	function Overlay(elem, url) {
		this.obj = elem;
		this.url = url;
		this.properties = {
			"href": $(elem).attr("href"),
			"width": $(elem).data("overlaywidth")
		};
	}

	Overlay.prototype.attachEvents = function() {
		var self = this,
			url = self.properties.href;

		if (!mobile) {
			url = this.url.setSelector(url, "lightbox");
		}

		$(self.obj).on("click", function(event) {
			event.preventDefault();
			event.stopPropagation();

			if (!mobile) {
				self.initOverlayContainer();
				self.showLoadingContainer();
			}

			self.visible = true;

			$.ajax({
				type: "GET",
				url: url,
				dataType: "html",
				success: function(response) {
					self.overlayBuilder(response);
					Cog.init({$element: overlayContentInner});
				}
			});
		});

		$(document)
			.on("click touchstart", ".overlay-content", function(event) {
				event.stopPropagation();
			})
			.on("click touchstart", ".overlay-background, .overlay-container, .overlay-close", function() {
				if (self.visible) {
					self.hideOverlay();
				}
			})
			.on("keydown", function(event) {
				if (event.keyCode === 27) {
					self.hideOverlay();
				}
			});
	};

	Overlay.prototype.initOverlayContainer = function() {
		var body = $("body"),
			overlayBackgroundHtml = "<div class='overlay-background'></div>",
			overlayContainerHtml = "<div class='overlay-container'>" +
				"<div class='overlay-content'>" +
				"<div tabindex='0' class='overlay-close'></div>" +
				"<div class='overlay-loading'></div>" +
				"<div class='overlay-content-inner'></div>" +
				"</div>" +
				"</div>";

		if (!overlayContainer) {
			body.append(overlayBackgroundHtml, overlayContainerHtml);
			overlayBackground = $(".overlay-background");
			overlayContainer = $(".overlay-container");
			overlayContent = $(".overlay-content");
			overlayContentInner = $(".overlay-content-inner");
			overlayLoading = $(".overlay-loading");
			overlayClose = $(".overlay-close");
		} else {
			overlayContentInner.empty();
		}
	};

	Overlay.prototype.showLoadingContainer = function() {
		overlayClose.hide();
		overlayBackground.show();
		overlayContainer.css({
			"top": $(window).scrollTop() + parseInt(startingPositionTop, 10) + "px"
		});
		overlayContainer.show();
		overlayLoading.show();
	};

	Overlay.prototype.overlayBuilder = function(response) {
		var self = this;

		if (mobile) {
			window.open(self.properties.href, "_blank");
		} else {
			self.showOverlay(response);
		}
	};

	Overlay.prototype.showOverlay = function(response) {
		var overlayWidth = this.properties.width;

		overlayLoading.hide();
		overlayClose.show();
		overlayContent.css({
			"width": "90%",
			"max-width": overlayWidth
		});
		overlayContentInner.append(response);
	};

	Overlay.prototype.hideOverlay = function() {
		overlayContainer.fadeOut();
		overlayBackground.fadeOut();

		if (this.visible) {
			this.visible = false;
			Cog.fireEvent("overlay", "close");
		}
	};

	function checkMobile() {
		var device = Cog.Cookie.read("device-group");
		return (device === "mobile");

	}

	api.onRegister = function(elements) {
		var self = this;
		if (!mobileChecked) {
			mobile = checkMobile();
			mobileChecked = true;
		}

		elements.$scope.each(function() {
			var overlay = new Overlay(this, self.external.url);
			overlay.attachEvents();
		});
	};

	Cog.registerComponent({
		name: "overlay",
		api: api,
		selector: "a.lightbox",
		requires: [
			{
				name: "utils.url",
				apiId: "url"
			}
		]
	});

})(Cog.jQuery());

