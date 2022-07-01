($ => {
  //for Custom Dimesions
  let locale = document.querySelector('html').getAttribute('lang') || '';
  let language = locale.split('-')[0].toLowerCase();
  let country = locale.split('-')[1].toLowerCase();
  window.addEventListener('load', () => {
    dataLayer.push({
      event: 'customDimensions',
      language: language,
      country: country,
      brand: 'Haleon'
    });
  });

  const EXTERNAL_LINK_SELECTOR = 'a.external, a.external *';
  const VALID_LINK_SELECTOR =
    'a[href]:not(.external):not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"]), a:not(.external):not([href^="#"]):not([href^="tel:"]):not([href^="mailto:"]) *';

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
        cfg.eventTrigger === 'scroll'
      ) {
        baseElement = window;
      }

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
            ? `${window.location.protocol}//${window.location.hostname}${link}`
            : link,
          title: baseElement.title ? baseElement.title : 'null',
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
          filterSelectedLabel: baseElementIsElement
            ? (() => {
                return baseElement.dataset.label;
              })()
            : 'null',
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
          //Custom macros for HVA Tagging:
          countryWithLanguage: baseElement.textContent
            ? baseElement.textContent
                .replace(')', '')
                .split(' (')
                .join(':')
            : 'null',
          slidesCount: () => {
            let slides = document.querySelectorAll(
              '.carousel-wrapper .carousel-slide:not(.clone)'
            );
            let slideName = document.querySelectorAll(
              '.carousel-wrapper .active.carousel-slide:not(.clone) .carousel-content h3'
            )[0].textContent;
            for (let i = 0; i < slides.length; i++) {
              if (slides[i].classList.contains('active')) {
                return `${i + 1} : ${slideName}`;
              }
            }
          },
          slidesCount2: () => {
            let slides = document.querySelectorAll(
              '.common-questions-homepage .carousel-slide'
            );
            let slideName = document.querySelectorAll(
              '.common-questions-homepage .active.carousel-slide .carousel-content h3'
            )[0].textContent;
            for (let i = 0; i < slides.length; i++) {
              if (slides[i].classList.contains('active')) {
                return `${i + 1} : ${slideName}`;
              }
            }
          },
          productName:
            baseElement !== null &&
            typeof baseElement.getAttribute === 'function'
              ? baseElement.getAttribute('data-gtm-product-name')
              : 'null',
          altText:
            baseElement !== null &&
            typeof baseElement.getAttribute === 'function'
              ? baseElement.getAttribute('alt')
              : 'null',
          reviewId:
            baseElement !== null &&
            typeof baseElement.getAttribute === 'function'
              ? baseElement.getAttribute('data-content-id')
              : 'null'
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

      if (!globalDebug) {
        if (data.eventIndex) {
          dataLayer[data.eventIndex] = data.pushObject;
        } else {
          dataLayer.push(data.pushObject);
        }
      }

      if (cfg.debug) console.log(JSON.stringify(data.pushObject, null, 2));
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
          } catch (error) {}

          isElement = typeof t.matches === 'function';
          matched = isElement && t.matches(`${cfg.eventTargetSelector}`);
          if (matched && cfg.eventTargetSelector === VALID_LINK_SELECTOR) {
            const closestLink = this.closest(t, cfg.eventTargetClosestSelector);
            let isExternalLink = closestLink.host.indexOf(location.host) === -1;
            if (
              cfg.eventTargetSelector === VALID_LINK_SELECTOR &&
              isExternalLink
            ) {
              matched = false;
            } else if (
              cfg.eventTargetSelector === EXTERNAL_LINK_SELECTOR &&
              isExternalLink
            ) {
              matched = true;
            }
          }
          const isLink = isElement && t.matches(VALID_LINK_SELECTOR);
          if (
            !matched &&
            isLink &&
            cfg.eventTargetSelector === EXTERNAL_LINK_SELECTOR
          ) {
            const closestLink = this.closest(t, cfg.eventTargetClosestSelector);
            let isExternalLink = closestLink.host.indexOf(location.host) === -1;
            if (
              cfg.eventTargetSelector === VALID_LINK_SELECTOR &&
              isExternalLink
            ) {
              matched = false;
            } else if (
              cfg.eventTargetSelector === EXTERNAL_LINK_SELECTOR &&
              isExternalLink
            ) {
              matched = true;
            }
          }
          t = matched ? this.closest(t, cfg.eventTargetClosestSelector) : t;
          isAnchor = isElement && t.matches('a[href]');
          hashLink =
            isElement && isAnchor && t.matches('a[href^="#"]') ? true : false;
          external = isAnchor && t.matches('.external');

          if (cfg.debug || (isAnchor && !hashLink)) e.preventDefault();

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

  window.GTMTracker = GTMTracker;
})(Cog.jQuery());
