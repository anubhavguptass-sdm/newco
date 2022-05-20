/**
 * @overview  commonQuestions component
 */

/* global Cog */

(function($) {
  $(document).ready(function() {
    var $slider = $('#question-answer-slider');

    if (!$slider.length) {
    } else {
      $slider.lightSlider({
        onSliderLoad: function(el) {
          var maxHeight = 0,
            container = $(el),
            children = container.children();
          children.each(function() {
            var childHeight = $(this).height();
            if (childHeight > maxHeight) {
              maxHeight = childHeight;
            }
          });
          container.height(maxHeight);
        },
        onBeforeSlide: function(el) {
          var slideNumber = el.getCurrentSlideCount();
          dataLayer.push({
            event: 'e_carousel_slide',
            slideNumber: slideNumber
          });
        },
        item: 3,
        slideMove: 1,
        loop: true,
        slideMargin: 5,
        enableDrag: false,
        keyPress: true,
        controls: false,
        responsive: [
          {
            breakpoint: 992,
            enableDrag: true,
            settings: {
              item: 2
            }
          },
          {
            breakpoint: 768,
            enableDrag: true,
            settings: {
              item: 1
            }
          }
        ]
      });

      var slide = $('#question-answer-slider li');
      slide.click(function(e) {
        $(this).toggleClass('answered');
      });
    }
  });
})(Cog.jQuery());
