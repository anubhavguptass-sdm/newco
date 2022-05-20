/*eslint-disable*/
($ => {
  // comment / uncomment trakers to exclude / include trackers from site
  // to add a new tracker create a new record in Array and create tracker at the end of the file
  const includedTrackers = [];

  //GTMTracker class
  class GTMTracker {
    static error = (msg, id) => {
      console.warn(`GTMTracker: ${msg}. In ${id}`);
    };

    static initCheck = ['eventTrigger'];
    #maxScrolled = 0;
    #config = {
      id: `gtmtracker${new Date().getTime() +
        Math.floor(Math.random() * (1000 * 1000))}`,
      eventCategory: 'Unspecified category',
      eventAction: '',
      eventTrigger: null,
      eventLabel: 'Unspecified label',
      eventTargetSelector: '',
      eventTargetClosestSelector: '',
      eventTargetParentSelector: '',
      eventTargetSharerSelector: '',
      eventTargetChildSelector: '',
      eventDelay: 0,
      pushOnce: false,
      keepMaxScroll: false,
      formValidation: false,
      debug: false
    };
    #ready = false;

    constructor(config = {}) {
      Object.assign(this.#config, config);
      Object.keys(this.#config).forEach(key => {
        Object.defineProperty(this, key, {
          get: function() {
            return this.#config[key];
          },
          set: function(value) {
            this.#config[key] = value;
          }
        });
      });

      return this;
    }

    closest = (element, selector) => {
      if (typeof selector !== 'string') return false;
      let current = element;
      while (current !== document.documentElement) {
        if (current.matches(selector)) return current;
        current = current.parentElement;
      }
      return null;
    };

    next = (element, selector) => {
      if (typeof selector !== 'string') return false;
      let current = element.nextSibling;
      while (typeof current.nextSibling === 'object') {
        if (typeof current.matches !== 'function') {
          current = current.nextSibling;
          continue;
        }
        if (current.matches(selector)) return current;
        current = current.nextSibling;
      }
      return null;
    };

    prev = (element, selector) => {
      if (typeof selector !== 'string') return false;
      let current = element.previousSibling;
      while (typeof current.previousSibling === 'object') {
        if (typeof current.matches !== 'function') {
          current = current.previousSibling;
          continue;
        }
        if (current.matches(selector)) return current;
        current = current.previousSibling;
      }
      return null;
    };

    getData = baseElement => {
      let cfg = this.#config,
        dlObject = {
          event: 'customEvent',
          eventCategory: cfg.eventCategory,
          eventAction: cfg.eventAction,
          eventLabel: cfg.eventLabel
        },
        dlObjectStringified = JSON.stringify(dlObject),
        eventIndex =
          typeof this.eventIndex === 'number' ? this.eventIndex : false;
      if (
        typeof baseElement.matches !== 'function' &&
        (cfg.eventTrigger === 'scroll' || cfg.eventTrigger === 'load')
      ) {
        baseElement = window;
      }

      if (
        cfg.eventTrigger === 'load' &&
        cfg.eventCategory === 'site search' &&
        document.querySelectorAll('.component.searchResults').length < 1
      )
        return;

      if (!baseElement) {
        GTMTracker.error('No base element specified!', cfg.id);
        return false;
      }

      /*
       ** create object with macros
       ** each property represents macro
       ** {{propertyName}}
       */

      //  console.log(baseElement !== window)
      let link = window !== baseElement ? baseElement.getAttribute('href') : '',
        eh =
          baseElement !== window
            ? baseElement.offsetHeight
            : window.innerHeight,
        sh =
          (baseElement !== window
            ? baseElement.scrollHeight
            : document.documentElement.scrollHeight) - eh,
        st = baseElement !== window ? baseElement.scrollTop : window.scrollY,
        percScroll = (st / sh) * 100;

      this.#maxScrolled =
        this.#maxScrolled > percScroll && cfg.keepMaxScroll
          ? this.#maxScrolled
          : percScroll;

      let parent =
          cfg.eventTargetParentSelector !== '' && window !== baseElement
            ? this.closest(baseElement, cfg.eventTargetParentSelector)
            : null,
        sharer =
          parent !== null && cfg.eventTargetSharerSelector !== ''
            ? parent.querySelector(cfg.eventTargetSharerSelector)
            : null,
        child =
          cfg.eventTargetChildSelector !== ''
            ? baseElement.querySelector(cfg.eventTargetChildSelector)
            : null,
        baseElementIsElement =
          baseElement !== null && typeof baseElement.matches === 'function',
        macros = {
          text: baseElement.textContent,
          link: link,
          fullInternalLink: !/https?:\/\/(www\.)?/gim.test(link)
            ? `${window.location.protocol}://${window.location.hostname}${link}`
            : link,
          pageUrl: window.location.href,
          hostName: window.location.hostname,
          rootUrl: `${window.location.protocol}://${window.location.hostname}`,
          sharerText: sharer !== null ? sharer.textContent : 'null',
          parentText: parent !== null ? parent.textContent : 'null',
          parentTitle: parent !== null ? parent.getAttribute('title') : 'null',
          sharerTitle: sharer !== null ? sharer.getAttribute('title') : 'null',
          childTitle: child !== null ? child.getAttribute('title') : 'null',
          childText: child !== null ? child.textContent : 'null}',
          childLink:
            child !== null && typeof child.getAttribute('href') !== 'undefined'
              ? child.getAttribute('href')
              : 'null',
          scrollTop: baseElement.scrollTop,
          scrollTopPercentage: `${this.#maxScrolled.toFixed(2)}%`,
          accordionOpenedClosed: baseElementIsElement
            ? (() => {
                return baseElement.matches('.is-active') ? 'open' : 'close';
              })()
            : 'null',
          productRating: () => {
            try {
              return document.querySelector('.bv-rating-helper').textContent;
            } catch (error) {
              return 'Not rated';
            }
          },
          formName: () => {
            try {
              let name = baseElement.id.replace(/\-/gi, ' ');
              name = name.charAt(0).toUpperCase() + name.slice(1);
              return name;
            } catch (error) {
              return '';
            }
          },
          validationErrors: () => {
            let errors = [];
            baseElement
              .querySelectorAll('.gigya-error-msg-active')
              .forEach(err => {
                try {
                  errors.push(
                    this.prev(err, 'label')
                      .textContent.replace(/\n|^\s*|\s*$/gim, '')
                      .replace(/\s{2,}/gim, ' ')
                  );
                } catch (error) {
                  console.warn(error);
                }
              });
            return errors.join(' / ');
          },
          comparedProducts: () => {
            try {
              let first = sharer,
                second = this.next(sharer, '.box');

              first = `${first
                .querySelector('.product-card-title')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')} ${first
                .querySelector('.product-card-subtitle')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')}`;
              second = `${second
                .querySelector('.product-card-title')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')} ${second
                .querySelector('.product-card-subtitle')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')}`;
              return `${first} vs. ${second}`;
            } catch (error) {
              return '';
            }
          },
          reviewId: () => {
            try {
              return parent.dataset.contentId.replace(/reviews?\-/gi, '');
            } catch (error) {
              return '';
            }
          },
          benefitOrIngredient: () => {
            try {
              return document
                .querySelector('.ingredients-tabs-tracker .is-active')
                .textContent.replace(/\s/g, '');
            } catch (error) {
              return '';
            }
          },
          cardProductName: () => {
            try {
              let pName = `${parent
                .querySelector('.product-card-title')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')} ${parent
                .querySelector('.product-card-subtitle')
                .textContent.replace(/\n|^\s*|\s*$/gim, '')
                .replace(/\s{2,}/gim, ' ')}`;
              return pName;
            } catch (error) {
              return '';
            }
          },
          productRatingGeneral: () => {
            try {
              let ratings = {
                poor: 'Negative',
                fair: 'Negative',
                average: 'Neutral',
                good: 'Positive',
                excellent: 'Positive'
              };
              return ratings[
                document
                  .querySelector('.bv-rating-helper')
                  .textContent.toLowerCase()
                  .replace(/\s/g, '')
              ];
            } catch (error) {
              return 'Not rated';
            }
          },
          filterSelectedLabel: baseElementIsElement
            ? (() => {
                return baseElement.dataset.label;
              })()
            : 'null',
          socialNetwork: () => {
            try {
              return baseElement.dataset.service;
            } catch (error) {
              return '';
            }
          },
          searchPhrase: () => {
            try {
              return document.querySelectorAll('.searchResults-term').length > 0
                ? document
                    .querySelector('.searchResults-term')
                    .textContent.replace(/^\s*|\s*$/g, '')
                : '';
            } catch (error) {
              return '';
            }
          },
          searchResultsCount: () => {
            try {
              return document.querySelectorAll('.searchResults-number').length >
                0
                ? parseInt(
                    document.querySelector('.searchResults-number').textContent
                  )
                : 0;
            } catch (error) {
              return 0;
            }
          },
          articleType: () => {
            try {
              return parent.classList
                .toString()
                .match(/article-tracker-([^\s]+)/i)[1];
            } catch (err) {
              return '';
            }
          },
          productType: () => {
            try {
              return parent.classList
                .toString()
                .match(/products-tracker-([^\s]+)/i)[1];
            } catch (err) {
              return '';
            }
          },
          email: () => {
            try {
              return baseElement
                .getAttribute('href')
                .match(
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                )[0];
            } catch (error) {
              return '';
            }
          },
          phone: () => {
            try {
              return baseElement.getAttribute('href').replace(/tel\:/gi, '');
            } catch (error) {
              return '';
            }
          },
          dropdownParentText: () => {
            try {
              return parent.matches('.megamenu-submenu-item')
                ? parent.getAttribute('data-link-title')
                : parent.previousSibling.textContent;
            } catch (error) {
              return '';
            }
          },
          filterStatus: () => {
            try {
              return this.closest(baseElement, '.filter-container-js').matches(
                '.opened-js'
              )
                ? 'open'
                : 'close';
            } catch (error) {
              return '';
            }
          },
          filterSelectedGroup: () => {
            try {
              return baseElement.dataset.filterGroup;
            } catch (error) {
              return '';
            }
          },
          filterSelectedItem: () => {
            try {
              return baseElement.dataset.label;
            } catch (error) {
              return '';
            }
          }
        };
      // loop through macros and replace every occurance in given string
      Object.entries(macros).forEach(entry => {
        if (typeof entry[1] === 'undefined' || entry[1] === null) return;
        let re = new RegExp(`\{\{${entry[0]}\}\}`, 'igm');
        entry[1] =
          typeof entry[1].trim === 'function' ? entry[1].trim() : entry[1];
        dlObjectStringified = dlObjectStringified.replace(re, entry[1]);
      });
      // return converted string
      return {
        pushObject: JSON.parse(dlObjectStringified),
        eventIndex: eventIndex
      };
    };

    enable = () => {
      this.disabled = false;
    };

    disable = () => {
      this.disabled = true;
    };

    process = (element, isLink, link, external) => {
      try {
        if (this.disabled) {
          return;
        }
        this.disable();
        setTimeout(() => {
          this.enable();
        }, 1);
        if (
          typeof dataLayer !== 'object' ||
          !Array.isArray(dataLayer) ||
          (dataLayer && !dataLayer.hasOwnProperty('push'))
        )
          return;

        let cfg = this.#config,
          globalDebug = document.querySelectorAll('.gtm-debug').length > 0;

        if (globalDebug || cfg.debug === true) cfg.debug = true;
        else cfg.debug = false;

        if (cfg.pushOnce && !this.uniquieEventId && !this.eventIndex) {
          this.uniquieEventId =
            dataLayer[dataLayer.length - 1]['gtm.uniqueEventId'];
          this.eventIndex = dataLayer.length - 1;
        }

        let data = this.getData(element);

        if (isLink && typeof link === 'string' && !external && !cfg.debug) {
          data.pushObject.eventCallback = function() {
            if (element.matches('a[target="_blank"]')) window.open(link);
            else window.location = link;
          };
        }

        if (
          !globalDebug &&
          (!cfg.formValidation ||
            (cfg.formValidation &&
              element.querySelectorAll('.gigya-error-msg-active').length > 0))
        ) {
          if (data.eventIndex) {
            dataLayer[data.eventIndex] = data.pushObject;
          } else {
            dataLayer.push(data.pushObject);
          }
        }

        if (cfg.debug) console.log(JSON.stringify(data.pushObject, null, 2));
      } catch (error) {
        let cfg = this.#config;
        if (cfg.debug)
          console.warn(`Issue while processing GTMTracker DATA on ${cfg.id}!`);
      }
    };

    init = () => {
      let cfg = this.#config,
        canInit = true;

      if (this.#ready) {
        GTMTracker.error('Already initiated!', cfg.id);
        return this;
      }

      GTMTracker.initCheck.forEach(entry => {
        if (!cfg || cfg[entry] === null) {
          GTMTracker.error(`${entry} not specified!`, cfg.id);
          canProcess = false;
          return;
        }
      });

      if (!canInit) return this;

      window.addEventListener(
        cfg.eventTrigger,
        e => {
          if (
            typeof dataLayer !== 'object' ||
            !Array.isArray(dataLayer) ||
            (dataLayer && !dataLayer.hasOwnProperty('push'))
          ) {
            if (typeof window._gtm_error_warned !== 'boolean') {
              console.warn(
                'dataLayer is not present but GTMTracker is set! Please either turn off GTMTracker or setup GTM on this page!'
              );
              window._gtm_error_warned = true;
            }
            return;
          }
          let isAnchor, t, matched, isElement, external, hashLink;

          t = e.target;
          try {
            if (
              t.matches(
                '.navigation-item-decoration, .navigation-item-decoration *'
              )
            )
              return;
          } catch (error) {
            // console.warn(error)
            // return
          }

          isElement = typeof t.matches === 'function';
          matched = isElement && t.matches(`${cfg.eventTargetSelector}`);
          t = matched ? this.closest(t, cfg.eventTargetClosestSelector) : t;
          isAnchor = isElement && t.matches('a[href]');
          hashLink =
            isElement && isAnchor && t.matches('a[href^="#"]') ? true : false;
          external = isAnchor && t.matches('.external');

          // if (cfg.debug || (isAnchor && !hashLink)) e.preventDefault()

          if (matched && !t.delayed && cfg.eventTrigger !== 'scroll') {
            if (cfg.eventDelay > 0) {
              setTimeout(() => {
                this.process(t, isAnchor, t.getAttribute('href'), external);
              }, cfg.eventDelay);
            } else {
              this.process(t, isAnchor, t.getAttribute('href'), external);
            }
          }

          if (
            cfg.eventTrigger === 'scroll' &&
            cfg.eventTargetSelector === 'body'
          ) {
            setTimeout(() => {
              this.process(t);
            }, cfg.eventDelay);
          }

          if (
            cfg.eventTrigger === 'load' &&
            cfg.eventTargetSelector === 'body'
          ) {
            setTimeout(() => {
              this.process(t);
            }, cfg.eventDelay);
          }
        },
        true
      );

      this.#ready = true;
      return this;
    };
  }

  GTMTracker.debug = () => {
    if (document.body.matches('.gtm-debug')) {
      document.body.classList.remove('gtm-debug');
      Object.entries(window.bpComponents.bpTrackers).forEach(
        entry => (entry[1].debug = false)
      );
    } else document.body.classList.add('gtm-debug');
  };

  $(document).ready(e => {
    // this is a simple example tracker that tracks clicks to any img elements
    // register this tracker to a bpComponents Object
    bpComponents.bpTrackers.exampleTracker = new GTMTracker({
      id: 'exampleTracker',
      // event category | macros avilable
      eventCategory: 'custom event category {{text}}',
      // event action | macros avilable
      eventAction: 'custom event action {{childText}}',
      // event trigger | could be almost any js event |  macros not avilable
      eventTrigger: 'click',
      // event label | macros available
      eventLabel: '{{sharerText}}',
      // event target css selctor
      eventTargetSelector: 'p, p *',
      // event target closest selector should be always defined. serves as a base for macros
      eventTargetClosestSelector: 'p',
      // could be used to get data from children based on selector with a macro
      eventTargetChildSelector: 'span',
      // could be used to get data from parent based on selector with a macro,
      // also serves as a base for targeting data sharer
      eventTargetParentSelector: 'body',
      // sharers serves as shared data holders, you can retrive data out of any element on page
      // requires eventTargetParentSelector to be sat and valid
      // data sharer than can be selected with a css selector from parent base
      // in this case {{sharerText}} macro will always gets h1 text of the current page when clicked to any p element
      eventTargetSharerSelector: 'h1',
      // push only once default: false
      pushOnce: false,
      // form validation will check gigya forms for any errors
      formValidation: false,
      // if debug set to true, nothing is pushed to dataLayer rather than output to console
      debug: false
    }).init();
  });

  window.GTMTracker = GTMTracker;
})(Cog.jQuery());
/*eslint-enable*/
