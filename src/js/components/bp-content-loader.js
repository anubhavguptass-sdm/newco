/*
 **  BP CONTENT LOADER
 **  component can load external (not crossDomain) data to it's parent element
 **  available settings:
 **  source, update interval, preloader image, elements to load, initiation trigger, order of elements can be set
 **/
(function($) {
  const loadData = (el, insert) => {
      insert = typeof insert === 'boolean' ? insert : true;
      if (!window.bpComponents.bpLoaders[el.data.id])
        window.bpComponents.bpLoaders[el.data.id] = el;

      /*
       ** this method covers entire process of loading content to its container
       ** el: Element
       */
      if (!el) return; // if element not defined or missing argument... stop

      // declare vars
      let t = $(el), // root element
        data = t.data(); // root element data

      // check and set insertLoadedContent method
      if (typeof el.insertLoadedContent !== 'function') {
        el.insertLoadedContent = insertLoadedContent;
      }
      // trigger loadContent with content path (url) defined in data
      loadContent(data.contentPath, false, t, insert);
    },
    setData = el => {
      insert = typeof insert === 'boolean' ? insert : true;
      if (!window.bpComponents.bpLoaders[el.data.id])
        window.bpComponents.bpLoaders[el.data.id] = el;

      if (!el) return; // if element not defined or missing argument... stop
      // check and set insertLoadedContent method
      if (typeof el.insertLoadedContent !== 'function') {
        el.insertLoadedContent = insertLoadedContent;
      }
    },
    clearPreloader = from => {
      let t = $(from);
      t.removeClass('loading')
        .addClass('loaded')
        .css({
          'max-height': t.prop('scrollHeight')
        });
    };
  (insertLoadedContent = function(insert) {
    insert = typeof insert === 'boolean' ? insert : true;

    let t = $(this), // initiator Element
      data = t.data(), // initiator's data
      DOM;
    // check if is actual content loader container
    if (data.isContainer) {
      // if (data.updateInterval === 0) {
      //   t.empty()
      // }

      if (
        data.contentSelector !== null &&
        data.contentSelector !== 'null' &&
        insert
      ) {
        // set DOM object
        DOM = data.DOM;
        // declare variables
        let collection, collectionBase, appendContent, prevContent;

        // if random placement selected
        if (data.contentPlacement === 'random') {
          // shuffle and set conllection
          collectionBase = DOM.find(data.contentSelector).sort(function() {
            return Math.round(Math.random()) - 0.5;
          });
          // if limit of elements is set slice
          collection =
            data.contentLimit > 0
              ? collectionBase.slice(0, data.contentLimit)
              : collectionBase;
        }
        // based on "selector" means order of selector occurrence
        if (data.contentPlacement === 'selector') {
          // collectionBase Array needs to be created first

          collection = []; // declare empty array
          // iterate over each element in collectionBase and push each to collection to create "selector" based order
          $(data.contentSelector.split(/, ?/gi)).each((ind, el) => {
            DOM.find(el).each((i, e) => {
              collection.push(e);
            });
          });
          // if limit of elements is set slice
          collection =
            data.contentLimit > 0
              ? collection.splice(0, data.contentLimit)
              : collection;
        }
        // native selector order (defined by jQuery)
        if (data.contentPlacement === 'native') {
          // if limit of elements is set slice when creating collection
          collection =
            data.contentLimit > 0
              ? $(
                  DOM.find(data.contentSelector)
                    .get()
                    .slice(0, data.contentLimit)
                )
              : DOM.find(data.contentSelector);
        }
        // reversed collection
        if (data.contentPlacement === 'reverse') {
          collection =
            data.contentLimit > 0
              ? $(
                  DOM.find(data.contentSelector)
                    .get()
                    .reverse()
                    .slice(0, data.contentLimit)
                )
              : $(
                  DOM.find(data.contentSelector)
                    .get()
                    .reverse()
                );
        }
        // append created collection with cloned elements so data DOM stays untouched
        prevContent = t.find('> *:not(.achild)');
        if (t.find('> .achild').length === 0) {
          t.append($('<a class="achild"></a>').hide());
        }

        let timeOut = (int => {
          let map = {
              ms: 1,
              s: 1000
            },
            unit = int.match(/[^0-9\.]+/gi)[0];
          return parseFloat(int) * map[unit];
        })(window.getComputedStyle(t.get(0), null).transitionDuration);

        appendContent = $(collection).clone();
        if (appendContent.length > 0) {
          t.append(appendContent);
          prevContent.css('margin-top', '-100%');
          if (data.updateInterval > 0)
            t.css('max-height', t.prop('scrollHeight'));
          // remove preloader
          t.removeClass('loading').addClass('loaded');
          setTimeout(() => {
            prevContent.remove();
            if (data.updateInterval > 0) t.addClass('loading');
          }, timeOut + 1);

          // if update interval is greater than 0s and interval not yet set => create interval
          if (data.updateInterval > 0 && !data.isSet) {
            $(this).addClass('bp-content-loader-updated');
            $(this)
              .data({
                updater: new Interval(() => {
                  insertLoadedContent.apply(this);
                }, data.updateInterval * 1000) // interval is converted from seconds to ms
              })
              .on('mouseenter', () => {
                let updater = $(this).data('updater');
                if (window._focused) {
                  updater.pause();
                }
              })
              .on('mouseleave', () => {
                let updater = $(this).data('updater');
                if (window._focused) {
                  updater.resume();
                }
              });

            // declare that interval has been already set
            t.data('isSet', true);
          }
        } else {
          let msg =
              typeof data.noDataMessage === 'string' &&
              data.noDataMessage !== ' ' &&
              data.noDataMessage !== null
                ? data.noDataMessage
                : 'No matching content',
            noDataHeading = $(`<span class="nodata-${data.id}">${msg}</span>`),
            errMxgContainer = $(`span.nodata-${data.id}`);

          if (errMxgContainer.length > 0) errMxgContainer.text(msg);
          else t.append(noDataHeading);
        }
      } else {
        let dp = new DOMParser();
        let theDom = dp.parseFromString(data.DOM, 'text/html');
        t.html(
          $(theDom)
            .find('body')
            .html()
        )
          .removeClass('loading')
          .addClass('loaded');
      }

      if (
        data.updateInterval > 0 &&
        data.showStatusBar &&
        typeof $(this).data().statusBar === 'undefined'
      ) {
        $(this).data({
          statusBar: $('<div class="bp-content-loader-statusbar"/>').appendTo(
            t.parent()
          )
        });
        t.parent().css({
          position: 'relative'
        });
        $(this).data().updater.onUpdate = objData => {
          $(this)
            .data()
            .statusBar.css(
              'width',
              `${(objData.remaining / objData.interval) * 100}%`
            );
        };
      }

      clearPreloader(this);
      try {
        setTimeout(() => {
          $(window).trigger('resize');
          Function(`${data.onContentLoaded}`).call(this, null);
        }, timeStriToMs(data.transitionTiming) + 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }),
    (loadContent = (src, second, initiator, insert) => {
      /*
       ** this method loads actual content from source
       ** src: STRING url / path of content page or file
       ** second: BOOLEAN specifies if second attempt is being executed
       ** initiator: jQuery Object element that initiates content loading
       */

      if (!src || src === '' || typeof second !== 'boolean' || !initiator.data)
        return false; // check all arguments correctness

      if (!(initiator instanceof $)) {
        let ndata = initiator.data;
        initiator = $(initiator);
        initiator.data(ndata);
      }

      let data = initiator.data();

      // show preloader image
      $(initiator)
        .addClass('loading')
        .removeClass('loaded')
        .css({
          'max-height': ''
        });

      let startLoadingIn = 1;
      try {
        if (typeof data.onBeforeLoad === 'string') {
          Function(`${data.onBeforeLoad}`).call(initiator, null);
        }
        if (typeof data.transitionTiming === 'string') {
          // startLoadingIn = timeStriToMs(data.transitionTiming) + 100
          startLoadingIn = 1;
        }
      } catch (error) {
        console.warn(error);
      }

      setTimeout(() => {
        $.ajax({
          type: 'get',
          dataType: 'html',
          url: src || data.contentPath,
          success: response => {
            // create jQuery collection out of html response ie pseudo DOM
            let DOM =
              data.contentSelector === null || data.contentSelector === 'null'
                ? response
                : $(response);
            // set DOM data object to be accessable by other programs
            if (typeof insert !== 'undefined' && insert === false) {
              initiator.data('DOM', DOM);
              return;
            }
            initiator
              .data('DOM', DOM)
              .get(0)
              .insertLoadedContent(insert); // initiate Element's insertLoadedContent method
          },
          error: err => {
            // on error try to append source with HTML extension and initiate
            // senond loadContent attempt or skip if second one has been already initiated
            if (!second) loadContent(`${src}.html`, true, initiator);
          }
        });
      }, startLoadingIn);
      // create ajax call
    });

  $(document).ready(e => {
    if (
      $('.aem-AuthorLayer-Edit').length > 0 ||
      /author\.gsk\.com/gi.test(location.host)
    ) {
      console.log('AEM mode');
      return;
    }

    // iterate over each content loader
    $('.bp-content-loader').each((ind, el) => {
      // set variables
      let source = $(el), // resolve dom element as jQuery collection object
        root = source
          .closest('.advancedParametrizedHtml, .parametrizedhtml')
          .parent(), // find closest CF component wrapper's parent element
        // create and extend data object with content loader's along with root's data attributes
        data = $.extend(source.data(), root.data(), {
          isContainer: true,
          container: root.get(0),
          id: source.attr('id')
        });
      // if everything is declared and set remove CF component wrapper with it's content
      let toRemove = source.closest(
        '.advancedParametrizedHtml, .parametrizedhtml'
      );

      if (!toRemove.is('.cq-Editable-dom')) {
        toRemove.hide();
      }
      // preload loader if any
      if (data.preloaderImg !== null && typeof data.preloaderImg === 'string') {
        let preloaderPreload = new Image();
        preloaderPreload.src = data.preloaderImg;
      }

      // and save data object to root so it's accesable when needed
      root.data(data);
      root.get(0).data = data;

      let backgroundSize =
          typeof data.backgroundSize === 'undefined' ? 64 : data.backgroundSize,
        emptyPadding =
          typeof data.emptyPadding === 'undefined' ? 100 : data.emptyPadding,
        maxHeight = backgroundSize + emptyPadding,
        transitionTiming =
          typeof data.transitionTiming === 'undefined'
            ? '.25s'
            : data.transitionTiming,
        transitionType =
          typeof data.transitionType === 'undefined'
            ? 'cubic-bezier(0.65, 0, 0.35, 1)'
            : data.transitionType,
        bgImage =
          typeof data.preloaderImg === 'undefined'
            ? 'none'
            : `url(${data.preloaderImg})`,
        styleEl = `<style>
        #${data.id} {
          overflow: hidden;
          background-image: none;
          background-size: ${backgroundSize}px;
          background-repeat: no-repeat;
          background-position: center;
          max-height: ${maxHeight}px;
          min-height: ${maxHeight}px;
          transition: max-height ${transitionTiming} ${transitionType};
        }

        #${data.id}.loading {
          background-image: ${bgImage};
        }

        #${data.id} > * {
          transition: opacity ${transitionTiming} ${transitionType};
          opacity: 1;
        }

        #${data.id}.loading > * {
          opacity: 0 !important;
        }
      </style>`;

      root
        .attr({
          id: data.id
        })
        .addClass('bp-content-loader-container');
      root.before($(styleEl));
      root.get(0).settings = function(property, value) {
        try {
          if (arguments.length > 1 && this.data[property]) {
            this.data[property] = value;
            return this;
          } else if (this.data[property]) {
            return this.data[property];
          } else if (arguments.length === 0) {
            return this.data;
          }
          console.warn(`Property ${property} doesn't exists!`);
          return false;
        } catch (err) {}
      };
      root.get(0).clear = function() {
        try {
          let t = $(this), // initiator Element
            data = t.data(); // initiator's data
          $(data.container)
            .empty()
            .removeClass('loaded');
        } catch (error) {
          console.warn(error);
        }
      };
      root.get(0).loadContent = function(src, selector) {
        if (selector) this.data.contentSelector = selector;
        else selector = this.data.contentSelector;
        if (src) this.data.contentPath = src;
        else src = this.data.contentPath;

        loadContent(src, false, this);
      };
      // declare when content should be loaded with loadData method and pass pure dom root element as argument
      if (data.initialLoadOn === 'dom') loadData(root.get(0)); // load on dom ready
      if (data.initialLoadOn === 'window') {
        // load on window load
        $(window).on('load', () => {
          loadData(root.get(0));
        });
      }
      if (data.initialLoadOn === 'request') {
        setData(root.get(0));
      }
      if (data.initialLoadOn === 'viewport') {
        root
          .on('appear', function() {
            loadData(root.get(0));
          })
          .initAppear({
            scrollDelay: 0,
            once: true
          });
      }
    });
  });

  $(window).on('load', () => {
    let containers = $('.bp-content-loader-container');

    if (containers.length > 0) {
      $(window).on('resize', e => {
        containers.filter('.loaded').each((ind, container) => {
          $(container).css({
            'max-height': container.scrollHeight
          });
        });
      });
    }
  });
})(Cog.jQuery());
