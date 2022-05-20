"use strict";

(function ($) {
  "use strict";

  var api = {},
      selectImage,
      slideTime = 0,
      finalWidth;

  api.onRegister = function (element) {
    var $webinar = element.$scope,
        $imageBox = $webinar.find(".imageBox"),
        count = $imageBox.length,
        $videoContainer = $webinar.find(".video-video-container"),
        totalWidth = $imageBox.width(),
        $video = $videoContainer.find('video'),
        $imageContainer = $webinar.find(".imagesContainer");
    $webinar.find(".videoDetail ul li:odd").addClass("odd");
    $webinar.find(".videoDetail ul li:even").addClass("alpha");
    $webinar.find(".imageBox :first").addClass('activeSlide');
    $imageBox.click(function () {
      api.showCurrentSilde($(this), $webinar);
    });
    $webinar.find(".webinarArrowLeft").click(function () {
      api.previousSlide($imageContainer);
    });
    $webinar.find(".webinarArrowRight").click(function () {
      api.nextSlide($imageContainer, count);
    });
    $imageContainer.css("width", count * totalWidth + "px");

    if ($videoContainer.length > 0) {
      $video.on('timeupdate', function () {
        var currentTime = $video.get(0).currentTime;
        $imageBox.each(function () {
          slideTime = $(this).attr("data-interval");

          if (currentTime > slideTime) {
            $(this).prev().removeClass("activeSlide");
            $(this).addClass("activeSlide");
            selectImage = $(this).find("img").attr("src");
            $webinar.find(".slide img").attr("src", selectImage);
          }
        });
      });
    }
  };

  api.showCurrentSilde = function (element, $webinar) {
    $webinar.find(".imageBox").removeClass("activeSlide");
    var videoTime = element.attr("data-interval"),
        $video = $webinar.find(".video-video-container video").get(0);
    element.addClass("activeSlide");
    selectImage = element.find("img").attr("src");
    $webinar.find(".slide img").attr("src", selectImage);
    $video.currentTime = videoTime;
    $video.play();
  };

  api.previousSlide = function ($imageContainer) {
    var initialWidth = $imageContainer.css("left");

    if (initialWidth !== "0px") {
      $imageContainer.animate({
        "left": "+=167px"
      });
    }
  };

  api.nextSlide = function ($imageContainer, slideCount) {
    event.preventDefault();
    var initialWidth = $imageContainer.css("left"),
        temp = "",
        finalWidth = 0;

    while (slideCount > 5) {
      finalWidth = finalWidth - 167;
      slideCount = slideCount - 1;
    }

    temp = finalWidth + "px";

    if (initialWidth !== temp) {
      $imageContainer.animate({
        "left": "-=167px"
      });
    }
  };

  Cog.registerComponent({
    name: "webinar",
    api: api,
    selector: ".webinar"
  });
})(Cog.jQuery());