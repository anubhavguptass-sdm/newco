"use strict";

/**
 * Carousel
 */
(function ($) {
  "use strict";

  var api = {},
      ariaLabelCurrentSlide = "Current Slide";
  api.delay = 0;

  api.showSlide = function (nextIndex, context, delay, autoRotate) {
    clearTimeout(context.timerId);
    var current = context.slides.filter(".is-active"),
        currentIndex = current.index();
    nextIndex = nextIndex < 0 ? context.slides.length - 1 : nextIndex >= context.slides.length ? 0 : nextIndex;

    if (Number(nextIndex) !== Number(currentIndex)) {
      context.slides.stop(true, true);
      current.removeClass("is-active").fadeOut(function () {
        $(this).removeClass("is-active").attr("aria-label", null);
        context.controls.removeClass("is-active").attr("aria-label", null).eq(nextIndex).addClass("is-active").attr("aria-label", ariaLabelCurrentSlide);
      });
      context.slides.eq(nextIndex).fadeIn(function () {
        $(this).addClass("is-active").attr("aria-label", ariaLabelCurrentSlide);
      });
    }

    if (delay > 0 && autoRotate !== false) {
      context.timerId = setTimeout(function () {
        api.showSlide(nextIndex + 1, context, delay, autoRotate);
      }, delay * 1000);
    }
  };

  api.onRegister = function (scope) {
    var $carousel = scope.$scope,
        $slideNav = $carousel.find(".carousel-nav"),
        $slideControls = $slideNav.find("li:not(.carousel-nav-prev):not(.carousel-nav-next)"),
        $slidesList = $carousel.find(".carousel-slides"),
        $slides = $slidesList.find(".carousel-slide"),
        slidesMaxHeight = $slidesList.data("height"),
        delay = 0,
        autoRotate = $slidesList.data("rotate"),
        context = {
      slides: $slides,
      controls: $slideControls
    },
        status = this.external.status,
        resizeView = function resizeView() {
      if (status.isAuthor()) {
        return;
      }

      var maxHeight = 0;
      $slides.each(function () {
        var height = $(this).height();
        maxHeight = height > maxHeight ? height : maxHeight;
      });

      if (slidesMaxHeight) {
        if (maxHeight > slidesMaxHeight) {
          maxHeight = slidesMaxHeight;
        }
      }

      $slidesList.css("height", maxHeight + "px");
    };

    $(window).resize(_.throttle(function () {
      resizeView();
    }, 250));
    resizeView();
    delay = $slidesList.data("delay") || 0;
    $slides.hide().first().show().attr("aria-label", ariaLabelCurrentSlide);
    $slideNav.on("click", "a", function (e) {
      e.preventDefault();
      var $parent = $(this).parent(),
          index = $slideControls.index($parent);

      if ($parent.is(".carousel-nav-prev,.carousel-nav-next")) {
        index = $slides.filter(".is-active").index();
        index = $parent.hasClass("carousel-nav-prev") ? index - 1 : index + 1;
      }

      api.showSlide(index, context);
    });

    if (delay > 0 && autoRotate !== false) {
      context.timerId = setTimeout(function () {
        api.showSlide(1, context, delay, autoRotate);
      }, delay * 1000);
    }
  };

  Cog.registerComponent({
    name: "carousel",
    api: api,
    selector: ".carousel",
    requires: [{
      name: "utils.status",
      apiId: "status"
    }]
  });
})(Cog.jQuery());