"use strict";

(function ($) {
  var api = {},
      $component,
      $noOfAllResults,
      $noOfShownResults,
      $products,
      $alphabeticSections,
      $alphabetFilter,
      $showMoreBtn,
      $appliedFilter,
      $filterTriggers,
      $resetFilterTrigger,
      $filterByLabel,
      $productTypes,
      paginationEnabled,
      resultLimit,
      currentResultLimit,
      alphabetLimit,
      hashParams;

  api.onRegister = function (element) {
    $component = $(element.$scope);
    hashParams = extractHashParameters();
    initializeContext();
    initializeEventHandlers();
    markProtectedPages();
    api.rebuildProductList(hashParams['filter-type'], hashParams['filter-value']);
  };

  api.rebuildProductList = function (filterType, filterValue, filterHashParam) {
    if (filterType && filterValue) {
      api.filterProducts(filterType, filterValue);
    } else {
      api.resetFilters();
    }

    api.updateAlphabetFilter();

    if (filterType !== 'alphabetic') {
      api.resetPagination();
      api.processPagination();
    }

    api.updateNumberOfShownResults();

    if (filterHashParam) {
      window.location.hash = filterHashParam;
    }
  };

  api.updateNumberOfShownResults = function () {
    $noOfShownResults.text($products.length - $products.filter(":hidden").length);
    $noOfAllResults.text($products.length - $products.filter('[data-hidden-by="filter"]').length);
  };

  api.processPagination = function () {
    if (paginationEnabled) {
      var $visibleProducts = $products.filter('[data-hidden-by!="filter"]'),
          noOfProducts = $visibleProducts.length;

      for (var i = 0; i < noOfProducts; i++) {
        var $product = $($visibleProducts[i]);

        if (i < currentResultLimit) {
          $product.show();
          $product.attr('data-hidden-by', '');
        } else {
          $product.attr('data-hidden-by', 'pagination');
          $product.hide();
        }
      }

      if (currentResultLimit < noOfProducts) {
        $showMoreBtn.show();
      } else {
        $showMoreBtn.hide();
      }
    }
  };

  api.updateAlphabetFilter = function () {
    $alphabeticSections.each(function (index, target) {
      var $section = $(target),
          productsBelow = $section.find('.product'),
          alphabetFilterElement = $alphabetFilter.find('.alphabet-filter__element a[data-filter-value={sectionFilterValue}]'.replace('{sectionFilterValue}', $section.data('filterValue')));

      if (productsBelow.length === productsBelow.filter('[data-hidden-by="filter"]').length) {
        alphabetFilterElement.removeClass('filter-trigger--active');
        alphabetFilterElement.addClass('filter-trigger--inactive');
      } else {
        alphabetFilterElement.addClass('filter-trigger--active');
        alphabetFilterElement.removeClass('filter-trigger--inactive');
      }
    });

    if (alphabetLimit && alphabetLimit >= $products.length - $products.filter('[data-hidden-by="filter"]').length) {
      $alphabetFilter.hide();
    } else {
      $alphabetFilter.show();
    }
  };

  api.resetPagination = function () {
    currentResultLimit = resultLimit;
  };

  api.turnOffPagination = function () {
    var $productsHiddenByPagination = $products.filter('[data-hidden-by="pagination"]');
    $productsHiddenByPagination.each(function (index, element) {
      $(element).show();
      $(element).attr('data-hidden-by', '');
    });
    currentResultLimit = $products.length;
    $showMoreBtn.hide();
  };

  api.resetFilters = function () {
    $products.each(function (index, target) {
      $(target).show();
      $(target).attr('data-hidden-by', '');
    });
    $showMoreBtn.hide();
  };

  api.filterProducts = function (filterType, filterValue) {
    if (filterType === 'alphabetic') {
      var $target = $('.product-list-filter-target[data-filter-value="${0}"][data-filter-type="${1}"]'.replace("${0}", filterValue).replace("${1}", filterType));
      api.turnOffPagination();

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }

      $target[0].scrollIntoView();
    } else if (filterType === 'productType') {
      api.resetFilters();
      var $targets = $('.product-list-filter-target[data-filter-value!="${0}"][data-filter-type="${1}"]'.replace("${0}", filterValue).replace("${1}", filterType));
      $targets.each(function (index, target) {
        $(target).attr('data-hidden-by', 'filter');
        $(target).hide();
      });
      $showMoreBtn.hide();
      $appliedFilter.text(filterValue);
      $productTypes.find('li[data-href="#filter-type=productType&filter-value=${0}"] input'.replace("${0}", filterValue)).prop("checked", "checked");
    }
  };

  var initializeContext = function initializeContext() {
    var componentDiv = $component.find('.product-list-content');
    $noOfAllResults = $component.find('.no-of-all-results');
    $noOfShownResults = $component.find('.no-of-shown-results');
    $products = $component.find('.product');
    $alphabeticSections = $component.find('.product-list-filter-target[data-filter-type="alphabetic"]');
    $alphabetFilter = $component.find('.product-list-filter[data-filter-type="alphabetic"]');
    $showMoreBtn = $component.find('.results__show-more-btn');
    $appliedFilter = $component.find('.applied-filter');
    $filterTriggers = $component.find('.filter-trigger');
    $resetFilterTrigger = $component.find('.filter-trigger--reset');
    $filterByLabel = $component.find('.filter-by__label');
    $productTypes = $component.find('ul.filter__product-types');
    paginationEnabled = componentDiv.data('paginationEnabled');
    resultLimit = componentDiv.data('resultLimit');
    alphabetLimit = componentDiv.data('alphabetLimit');
    currentResultLimit = resultLimit;
  },
      extractHashParameters = function extractHashParameters() {
    var hash = window.location.hash.substr(1),
        result = {};

    if (hash) {
      result = hash.split('&').reduce(function (result, item) {
        var parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
    }

    return result;
  },
      initializeEventHandlers = function initializeEventHandlers() {
    $filterTriggers.on('click', function (event) {
      var $filterTrigger = $(event.currentTarget),
          filterType = $filterTrigger.closest('.product-list-filter').data('filterType'),
          filterValue = $filterTrigger.data('filterValue'),
          filterHashParam = $filterTrigger.data('href');
      api.rebuildProductList(filterType, filterValue, filterHashParam);
    });
    $resetFilterTrigger.on('click', function (event) {
      api.rebuildProductList();
      $appliedFilter.text($(event.currentTarget).data('filterValue'));
    });
    $filterByLabel.on('click', function () {
      $productTypes.toggleClass("show");
    });
    $showMoreBtn.on('click', function () {
      currentResultLimit += resultLimit;
      api.processPagination();
      api.updateNumberOfShownResults();
    });

    window.onclick = function (event) {
      if (!event.target.matches('.filter-by__label')) {
        var dropdowns = $('ul.filter__product-types.show');
        dropdowns.each(function (index, element) {
          $(element).removeClass('show');
        });
      }
    };
  },
      markProtectedPages = function markProtectedPages() {
    var hrefs = [];
    $products.each(function (index, element) {
      var longPath = $(element).data('longPath');

      if (longPath) {
        hrefs.push(longPath);
      }
    });
    $.ajax(window.location.pathname.split('.')[0] + '.productsProtectionCheck.json?hrefs=' + JSON.stringify(hrefs)).done(function (data) {
      data.forEach(function (productPath) {
        $component.find('.product[data-long-path="$productPath"]'.replace('$productPath', productPath)).find('.product__info-title').addClass('lock-icon');
      });
    });
  };

  Cog.registerComponent({
    name: "productList",
    api: api,
    selector: ".productList"
  });
})(Cog.jQuery());