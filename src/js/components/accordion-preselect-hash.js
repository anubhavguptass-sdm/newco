/*
 ** accordion component handler
 ** handles hash change and hash reading on DOM load
 ** scrolls and opens the accordion content if match found
 **
 ** all accordions that have class idclass-{{yourid}} are also added to
 ** window.bpComponents.accordions and accessable through this object via {{yourid}}
 */
(function($) {
  const animationSpeen = 'slow', // slow, fast, number in milliseconds
    openAccordionTitleByHash = accordionHeadEl => {
      // get total offset of accordion head and subtract the height of the navigation
      let top = accordionHeadEl.offset().top - $('.megamenu-main-nav').height();
      // animate scroll in 1 second
      setTimeout(() => {
        $('html')
          .stop(true, true, true)
          .animate(
            {
              scrollTop: top
            },
            animationSpeen,
            'swing',
            () => {
              // add is-active class to accordion slide when animation ends
              accordionHeadEl.closest('.accordion-slide').addClass('is-active');
              // script ends
            }
          );
      }, 1000);
    },
    getHash = e => {
      // get hash
      let hash = decodeURIComponent(window.location.hash).replace('#', ''),
        // get accordion titles collection
        titles = $('.accordion-title-text');
      //iterate over each title
      titles.each((ind, el) => {
        let t = $(el),
          // slugify title text
          titleSlug = slug(t.text());
        // if slugified title and hash match call openAccordionTitleByHash with closest acordion head as a parameter
        if (titleSlug === hash)
          openAccordionTitleByHash(t.closest('.accordion-head'));
      });
    };

  // script starts
  $(document).ready(() => {
    // iterate over each accordion with idclass so it can be added to bpComponents.accordions
    $(
      '.accordion.component:not(.box):not(.snippetReference), .accordion[class*="idclass-"]'
    ).each((ind, el) => {
      try {
        //extract id from accordion class stack
        let accEl = $(el),
          allSlides = accEl.find('.accordion-slide'),
          accordionId = accEl.is('[class*="idclass-"]')
            ? accEl
                .attr('class')
                .match(/idclass\-([^\s]+)/gi)[0]
                .replace('idclass-', '')
                .camelize()
            : generateID('accordion');
        // add accordion as element to bpComponents.accordions
        if (!window.bpComponents.accordions[accordionId])
          window.bpComponents.accordions[accordionId] = el;

        el.slides = {};
        el.slidesCount = 0;
        allSlides.each((i, slide) => {
          let s = $(slide),
            sTitle = s.find('.accordion-head h3').text(),
            slugTitle = slug(sTitle),
            camId = slugTitle.camelize();
          slide.data = {
            title: sTitle,
            slug: slugTitle
          };
          slide.open = function() {
            $(this).addClass('is-active');
          };
          slide.close = function() {
            $(this).removeClass('is-active');
          };
          el.slidesCount++;
          if (!el.slides[camId]) el.slides[camId] = slide;
        });
        el.openAll = function() {
          allSlides.addClass('is-active');
        };
        el.closeAll = function() {
          allSlides.removeClass('is-active');
        };
        accEl.removeClass(function(index, className) {
          return (className.match(/idclass\-([^\s]+)/gi) || []).join(' ');
        });
      } catch (error) {}
    });
    // check the hash on DOM ready
    getHash();
  });
  // check the hash when changed
  $(window).on('hashchange', getHash);
})(Cog.jQuery());
