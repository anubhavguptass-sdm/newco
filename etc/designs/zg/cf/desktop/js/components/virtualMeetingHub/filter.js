"use strict";

(function ($) {
  var api = {},
      DateFilter = {
    UPCOMING: {
      filterFunction: function filterFunction(currentTime, meetingStartTime) {
        return currentTime < meetingStartTime;
      },
      name: 'upcoming'
    },
    PAST: {
      filterFunction: function filterFunction(currentTime, meetingStartTime) {
        return currentTime > meetingStartTime;
      },
      name: 'past'
    }
  };

  api.onRegister = function (element) {
    var $component = element.$scope,
        $meetings = $component.find('.meeting-list-entry');
    $component.find('.categoryFilter__trigger').on('click', getFilterTriggerClickHandler($meetings));
    $component.find('.meeting-list-filter__resetTrigger').on('click', function () {
      api.resetFilter($meetings, 'category-filter');
      $component.find('.categoryFilter__trigger').removeClass('active');
    });
    $component.find('.meeting-list-filter__filterByLabel').on('click', function (e) {
      e.stopPropagation();
      toggleFilterMenuVisibility($component);
    });
    $component.find('.meeting-list-filter__categoryFilter').on('click', function (e) {
      var $target = $(e.currentTarget),
          $optionsList = $target.find('.categoryFilter__optionsList');

      if ($optionsList.is(":hidden")) {
        $optionsList.addClass('active');
        $target.addClass('active');
      } else if ($(e.target).hasClass('meeting-list-filter__categoryFilter') || $(e.target).hasClass('categoryFilter__label')) {
        $optionsList.removeClass('active');
        $target.removeClass('active');
      }
    });

    window.onclick = function (event) {
      if ($(event.target).parents('.meeting-list-filter__filterBox').filter(':visible').length === 0) {
        hideFilterMenu();
        event.stopPropagation();
      }
    };

    handleFoundResults($meetings);
  };

  api.hidePastMeetings = function ($meetings) {
    api.resetFilter($meetings, 'date-filter');
    applyDateFilter($meetings, DateFilter.PAST);
  };

  api.hideUpcomingMeetings = function ($meetings) {
    api.resetFilter($meetings, 'date-filter');
    applyDateFilter($meetings, DateFilter.UPCOMING);
  };

  api.filterCategoryByValue = function ($trigger, $meetings, categoryType, categoryValue) {
    api.filter($meetings, 'category-filter', categoryType, function (meeting) {
      return $(meeting).data(categoryType) !== categoryValue;
    }, $trigger);
  };

  api.filter = function ($meetings, category, categoryType, filterFunction, $trigger, selectedCategoryTitle) {
    var $categoryFilterHeading = $trigger ? $trigger.closest('.meeting-list-filter__categoryFilter') : null,
        $selectedCategoryText = $categoryFilterHeading ? $categoryFilterHeading.find('.categoryFilter__selectedCategoryTitle') : null,
        $meetingsToHide = $meetings.filter(':not(.hidden-by-filter)').filter(function (index, element) {
      return filterFunction.call(this, element);
    });
    $.each(filterEmptyParentMeetings($.makeArray($meetingsToHide)), function (index, meetingToHide) {
      $(meetingToHide).hide();
      $(meetingToHide).addClass('hidden-by-filter');
      $(meetingToHide).data('hiddenBy', category);
      $(meetingToHide).data('hiddenByType', categoryType);
    });

    if ($selectedCategoryText && $categoryFilterHeading) {
      selectedCategoryTitle = selectedCategoryTitle ? selectedCategoryTitle : $trigger.find(".categoryFilter__name").text();
      $trigger.addClass('active selected');
      $categoryFilterHeading.addClass('selected');
      $selectedCategoryText.text(selectedCategoryTitle);
      $selectedCategoryText.show();
    }

    hideFilterMenu();
    handleFoundResults($meetings);
    handleNoResultsLabel($meetings);
  };

  api.resetFilter = function ($meetings, filterType, filterTypeValue) {
    var $component = $meetings.closest('.meeting-list-content'),
        $filterCategoryHeading = filterTypeValue ? $component.find('.meeting-list-filter .categoryFilter__trigger[data-meeting-list-filter-type="' + filterTypeValue + '"]').closest(".meeting-list-filter__categoryFilter") : $component.find('.meeting-list-filter .categoryFilter__trigger').closest(".meeting-list-filter__categoryFilter"),
        $trigger = $filterCategoryHeading.find('.selected');
    filterType = filterType ? filterType : 'category-filter';
    var $meetingsToShow = $meetings.filter('.hidden-by-filter').filter(function (index, meeting) {
      var result = $(meeting).data('hiddenBy') === filterType;

      if (result && filterTypeValue) {
        result = $(meeting).data('hiddenByType') === filterTypeValue;
      }

      return result;
    });
    $meetingsToShow.show();
    $meetingsToShow.removeClass('hidden-by-filter');
    $meetingsToShow.data('hiddenBy', '');
    $meetingsToShow.data('hiddenByType', '');
    $filterCategoryHeading.removeClass('selected');
    $filterCategoryHeading.find('.categoryFilter__selectedCategoryTitle').hide();
    $trigger.removeClass('active');
    $trigger.removeClass('selected');
    handleNoResultsLabel($meetings);
    handleFoundResults($meetings);
    hideFilterMenu();
  };

  api.getPastMeetings = function ($meetings) {
    return $meetings.filter(function (index, element) {
      return getFilterFunction(DateFilter.PAST).call(this, element);
    });
  };

  api.getUpcomingMeetings = function ($meetings) {
    return $meetings.filter(function (index, element) {
      return getFilterFunction(DateFilter.UPCOMING).call(this, element);
    });
  };

  var filterEmptyParentMeetings = function filterEmptyParentMeetings(meetingsToHideArr) {
    var component = $(meetingsToHideArr).closest('.meeting-list-content'),
        hideParent = component.data('hideChildrenWhenParentHidden'),
        result = meetingsToHideArr.filter(function (meetingToHide) {
      return filterOutEmptyParentLookingFromBottom(meetingToHide, meetingsToHideArr, hideParent);
    });

    if (hideParent) {
      filterOutEmptyParentsLookingFromAbove(meetingsToHideArr, result);
    }

    return result;
  };

  var handleNoResultsLabel = function handleNoResultsLabel($meetings) {
    var $noResultsLabel = $meetings.closest('.meetingList__entries').siblings('.no-results-label');

    if ($meetings.filter(':not(.hidden-by-filter)').length === 0) {
      $noResultsLabel.show();
    } else {
      $noResultsLabel.hide();
    }
  };

  var handleFoundResults = function handleFoundResults($meetings) {
    var $component = $meetings.closest('.meeting-list-content'),
        hideParent = $component.data('hideChildrenWhenParentHidden'),
        $template = $component.find('.meeting-list-filter__foundResults'),
        allCategoriesText = $component.find('.meeting-list-filter').data('allCategoriesText'),
        templateText = $component.find('.meeting-list-filter').data('foundResultsTemplate'),
        $selectedCategories = $component.find('.selected'),
        categoriesText = $.map($selectedCategories.filter('div').find('.categoryFilter__selectedCategoryTitle'), function (element) {
      return $(element).text().trim();
    }).join(", ");

    if (templateText) {
      templateText = templateText.replace("{{categories}}", '<span class="meeting-list-filter__byType">{{categories}}</span>');
      templateText = templateText.replace("{{resultsNumber}}", '<span class="meeting-list-filter__filterCount">{{resultsNumber}}</span>');
      templateText = templateText.replace("{{categories}}", categoriesText ? categoriesText : allCategoriesText);

      if (!hideParent) {
        templateText = templateText.replace("{{resultsNumber}}", $meetings.filter(':not(.hidden-by-filter)').length);
      } else {
        templateText = templateText.replace("{{resultsNumber}}", $meetings.filter(':not(.meeting-list-entry--hasSubMeetings)').filter(':not(.hidden-by-filter)').length);
      }

      $template.empty().append(templateText);
    }
  };

  var toggleFilterMenuVisibility = function toggleFilterMenuVisibility($component) {
    var $filterBox = $component.find('.meeting-list-filter__filterBox');

    if ($filterBox.is(":hidden")) {
      $filterBox.show();
    } else {
      hideFilterMenu();
    }
  };

  var filterOutEmptyParentsLookingFromAbove = function filterOutEmptyParentsLookingFromAbove(meetingsToHideArr, result) {
    $(meetingsToHideArr).each(function (index, meetingToHide) {
      var parent = $(meetingToHide).closest('.meeting-list-entry--hasSubMeetings'),
          visibleSubMeetingsOfParent = $(parent).find('.section--subMeetings .meeting-list-entry').filter(':visible'),
          subMeetingsOfParentToHide = 0;
      visibleSubMeetingsOfParent.each(function (subIndex, element) {
        if ($.inArray(element, meetingsToHideArr) !== -1) {
          subMeetingsOfParentToHide += 1;
        }
      });

      if (visibleSubMeetingsOfParent.length === subMeetingsOfParentToHide) {
        result.push(parent);
      }
    });
  };

  var filterOutEmptyParentLookingFromBottom = function filterOutEmptyParentLookingFromBottom(meetingToHide, meetingsToHideArr, hideParent) {
    var shouldBeHidden = true;

    if ($(meetingToHide).hasClass('meeting-list-entry--hasSubMeetings')) {
      var visibleSubMeetings = $(meetingToHide).find('.section--subMeetings .meeting-list-entry').filter(':visible'),
          subMeetingsToBeHidden = 0;
      visibleSubMeetings.each(function (subIndex, element) {
        if ($.inArray(element, meetingsToHideArr) === -1) {
          shouldBeHidden = false;
        } else {
          subMeetingsToBeHidden += 1;
        }
      });
      return hideParent ? shouldBeHidden || visibleSubMeetings.length === subMeetingsToBeHidden : shouldBeHidden;
    } else {
      return true;
    }
  };

  var hideFilterMenu = function hideFilterMenu() {
    var $filterContainer = $(document).find('.meeting-list-filter'),
        $filterBox = $filterContainer.find('.meeting-list-filter__filterBox').filter(':visible'),
        $activeSections = $filterContainer.find('.active');
    $activeSections.removeClass('active');
    $filterBox.hide();
  };

  var handleNewCategorySelection = function handleNewCategorySelection($trigger, $meetings) {
    api.filterCategoryByValue($trigger, $meetings, $trigger.data('meetingListFilterType'), $trigger.data('meetingListFilterValue'));
  };

  var getFilterFunction = function getFilterFunction(dateFilter) {
    return function (meeting) {
      var meetingStartDateTime = new Date($(meeting).data('utcDateTime'));
      meetingStartDateTime.setMinutes(meetingStartDateTime.getMinutes() + $(meeting).data('meetingDuration'));
      return dateFilter.filterFunction(new Date(), meetingStartDateTime);
    };
  };

  var applyDateFilter = function applyDateFilter($meetings, dateFilter) {
    api.filter($meetings, 'date-filter', dateFilter.name, getFilterFunction(dateFilter));
  };

  var getFilterTriggerClickHandler = function getFilterTriggerClickHandler($meetings) {
    return function (event) {
      var $trigger = $(event.target).closest('.categoryFilter__trigger'),
          $activeSiblings = $trigger.siblings('.selected');

      if ($trigger.hasClass('selected')) {
        api.resetFilter($meetings, 'category-filter', $trigger.data('meetingListFilterType'));
      } else if ($activeSiblings.length > 0) {
        $activeSiblings.removeClass('active');
        $activeSiblings.removeClass('selected');
        api.resetFilter($meetings, 'category-filter', $activeSiblings.first().data('meetingListFilterType'));
        handleNewCategorySelection($trigger, $meetings);
      } else {
        handleNewCategorySelection($trigger, $meetings);
      }

      event.stopPropagation();
    };
  };

  Cog.registerComponent({
    name: 'virtualMeetingListFilter',
    api: api,
    sharedApi: api,
    selector: '.virtualMeetingList'
  });
})(Cog.jQuery());