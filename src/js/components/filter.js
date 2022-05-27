/*
 ** IF USED INSIDE CAROUSEL MAKE SURE CAROUSEL IS SET NOT TO LOOP !!!!!!!!!!!!!!!!
 ** TO EXTEND NAVIGATION FUNCTIONALITY USE CLASSES "class-filter, type-{dropdown|buttons|titles|sidebar}, type-mobile-{dropdown|buttons|titles|sidebar}, theme-?" on NAVIGATION COMPONENT
 */
String.prototype.regexIndexOf = function(regex, startpos) {
  var indexOf = this.substring(startpos || 0).search(regex);
  return indexOf >= 0 ? indexOf + (startpos || 0) : indexOf;
};
// eslint-disable
(function($) {
  //css selector for class filter component
  const filterSelector = '.class-filter',
    carouselInfo = rootFilter => {
      let carousel = rootFilter.closest('.carousel-slides'),
        slides = carousel.find('.carousel-slide'),
        slide = rootFilter.closest('.carousel-slide').get(0),
        index = slides.index(slide);
      for (let i in window.bpComponents.bpCarousels) {
        if ($(window.bpComponents.bpCarousels[i]).is(carousel)) {
          return {
            parentCarousel: window.bpComponents.bpCarousels[i], // deckare carousel (lightslider object) that can be used as a reference to control current parent slider
            hasCarousel: true, // determines if current filter has carousel as a parent
            currentSlide: slide, // current slide element (not jQuery object) that filter is placed in
            carouselSlides: slides, // jquery collection of all slides of current slider that filter is placed in
            placementIndex: index // gets index of slide in which current filter is placed
          };
        }
      }
      return {
        parentCarousel: null, // deckare carousel (lightslider object) that can be used as a reference to control current parent slider
        hasCarousel: false, // determines if current filter has carousel as a parent
        currentSlide: null, // current slide element (not jQuery object) that filter is placed in
        carouselSlides: null, // jquery collection of all slides of current slider that filter is placed in
        placementIndex: -1 // gets index of slide in which current filter is placed
      };
    };
  let ls = window.localStorage,
    body,
    getLabelId = (el, nid) => {
      let attr =
        typeof el.attr('aria-labelledby') === 'undefined'
          ? ''
          : el.attr('aria-labelledby');
      return attr
        .split(' ')
        .concat(nid)
        .join(' ')
        .replace(/^ /gi, '');
    };
  // hadler for item selection
  function handleFilter(e) {
    if (e.keyCode && e.keyCode !== 13) return;
    let t = $(e.target),
      rootItem = t.closest('.filter-item-js'),
      isDefault = t.is('.default-state-js'),
      rootFilter = t.closest(filterSelector),
      firstList = rootFilter.find('.filter-list-js').get(0),
      filterEl = rootFilter.get(0),
      multiSelect = rootFilter.is('[data-multiselect="true"]'),
      updateHash = rootFilter.is('[data-update-urlhash="true"]'),
      showResultsInBox = rootFilter.data('showResultsInBox'),
      saveToLocalStorage = rootFilter.data('saveToLocalStorage') === true,
      wrapItemWithSelector = rootFilter.data('wrapItemWithSelector'),
      filterClass = rootFilter.data('filterClass'),
      resultsBox = !rootFilter.data('resultsBoxClass')
        ? null
        : $(
            `.${rootFilter.data(
              'resultsBoxClass'
            )} > .component-content > .paragraphSystem`
          ),
      needsToMeetAllCriteria = rootFilter.data('needsToMeetAllCriteria'),
      type = rootFilter.data('type'),
      groupClass = rootFilter.data('groupClass'),
      isNavigation = rootFilter.data('isNavigation');
    if (
      rootFilter.is('[data-type="sidebar"],[data-type-mobile="sidebar"]') &&
      t.is('.filter-container-js.opened-js .filter-list-js')
    ) {
      $('.opened-js').removeClass('opened-js');
      return;
    }
    if (t.is('.filter-group-label-js, .filter-group-label-js *')) {
      return;
    }
    if (rootFilter.find('.filter-container-js.opened-js').length < 1) {
      $('.opened-js').removeClass('opened-js');
    }
    if (
      !t.is(
        '.selected-item-js, .selected-item-js *, .filter-item-js, .filter-item-js *'
      )
    ) {
      return;
    }
    if (t.is('.selected-item-js, .selected-item-js *')) {
      t = t.closest('.selected-item-js');
      t.parent().toggleClass('opened-js');
      if (
        t.is(
          '[data-type-mobile=dropdown] .selected-item-js, [data-type=dropdown] .selected-item-js, [data-type-mobile=dropdown] .selected-item-js *, [data-type=dropdown] .selected-item-js *'
        )
      ) {
        if (
          $(firstList).offset().top + firstList.scrollHeight >
          $('.container-fluid').get(0).scrollHeight
        ) {
          $('.container-fluid').css({
            minHeight:
              $(firstList).offset().top +
              firstList.scrollHeight -
              $('body').get(0).scrollHeight +
              $('body').get(0).scrollHeight
          });
        }
      }
      //if dropdown selected item clicked stop handeling filter
      if (
        t.is(
          '[data-type-mobile=dropdown] .selected-item-js, [data-type=dropdown] .selected-item-js, [data-type-mobile=dropdown] .selected-item-js *, [data-type=dropdown] .selected-item-js *'
        )
      )
        return;
      //if sidebar selected item clicked stop handeling filter
      if (
        t.is(
          '[data-type-mobile=sidebar] .selected-item-js, [data-type=sidebar] .selected-item-js, [data-type-mobile=sidebar] .selected-item-js *, [data-type=sidebar] .selected-item-js *'
        )
      )
        return;
    }
    if (t.is('.filter-redirect .filter-item-js a')) {
      return true;
    }
    if (isNavigation) {
      return;
    }
    e.preventDefault();
    if (
      t.is(
        '.filter-redirect .filter-item-js, .filter-redirect .filter-item-js *'
      )
    ) {
      t.closest('.filter-container-js').removeClass('opened-js');
      t = t.closest('.filter-item-js');
      try {
        window.location.href = t.data('link');
      } catch (err) {
        console.warn(
          `Data link is: ${t.data('link')}. And can't be redirected!`
        );
      }
      return;
    }

    // if show filter results in results box true first clear
    // all items than can be in results box then hide all the filtered elements
    // on the page and copy filtered ones to results box
    if (showResultsInBox) {
      resultsBox.empty();
      rootFilter.data('elements').hide();
    }
    if (t.is('.filter-item-js, .filter-item-js *')) {
      // if multiselect and all items are not selected hide all at first
      if (multiSelect) {
        if (rootFilter.find('.filter-item-js.active-js').length === 0) {
          rootFilter.data('elements').hide();
        }
      }
      t = t.closest('.filter-item-js');
      let container = t.closest('.filter-container-js');
      if (!multiSelect) {
        container
          .closest(filterSelector)
          .data('elements')
          .hide();
        rootFilter
          .find('.filter-item-js.active-js')
          .removeClass('active-js')
          .attr({
            'aria-selected': false
          });
      }
      if (t.is('.active-js')) {
        t.removeClass('active-js').attr({
          'aria-selected': false
        });
        t.data('data-related-item').hide();
      } else if (!t.is('.active-js') && !t.is('.filter-group-label-js')) {
        t.addClass('active-js').attr({
          'aria-selected': true
        });
        if (!showResultsInBox && !needsToMeetAllCriteria) {
          t.data('data-related-item').show();
        }
      }
      if (!multiSelect) {
        container
          .find(`.selected-item-js${wrapItemWithSelector}`)
          .text(t.text());
        t.closest('.filter-container-js').removeClass('opened-js');
        body.css({
          overflow: ''
        });
      }
      // if show results in box or need to meet all citeria is set to true
      if (showResultsInBox || needsToMeetAllCriteria) {
        // JV flexbox fix
        resultsBox.append($('<a style="visibility:hidden"></a>'));
        // end of JV flexbox fix
        if (!needsToMeetAllCriteria && showResultsInBox) {
          // if needsToMeetAllCriteria is false and showResultsInBox is true
          // collect loop through all the active items in filter and clone them
          // to specified resutls box
          rootFilter.find('.filter-item-js.active-js').each((ind, el) => {
            $(el)
              .data('data-related-item')
              .clone(true)
              .removeData()
              .appendTo(resultsBox)
              .show();
          });
        } else if (needsToMeetAllCriteria) {
          // if needsToMeetAllCriteria is set to true create results class collector
          let resultClass = [];
          // loop through each active item in filter and push categoryClass
          // stored in jQuery data object to resultClass collector
          rootFilter.find('.filter-item-js.active-js').each((ind, el) => {
            resultClass.push($(el).data('categoryClass'));
          });
          // if reulstClass is not empty
          if (resultClass.length > 0) {
            // create related items collection with combination of dataFilterClass
            // and selector of classes in resultClass joined together
            let relatedItems = $(
              `${rootFilter.data('dataFilterClass')}.${resultClass.join('.')}`
            );
            if (showResultsInBox && relatedItems.length > 0) {
              // if show results in box and related items are not empty
              // clone all related items to resultsBox
              relatedItems
                .clone(true)
                .removeData()
                .appendTo(resultsBox)
                .show();
            } else if (showResultsInBox && relatedItems.length === 0) {
              // if show results in box and related items are empty
              // append empty results label to results box only
              resultsBox.append(
                $(
                  `<p class="no-results-filter-js">${rootFilter.data(
                    'noResultsLabel'
                  )}</p>`
                )
              );
            } else if (!showResultsInBox && relatedItems.length > 0) {
              // if show results in box is false and related items are not empty
              // show all realted items
              relatedItems.show();
              // and hide those that do not match selector but match dataFilterClass selector
              $(
                `${rootFilter.data('dataFilterClass')}:not(.${resultClass.join(
                  '.'
                )})`
              ).hide();
            } else if (!showResultsInBox && relatedItems.length === 0) {
              // if show results in box is false and related items are empty hide all elements with dataFilterClass
              $(`${rootFilter.data('dataFilterClass')}`).hide();
            }
          }
        }
      }
      // if updatehash true
      // update hash should work only if needsToMeetAllCriteria and showResultsInBox are set to false
      if (updateHash) {
        // update hash if set to true
        let hash = '';
        container.find('.filter-item-js.active-js').each((ind, el) => {
          hash += `${$(el).attr('data-label-slug')}|`;
        });
        hash = hash.slice(0, -1);
        if (
          typeof hash === 'undefined' ||
          hash === 'undefined' ||
          hash === ''
        ) {
          if (typeof window.history.replaceState == 'function') {
            history.replaceState({}, '', window.location.href.split('#')[0]);
          }
        } else window.location.hash = hash;
      }
      // if multiselect and all items are not selected show all at last
      if (multiSelect) {
        if (rootFilter.find('.filter-item-js.active-js').length === 0) {
          if (showResultsInBox) {
            resultsBox.empty();
          }
          rootFilter.data('elements').show();
        }
      }
      rootFilter.get(0).results = {
        selectedItems: [],
        selectedGroups: [],
        selectedGropsSlugified: [],
        selectedLabels: [],
        selectedClasses: [],
        selected: 0
      };
      container.find('.filter-item-js.active-js').each((ind, el) => {
        try {
          rootFilter.get(0).results.selectedItems.push(el);
          if ($(el).is('[data-selector]')) {
            rootFilter.get(0).results.selected++;
            rootFilter
              .get(0)
              .results.selectedLabels.push($(el).attr('data-label'));
            let tempArray = $(el)
              .attr('data-selector')
              .split(/ ?\./i);
            tempArray.shift(0);
            rootFilter.get(0).results.selectedClasses = rootFilter
              .get(0)
              .results.selectedClasses.concat(tempArray);
          }
          if (
            $(el).attr('data-filter-group') !== 'false' &&
            rootFilter
              .get(0)
              .results.selectedGroups.indexOf($(el).attr('data-filter-group')) <
              0
          ) {
            rootFilter
              .get(0)
              .results.selectedGroups.push($(el).attr('data-filter-group'));
            rootFilter
              .get(0)
              .results.selectedGropsSlugified.push(
                $(el).attr('data-filter-group-slug')
              );
          }
        } catch (error) {
          console.warn(error);
        }
      });
      try {
        if (rootFilter.get(0).results.selectedClasses.length > 0)
          rootFilter
            .get(0)
            .results.selectedClasses.push(rootFilter.get(0).data.filterClass);
        rootFilter.get(0).results.selectedClasses = rootFilter
          .get(0)
          .results.selectedClasses.unique();
      } catch (error) {}
      try {
        rootFilter.get(0).getGroupResults();
      } catch (error) {}
      // run callback function on changed
      if (typeof rootFilter.get(0).onChanged === 'function') {
        rootFilter.get(0).onChanged();
      }
    }
    // hide all elements with this class
    if (isDefault) {
      $('.hide-on-default').hide();
    }
    // if save to local storage is true
    if (saveToLocalStorage) {
      let fObject;
      // get localstorage saved filters
      if (ls.getItem('bpFilterLsObject') === null) {
        // if no filter was saved yet and record doesn't exists create empty object
        fObject = {};
      } else {
        // otherwise load json string and parse
        fObject = JSON.parse(ls.getItem('bpFilterLsObject'));
      }
      // get currently selected items
      let selectedItems = rootFilter.find('.filter-item-js.active-js');
      // create class reference of filter in localstorage filter object
      fObject[filterClass] = {};
      if (selectedItems.length < 1) {
        // if nothing is currently selected remove reference if any
        delete fObject[filterClass];
      } else {
        // otherwise create array of selected indexes starting from 1 (same as preselect)
        fObject[filterClass]['preselect'] = (() => {
          let selected = [];
          selectedItems.each((ind, el) => {
            selected.push($(el).index() + 1);
          });
          return selected;
        })();
      }
      // save current filter object to localstorage
      ls.setItem('bpFilterLsObject', JSON.stringify(fObject));
    }
    if (!multiSelect) {
      rootFilter.find('*').trigger('blur');
    }
  }

   initFilters = () => {
    if (!bpComponents.bpLanguages.loaded) {
      setTimeout(initFilters, 10);
      return;
    }
    /* to hide filter when clicked outside */
    body = $('body');
    body
      .on('click', e => {
        let t = $(e.target);
        if (!t.is('.filter-container-js, .filter-container-js *')) {
          $('.filter-container-js.opened-js').removeClass('opened-js');
        }
        if (
          t.is(
            '[data-type="sidebar"][data-multiselect="true"] .filter-container-js.opened-js .filter-list-js,[data-type-mobile="sidebar"][data-multiselect="true"] .filter-container-js.opened-js .filter-list-js'
          ) ||
          !t.is('.filter-container-js, .filter-container-js *')
        ) {
          setTimeout(() => {
            body.css({
              overflow: ''
            });
          }, 10);
        }
      })
      .on('mouseup', e => {
        $('.filter-item-js, .filter-item-js *').trigger('blur');
      });
    let filters = $(filterSelector),
      groups = [];
    filters.each((i, e) => {
      let creationStarted = new Date().getTime(),
        filterInfo = `
  JV Filter Object:
  Filter selector: ${filterSelector}`,
        // set filter as variable
        filter = $(e),
        isNavigation = filter.is('.navigation.component'),
        filterEl = filter.get(0),
        filterType = !isNavigation
          ? $(window).width() > 768
            ? filter.attr('data-type')
            : filter.attr('data-type-mobile')
          : $(window).width() > 768
          ? (() => {
              try {
                return filter
                  .attr('class')
                  .match(/type\-(?!mobile\-)([^ ]+)/i)[1];
              } catch (error) {
                return 'dropdown';
              }
            })()
          : (() => {
              try {
                return filter.attr('class').match(/type\-mobile\-([^ ]+)/i)[1];
              } catch (error) {
                return 'dropdown';
              }
            })(),
        filterTypeMobile = !isNavigation
          ? null
          : filter.attr('class').match(/type\-mobile\-([^ ]+)/i) !== null
          ? filter.attr('class').match(/type\-mobile\-([^ ]+)/i)[1]
          : 'dropdown',
        filterPreselectVal = isNavigation
          ? ''
          : filter.attr('data-preselect-item'),
        filterPreselect =
          filterPreselectVal === '$preselectItemIndex' ||
          filterPreselectVal === '' ||
          /[^0-9, ]/gi.test(filterPreselectVal)
            ? false
            : filterPreselectVal.split(/, ?/gi),
        forceHideDefaultLabel =
          !isNavigation &&
          (filter.attr('data-force-hide-defaultlabel') === 'true' ||
            filter.attr('data-force-hide-defaultlabel') === 'false')
            ? Function(
                `return ${filter.attr('data-force-hide-defaultlabel')}`
              )()
            : false,
        // get default label
        defaultLabel = filter.attr('data-default-label'),
        saveToLocalStorage =
          filter.attr('data-use-localstorage') === '1' ||
          filter.attr('data-use-localstorage') === 'true',
        wrapItemWithStart =
          filter.attr('data-item-wrap-with') === ' ' ||
          filter.attr('data-item-wrap-with') === '' ||
          filter.attr('data-item-wrap-with') === '$itemWrapWith'
            ? ''
            : `<${filter.attr('data-item-wrap-with')}>`,
        wrapItemWithEnd =
          filter.attr('data-item-wrap-with') === ' ' ||
          filter.attr('data-item-wrap-with') === '' ||
          filter.attr('data-item-wrap-with') === '$itemWrapWith'
            ? ''
            : `</${filter.attr('data-item-wrap-with')}>`,
        wrapItemWithSelector =
          filter.attr('data-item-wrap-with') === ' ' ||
          filter.attr('data-item-wrap-with') === '' ||
          filter.attr('data-item-wrap-with') === '$itemWrapWith'
            ? ''
            : ` > ${filter.attr('data-item-wrap-with')}`,
        // check if categories are present
        categoriesText = filter.attr('data-categories') || '',
        categorized = categoriesText !== '' && categoriesText !== '$categories',
        categories = categoriesText.split(/, ?/gi),
        linkStart =
          filterType === 'links' || isNavigation ? '<a href="#">' : '',
        linkEnd = filterType === 'links' || isNavigation ? '</a>' : '',
        // data filterClass represents all elements that will be filtered
        dataFilterClass =
          isNavigation ||
          filter.attr('data-filter-class') === '' ||
          filter.attr('data-filter-class') === '$fClass' ||
          typeof filter.attr('data-filter-class') === 'undefined'
            ? 'noclass'
            : `.${filter.attr('data-filter-class').replace(/ /gi, '')}`,
        dataFilterGroupClass =
          filter.attr('data-filter-group-class') === '$filterGroupClass' ||
          typeof filter.attr('data-filter-group-class') === 'undefined' ||
          filter.attr('data-filter-group-class') === ' '
            ? false
            : `${filter.attr('data-filter-group-class').replace(/ /gi, '')}`,
        // filter functionality check
        filterFunctionality = filter.attr('data-functionality'),
        filterApplyClassesToFilteredItems =
          filter.attr('data-applyadditionalclasstoall') === 'true',
        // adds desired classes to filter object
        filterClassAddClasses =
          filter.attr('data-filter-add-class') === '$fAddClass' ||
          filter.attr('data-filter-add-class') === '' ||
          typeof filter.attr('data-filter-add-class') === 'undefined'
            ? ['']
            : filter
                .attr('data-filter-add-class')
                .split(/, ?/gi)
                .join(' '),
        // adds desired classes to filter items
        filterCategoriesAddClasses =
          filter.attr('data-categories-add-classes') ===
            '$categoriesAddClasses' ||
          filter.attr('data-categories-add-classes') === '' ||
          typeof filter.attr('data-categories-add-classes') === 'undefined'
            ? []
            : filter.attr('data-categories-add-classes').split(/, ?/gi),
        // labels for redirect URLs
        redirectUrlLabels =
          filter.attr('data-url-labels') === '$urllabels' ||
          filter.attr('data-url-labels') === '' ||
          typeof filter.attr('data-url-labels') === 'undefined'
            ? []
            : filter.attr('data-url-labels').split(/, ?/gi),
        // redirect URLs
        redirectUrls =
          filter.attr('data-urls') === '$urllabels' ||
          filter.attr('data-urls') === '' ||
          typeof filter.attr('data-urls') === 'undefined'
            ? []
            : filter.attr('data-urls').split(/, ?/gi),
        // determines if filtered content should be displayed in separate results box
        showResultsInBox =
          filter.attr('data-results-in-box') === '$showResultsInBox' ||
          filter.attr('data-results-in-box') === '' ||
          typeof filter.attr('data-results-in-box') === 'undefined'
            ? false
            : Function(`return ${filter.attr('data-results-in-box')}`)(),
        // results box class to target results box class element (needs to be BOX component AEM)
        resultsBoxClass =
          filter.attr('data-resluts-box-class') === '$resultsBoxClass' ||
          filter.attr('data-resluts-box-class') === '' ||
          typeof filter.attr('data-resluts-box-class') === 'undefined'
            ? false
            : filter.attr('data-resluts-box-class'),
        onChanged =
          filter.attr('data-onchanged') === '$dataOnChanged'
            ? ''
            : filter.attr('data-onchanged'),
        onFinished =
          filter.attr('data-onfinished') === '$dataOnFinished'
            ? ''
            : filter.attr('data-onfinished'),
        onReady =
          filter.attr('data-onready') === '$dataOnReady'
            ? ''
            : filter.attr('data-onready'),
        // needs to meet all criteria of selected items in filter by comination of classes
        // and findig all elements that has all the classes
        needsToMeetAllCriteria =
          filter.attr('data-meet-all-criteria') === '$needsToMeetAllCriteria' ||
          filter.attr('data-meet-all-criteria') === '' ||
          typeof filter.attr('data-meet-all-criteria') === 'undefined'
            ? false
            : Function(`return ${filter.attr('data-meet-all-criteria')}`)(),
        // no results label shows only in separated results box
        noResultsLabel =
          filter.attr('data-no-results-label') === '$noResultsLabel' ||
          filter.attr('data-no-results-label') === '' ||
          typeof filter.attr('data-no-results-label') === 'undefined'
            ? 'No results'
            : filter.attr('data-no-results-label');
      // add data to filter component requred by handler
      filter
        .data({
          showResultsInBox: showResultsInBox,
          resultsBoxClass: resultsBoxClass,
          needsToMeetAllCriteria: needsToMeetAllCriteria,
          noResultsLabel: noResultsLabel,
          dataFilterClass: dataFilterClass,
          saveToLocalStorage: saveToLocalStorage,
          filterClass: dataFilterClass.replace(/\./gi, ''),
          groupClass: dataFilterGroupClass,
          isNavigation: isNavigation,
          wrapItemWithSelector: wrapItemWithSelector
        })
        .addClass(dataFilterGroupClass);
      if (dataFilterGroupClass) {
        filterEl.grouped = true;
        filterEl.getGroupResults = function() {
          let groupSelector = [];
          this.groupResults = {};
          if (this.data.filterGroupClass) {
            $(`.${this.data.filterGroupClass}`).each((ind, el) => {
              this.groupResults[el.id] = el.getResults();
              groupSelector = groupSelector.concat(
                this.groupResults[el.id].selectedClasses
              );
            });
          }
          this.groupResults.selectedGroupClasses = groupSelector.unique();
          return this.groupResults;
        };
      } else filterEl.grouped = false;
      filterEl.onChanged = function() {
        try {
          Function(`${filterEl.data.onchanged}`).call(filterEl, null);
        } catch (err) {
          if (filter.is(`.debug ${filterSelector}`)) console.log(err);
        }
      };
      filterEl.onFinished = function() {
        try {
          Function(`${filterEl.data.onfinished}`).call(filterEl, null);
        } catch (err) {
          if (filter.is(`.debug ${filterSelector}`)) console.log(err);
        }

        if (filterEl.data.type === 'sidebar') {
          body.css({
            overflow: '',
            position: ''
          });
        }
      };
      filterEl.onOpened = function() {
        if (filterEl.data.type === 'sidebar') {
          body.css({
            overflow: 'hidden',
            position: 'static'
          });
        }
      };
      filterEl.onReady = function() {
        try {
          Function(`${filterEl.data.onready}`).call(filterEl, null);
        } catch (err) {
          if (filter.is(`.debug ${filterSelector}`)) console.log(err);
        }
      };
      // debuging info string
      filterInfo = `${filterInfo}
  Type: ${filterType}
  Functionality: ${filterFunctionality}
  Preselect: ${filterPreselect}
  Hide default label: ${forceHideDefaultLabel}
  Default label: ${defaultLabel}
  Has categories: ${categorized}
  Categories: ${categories}
  Filtered global class: ${dataFilterClass}
  Filter grooup class: ${dataFilterGroupClass}
  Filter grouped: ${filter.get(0).grouped}
  Filter custom class: ${filterClassAddClasses}
  Filter items custom classes: ${(n => {
    let retStr = ``;
    filterCategoriesAddClasses.forEach((str, indd) => {
      let catgegory =
        typeof categories[indd] === 'undefined' ||
        categories[indd] === '$categories'
          ? `Item ${indd + 1}`
          : categories[indd];
      retStr = `${retStr}
            ${catgegory}: .${str.split(/\. ?/).join(' .')}`;
    });
    return retStr;
  })()}
  URLs: ${(n => {
    let retStr = ``;
    redirectUrlLabels.forEach((str, indd) => {
      if (redirectUrls[indd]) {
        retStr = `${retStr}
          ${str}: ${redirectUrls[indd]}`;
      }
    });
    return retStr;
  })()}`;
      // end of debuging info string
      let itemsInit = [];
      //convert filter preselect values to numbers
      $(filterPreselect).each(
        (ind, el) => (filterPreselect[ind] = parseInt(el))
      );
      if (
        (filterFunctionality === 'filter' && dataFilterClass) ||
        isNavigation
      ) {
        if (categorized) {
          // if filter has categories
          // push all the categories with classes to array of categories
          categories.forEach((el, ind) => {
            let splitted = el.split('.'),
              selectorAndGroup = splitted[1].split('+'),
              selector = selectorAndGroup[0],
              group = selectorAndGroup[1];
            categories[ind] = {
              label: splitted[0],
              selector: `.${selector}`,
              group: typeof group === 'undefined' ? false : `${group}`,
              groupSlug: typeof group === 'undefined' ? false : slug(group)
            };
            // console.log(categories[ind])
          }, categories);
        }
        // gather all elements to be filtered based on classname
        let elements = $(dataFilterClass),
          filterClasses =
            typeof filterClassAddClasses.split === 'function'
              ? filterClassAddClasses.split(/, ?| /gi)
              : filterClassAddClasses,
          filterID =
            typeof filterClasses[0] === 'string' &&
            filterClasses[0] !== ' ' &&
            filterClasses[0].length > 1
              ? filterClasses[0]
              : false;
        // set elements as data to filter to be accessible
        filter.data('elements', elements);
        filterEl.elements = elements;
        // get label selector and set it to filter as a data
        filter.data('label-selector', filter.attr('data-label-selector'));
        filterEl.labelSelector =
          filter.attr('data-label-selector') !== '$labelSelector' &&
          filter.attr('data-label-selector') !== ' ' &&
          filter.attr('data-label-selector') !== ''
            ? filter.attr('data-label-selector')
            : false;
        filterEl.id = `filter${(!isNavigation
          ? filterID
            ? filterID
            : `${(Math.random() * 10000000000000).toFixed(0)}`
          : 'navigation-filter'
        ).camelize()}${
          isNavigation ? (Math.random() * 10000000000000).toFixed(0) : ''
        }`;
        filterEl.getResults = function(group) {
          // console.log(this)
          if (!group)
            filterEl.results =
              typeof filterEl.results === 'undefined'
                ? {
                    selectedItems: [],
                    selectedGroups: [],
                    selectedGropsSlugified: [],
                    selectedLabels: [],
                    selectedClasses: [],
                    selected: 0
                  }
                : filterEl.results;
          return filterEl.results;
        };
        // create filter container
        let filterContainer,
          multiSelectFilter = filter.is('[data-multiselect="true"]'),
          list;
        if (!isNavigation) {
          filterContainer = $(
            `<div class="filter-container-js ${filterClassAddClasses}"></div>`
          );
          // if not multiselect - include selected item container for displaying the selected item label
          //add selected label container if multiselect is disabled
          $(
            `<div class="selected-item-js">${wrapItemWithStart}${defaultLabel}${wrapItemWithEnd}</div>`
          ).appendTo(filterContainer);
          // create actual list of labels
          list = $(`<ul class="filter-list-js"></ul>`).appendTo(
            filterContainer
          ); //add actual list
        } else {
          window.filterNavDefaultLabel = window.filterNavDefaultLabel
            ? window.filterNavDefaultLabel
            : 'Please select';
          filterContainer = filter
            .find('> .component-content')
            .addClass('filter-container-js');
          list = filter
            .find('> .component-content > ul')
            .addClass('filter-list-js');
          let subLevels = list.find('ul'),
            multiLevel = subLevels.length > 0;
          if (multiLevel) {
            subLevels.each((ind, el) => {
              let t = $(el),
                parentLevel = t.closest('li'),
                subItems = t.find('li');
              parentLevel.addClass('group-label-js multilevel');
              subItems.addClass('filter-item-js');
            });
          }
          $(
            `<div class="selected-item-js"><p>${window.filterNavDefaultLabel}<p></div>`
          ).prependTo(filterContainer);
        }
        // if not multiselect - include default label (show all items)
        if (!multiSelectFilter && !forceHideDefaultLabel && !isNavigation) {
          // add default item if no multiselect
          $(
            `<li class="filter-item-js default-state-js active-js" aria-selected="false">${wrapItemWithStart}${linkStart}${defaultLabel}${linkEnd}${wrapItemWithEnd}</li>`
          )
            .data('data-related-item', elements)
            .appendTo(list);
        }
        //get url filter hashes if any
        let urlTags = decodeURIComponent(window.location.hash)
          .replace('#', '')
          .split('|');
        //iterate over each item and set actual target as a data
        if (categorized) {
          categories.forEach((el, ind) => {
            // has match found
            let hashMatchFound = false,
              globalHashMatchFound = false,
              categorySelector = el.selector,
              categoryClass = categorySelector.substr(1),
              categoryLabel = el.label,
              group = el.group,
              groupSlug = el.groupSlug,
              item = $(categorySelector),
              itemIds = [];
            item.each((i, e) => {
              if (e.id === '')
                e.id = `filteredItem${Math.random() *
                  100000000000000000}${new Date().getTime()}`;
              itemIds.push(el.id);
            });
            if (item.not(dataFilterClass)) {
              item = $(categorySelector).closest(dataFilterClass);
            }
            let categorySlug = window.slug(categoryLabel),
              // activeClass = urlTags.indexOf(categorySlug) > -1 ? true : false,
              additionalItemClasses = '';
            if (
              filterCategoriesAddClasses.length > 0 &&
              typeof filterCategoriesAddClasses[ind] !== 'undefined'
            ) {
              additionalItemClasses = filterCategoriesAddClasses[ind]
                .split(/\. ?/gi)
                .join(' ');
            }
            if (filterApplyClassesToFilteredItems) {
              item.addClass(additionalItemClasses);
            }
            if (item.not(dataFilterClass)) {
              item = $(categorySelector).closest(dataFilterClass);
              if (filterApplyClassesToFilteredItems) {
                item.addClass(additionalItemClasses);
              }
            }
            //append item to list and add category class
            let nid = `filterItem${Math.random() *
                100000000000000000}${new Date().getTime()}`,
              it = $(
                `<li class="filter-item-js ${categoryClass} ${additionalItemClasses}" aria-selected="false">${wrapItemWithStart}${linkStart}${categoryLabel}${linkEnd}${wrapItemWithEnd}</li>`
              )
                .data({
                  'data-related-item': item,
                  categoryClass: categoryClass
                })
                .attr({
                  'data-label': categoryLabel,
                  'aria-label': `Click this to select or deselect option '${categoryLabel}'`,
                  'aria-controls': itemIds.join(' '),
                  'data-label-slug': categorySlug,
                  'data-filter-group': group,
                  'data-filter-group-slug': groupSlug,
                  'data-selector': categorySelector,
                  id: nid
                });
            item.each((i, e) => {
              let el = $(e);
              el.attr({
                'aria-labelledby': getLabelId(el, nid)
              });
            });
            if (urlTags.indexOf(categorySlug) > -1)
              hashMatchFound = globalHashMatchFound = true;
            item.attr('data-label-slug', categorySlug);
            if (hashMatchFound && !needsToMeetAllCriteria) {
              itemsInit.push(it);
            } else if (
              filterPreselect &&
              filterPreselect.indexOf(ind + 1) > -1 &&
              !needsToMeetAllCriteria &&
              !hashMatchFound
            ) {
              itemsInit.push(it);
            } else if (needsToMeetAllCriteria && hashMatchFound) {
              itemsInit.push(it);
            }
            let gId;
            if (
              group &&
              list.find(`.filter-group-label-js[data-filter-group="${group}"]`)
                .length < 1
            ) {
              gId = `filterGroup${new Date().getTime()}`;
              $(
                `<li id="${gId}" class="filter-item-js filter-group-label-js" data-filter-group="${group}" data-filter-group-slug="${groupSlug}">${wrapItemWithStart}${group}${wrapItemWithEnd}</li>`
              ).appendTo(list);
            }
            // append item to list and to particular group if any
            if (group) {
              list.find(`[data-filter-group="${group}"]:last`).after(
                it.attr({
                  'aria-describedby': gId
                })
              );
            } else {
              it.appendTo(list);
            }
          });
        } else if (isNavigation) {
          filter
            .attr({
              'data-type': filterType,
              'data-type-mobile': filterTypeMobile
            })
            .find('> .component-content > ul > li')
            .addClass('filter-item-js');
          filter.find('li.is-active').addClass('active-js');
        } else {
          elements.each((ind, el) => {
            // has match found
            let hashMatchFound = false,
              // set item as variable
              item = $(el),
              itemIds = [];
            item.each((i, e) => {
              if (e.id === '')
                e.id = `filteredItem${Math.random() *
                  100000000000000000}${new Date().getTime()}`;
              itemIds.push(e.id);
            });
            // get label based on label selector
            let labelSelector = filter.data('label-selector'),
              label = item.find(labelSelector).text(),
              slug = window.slug(label),
              activeClass = urlTags.indexOf(slug) > -1 ? true : false,
              //append item to list
              nid = `filterItem${Math.random() *
                100000000000000000}${new Date().getTime()}`,
              it = $(
                `<li class="filter-item-js" aria-selected="false">${wrapItemWithStart}${linkStart}${label}${linkEnd}${wrapItemWithEnd}</li>`
              )
                .data('data-related-item', item)
                .attr({
                  'data-label': label,
                  'aria-label': label,
                  'aria-controls': itemIds.join(' '),
                  'data-label-slug': slug,
                  id: nid
                });
            item.each((i, e) => {
              let el = $(e);
              el.attr({
                'aria-labelledby': getLabelId(el, nid)
              });
            });
            if (urlTags.indexOf(slug) > -1)
              hashMatchFound = globalHashMatchFound = true;
            item.attr('data-label-slug', slug);
            if (hashMatchFound && !needsToMeetAllCriteria) {
              itemsInit.push(it);
            } else if (
              filterPreselect &&
              filterPreselect.indexOf(ind + 1) > -1 &&
              !needsToMeetAllCriteria &&
              !hashMatchFound
            ) {
              itemsInit.push(it);
            } else if (needsToMeetAllCriteria && hashMatchFound) {
              itemsInit.push(it);
            }
            // append item to list
            it.appendTo(list);
          });
        }
        // append filter container to filter
        filterContainer.appendTo(filter);
        // add event listener
        filter.on('click keyup', handleFilter);
      } else if (filterFunctionality === 'redirect') {
        let filterContainer = $(
          `<div class="filter-container-js filter-redirect ${filterClassAddClasses}"></div>`
        );
        $(
          `<div class="selected-item-js">${wrapItemWithStart}${defaultLabel}${wrapItemWithEnd}</div>`
        ).appendTo(filterContainer); //add selected label container if multiselect is disabled
        // create actual list of labels
        let list = $(`<ul class="filter-list-js"></ul>`).appendTo(
          filterContainer
        ); //add actual list
        redirectUrlLabels.forEach((el, ind) => {
          //append item to list and add category class
          let additionalItemClasses = '',
            linkStart =
              filterType === 'links' ? `<a href="${redirectUrls[ind]}">` : '',
            linkEnd = filterType === 'links' ? '</a>' : '';
          if (
            filterCategoriesAddClasses.length > 0 &&
            typeof filterCategoriesAddClasses[ind] !== 'undefined'
          ) {
            additionalItemClasses = filterCategoriesAddClasses[ind]
              .split(/\. ?/gi)
              .join(' ');
          }
          let it = $(
            `<li class="filter-item-js ${additionalItemClasses}">${wrapItemWithStart}${linkStart}${el}${linkEnd}${wrapItemWithEnd}</li>`
          )
            .data('link', redirectUrls[ind])
            .attr({
              'data-label': el,
              'data-label-slug': window.slug(el)
            });
          it.appendTo(list);
        });
        filterContainer.appendTo(filter);
        // add event listener
        filter.on('click', handleFilter);
        if (filterPreselect[0] === 0 || isNavigation) {
          setTimeout(() => {
            filter.find('.default-state-js').trigger('click');
          }, 1);
        }
      }
      // console.log(itemsInit)
      $(itemsInit).each((ind, el) => {
        el.trigger('click');
      });
      let creationEnded = new Date().getTime(),
        creationTook = new Date(
          creationEnded - creationStarted
        ).getMilliseconds();
      filterInfo = `${filterInfo}
  Filter creation time: ${creationTook}ms
  `;
      if (filter.is(`.debug ${filterSelector}`)) {
        $(document.createComment(filterInfo)).prependTo(filter);
      }
      // check if bpFilterLsObject is present in localstorage to load and if current filter has not saveToLocalStorage on
      if (ls.getItem('bpFilterLsObject') !== null) {
        // parse object from localstorage
        let fObject = JSON.parse(ls.getItem('bpFilterLsObject')),
          // check if reference to current filter exists
          hasSettings = fObject.hasOwnProperty(filter.data('filterClass')),
          preselect,
          currentFilter;
        if (hasSettings) {
          // create reference to current filter object
          currentFilter = fObject[filter.data('filterClass')];
          // get preselect indexes array (starting from 1)
          preselect = currentFilter['preselect'];
          // iterate over each filter item
          filter.find('.filter-item-js').each((ind, el) => {
            let t = $(el);
            if (preselect.indexOf(ind + 1) > -1) {
              // if current item index is present in preselect set item as active and show related items
              if (t.is('.active-js'))
                t.removeClass('active-js').attr({
                  'aria-selected': false
                });
              setTimeout(() => {
                t.trigger('click');
              }, 10);
            } else {
              // otherwise set as not active and hide related items
              if (!t.is('.active-js') && !t.is('.filter-group-label-js'))
                t.removeClass('active-js').attr({
                  'aria-selected': true
                });
            }
          });
          // delete reference filter from localstorage object and save it for furher use if keep data in localStorage is set to false
          delete fObject[filter.data('filterClass')];
          if (filter.data('keepLocalStorageData') === false)
            ls.setItem('bpFilterLsObject', JSON.stringify(fObject));
        }
      }
      filterEl.data = filter.data();
      filterEl.open = function() {
        $(this)
          .find('.filter-container-js')
          .addClass('opened-js');
      };
      filterEl.close = function() {
        $(this)
          .find('.filter-container-js')
          .removeClass('opened-js');
      };
      filterEl.select = function(indexes) {
        let self = $(this),
          items = self.find('.filter-list-js .filter-item-js');
        if (!Array.isArray(indexes) && typeof indexes === 'string') {
          indexes = indexes.split(/, ?/gi);
        }
        $(indexes).each((ind, el) => {
          if (!isNaN(el)) {
            items.eq(parseInt(el)).trigger('click');
          }
        });
      };
      filterEl.clear = function() {
        let self = $(this),
          activeItems = self.find('.filter-list-js .filter-item-js.active-js'),
          multiselect = this.data.multiselect;
        clearLabel = self.find('.selected-item-js p');
        if (!this.results.selected || this.results.selected < 1) return;
        if (!multiselect) self.attr('data-multiselect', 'true');
        activeItems.trigger('click');
        if (!multiselect) self.attr('data-multiselect', 'false');
        if (clearLabel.length) clearLabel.html(`${defaultLabel}`);
      };
      filterEl.getRelatedFilters = function() {
        if (!this.data.groupClass) return [];
        let related = [];
        for (let i in window.bpComponents.bpFilters) {
          if (
            window.bpComponents.bpFilters.hasOwnProperty(i) &&
            window.bpComponents.bpFilters[i].data.groupClass ===
              this.data.groupClass &&
            this !== window.bpComponents.bpFilters[i]
          ) {
            related.push(window.bpComponents.bpFilters[i]);
          }
        }
        return related;
      };
      filterEl.items = (function() {
        return $(filterEl)
          .find('.filter-list-js > .filter-item-js')
          .get();
      })();
      filterEl.containerHeight = (function() {
        try {
          return (
            $(filterEl)
              .find('.filter-list-js')
              .get(0).scrollHeight +
            $(filterEl)
              .find('.filter-container-js')
              .height()
          );
        } catch (error) {
          return 0;
        }
      })();
      setTimeout(() => {
        filterEl.carousel = carouselInfo(filter);
      }, 1);
      window.bpComponents.bpFilters[filterEl.id] = filterEl;
      filter.addClass('initiated');
      setTimeout(() => {
        $('body').trigger('click');
      }, 10);
      let sready = function(filterEl) {
        if (typeof filterEl.getResults !== 'function') {
          setTimeout(function() {
            sready(filterEl);
          }, 1);
          return;
        }
        filterEl.getResults();
        try {
          filterEl.getGroupResults();
        } catch (err) {}
        filterEl.onReady.apply(filterEl, null);
      };
      setTimeout(() => {
        sready(filterEl);
      }, 1);
      if (filterEl.grouped) {
        groups.push(filterEl.data.groupClass);
      }
    });
    try {
      if (groups.length > 0) {
        let cGroups = {};
        groups = groups.unique();
        $(groups).each((i, group) => {
          let g = $(`.${group}`);
          g.get(0).getGroupResults();
          cGroups[group.camelize()] = g;
        });
        bpComponents.bpFilters.bpFilterGroups = cGroups;
      }
    } catch (error) {
      console.warn(error);
    }
  };

  $(document).ready(initFilters);
  $('body').on('transitionend', e => {
    let t = $(e.target);
    if (t.is('.filter-list-js')) {
      let filterEl = t.closest('.class-filter').get(0);
      if (filterEl.carousel.hasCarousel) {
        let cs = filterEl.carousel.parentCarousel,
          index = filterEl.carousel.placementIndex;
        cs.goToSlide(index);
      }
      if (
        typeof filterEl.onFinished === 'function' &&
        e.originalEvent.propertyName === 'transform'
      ) {
        let opened =
          $(filterEl).find('.filter-container-js.opened-js').length > 0;

        if (opened) filterEl.onOpened();
        else filterEl.onFinished();
      }
    }
  });
})(Cog.jQuery());
// eslint-enable
