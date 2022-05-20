"use strict";

/*
 * desktop/js/components/article.teaser.v2.js
 */
(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (element) {
    var $element = element.$scope,
        $buttonContainer = $element.find(".article-button-container");
    $element.click(function () {
      var link, target;

      if ($element.find(".article-body").hasClass("article-body-no-button")) {
        var $linkContainer = $element.find(".article-link-wrapper");
        link = $linkContainer.data("linkDestination");
        target = $linkContainer.data("linkBehaviour") || '_self';
      } else {
        var $aTag = $buttonContainer.find('a');
        link = $aTag.attr('href');
        target = $aTag.attr('target') || '_self';
      }

      window.open(link, target);
    });
  };

  Cog.registerComponent({
    name: "articleTeaserV2",
    selector: ".articleTeaserV2 .clickable-at",
    api: api
  });
})(Cog.jQuery());