/*eslint-disable*/
/*
 ** depricated component if not used on site
 ** can be commented out of index.js file
 */

($ => {
  //GTMTracker object
  let GTMTracker = function(trackersConfigSelector) {
    // no selector for configs provided
    if (!trackersConfigSelector) {
      console.warn('No trackersConfigSelector provided! Aborting!');
      return;
    }
    // storage for trackers
    this.trackers = {};
    let varsToReplace = '$id,$dataEvent,$dataEventCategory,$dataEventAction,$dataEventTrigger,$dataEventLabel,$dataEventTarget,$dataEventTargetParentSelector,$dataEventTargetSharerSelector,$dataEventTargetChildSelector,$dataEventDelay,$dataEventAnchorDelay'.split(
      ','
    );

    // converts strings with macros into string with values
    let getMacroString = function(element, string) {
      if (!element || arguments.length < 2 || element === null) return '';
      // check if element is jQuery collection and sets it if not
      element = element instanceof $ ? element : $(element);
      // create string to return
      let returnString = string;
      /*
       ** create object with macros
       ** each property represents macro
       ** {{propertyName}}
       */
      let macros = {
        text: element.text(),
        link: element.attr('href'),
        fullInternalLink: `${window.location.protocol}://${
          window.location.hostname
        }${element.attr('href')}`,
        pageUrl: window.location.href,
        hostName: window.location.hostname,
        rootUrl: `${window.location.protocol}://${window.location.hostname}`,
        sharerText: element.data('data-sharer')
          ? element.data('data-sharer').text()
          : '',
        parentText: element.data('data-parent')
          ? element.data('data-parent').text()
          : '',
        childText: element.data('data-child')
          ? element.data('data-child').text()
          : '',
        childLink: element.data('data-child')
          ? element.data('data-child').attr('href')
          : ''
      };
      // loop through macros and replace every occurance in given string
      for (let i in macros) {
        if (macros.hasOwnProperty(i)) {
          let re = new RegExp(`\{\{${i}\}\}`, 'ig');
          returnString = returnString.replace(re, macros[i]);
        }
      }
      // return converted string
      return returnString;
    };
    // loop through each tracker with given selector and sets it's own instance
    $(trackersConfigSelector).each((ind, el) => {
      // declare configuration element
      let config = $(el);

      // cleanup AEM variables
      varsToReplace.forEach((el, ind) => {
        let val = el;
        let attrs = config.get(0).attributes;
        for (let i in attrs) {
          if (attrs[i].value && attrs[i].value === val) attrs[i].value = '';
        }
      });
      // end of cleanup

      // declare configuration id
      let configId = config.attr('id');
      // if no id throw warning and skip to next configuration element
      if (configId === '') {
        console.warn('No trackerId specified. Skipping this tracker!');
        return;
      }
      // store current tracker configuration instance
      this.trackers[configId] = {
        dataEvent: config.attr('data-event'),
        dataEventCategory: config.attr('data-event-category'),
        dataEventAction: config.attr('data-event-action'),
        dataEventTrigger: config.attr('data-event-trigger'),
        dataEventLabel: config.attr('data-event-label'),
        dataEventTarget: config.attr('data-event-target'),
        dataEventTargetClosestParentSelector: config.attr(
          'data-event-target-parent-selector'
        ),
        dataEventTargetSharerSelector: config.attr(
          'data-event-target-sharer-selector'
        ),
        dataEventTargetChildSelector: config.attr(
          'data-event-target-child-selector'
        ),
        dataEventDelay: parseInt(config.attr('data-event-delay')),
        dataEventAnchorDelay: parseInt(config.attr('data-event-anchor-delay')),
        debug: Function(`return ${config.attr('data-debug')}`)()
      };
    });
    // loop through each stored tracker and attach actions
    for (let i in this.trackers) {
      // get stored tracker data
      let trackerData = this.trackers[i];
      // attach event to top level element, catch and filter actions by selector (event delegation)
      $('body').on(trackerData.dataEventTrigger, e => {
        // get event target
        let t = $(e.target);
        // check if target is given selector or any of it's children
        if (
          t.is(
            `${trackerData.dataEventTarget}, ${trackerData.dataEventTarget} *`
          )
        ) {
          // check if event target is an anchor to setup a redirection delay
          let isAnchor = t.is('a');
          // stores current link in a variable or sets it to false if event target is not a link
          let anchorLink = isAnchor ? t.attr('href') : false;
          // prevents redirection if event target is a link
          if (isAnchor && !t.target('_blank') && !t.rel('noopener noreferrer'))
            e.preventDefault();
          // sets timeout (delay) based on current tracker dataEventDelay
          setTimeout(() => {
            // set t as actual desired target
            t = t.closest(`${trackerData.dataEventTarget}`);
            // stores related elements as jquery collections as a data to dataEventTarget
            // if parent exists set data accordingly
            if (
              trackerData.dataEventTargetClosestParentSelector !== '' &&
              t.closest(`${trackerData.dataEventTargetClosestParentSelector}`)
                .length > 0
            ) {
              t.data({
                // closest parent selector
                'data-parent': t
                  .closest(
                    `${trackerData.dataEventTargetClosestParentSelector}`
                  )
                  .eq(0),
                // closest parent -> data sharer selector
                'data-sharer':
                  t
                    .closest(
                      `${trackerData.dataEventTargetClosestParentSelector}`
                    )
                    .find(`${trackerData.dataEventTargetSharerSelector}`)
                    .length > 0
                    ? t
                        .closest(
                          `${trackerData.dataEventTargetClosestParentSelector}`
                        )
                        .find(`${trackerData.dataEventTargetSharerSelector}`)
                        .eq(0)
                    : false,
                // child based on target-child-selector
                'data-child':
                  t.find(`${trackerData.dataEventTargetChildSelector}`).length >
                  0
                    ? t
                        .find(`${trackerData.dataEventTargetChildSelector}`)
                        .eq(0)
                    : false
              });
            }
            // if parent do not exists set only child if exists
            else {
              t.data({
                // closest parent selector
                'data-parent': false,
                // closest parent -> data sharer selector
                'data-sharer': false,
                // child based on target-child-selector
                'data-child':
                  t.find(`${trackerData.dataEventTargetChildSelector}`).length >
                  0
                    ? t
                        .find(`${trackerData.dataEventTargetChildSelector}`)
                        .eq(0)
                    : false
              });
            }

            // if debuging is enabled
            if (trackerData.debug) {
              console.log(
                getMacroString(
                  t,
                  `
                dataLayer.push({
                  'event':'${trackerData.dataEvent}',
                  'eventCategory': '${trackerData.dataEventCategory}',
                  'eventAction':'${trackerData.dataEventAction}',
                  'eventLabel':'${trackerData.dataEventLabel}'
                });
              `
                )
              );
              try {
                // try to push data to GTM's dataLayer
                dataLayer.push({
                  event: getMacroString(t, trackerData.dataEvent),
                  eventCategory: getMacroString(
                    t,
                    trackerData.dataEventCategory
                  ),
                  eventAction: getMacroString(t, trackerData.dataEventAction),
                  eventLabel: getMacroString(t, trackerData.dataEventLabel)
                });
              } catch (e) {
                console.warn(e);
              }
            } else {
              try {
                // try to push data to GTM's dataLayer
                dataLayer.push({
                  event: getMacroString(t, trackerData.dataEvent),
                  eventCategory: getMacroString(
                    t,
                    trackerData.dataEventCategory
                  ),
                  eventAction: getMacroString(t, trackerData.dataEventAction),
                  eventLabel: getMacroString(t, trackerData.dataEventLabel)
                });
              } catch (e) {
                console.warn(e);
              }

              // delays anchor link redirection for GTM to store the data first
              if (
                isAnchor &&
                anchorLink &&
                (trackerData.dataEventTrigger === 'click' ||
                  trackerData.dataEventTrigger === 'tap')
              ) {
                setTimeout(() => {
                  location.href = anchorLink;
                }, trackerData.dataEventAnchorDelay);
              }
            }
          }, trackerData.dataEventDelay);
        }
      });
    }
  };
  $(document).ready(e => {
    // create instance of GTMTracker
    window.gtmtrack = new GTMTracker('.gtm-tracker-configurator');
  });
})(Cog.jQuery());
/*eslint-enable*/
