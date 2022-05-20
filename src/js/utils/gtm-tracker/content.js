($ => {
  if ($('html').attr('lang') === 'en-US') {
    $(document).ready(e => {
      /*
       ***** Article Start *****
       */
      // Article Category Selected
      // Did an user selects a category to narrow results
      // Category: article links | Action: category selection | Label: {{category}}
      bpComponents.bpTrackers.articleCategorySelectedTracker = new GTMTracker({
        id: 'articleCategorySelectedTracker',
        eventCategory: 'article links',
        eventAction: 'category selection',
        eventTrigger: 'click',
        eventLabel: '{{childText}}',
        eventTargetSelector:
          '.layout-article-hub .reference-resources-article-listing a[href] *',
        eventTargetClosestSelector: '.box',
        eventTargetChildSelector: 'p a[href]'
      }).init();

      // Article selected
      // Did an user selects a specific article from the main list
      // Category: article links | Action: list selection | Label: {{article name}}
      bpComponents.bpTrackers.articleSelectedTracker = new GTMTracker({
        id: 'articleSelectedTracker',
        eventCategory: 'article links',
        eventAction: 'list selection',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector:
          '.layout-article-hub [class*="reference-"].fixed-height-copyblock a[href],.relative-box .component-content .richText a[href]',
        eventTargetClosestSelector: 'a'
      }).init();

      // Read more click
      // Did an user click button/link to display full article?
      // Category: article links | Action: read more | Label: {{article name}}
      // bpComponents.bpTrackers.articleReadMoreTracker = new GTMTracker({
      //   id: 'articleReadMoreTracker',
      //   eventCategory: 'article links',
      //   eventAction: 'read more',
      //   eventTrigger: 'click',
      //   eventLabel: '{{childText}}',
      //   eventTargetSelector:
      //     '.component-content .richText a:not(.box .component-content .richText a.loadMore):not(.btn-default):not(.relative-box .component-content .richText a:not(.btn-default)',
      //   eventTargetClosestSelector: '.richText-content',
      //   eventTargetChildSelector: 'h3,p strong'
      // }).init();

      // load more click
      // Did an user click load more?
      // Category: article links | Action: load more | Label: {{title of page where click occurs}}
      bpComponents.bpTrackers.loadMoreTracker = new GTMTracker({
        id: 'loadMoreTracker',
        eventCategory: 'article links',
        eventAction: 'load more',
        eventTrigger: 'click',
        eventLabel: '{{pageUrl}}',
        eventTargetSelector: '.browse-stories-sec .richText a.btn',
        eventTargetClosestSelector: '.richText-content',
        eventTargetChildSelector: 'p'
      }).init();

      /*
       ***** Article End *****
       */

      /*
       ********* Product Hub page Start ********
       */

      // Product selected
      // Did an user click to selects a category to narrow results
      // Category: product links | Action: category selection | Label: {{category}}
      bpComponents.bpTrackers.productCategorySelectedTracker = new GTMTracker({
        id: 'productCategorySelectedTracker',
        eventCategory: 'product links',
        eventAction: 'list selection',
        eventTrigger: 'click',
        eventLabel: '{{childText}}',
        eventTargetSelector: '.txtimg a',
        eventTargetClosestSelector: ' .component-content',
        eventTargetChildSelector: '.richText-content p a'
      }).init();

      // Product selected
      // Did an user select a specific product from the main list
      // Category: product links | Action: list selection | Label: {{product name}}
      bpComponents.bpTrackers.productSelectedTracker = new GTMTracker({
        id: 'productSelectedTracker',
        eventCategory: 'product links',
        eventAction: 'list selection',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.page-our-products .product-grad-content a',
        eventTargetClosestSelector: 'a'
      }).init();

      // Product category selected
      // Did an user click to selects a category to narrow results
      // Category: product links | Action: category selection | Label: {{category}}
      bpComponents.bpTrackers.productCategoryClickTracker = new GTMTracker({
        id: 'productCategoryClickTracker',
        eventCategory: 'product links',
        eventAction: 'category selection',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.filterbox-1 option:checked',
        eventTargetClosestSelector: '.filterbox-1'
      }).init();

      // Product selected
      // Did an user select a specific product from the main list
      // Category: product links | Action: list selection | Label: {{product name}}
      // bpComponents.bpTrackers.productPageSuggestedProductClick = new GTMTracker({
      //     id: 'productPageSuggestedProductClick',
      //     eventCategory: 'product links',
      //     eventAction: 'list selection',
      //     eventTrigger: 'click',
      //     eventLabel: '{{childText}}',
      //     eventTargetSelector: '.layout-product-listing [class*="reference-related-products-"] a, .layout-product-listing [class*="reference-related-products-"] a *,' +
      //         '.layout-product-listing [class*= "reference-products-"] a, .layout-product-listing [class*= "reference-products-"] a *',
      //     eventTargetClosestSelector: '[class*="reference-related-products-"], [class*= "reference-products-"]',
      //     eventTargetChildSelector: 'h3'
      // }).init();

      /*
       ***** Product Hub page End *****
       */

      /*
       ***** Product detail page Start *****
       */

      // Detail tab clicks
      // Did an user click user selects a tab to dynamically display different information
      // Category: product links| Action: detail tab | Label: {{tab name}}
      bpComponents.bpTrackers.productDetailTabsTracker = new GTMTracker({
        id: 'productDetailTabsTracker',
        eventCategory: 'article links',
        eventAction: 'detail tab',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.tabs-nav-item *',
        eventTargetClosestSelector: '.text-wrapper'
      }).init();

      /*
       ***** Product detail page End *****
       */

      /*
       ***** FAQs Start *****
       */

      // FAQ category selected
      // Did an user select category of FAQs to review? //Pm advil //
      // Category: faq links | Action: category selection | Label: category
      bpComponents.bpTrackers.faqCategorySelectedTracker = new GTMTracker({
        id: 'faqCategorySelectedTracker',
        eventCategory: 'faq links',
        eventAction: 'category selection',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.layout-faq .filter-item-js',
        eventTargetClosestSelector: '.filter-item-js'
      }).init();
      // FAQ category Links
      bpComponents.bpTrackers.faqCategorylinkSelectedTracker = new GTMTracker({
        id: 'faqCategorylinkSelectedTracker',
        eventCategory: 'faq links',
        eventAction: 'category selection',
        eventTrigger: 'click',
        eventLabel: '{{text}}',
        eventTargetSelector: '.reference-faq-top-page-links .richText h3 a',
        eventTargetClosestSelector: 'h3 a'
      }).init();

      // FAQ question clicks
      // Did an user click on a question to open or close the answer?
      // Category: faq | Action: {{open/close}} | Label: {{question text}}
      // Open FAQ Question
      bpComponents.bpTrackers.faqQuestionOpenTracker = new GTMTracker({
        id: 'faqQuestionOpenTracker',
        eventCategory: 'faq',
        eventAction: 'open',
        eventTrigger: 'click',
        eventLabel: '{{childText}}',
        eventTargetSelector: '.accordion-slide:not(.is-active) *',
        eventTargetClosestSelector: '.accordion-slide',
        eventTargetChildSelector: '.accordion-title-text'
      }).init();

      // Close FAQ Question
      bpComponents.bpTrackers.faqQuestionCloseTracker = new GTMTracker({
        id: 'faqQuestionCloseTracker',
        eventCategory: 'faq',
        eventAction: 'close',
        eventTrigger: 'click',
        eventLabel: '{{childText}}',
        eventTargetSelector: '.accordion-slide.is-active *',
        eventTargetClosestSelector: '.accordion-slide',
        eventTargetChildSelector: '.accordion-title-text'
      }).init();

      // Click on answer article
      // Did an user click on a link to an article embedded in an answer?
      // Category: article links | Action: faq click | Label: {{article name}}
      // Click on answer product
      // Did an user clicked on a link to a prudct embedded in an answer?
      // Category: product links | Action: faq click | Label: {{product name}}
      $(window).click(e => {
        const target = e.target;
        let isElement = Boolean(target) && typeof target.matches === 'function';
        let matched = isElement && target.matches('.accordion-content a');
        if (matched) {
          const link = $(target).attr('href') || '';
          if (Boolean(link)) {
            let category = 'article links';
            if (link.indexOf('products/') >= 0) {
              category = 'product links';
            }
            let eventData = {
              event: 'customEvent',
              eventCategory: category,
              eventAction: 'faq click',
              eventLabel: $(target).text()
            };
            dataLayer.push(eventData);
          }
        }
      });

      /*
       ***** FAQs End *****
       */
    });
  }
})(Cog.jQuery());
