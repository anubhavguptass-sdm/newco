($ => {
  if ($('html').attr('lang') === 'en-US') {
    $(document).ready(e => {
      /*
       ***** Default Global Site Interaction Start *****
       */

      // // Did a user click any internal links not outlined elsewhere in this document?
      // // tracks all internal links click - no class needed
      // // Category: internal links | Action: {{link text}} | Label: {{destination URL}}
      bpComponents.bpTrackers.internalLinksTracker = new GTMTracker({
        id: 'internalLinksTracker',
        eventCategory: 'internal links',
        eventAction: '{{text}}',
        eventTrigger: 'click',
        eventLabel: '{{fullInternalLink}}',
        eventTargetSelector:
          'a[href]:not(.external):not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"]), a:not(.external):not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"]) *',
        eventTargetClosestSelector: 'a'
      }).init();

      // // Did a user click any external links not outlined elsewhere in this document?
      // // tracks all external links, no class needed
      // // Category: external links | Action: {{link text}} | Label: {{destination URL}}
      bpComponents.bpTrackers.externalLinksTracker = new GTMTracker({
        id: 'externalLinksTracker',
        eventCategory: 'external links',
        eventAction: '{{text}}',
        eventTrigger: 'click',
        eventLabel: '{{link}}',
        eventTargetSelector: 'a.external, a.external *',
        eventTargetClosestSelector: 'a'
      }).init();

      // Document/file downloads
      // Clicks on a link to common downloadable content (usually PDF)
      // Category: downloads | Action: {{link text}} | Label: {{file URL}}
      bpComponents.bpTrackers.fileDownloadTracker = new GTMTracker({
        id: 'fileDownloadTracker',
        eventCategory: 'downloads',
        eventAction: '{{text}}',
        eventTrigger: 'click',
        eventLabel: '{{link}}',
        eventTargetSelector: 'a[href$=".pdf"], a[href$=".pdf"] *',
        eventTargetClosestSelector: 'a'
      }).init();

      // Did a user try to email GSK
      // Covered with Brilliant Basics for all ‘mailto’ links
      // Category: mailto links | Action: email address click | Label: {{URL where click occured}}
      bpComponents.bpTrackers.contactMailLinkTracker = new GTMTracker({
        id: 'contactMailLinkTracker',
        eventCategory: 'mailto links',
        eventAction: 'email address click',
        eventTrigger: 'click',
        eventLabel: '{{pageUrl}}',
        eventTargetSelector: 'a[href^="mailto:"], a[href^="mailto:"] *',
        eventTargetClosestSelector: 'a[href^="mailto:"]'
      }).init();

      // Did a user try to call GSK
      // If one phone number listed: covered by Brilliant Basics (pending feature) for all ‘tel’ links
      // Category: telephone links | Action: phone number click | Label: {{page URL}}
      bpComponents.bpTrackers.contactPhoneLinkTracker = new GTMTracker({
        id: 'contactPhoneLinkTracker',
        eventCategory: 'telephone links',
        eventAction: 'phone number click',
        eventTrigger: 'click',
        eventLabel: '{{pageUrl}}',
        eventTargetSelector: 'a[href^="tel:"], a[href^="tel:"] *',
        eventTargetClosestSelector: 'a[href^="tel:"]'
      }).init();

      /*
       ***** Default Global Site Interaction End *****
       */
    });
  }
})(Cog.jQuery());
