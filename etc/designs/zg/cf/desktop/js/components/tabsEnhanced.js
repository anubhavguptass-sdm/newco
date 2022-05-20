"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    var $this = element.$scope,
        $contents = $this.find("> .component-content > .tabs-contents >.tabs-content"),
        $switcherRight = $this.find(".tabs-arrows__right"),
        $switcherLeft = $this.find(".tabs-arrows__left"),
        $listDotsItems = $this.find(".tabs-dots__item"),
        $tabs = $this.find("> .component-content > .tabs-nav .tabs-nav-item"),
        $tabsList = $this.find(".tabs-nav-list");

    function updateTabNavDots() {
      var $linkRight, $linkLeft, previousDotId, $previousDot, $activeDot, activeTabId, nextDotId, $nextDot;
      $listDotsItems.removeClass("is-active");
      activeTabId = $tabsList.find(".is-active").find("a").attr("href");
      $activeDot = $listDotsItems.find("[href='" + activeTabId + "']").parent();
      $linkLeft = $switcherLeft.find("a");
      $previousDot = $activeDot.prev();

      if ($previousDot.length > 0) {
        previousDotId = $previousDot.find("a").attr("href");
        $linkLeft.attr("href", previousDotId);
        $switcherLeft.addClass("is-active");
        $switcherLeft.removeClass("tabs-arrows--hidden");
      } else {
        $linkLeft.removeAttr("href");
        $switcherLeft.removeClass("is-active");
        $switcherLeft.addClass("tabs-arrows--hidden");
      }

      $linkRight = $switcherRight.find("a");
      $nextDot = $activeDot.next();

      if ($nextDot.length > 0) {
        nextDotId = $nextDot.find("a").attr("href");
        $linkRight.attr("href", nextDotId);
        $switcherRight.addClass("is-active");
        $switcherRight.removeClass("tabs-arrows--hidden");
      } else {
        $linkRight.removeAttr("href");
        $switcherRight.removeClass("is-active");
        $switcherRight.addClass("tabs-arrows--hidden");
      }

      $activeDot.addClass("is-active");
    }

    function activateTab(event) {
      var $target = $(event.currentTarget),
          targetId = $target.find("a").attr("href"),
          $targetTab = $tabs.find("[href='" + targetId + "']").parent(),
          newPanel;

      if ($targetTab.length > 0) {
        $contents.addClass("is-hidden");
      }

      newPanel = $contents.filter($targetTab.find("a").attr("href"));
      newPanel.removeClass("is-hidden");
      $tabs.removeClass("is-active");
      $tabs.find("a").attr("aria-selected", "false");
      $targetTab.addClass("is-active");
      $targetTab.find("a").attr("aria-selected", "true");
      event.preventDefault();
      Cog.fireEvent("tab", "change", {
        id: newPanel.attr("id"),
        container: newPanel
      });
    }

    $tabs.on('click', function (event) {
      activateTab(event);
      updateTabNavDots();
    });
    $switcherLeft.on('click', function (event) {
      activateTab(event);
      updateTabNavDots();
    });
    $switcherRight.on('click', function (event) {
      activateTab(event);
      updateTabNavDots();
    });
    $listDotsItems.on('click', function (event) {
      activateTab(event);
      updateTabNavDots();
    });
    $tabs.filter(".is-active").trigger("click");
  };

  Cog.registerComponent({
    name: "tabsEnhancedMarkup",
    api: api,
    selector: ".tabsEnhancedMarkup"
  });
})(Cog.jQuery());