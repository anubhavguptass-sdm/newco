"use strict";

(function ($) {
  var api = {};
  var tagDepth;
  var count, tagVal, showProduct, productArray, parse, countTagItem, tagArray;
  var selectionType;
  var $tagBasedFilter;

  api.onRegister = function (elements) {
    $tagBasedFilter = elements.$scope;
    var i;
    $(".multiLevelFilter-Container .tagBasedFilterResults-Information").hide();
    tagDepth = $(".tagBasedFilter").attr("data-depth");
    selectionType = $(".tagBasedFilter").attr("data-selection-Type");

    for (i = 1; i <= tagDepth; i++) {
      var level = ".multiLevelFilter-level" + i;
      $(level).each(function () {
        $(this).hide();
      });
    }

    $tagBasedFilter.each(function () {
      $(this).on("click", ".multiLevelFilter input", api.onMultiLevelFilterClick);
      $(this).on("click", ".simpleTagFilter input", api.getSelectedTagResults);
    });
  };

  api.onMultiLevelFilterClick = function (event, triggered) {
    var itemID = $(this).attr("id"),
        activeItem;
    var type = $(this).parents(".multiLevelFilter-Container").find(".multiLevelFilter").attr("data-input-type");

    if (type == "checkbox") {
      api.checkSelection($(this));
    } else if (type == "radio") {
      api.radioSelection($(this));
    } else {
      api.buttonSelection($(this));
    }

    var resultCount = $(".tagBasedFilterResults .grid_4.activeTagItem").length;
    var errorMessage = $(".tagBasedFilter").data("errorMessage");

    if ($(this).hasClass("lastProduct") && resultCount == 0) {
      $(".tagBasedFilterResults").append("<div class='tagBasedNoResult'>" + errorMessage + "</div>");
    }
  };

  api.resetSelection = function (currentObj) {
    var parentElement = currentObj.parents(".multiLevelFilter-Container");
    $(parentElement).find(".multiLevelFilter-ContainerResults .tagBasedFilterResults-Information").each(function () {
      $(this).parent().hide();
    });
    $(parentElement).find(".tagBasedFilterResults .tagBasedNoResult").html("");
    $(parentElement).find('.tagBasedFilterResults div.activeTagItem').removeClass("activeTagItem");
  };

  api.getAndIncrementLastNumber = function (str) {
    return str.replace(/\d+$/, function (s) {
      return +s - 1;
    });
  };

  api.buttonSelection = function (currentObj) {
    api.resetSelection(currentObj);
    var parentElement = currentObj.parents(".multiLevelFilter-Container");
    parentElement.find(".multiLevelFilterContent input.selected").removeClass("selected");
    currentObj.addClass("selected");
    var parentClass = currentObj.parent().parent().attr('class').split(' ')[1];

    if (parentClass == undefined) {
      parentClass = currentObj.parent().attr('class').split(' ')[1];
    }

    var lastChar = parseInt(parentClass[parentClass.length - 1]);

    if (parentClass == "multiLevelFilter-level1") {
      var inpClass = currentObj.attr("class").split(' ')[0];
      $("#" + inpClass).addClass("selected");
    } else {
      var parentContainer = api.getAndIncrementLastNumber(parentClass);

      for (var i = 1; i < lastChar; i++) {
        if (i == 1) {
          var inpClassFirst = currentObj.parents(".multiLevelFilterContent").find(".multiLevelFilter-level" + i).find("input:first").attr("class").split(' ')[0];
          $("#" + inpClassFirst).addClass("selected");
        }

        currentObj.parents(".multiLevelFilterContent").find(".multiLevelFilter-level" + i).find("input:first").addClass("selected");
      }
    }

    $('.multiLevelFilterContent input').each(function () {
      if (!$(this).hasClass("selected")) {
        $(this).next().hide();
      }
    });
    currentObj.next().slideDown();
    api.showRecommendedProduct(currentObj);
  };

  api.checkSelection = function (currentObj) {
    api.resetSelection(currentObj);
    var parentElement = currentObj.parents(".multiLevelFilterContent");

    if (currentObj.is(":checked")) {
      currentObj.parents(".genericFormGroup").next().slideDown();
    } else {
      var parentClass = currentObj.parents(".multiLevelFilterContent").attr("class").split(' ')[1];
      var parentContainer = api.getAndIncrementLastNumber(parentClass);

      for (var i = 1; i < tagDepth; i++) {
        currentObj.parents(".multiLevelFilterContent").find(".multiLevelFilter-level" + i).slideUp();
        currentObj.parents(".multiLevelFilterContent").find(".multiLevelFilter-level" + i).find("input").prop('checked', false);
      }
    }

    $('.multiLevelFilterContent .lastProduct').each(function () {
      if ($(this).is(":checked")) {
        api.showRecommendedProduct($(this));
      }
    });
  };

  api.radioSelection = function (currentObj) {
    api.resetSelection(currentObj);
    var parentElement = currentObj.parents(".multiLevelFilter-Container");
    currentObj.parents(".genericFormGroup").next().find("input").prop('checked', false);
    parentElement.find('.multiLevelFilter input').each(function (index) {
      if (!$(this).is(":checked")) {
        $(this).parents(".genericFormGroup").next(".multiLevelFilterContent").slideUp();
      }
    });
    currentObj.parents(".genericFormGroup").next().slideDown();
    api.showRecommendedProduct(currentObj);
  };

  api.showRecommendedProduct = function (inputSelected) {
    tagArray = [];
    var itemID = inputSelected.attr("id"),
        dataTagName,
        isChecked;

    if (inputSelected.attr("type").trim() == "checkbox") {
      isChecked = inputSelected.is(":checked");
    } else {
      isChecked = "true";
    }

    $(".tagBasedFilterResults .activeTagItem").removeClass("alpha");

    if (inputSelected.hasClass("lastProduct") == true && isChecked) {
      $(inputSelected).parents(".multiLevelFilter-Container").find('.multiLevelFilter-ContainerResults .tagBasedFilterResults-Information').each(function () {
        dataTagName = $(this).data("tagName");

        if (dataTagName.indexOf(",") != -1) {
          tagArray = dataTagName.split(",");

          for (var k = 0; k < tagArray.length; k++) {
            if (itemID == tagArray[k]) {
              api.showResult($(this));
            }
          }
        } else {
          if (dataTagName == itemID) {
            api.showResult($(this));
          }
        }
      });
    }

    $('.tagBasedFilterResults .activeTagItem').filter(function (index) {
      return index % 3 == 0;
    }).addClass('alpha');
  };

  api.showResult = function (currentObj) {
    currentObj.parent().show();
    currentObj.parent().addClass("activeTagItem");
    currentObj.show();
  };

  api.getSelectedTagResults = function (event, triggered) {
    $(".tagBasedFilterResults-Information").parent().css("display", "none");
    showProduct = $(this).attr("data-product-name");

    if (selectionType == 'Check-Box') {
      var allProduct = $(this).parents('.simpleTagFilter:eq(0)').find('input[type=checkbox]:checked');

      _.forEach(allProduct, function (n) {
        api.showProductMethod(jQuery(n).attr('data-product-name'));
      });
    } else {
      api.showProductMethod(showProduct);
    }

    if ($(".grid_4").hasClass("active")) {
      $(".grid_4").removeClass("active");
    }
  };

  api.showProductMethod = function (activeProduct) {
    productArray = [];
    $('.tagBasedFilterResults-Information').each(function () {
      tagVal = $(this).attr("data-tag-name");

      if (tagVal.indexOf(",") != -1) {
        productArray = tagVal.split(",");

        for (var j = 0; j < productArray.length; j++) {
          if (activeProduct == productArray[j]) {
            $(this).parent().show();
            $(this).parent().addClass("active");
          }
        }
      } else {
        if (activeProduct == tagVal) {
          $(this).parent().show();
          $(this).parent().addClass("active");
        }
      }
    });
  };

  Cog.registerComponent({
    name: "tagBasedFilter",
    api: api,
    selector: ".tagBasedFilter"
  });
})(Cog.jQuery());