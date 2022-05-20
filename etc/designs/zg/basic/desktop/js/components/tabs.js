/**
 * Tabs component - desktop/js-component/component.tabs.js
 */

(function($) {
	"use strict";

	var api = {
		tabs: []
	};

	function Tab($scope) {
		this.$scope = $scope;
		this.init();
		this.bindEvents();
	}

	Tab.prototype.init = function() {
		var $this = this.$scope;
		this.$contents = $this.find("> .component-content > .tabs-content");
		this.$contents.addClass("is-hidden");
		this.isVertical = $this.hasClass("tabs-vertical");
	};

	Tab.prototype.bindEvents = function() {

		function activateTab(event) {
			var $tab = $(event.currentTarget),
				newPanel;
			self.$contents.addClass("is-hidden");
			newPanel = self.$contents.filter($tab.find("a").attr("href"));
			newPanel.removeClass("is-hidden");
			$tabs.removeClass("is-active");
			$tabs.find("a").attr("aria-selected", "false");
			$tab.addClass("is-active");
			$tab.find("a").attr("aria-selected", "true");
			event.preventDefault();

			Cog.fireEvent("tab", "change", {
				id: newPanel.attr("id"),
				container: newPanel
			});
		}

		var $tabs = this.$scope.find("> .component-content > .tabs-nav .tabs-nav-item"),
			self = this;

		this.navWidth = this.$scope.find("> .component-content > .tabs-nav").width();
		this.listWidth = 0;
		this.listHeight = 0;
		$tabs.each(function() {
			self.listWidth += $(this).outerWidth(true);
			self.listHeight += $(this).outerHeight(true);
		});

		if (!this.isVertical) {
			if (this.navWidth < this.listWidth) {
				this.initializeScrolling();
			}
		} else {
			this.setContentHeight();
		}

		$tabs.on("click", activateTab);

		$tabs.filter(".is-active").trigger("click");
	};

	Tab.prototype.initializeScrolling = function() {

		var $switchers = this.$scope.find(".tabs-nav-switcher"),
			$switcherRight = $switchers.filter(".tabs-nav-switcher-right"),
			$switcherLeft = $switchers.filter(".tabs-nav-switcher-left"),
			$list = this.$scope.find(".tabs-nav-list"),
			self = this;

		$switcherRight.removeClass("is-hidden");
		$switchers.on("click", function() {
			var $this = $(this),
				difference = $this.hasClass("tabs-nav-switcher-right") ? -20 : 20,
				nextLeft = (parseInt($list.css("left"), 10) + difference);
			if (nextLeft < 0) {
				$switcherLeft.removeClass("is-hidden");
				if (-1 * nextLeft >= self.listWidth - self.navWidth) {
					$switcherRight.addClass("is-hidden");
				} else {
					$switcherRight.removeClass("is-hidden");
				}
			} else {
				$switcherLeft.addClass("is-hidden");
			}
			$list.stop().animate({left: nextLeft + "px"});
		});
	};

	Tab.prototype.setContentHeight = function() {
		var self = this;
		this.$contents.each(function() {
			if ($(this).height() < self.listHeight) {
				$(this).css("min-height", self.listHeight + "px");
			}
		});
	};

	api.onRegister = function(scope) {
		api.tabs.push(new Tab(scope.$scope));
	};

	Cog.registerComponent({
		name: "tabs",
		api: api,
		selector: ".tabs"
	});
})(Cog.jQuery());
