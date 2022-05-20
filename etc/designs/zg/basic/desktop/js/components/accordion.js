/**
 * Accordion
 */

(function($) {
	"use strict";

	var api = {};

	api.onHeaderClick = function() {
		var $this = $(this),
			$headParent = $this.parent();

		$headParent.toggleClass("is-active");
	};

	api.onRegister = function(element) {
		var $this = element.$scope;

		$this.on("click", "> div > ul > .accordion-slide > .accordion-head", api.onHeaderClick);
		$this.on("click", "> div > ul > .accordion-slide > .accordion-head > .accordion-title > a", function(e) {
			e.preventDefault();
		});
	};

	Cog.registerComponent({
		name: "accordion",
		api: api,
		selector: ".accordion"
	});
})(Cog.jQuery());
