"use strict";

(function ($) {
  var api = {},
      sharedApi = {};
  sharedApi.comparators = new Map();
  sharedApi.comparators.set("title", function (a, b) {
    var indexA = JSON.parse($(a).find('.index-entry')[0].textContent),
        indexB = JSON.parse($(b).find('.index-entry')[0].textContent),
        titleA = sharedApi.getNamedProp(indexA, 'title'),
        titleB = sharedApi.getNamedProp(indexB, 'title');
    return titleA.localeCompare(titleB);
  });
  sharedApi.comparators.set("date", function (a, b) {
    var indexA = JSON.parse($(a).find('.index-entry')[0].textContent),
        indexB = JSON.parse($(b).find('.index-entry')[0].textContent),
        dateA = new Date(sharedApi.getNamedProp(indexA, 'date')).valueOf(),
        dateB = new Date(sharedApi.getNamedProp(indexB, 'date')).valueOf();
    if (dateA < dateB) return -1;else if (dateA > dateB) return 1;else return 0;
  });

  sharedApi.getNamedProp = function (indexEntries, propName) {
    return indexEntries.filter(function (entry) {
      return entry.name === propName;
    }).map(function (namedEntry) {
      return namedEntry.value;
    }).shift();
  };

  sharedApi.buildSearchIndex = function ($indexableComponents) {
    var index,
        indexElements = [];
    $indexableComponents.find('.index-entry').each(function (i, element) {
      var indexEntries = JSON.parse(element.textContent),
          $domEntry = $(element).closest('.indexable-component'),
          title = sharedApi.getNamedProp(indexEntries, 'title'),
          id = $domEntry.data('id');
      indexElements.push({
        title: title,
        id: id
      });
    });
    index = lunr(function () {
      this.ref('id');
      this.field('title');
      this.pipeline.remove(lunr.stopWordFilter);
      indexElements.forEach(function (value) {
        this.add(value);
      }.bind(this));
    });
    return index;
  };

  api.onSortButtonClick = function (event, $sortControls, $indexableComponents, $sortMenuItems) {
    var $sortControl = $(event.target),
        sortBy = $sortControl.data('sortBy'),
        sortOrder = $sortControl.data('sortOrder') === 'ASC' ? 1 : -1;
    $sortControls.removeClass('active');
    $sortControl.addClass('active');
    $indexableComponents.sortDomElements(function (x, y) {
      return sharedApi.comparators.get(sortBy).call(this, x, y) * sortOrder;
    });
    $sortMenuItems.hide();
  };

  sharedApi.search = function (index, query, $component, $sortControls) {
    var searchResults = index.search(query),
        refsFound = searchResults.map(function (result) {
      return result.ref;
    }),
        $noResultsMsg = $component.find('.content__noResultFound');
    api.showSearchResults($component, refsFound);

    if (refsFound.length > 0) {
      $noResultsMsg.hide();

      if ($sortControls.filter('.active').length === 0) {
        api.filterSearchResultsByScore($component, searchResults);
      }
    } else {
      $noResultsMsg.show();
    }
  };

  api.showSearchResults = function ($component, refsFound) {
    $component.find('.indexable-component').each(function (index, element) {
      if (refsFound.indexOf($(element).data('id')) >= 0) {
        $(element).show();
      } else {
        $(element).hide();
      }
    });
  };

  api.filterSearchResultsByScore = function ($component, searchResults) {
    $component.find('.indexable-component:visible').sortDomElements(function (x, y) {
      var xRef = $(x).data('id'),
          yRef = $(y).data('id'),
          xScore = api.getScoreForRef(searchResults, xRef),
          yScore = api.getScoreForRef(searchResults, yRef);
      if (xScore === yScore) return 0;
      if (xScore < yScore) return -1;
      if (xScore > yScore) return 1;
    });
  };

  api.getScoreForRef = function (searchResults, ref) {
    return searchResults.filter(function (searchResult) {
      return searchResult.ref === ref;
    }).map(function (searchResult) {
      return searchResult.score;
    }).shift();
  };

  api.onRegister = function (element) {
    var $component = element.$scope,
        $searchBox = $component.find(".searchWrapper__search-box"),
        $sortControls = $component.find('.sortMenu__item'),
        $indexableComponents = $component.find('.indexable-component'),
        index,
        $sortMenuLabel = $component.find('.sortMenu__label'),
        $sortMenuItems = $component.find('.sortMenu__items'),
        $clearAll = $component.find('.header__clear-all');

    function moveStylingFromComponentToIndexableDiv(el) {
      var componentClasses = $(el).find(">div")[0].classList,
          classesCopy = JSON.parse(JSON.stringify(componentClasses)),
          length = Object.keys(classesCopy).length;

      for (var i = 0; i < length; i++) {
        var item = classesCopy[i];
        el.classList.add(item);
        componentClasses.remove(item);
      }
    }

    $indexableComponents.each(function (index, element) {
      moveStylingFromComponentToIndexableDiv(element);
      $(element).find(">div").change(function (event) {
        moveStylingFromComponentToIndexableDiv(event.target);
      });
    });
    $sortMenuLabel.on('click', function () {
      $sortMenuItems.toggle();
    });
    index = sharedApi.buildSearchIndex($indexableComponents);
    $sortControls.on('click', function (event) {
      api.onSortButtonClick(event, $sortControls, $indexableComponents, $sortMenuItems);
    });
    $searchBox.on("keypress", function (event) {
      if (event.key === 'Enter' || event.keyCode === 13) {
        var query = $searchBox.val().replace(/(\w+)/g, '+$1');
        sharedApi.search(index, query, $component, $sortControls);
      }
    });

    if ($clearAll) {
      $clearAll.on('click', function (event) {
        $sortControls.removeClass('active');
        $searchBox.val('');
        sharedApi.search(index, '', $component, $sortControls);
        var descOrder = -1;
        $indexableComponents.sortDomElements(function (x, y) {
          return sharedApi.comparators.get('date').call(this, x, y) * descOrder;
        });
      });
    }

    $(document).on('click', function (event) {
      if ($sortMenuItems.is(':visible') && $(event.target).closest('.header__sortMenu').length === 0) {
        $sortMenuItems.hide();
      }
    });
  };

  $.fn.sortDomElements = function () {
    return function (comparator) {
      return Array.prototype.sort.call(this, comparator).each(function (i) {
        this.parentNode.appendChild(this);
      });
    };
  }();

  Cog.registerComponent({
    name: "filterableBox",
    api: api,
    sharedApi: sharedApi,
    selector: ".filterableBox"
  });
})(Cog.jQuery());