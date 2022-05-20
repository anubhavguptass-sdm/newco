/* eslint-disable */
(function($) {
  // fix for lazyloaded images in carousels
  // with this carousel will resize after image is switched to correct height
  $('.carousel img').on('lazyloaded', e =>
    setTimeout(() => {
      $(window).trigger('resize');
      console.log('loaded');
    }, 10)
  );

  function updateSliderHeight(slider) {
    let a1 = !slider || arguments.length === 0;
    if (this === window && a1) return;
    if (a1) slider = this;
    if (!slider) return;

    // if(slider.suto) clearTimeout(slider.suto)
    let activeSlide = slider.find('.carousel-slide.active > .carouselSlide'),
      activeHeight = activeSlide.prop('scrollHeight'),
      data = slider.data('config');

    try {
      if (data.mode === 'fade') {
        slider.css({
          'min-height': 'auto',
          'padding-bottom': activeHeight
        });
      } else {
        slider.css({
          'min-height': 'auto',
          height: activeHeight
        });
      }
    } catch (err) {}

    // slider.suto = setTimeout(() =>{
    //   try {
    //     if (data.mode === 'fade') {
    //       slider.css({
    //         'min-height': 'auto',
    //         'padding-bottom': activeHeight
    //       })
    //     } else {
    //       slider.css({
    //         'min-height': 'auto',
    //         height: activeHeight
    //       })
    //     }
    //   } catch (err) {}
    // }, data.speed)
  }

  $(document).ready(e => {
    // loop through each carousel config on a page
    $('.carousel-configurator').each((ind, el) => {
      // configurator element
      let element = $(el);
      // get carousel Class from config
      let carouselClass = element.attr('data-carousel-class');
      // check if carousel class is set otherwise skip
      if (
        carouselClass === '' ||
        typeof carouselClass === 'undefined' ||
        carouselClass === '$carouselClass'
      )
        return;
      // AEM fix for leftovers of variables in HTML resp. in data attributes
      let varsToReplace = '$carouselClass,$carouselType,$slidesPerMove,$slidesPerMoveMobile,$slideMargin,$slideMarginMobile,$addClass,$mode,$speed,$auto,$pauseOnHover,$slideEndAnimation,$sliderPause,$keyPress,$controls,$controlsMobile,$pager,$pagerMobile,$prevHtml,$nextHtml,$rtl,$adaptiveHeight,$vertical,$verticalHeight,$vThumbWidth,$thumbItem,$thumbItemMobile,$galleryMargin,$galleryMarginMobile,$thumbMargin,$thumbMarginMobile,$currentPagerPosition,$currentPagerPositionMobile,$enableTouch,$enableDrag,$freeMove,$restrictNavigationsContentWidth'.split(
        ','
      );
      // create configuration object
      let sliderConfig = {};
      // get all attrinutes of configurator
      let attrs = element.get(0).attributes;
      // clean all leftover vars
      varsToReplace.forEach((el, ind) => {
        let val = el;
        for (let i in attrs) {
          if (attrs[i].value && attrs[i].value === val) attrs[i].value = '';
        }
      });

      let maxWidthNavigationRestriction = false;
      try {
        if (
          element.attr('data-slider-restrict-navigations-content-width') ==
            'true' ||
          element.attr('data-slider-restrict-navigations-content-width') ==
            'false'
        ) {
          maxWidthNavigationRestriction = Function(
            `return ${element.attr(
              'data-slider-restrict-navigations-content-width'
            )}`
          )();
        }
      } catch (err) {
        //skip
      }
      // create properties in slider configuration ba camelizing data attributes
      for (let i in attrs) {
        let an = attrs[i].name;
        if (typeof an === 'undefined' || !/data-/gi.test(an)) continue;
        if (an !== 'data-slider-pause-') {
          sliderConfig[an.replace(/slider\-|data\-/gi, '').camelize()] =
            attrs[i].value;
        } else {
          sliderConfig['sliderPause'] = attrs[i].value;
        }
      }

      // lightslider configuration
      let lightSliderConfig = {
        item: parseInt(sliderConfig.items),
        autoWidth: false,
        slideMove: parseInt(sliderConfig.perMove),
        slideMargin: parseInt(sliderConfig.margin),
        addClass: sliderConfig.addClass,
        mode: sliderConfig.mode,
        useCSS: true,
        cssEasing: 'ease', //'cubic-bezier(0.25, 0, 0.25, 1)',
        easing: 'linear', //'for jquery animation',//
        speed: parseInt(sliderConfig.animationSpeed), //ms'
        auto: Function(`return ${sliderConfig.autoplay}`)(),
        pauseOnHover: Function(`return ${sliderConfig.pauseOnHover}`)(),
        loop: Function(`return ${sliderConfig.loop}`)(),
        slideEndAnimation: Function(`return ${sliderConfig.endAnimation}`)(),
        pause: parseInt(sliderConfig.sliderPause),
        keyPress: Function(`return ${sliderConfig.enableKeypress}`)(),
        controls: Function(`return ${sliderConfig.enablePrevnext}`)(),
        prevHtml: '',
        nextHtml: '',
        rtl:
          window.getComputedStyle(document.body, null).direction === 'rtl'
            ? true
            : false,
        adaptiveHeight: Function(`return ${sliderConfig.adaptiveHeight}`)(),
        vertical: Function(`return ${sliderConfig.enableVertical}`)(),
        verticalHeight: parseInt(sliderConfig.verticalHeight),
        pager: Function(`return ${sliderConfig.enablePager}`)(),
        enableTouch: Function(`return ${sliderConfig.enableTouch}`)(),
        enableDrag: Function(`return ${sliderConfig.enableDrag}`)(),
        freeMove: Function(`return ${sliderConfig.enableFreeMove}`)(),
        swipeThreshold: 40,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              item: parseInt(sliderConfig.itemsMobile),
              slideMove: parseInt(sliderConfig.perMoveMobile),
              slideMargin: parseInt(sliderConfig.marginMobile),
              controls: Function(
                `return ${sliderConfig.enablePrevnextMobile}`
              )(),
              pager: Function(`return ${sliderConfig.enablePagerMobile}`)()
            }
          }
        ],
        onBeforeStart: function($el) {},
        onSliderLoad: function($el) {
          !window.carousels ? (window.carousels = []) : null;
          window.carousels.push($el);
          updateSliderHeight($el);
          $(window).resize(() => {
            updateSliderHeight($el);
          });

          // set navigation restriction
          $(`.${sliderConfig.carouselClass}`).attr(
            'data-restrict-nav-max-width',
            maxWidthNavigationRestriction
          );

          // end of fix of dynamic content
          // finish configuration of common questions type
          if (sliderConfig.carouselType === 'commonQuestions') {
            $el.find('.common-question-slide .cq-box').removeClass('active');
            // attach click action to cq box
            $(`.${sliderConfig.carouselClass}`).on('click', e => {
              let t = $(e.target);
              if (
                t.is(
                  $(
                    `.${sliderConfig.carouselClass} .cq-box, .${sliderConfig.carouselClass} .cq-box *`
                  )
                )
              ) {
                t = t.closest('.cq-box');
                t.toggleClass('active');
              }
            });
          }

          // set position of bullet navigation with classes
          $(`.${sliderConfig.carouselClass}`).addClass(
            `${sliderConfig.pagerPosition} ${sliderConfig.pagerMobile} initialized`
          );
        },
        onBeforeSlide: function($el, scene) {
          //on changing slides - pauses active video
          let videoCheck = $(this)
            .find('.carousel-slide.active .bpplayer')
            .attr('id');

          if (
            $(this)
              .find('.carousel-slide.active .bpplayer')
              .attr('data-status') === 'playing'
          ) {
            window.bpComponents.bpVideoPlayers[videoCheck].pauseVideo();
          }

          setTimeout(
            updateSliderHeight,
            parseInt(sliderConfig.animationSpeed),
            $el
          );
        },
        onAfterSlide: function($el, scene) {},
        onBeforeNextSlide: function($el, scene) {},
        onBeforePrevSlide: function($el, scene) {}
      };
      // configure common questions
      if (sliderConfig.carouselType === 'commonQuestions') {
        // get the content box
        let cqBox = $(`.${sliderConfig.carouselClass} .cq-box`);
        // get the actual content box content AEM relative gutter
        let cqContent = $(
          `.${sliderConfig.carouselClass} .cq-box > .component-content > .paragraphSystem`
        );
        // get the common questions answer element
        let cqText = cqBox.find('.cq-text');
        // unhide cqText to get full height of each element
        cqText.css('max-height', 'none');
        // wait until full height is fully rendered then loop through to get all heights
        setTimeout(() => {
          // collect all scroll heights of items
          let heights = [];
          cqContent.each((ind, el) => {
            heights.push(el.scrollHeight);
          });
          // get the height of the largest item and set it to all of the others
          cqBox.css('height', heights.sort().reverse()[0]);
          // reset max-height to initial
          cqText.css('max-height', '');
        }, 100);
        // add common-question-slide class  to each carousel-slide
        $(`.${sliderConfig.carouselClass} .carousel-slide`).addClass(
          'common-question-slide'
        );
      }
      let cSlides = $(`.${sliderConfig.carouselClass} .carouselSlide`);
      // if vertical
      if (lightSliderConfig.vertical) {
        $(`.${sliderConfig.carouselClass} .carousel-slides`)
          .eq(0)
          .addClass('carousel-vertical');
        let vHeights = [];
        cSlides.each((ind, el) => {
          vHeights.push(el.scrollHeight);
        });
        // get the highest number of collected scroll heights
        lightSliderConfig.verticalHeight = vHeights.sort().reverse()[0];
      }

      // initialize current carousel
      let carousel = $(`.${sliderConfig.carouselClass} .carousel-slides`)
          .eq(0)
          .data({
            config: lightSliderConfig
          })
          .lightSlider(lightSliderConfig),
        carouselEl = carousel.closest('.carousel'),
        matched = carouselEl.attr('class').match(/idclass\-([^\s]+)/gi),
        carouselId =
          matched !== null
            ? matched[0].replace('idclass-', '').camelize()
            : null;

      carouselEl.removeClass(function(index, className) {
        return (className.match(/idclass\-([^\s]+)/gi) || []).join(' ');
      });

      if (carouselId !== null) carouselId = carouselId;
      else
        carouselId = `carousel${(Math.random() * 1000000000000).toFixed(
          0
        )}${new Date().getTime()}`;

      carousel.attr('id', carouselId);
      carousel.updateSliderHeight = updateSliderHeight;
      window.bpComponents.bpCarousels[carouselId] = carousel;
    });
  });
})(Cog.jQuery());
/* eslint-enable */
