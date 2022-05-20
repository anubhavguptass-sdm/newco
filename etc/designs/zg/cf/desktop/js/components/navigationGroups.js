"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    var $this = element.$scope,
        $nav = $this.find('nav.flexy'),
        $btn = $this.find('nav.flexy button'),
        $vlinks = $this.find('nav.flexy .links'),
        $hlinks = $this.find('nav.flexy .hidden-links'),
        numOfItems = 0,
        totalSpace = 0,
        breakWidths = [],
        availableSpace,
        numOfVisibleItems,
        requiredSpace;
    $vlinks.children().outerWidth(function (i, w) {
      totalSpace += w;
      numOfItems += 1;
      breakWidths.push(totalSpace);
      check();
    });

    function check() {
      availableSpace = $vlinks.width() - 10;
      numOfVisibleItems = $vlinks.children().length;
      requiredSpace = breakWidths[numOfVisibleItems - 1];

      if (requiredSpace > availableSpace) {
        $vlinks.children().last().prependTo($hlinks);
        numOfVisibleItems -= 1;
        check();
      } else if (availableSpace > breakWidths[numOfVisibleItems]) {
        $hlinks.children().first().appendTo($vlinks);
        numOfVisibleItems += 1;
      }

      $btn.attr("count", numOfItems - numOfVisibleItems);

      if (numOfVisibleItems === numOfItems) {
        $btn.addClass('hidden');
      } else $btn.removeClass('hidden');
    }

    $btn.on('click', function () {
      $hlinks.toggleClass('hidden');
    });
    $(window).resize(function () {
      check();
    });
  };

  Cog.registerComponent({
    name: "navigationGroupEnhanced",
    api: api,
    selector: ".navigationGroupEnhanced"
  });
})(Cog.jQuery());