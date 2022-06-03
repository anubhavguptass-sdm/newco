(function($) {
  // document.addEventListener('DOMContentLoaded' e => {
  //   // furst run accordion height
  //   accordionHeight()
  // })

  // iterate over each accordion content wraper
  $(document).ready(e => {
    $(function() {
      // trigger accordion height method so all accordions are set with accurate heights
      accordionHeight();
      // on any ajax request - call the function
      // again to assign IDs to any
      // newly loaded accordions and update their content heights
      $(document).ajaxComplete(function() {
        setTimeout(accordionHeight, 10);
      });
      $('body').on('click', function(event) {
        let t = $(event.target);
        if (t.is('.accordion-content-wrapper, .accordion-content-wrapper *'))
          // ignore click within content
          return;
        if (t.is('.accordion-slide, .accordion-slide *')) {
          // handle accordion content activation
          event.preventDefault();
          event.stopPropagation();

          t = t.closest('.accordion-slide');

          if (t.closest('.accordion').is('.slide-to-active')) {
            t.find('.accordion-content-wrapper').one('transitionend', e => {
              if (
                e.originalEvent.propertyName === 'max-height' ||
                e.originalEvent.propertyName === 'maxHeight'
              ) {
                let navSelector =
                  $(window).width() < 992
                    ? '.megamenu-bottom-center'
                    : '.megamenu-main-nav';
                let tTop = t.offset().top - $(navSelector).height() - 10;
                $('body,html')
                  .stop()
                  .animate(
                    {
                      scrollTop: tTop
                    },
                    'fast',
                    null
                  );
              }
            });
          }

          // let rootAccordion = t.closest('.accordion');
          // rootAccordion
          //   .find('.is-active')
          //   .not(t)
          //   .removeClass('is-active')
          //   .trigger('blur')
          //   .find('*')
          //   .trigger('blur');

          // if (t.is('.is-active')) {
          //   t.removeClass('is-active');
          //   t.trigger('blur')
          //     .find('*')
          //     .trigger('blur');
          // } else t.addClass('is-active');
        }
      });
    });

    if (!bpComponents.isIE) {
      let targetNodes = $('.accordion-content-wrapper'),
        MutationObserver =
          window.MutationObserver || window.WebKitMutationObserver,
        myObserver = new MutationObserver(mutationHandler),
        obsConfig = {
          childList: true,
          characterData: true,
          attributes: true,
          subtree: true
        };

      //--- Add a target node to the observer. Can only add one node at a time.
      targetNodes.each(function() {
        myObserver.observe(this, obsConfig);
      });

      function mutationHandler(mutationRecords) {
        let mutated = false;
        mutationRecords.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            mutated = true;
          }
        });
        if (mutated) setTimeout(accordionHeight, 100);
      }
    }
    $(window).on('load', () => {
      $(window).on('resize', e => {
        accordionHeight();
      });
    });
  });
})(Cog.jQuery());
