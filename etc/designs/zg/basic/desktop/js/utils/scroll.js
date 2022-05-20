/**
 * Utils - Scroll
 * Smooth scrolling to components
 */

(function($) {
	"use strict";

	var api = {};

	api.init = function() {
		$(document).on("click", "a[href*=#]:not([href^=#])", function(e) {
			var target = this.hash;
			var $target = $("[id=" + target.substring(1) + "]").size() ?
				$("[id=" + target.substring(1) + "]") : $("[name=" + target.substring(1) + "]");

			if ($target.size() && window.location.origin + window.location.pathname + this.hash === this.href) {
				$("html, body").stop().animate({
					"scrollTop": $target.offset().top
				}, 800, function() {
					window.location.hash = target;
				});

				e.preventDefault();
			}
		});
	};

	Cog.registerStatic({
		name: "utils.scroll",
		api: api
	});
})(Cog.jQuery());