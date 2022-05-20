($ => {
  if ($('html').attr('lang') === 'en-US') {
    $(document).ready(e => {
      /*
       ***** Repeated Content Components Start *****
       */

      // Promoted product links
      // WWhen a user clicks a product, to be driven to a product page, for related, new, recommended, or other product types that can appear throughout the site.
      // Category: product links | Action: suggested | Label: {{product name}}
      // bpComponents.bpTrackers.homePageSuggestedProductClick = new GTMTracker({
      //   id: 'homePageSuggestedProductClick',
      //   eventCategory: 'article links',
      //   eventAction: 'suggested',
      //   eventTrigger: 'click',
      //   eventLabel: '{{childText}}',
      //   eventTargetSelector:
      //     '.article-wrapper .underline-plus-hover a,.component-content .richText a:not(.btn-default):not(.box .component-content .richText a.loadMore):not(.relative-box .component-content .richText a:not(.btn-default)):not(.article-filter .component-content .richText a:not(.btn-default)',
      //   eventTargetClosestSelector: '.richText-content',
      //   eventTargetChildSelector: 'h3,p strong'
      // }).init();

      // bpComponents.bpTrackers.articlePageSuggestedProductClick = new GTMTracker(
      //   {
      //     id: 'articlePageSuggestedProductClick',
      //     eventCategory: 'product links',
      //     eventAction: 'suggested',
      //     eventTrigger: 'click',
      //     eventLabel: '{{childText}}',
      //     eventTargetSelector:
      //       '.layout-article-page [class*="reference-related-products-"] a, .layout-article-page [class*="reference-related-products-"] a *,' +
      //       '.layout-article-page [class*= "reference-products-"] a, .layout-article-page [class*= "reference-products-"] a *',
      //     eventTargetClosestSelector:
      //       '[class*="reference-related-products-"], [class*= "reference-products-"]',
      //     eventTargetChildSelector: 'h3'
      //   }
      // ).init();

      bpComponents.bpTrackers.productPageSuggestedProductClick = new GTMTracker(
        {
          id: 'productPageSuggestedProductClick',
          eventCategory: 'product links',
          eventAction: 'related',
          eventTrigger: 'click',
          eventLabel: '{{childText}}',
          eventTargetSelector:
            '.layout-product-details [class*="reference-products-"] a, .layout-product-details [class*="reference-products-"] a *',
          eventTargetClosestSelector: '[class*="reference-products-"]',
          eventTargetChildSelector: 'h3'
        }
      ).init();

      /*
       ***** Repeated Content Components End *****
       */

      /*
       ***** Navigation Start *****
       */

      // Brand Logo Tracker
      // Did an user click the brand logo in the header
      // Category: navigation | Action: header | Label: {{brand name}} logo
      bpComponents.bpTrackers.brandLogoTracker = new GTMTracker({
        id: 'brandLogoTracker',
        eventCategory: 'navigation',
        eventAction: 'header',
        eventTrigger: 'click',
        eventLabel: '{{childTitle}} logo',
        eventTargetSelector: '.megamenu-logo a *',
        eventTargetClosestSelector: 'a',
        eventTargetChildSelector: 'img'
      }).init();

      // GSK Logo Tracker
      // Did an user clicks on GSK logo in the header
      // Category: navigation | Action: header | Label: GSK logo
      bpComponents.bpTrackers.logoGskTracker = new GTMTracker({
        id: 'logoGskTracker',
        eventCategory: 'navigation',
        eventAction: 'header',
        eventTrigger: 'click',
        eventLabel: 'GSK logo',
        eventTargetSelector: 'a[title="GSK-logo"], a[title="GSK-logo"] *',
        eventTargetClosestSelector: 'a[title="GSK-logo"]'
      }).init();

      // Header top navigation
      // Did an user clicks on a link in the top navigation (i.e. Products, Where to buy)
      // Category: navigation | Action: header | Label: {{link text}}
      bpComponents.bpTrackers.headerTopNavTracker = new GTMTracker({
        id: 'headerTopNavTracker',
        eventCategory: 'navigation',
        eventAction: 'header',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector:
          '.megamenu .megamenu-main-nav ul.navigation-branch.navigation-level1 .navigation-level1 > a',
        eventTargetClosestSelector: 'a'
      }).init();

      //Header Sub Navigation
      // Did an user clicks on a drop down link under a top navigation item (i.e. products > specific product or product category)
      // Category: navigation | Action: header | Label: {{top navigation text}}:{{link text}}
      bpComponents.bpTrackers.headerSubNavTracker = new GTMTracker({
        id: 'headerSubNavTracker',
        eventCategory: 'navigation',
        eventAction: 'header',
        eventTrigger: 'click',
        eventLabel: '{{sharerText}}:{{text}}',
        eventTargetSelector: '.megamenu-submenu-item a[href]',
        eventTargetClosestSelector: 'a',
        eventTargetParentSelector: '.megamenu-nav-container',
        eventTargetSharerSelector:
          '.megamenu-main-nav .navigation-item.is-active a'
      }).init();

      // Open Mobile Navigation
      // Did an user clicks on mobile view clicks on the hamburger menu to view navigation (3 horizontal lines)
      // Category: navigation | Action: mobile | Label: open mobile navigation
      bpComponents.bpTrackers.openMobileNavTracker = new GTMTracker({
        id: 'openMobileNavTracker',
        eventCategory: 'navigation',
        eventAction: 'mobile',
        eventTrigger: 'click',
        eventLabel: 'open mobile navigation',
        eventTargetSelector: '.navigation-mobile-menu:not(.opened)',
        eventTargetClosestSelector: '.navigation-mobile-menu'
      }).init();

      // Close mobile navigation
      // Did an user closes mobile navigation (via any means)
      // Category: navigation | Action: mobile | Label: close mobile navigation
      bpComponents.bpTrackers.closeMobileNavTracker = new GTMTracker({
        id: 'closeMobileNavTracker',
        eventCategory: 'navigation',
        eventAction: 'mobile',
        eventTrigger: 'click',
        eventLabel: 'close mobile navigation',
        eventTargetSelector: '.navigation-mobile-menu.opened',
        eventTargetClosestSelector: '.navigation-mobile-menu'
      }).init();

      //Country Selection with Language Option
      // Did an user selects country/language combination from drop down
      // Category: navigation | Action: country select | Label: {{country}}:{{language}}
      bpComponents.bpTrackers.countrySelectWithLanguageTracker = new GTMTracker(
        {
          id: 'countrySelectWithLanguageTracker',
          eventCategory: 'navigation',
          eventAction: 'country select',
          eventTrigger: 'click',
          eventLabel: '{{countryWithLanguage}}',
          eventTargetSelector: '.reference-language-block a',
          eventTargetClosestSelector: 'a'
        }
      ).init();

      //Footer link clicked
      // Click on footer link (excluding social network icons)
      // Category: navigation | Action: footer | Label: {{link text}}
      bpComponents.bpTrackers.footerLinkClickTracker = new GTMTracker({
        id: 'footerLinkClickTracker',
        eventCategory: 'navigation',
        eventAction: 'footer',
        eventTrigger: 'click',
        eventLabel: '{{text}} ',
        eventTargetSelector: '#footer ul li a',
        eventTargetClosestSelector: 'a'
      }).init();

      /*
       ***** Navigation End *****
       */

      // Promoted banner clicked
      // Did an user clicks CTA/Banner?
      // Category: Banner interaction | Action: {{banner name}} | Label: {{CTA/button text}}
      bpComponents.bpTrackers.promotedBannerClickTraker = new GTMTracker({
        id: 'promotedBannerClickTraker',
        eventCategory: 'banner',
        eventAction: '{{childText}}',
        eventTrigger: 'click',
        eventLabel: 'View More',
        eventTargetSelector:
          '.hero-banner-carousel  .btn-default, .hero-banner-carousel  .btn-default *',
        eventTargetClosestSelector: '.hero-banner-carousel  .richText-content',
        eventTargetChildSelector:
          '.hero-banner-carousel  .richText-content h2, .hero-banner-carousel  .richText-content h1',
        eventTargetParentSelector: '.hero-banner-carousel  .richText-content'
      }).init();

      /*
       ***** Carousel Start *****
       */

      // Carousel banner clicked
      // Did an user clicks retailer telephne number?
      // Category: carousel interaction | Action: carousel banner click | Label: {{banner position}}:{{banner name}}
      bpComponents.bpTrackers.carouselBannerClickTraker = new GTMTracker({
        id: 'carouselBannerClickTraker',
        eventCategory: 'carousel interaction',
        eventAction: 'carousel banner click',
        eventTrigger: 'click',
        eventLabel: '{{slidesCount}}',
        eventTargetSelector: '.carousel-slide a, .carousel-slide a *',
        eventTargetClosestSelector: 'a',
        eventTargetParentSelector: '.carousel-slides',
        eventTargetSharerSelector:
          '.active .carousel-content h2, .carousel-content h1'
      }).init();

      // Carousel indicator clicked
      // User clicks on indicator representing a banner to jump to a specific banner ?
      // Category: carousel interaction | Action: carousel indicator click | Label: {{indicator position}}
      bpComponents.bpTrackers.carouselIndicatorClickedTraker = new GTMTracker({
        id: 'carouselIndicatorClickedTraker',
        eventCategory: 'carousel interaction',
        eventAction: 'carousel indicator click',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.lSPager li a',
        eventTargetClosestSelector: 'a'
      }).init();

      bpComponents.bpTrackers.slickIndicatorClickedTraker = new GTMTracker({
        id: 'slickIndicatorClickedTraker',
        eventCategory: 'carousel interaction',
        eventAction: 'carousel indicator click',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.slick-dots li button',
        eventTargetClosestSelector: 'button'
      }).init();

      //carousel arrow click

      bpComponents.bpTrackers.carouselleftArrowClickTracker = new GTMTracker({
        id: 'carouselleftArrowClickTracker',
        eventCategory: 'carousel interaction',
        eventAction: 'carousel transition',
        eventTrigger: 'click',
        eventLabel: 'arrow left',
        eventTargetSelector:
          '.carousel .lSAction a:first-child, .carousel .lSAction a:first-child *',
        eventTargetClosestSelector: '.lSAction'
      }).init();

      bpComponents.bpTrackers.carouselrightArrowClickTracker = new GTMTracker({
        id: 'carouselrightArrowClickTracker',
        eventCategory: 'carousel interaction',
        eventAction: 'carousel transition',
        eventTrigger: 'click',
        eventLabel: 'arrow right',
        eventTargetSelector:
          '.carousel .lSAction a:last-child, .carousel .lSAction a:last-child *',
        eventTargetClosestSelector: '.lSAction'
      }).init();

      // Carousel advancement swipe
      // User swipes banner on mobile/touch screen to change the banner
      // Category: where to buy | Action: carousel transition | Label: swipe {{left/right}}
      window.trackerPreSlide = 1;
      $(window).on('touchend', e => {
        const target = e.target;
        isElement = typeof target.matches === 'function';
        matched =
          isElement &&
          target.matches(
            'li.carousel-slide:not(.clone), li.carousel-slide:not(.clone) *'
          );
        if (matched) {
          let currSlide = document.querySelector('.lSPager li.active a')
            .textContent;
          if (window.trackerPreSlide - parseInt(currSlide) > 0) {
            dataLayer.push({
              event: 'customEvent',
              eventCategory: 'carousel interaction',
              eventAction: 'carousel transition',
              eventLabel: 'swipe left'
            });
          } else {
            dataLayer.push({
              event: 'customEvent',
              eventCategory: 'carousel interaction',
              eventAction: 'carousel transition',
              eventLabel: 'swipe right'
            });
          }
          window.trackerPreSlide = currSlide;
        }
      });

      /*
       ***** Carousel End *****
       */

      /*
       ***** Product Filter Start *****
       */

      // Clicks a product category
      // User selects a product category to narrow results (outside of standard filter options)
      // Category: product filter | Action: category select | Label: {{category text}}
      bpComponents.bpTrackers.productCategoryClickTracker = new GTMTracker({
        id: 'productCategoryClickTracker',
        eventCategory: 'product filter',
        eventAction: 'category select',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector:
          '.layout-product-listing .filter-item-js:not(.active-js), .layout-product-listing .filter-item-js:not(.active-js) *',
        eventTargetClosestSelector: '.filter-item-js'
      }).init();

      /*
       ***** Product Filter End *****
       */

      /*
       ***** Forms Start *****
       */

      // Submission/validation errors
      // A user attempts to submit a form but there are validation errors
      // Category: form: {{form name}} | Action: validation errors | Label: {{comma separated list of fields with errors}}
      $(window).submit(e => {
        const form = e.target;
        if (!$(form).hasClass('form-search')) {
          const errorFields = form.querySelectorAll(
            'form .gigya-composite-control .gigya-error-msg-active'
          );
          const missingRequiredFields = [];
          for (field of errorFields) {
            const errorLabel = field
              .closest('div.gigya-composite-control')
              .querySelector('span.gigya-label-text');
            if (Boolean(errorLabel)) {
              missingRequiredFields.push(errorLabel.innerText);
            } else {
              const input = field
                .closest('div.gigya-composite-control')
                .querySelector('input');
              const placeholder = Boolean(
                $(input).attr('data-gigya-placeholder')
              )
                ? $(input).attr('data-gigya-placeholder')
                : $(input).attr('placeholder');
              missingRequiredFields.push(placeholder);
            }
          }
          if (missingRequiredFields.length > 0) {
            const $formWrapper = $(form).parents('[data-screen-set]');
            const formName = $formWrapper.attr('data-screen-set');

            dataLayer.push({
              event: 'customEvent',
              eventCategory: `form:${formName}`,
              eventAction: 'validation errors',
              eventLabel: missingRequiredFields
            });
          }
        }
      });

      // Submissions/completions
      // A user successfully submits a form without error
      // Category: form: {{form name}} | Action: submission complete | Label: {{URL where submission occured}}
      // gigyaraas.registerAction(
      //   'onAfterSubmit',
      //   'submission-gtm-tracker',
      //   function(response, config) {
      //     dataLayer.push({
      //       event: 'customEvent',
      //       eventCategory: `form:${config.screenSet}`,
      //       eventAction: 'submission complete',
      //       eventLabel: location.href
      //     });
      //   }
      // );

      /*
       ***** Forms End *****
       */

      if ($('html').attr('lang') === 'en-US') {
        /*
         ***** Ratings and Reviews Start *****
         */

        // Product rated
        // User submits a rating for a product (i.e. X out of 5 stars)
        // Category: product ratings | Action: {{product name}} | Label: {{rating}}
        bpComponents.bpTrackers.productRatedTracker = new GTMTracker({
          id: 'productRatedTracker',
          eventCategory: 'product ratings',
          eventAction: '{{childText}}',
          eventTrigger: 'click',
          eventLabel: '{{sharerText}}',
          eventTargetSelector: '.bv-submission-button-submit',
          eventTargetClosestSelector: '.bv-mbox',
          eventTargetParentSelector: '.bv-mbox',
          eventTargetSharerSelector:
            '.bv-rating-link[aria-checked="true"]:last-child .bv-off-screen',
          eventTargetChildSelector: '.bv-subject-name-header'
        }).init();

        // Product review submitted
        // User submits a text review of a product
        // Category: product reviews | Action: review submission | Label: {{product name}}:{{positive/neutral/negative}}
        bpComponents.bpTrackers.productReviewedTracker = new GTMTracker({
          id: 'productReviewedTracker',
          eventCategory: 'product reviews',
          eventAction: 'review submission',
          eventTrigger: 'click',
          eventLabel: '{{childText}}',
          eventTargetSelector: '.bv-submission-button-submit',
          eventTargetClosestSelector: '.bv-mbox',
          eventTargetChildSelector: '.bv-subject-name-header'
        }).init();

        // Flagged product review
        // User flags an existing review as inappropriate
        // Category: product reviews | Action: flagged review | Label: {{review id}}
        bpComponents.bpTrackers.productReviewedTracker = new GTMTracker({
          id: 'productReviewedTracker',
          eventCategory: 'product reviews',
          eventAction: 'flagged review',
          eventTrigger: 'click',
          eventLabel: '{{reviewId}}',
          eventTargetSelector: '.bv-content-report-btn',
          eventTargetClosestSelector: '.bv-content-item'
        }).init();

        /*
         ***** Ratings and Reviews End *****
         */
      }

      /*
       ***** Social Sharing Start *****
       */

      // Page shared
      // Did an user used tool to share a page to a social media network?
      // Category: social share | Action: {{social media network name/email}} | Label: {{URL of shared page}}
      bpComponents.bpTrackers.socialSharedTracker = new GTMTracker({
        id: 'socialSharedTracker',
        eventCategory: 'social share',
        eventAction: '{{childTitle}}',
        eventTrigger: 'click',
        eventLabel: 'visit',
        eventTargetSelector: '#footer .default-icon *',
        eventTargetClosestSelector: '#footer .default-icon',
        eventTargetChildSelector: 'a'
      }).init();

      bpComponents.bpTrackers.pageSharedTracker = new GTMTracker({
        id: 'pageSharedTracker',
        eventCategory: 'social share',
        eventAction: '{{childTitle}}',
        eventTrigger: 'click',
        eventLabel: 'share',
        eventTargetSelector: '.article-social-share .reference-bp-share-icon *',
        eventTargetClosestSelector:
          '.article-social-share .reference-bp-share-icon',
        eventTargetChildSelector: 'img'
      }).init();

      /*
       ***** Social Sharing End *****
       */

      /*
       ***** Site Search Start *****
       */

      // Number of search results for a term
      // Did an user performed a search (in header or on results page)?
      // Category: site search | Action: {{search term}} | Label: {{number of results}}
      $(document).ready(e => {
        function checkGA() {
          if (typeof ga === 'function') {
            ga(function(tracker) {
              let isResultsPage = Boolean(
                document.querySelector('body.page-search-results')
              );
              if (isResultsPage) {
                let isThereAnyResults = document.querySelector(
                  '.searchResults-number'
                );
                let noOfResults = 0;
                if (Boolean(isThereAnyResults)) {
                  let resultsText =
                    isThereAnyResults.childNodes[0].textContent || '';
                  noOfResults = resultsText.trim().split(' ')[0];
                }
                let searchTerm =
                  document.querySelector('.searchResults-term').textContent ||
                  '';
                let eventData = {
                  event: 'customEvent',
                  eventCategory: 'site search',
                  eventAction: searchTerm.trim(),
                  eventLabel: 'results:' + noOfResults
                };
                dataLayer.push(eventData);
              }
            });
          } else {
            setTimeout(checkGA, 500);
          }
        }
        checkGA();
      });

      // Clicked search results
      // Did an user clicked on a link in the search results page?
      // Category: site search | Action: {{search term}} | Label: selected: {{URL of link clicked}}
      bpComponents.bpTrackers.numberOfSearchResultsTracker = new GTMTracker({
        id: 'numberOfSearchResultsTracker',
        eventCategory: 'site search',
        eventAction: '{{sharerText}}',
        eventTrigger: 'click',
        eventLabel: 'selected:{{link}}',
        eventTargetSelector: '.searchResults-title a',
        eventTargetClosestSelector: 'a',
        eventTargetParentSelector: '.searchResults',
        eventTargetSharerSelector: '.searchResults-term'
      }).init();

      /*
       ***** Site Search End *****
       */
      /*
       ***** Where to buy Start *****
       */

      // Where to buy button click
      // User clicks button directing to a 'where to buy' page
      // Category: where to buy | Action: where to buy | Label: {{URL where button click occured}}
      bpComponents.bpTrackers.whereToBuyButtonClickTracker = new GTMTracker({
        id: 'whereToBuyButtonClickTracker',
        eventCategory: 'where to buy',
        eventAction: 'where to buy',
        eventTrigger: 'click',
        eventLabel: '{{pageUrl}}',
        eventTargetSelector: '.megamenu-top-bar-left a[href*="where-to-buy"]',
        eventTargetClosestSelector: 'a'
      }).init();

      // Buy now button click
      // Did an user clicks Buy now button?
      // Category: where to buy | Action: buy now | Label: {{product name}}
      bpComponents.bpTrackers.buyNowButtonClickTracker = new GTMTracker({
        id: 'buyNowButtonClickTracker',
        eventCategory: 'where to buy',
        eventAction: 'buy now',
        eventTrigger: 'click',
        eventLabel: '{{productName}}',
        eventTargetSelector: '.ps-widget.ps-enabled, .ps-widget.ps-enabled *',
        eventTargetClosestSelector: '.ps-widget'
      }).init();

      //Tab selection
      // Did an user clicks the 'buy local/find nearby' or 'buy online/find online' tab?
      // Category: where to buy | Action: tab select | Label: {{tab name}}
      bpComponents.bpTrackers.buyOnlineLocalTabsTracker = new GTMTracker({
        id: 'buyOnlineLocalTabsTracker',
        eventCategory: 'where to buy',
        eventAction: 'tab select',
        eventTrigger: 'click',
        eventLabel: '{{text}} ',
        eventTargetSelector: '.ps-wtb label span',
        eventTargetClosestSelector: 'span'
      }).init();

      //Online retailer selected
      // Did an user clicks to go to a specific retailer site for the product?
      // Category: where to buy | Action: online retailer visit | Label: {{retailer name}}
      bpComponents.bpTrackers.onlineRetailerSelectedTracker = new GTMTracker({
        id: 'onlineRetailerSelectedTracker',
        eventCategory: 'where to buy',
        eventAction: 'online retailer visit',
        eventTrigger: 'click',
        eventLabel: '{{text}} ',
        eventTargetSelector:
          '.ps-online-tab .ps-online-seller-select .ps-online-buy-button',
        eventTargetClosestSelector: '.ps-online-buy-button'
      }).init();

      //Local retailer selected
      // Did an user click to go to retailer website from local tab/column?
      // Category: where to buy | Action: local retailer visit | Label: {{retailer name}}
      bpComponents.bpTrackers.localRetailerSelectedTracker = new GTMTracker({
        id: 'localRetailerSelectedTracker',
        eventCategory: 'where to buy',
        eventAction: 'local retailer visit',
        eventTrigger: 'click',
        eventLabel: '{{altText}}',
        eventTargetSelector: '.ps-local-store-container .ps-seller img',
        eventTargetClosestSelector: 'img'
      }).init();

      //Location search completed
      // Did an user types search for the nearest store?
      // Category: where to buy | Action: retailer search | Label: search field
      bpComponents.bpTrackers.locationSearchCompletedTracker = new GTMTracker({
        id: 'locationSearchCompletedTracker',
        eventCategory: 'where to buy',
        eventAction: 'retailer search',
        eventTrigger: 'click',
        eventLabel: 'search field',
        eventTargetSelector: '.ps-location input',
        eventTargetClosestSelector: 'input'
      }).init();

      //Geolocation activated
      // Did an user clicks option to use device location to find nearest store?
      // Category: where to buy | Action: retailer search | Label: geolocation
      bpComponents.bpTrackers.geolocationActivatedTracker = new GTMTracker({
        id: 'geolocationActivatedTracker',
        eventCategory: 'where to buy',
        eventAction: 'retailer search',
        eventTrigger: 'click',
        eventLabel: 'geolocation',
        eventTargetSelector: '.ps-location .ps-map-geolocation-button',
        eventTargetClosestSelector: '.ps-map-geolocation-button'
      }).init();

      //Get directions to retailer
      // Did an user clicks button to get directions to a listed retailer?
      // Category: where to buy | Action: get directions | Label: {{retailerName}}
      bpComponents.bpTrackers.getDirectionsTracker = new GTMTracker({
        id: 'getDirectionsTracker',
        eventCategory: 'where to buy',
        eventAction: 'get directions',
        eventTrigger: 'click',
        eventLabel: '{{altText}}',
        eventTargetSelector: '.ps-local-store-container .ps-seller img',
        eventTargetClosestSelector: 'img'
      }).init();
      //Call retailer
      // Did an user clicks retailer telephne number?
      // Category: where to buy | Action: call retailer | Label: {{retailerName}}
      bpComponents.bpTrackers.callRetailerTracker = new GTMTracker({
        id: 'locationSearchCompletedTracker',
        eventCategory: 'where to buy',
        eventAction: 'call retailer',
        eventTrigger: 'click',
        eventLabel: '{{childText}}',
        eventTargetSelector: '.ps-local-store-container a',
        eventTargetClosestSelector: '.ps-local-store-container',
        eventTargetChildSelector: 'small.ps-local-seller-button'
      }).init();
      //Price spider widget loads
      // Did an user clicks occurs when price spider modal loads (no additional interactionr required)?
      // Category: where to buy | Action: load widget | Label: {{product name}}
      bpComponents.bpTrackers.priceSpiderModalLoadsTracker = new GTMTracker({
        id: 'priceSpiderModalLoadsTracker',
        eventCategory: 'where to buy',
        eventAction: 'load widget',
        eventTrigger: 'click',
        eventLabel: '{{productName}}',
        eventTargetSelector: '.ps-widget.ps-enabled',
        eventTargetClosestSelector: '.ps-widget'
      }).init();

      /*
       ***** Where to buy End *****
       */
    });
  }
})(Cog.jQuery());
