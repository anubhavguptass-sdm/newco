"use strict";

/**
 * desktop/js/components/article.teaser.js
 */
(function ($, document, _) {
  "use strict";

  var api = {};
  /**
   * Wraps text of selected elements with link
   *
   * @param $item {jQuery} article teaser component container
   */

  function wrapTextWithLink($item) {
    var $href = $item.find(".articleTeaser-text-header a").first().clone().empty();
    $item.find(".articleTeaser-text-description:not(:has(>a))").wrapInner($href);
  }

  api.onRegister = function (elements) {
    var element = elements.$scope;
    element.each(function (i, item) {
      var $item = $(item);
      wrapTextWithLink($item);

      if ($item.hasClass('articleTeaser-image-left')) {
        Cog.component.backgroundImage.createBackgroundImage($item, '.articleTeaser-image-holder');
      }
    });
    /**
     * Listens for loaded boxes and wrap text with link on them
     */

    Cog.addListener('loadMore', 'success', function () {
      $(".articleTeaser:not(.initialized)").each(function (i, item) {
        var $item = $(item);
        wrapTextWithLink($item);
      });
    });
  };

  api.$window = $(window);
  Cog.registerComponent({
    name: "articleTeaser",
    selector: ".articleTeaser",
    api: api
  });
})(Cog.jQuery());