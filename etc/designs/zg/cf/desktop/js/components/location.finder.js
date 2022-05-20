"use strict";

/**
 * Location Finder component - desktop/js-component/component.loction.finder.js
 */
(function ($) {
  "use strict";

  var api = {};
  api.config = {};
  api.ref = {};
  api.ref.currentSet = 0;
  api.ref.currentPage = 0;
  api.ref.selectedTag = null;
  var maxAmount = 100;
  var locationStore = [];
  var mapStore = [];
  var allLocation = [];
  var myLatlng;
  var infoWindow;
  var bounds;
  var mapOptions;
  var storeMap;
  var Lat;
  var Long;

  api.onRegister = function (elements) {
    var $locationFinder = elements.$scope;
    api.loadConfigs();
    $locationFinder.each(function () {
      $(this).on("click", ".locationFinder-button", api.onLocationFinderClick);
      $(this).on("click", ".locationFinder-pagination .prev", api.onPrevPagination);
      $(this).on("click", ".locationFinder-pagination .next,.locationFinder-loadMore .loadMore", api.nextPage);
      $(this).on("change", ".locationFinder-selectOption,.locationFinder-selectOption1", api.onLocationDistanceChange);
      $(this).on("click", ".locationFinder-tagSelectOption li", api.onTagSelect);
      $(this).on("load", cf.loadCsrfToken('.locationFinder.component'));
    });
  };

  api.onPrevPagination = function () {
    api.gotoPage(api.ref.currentPage - 1);
  };

  api.nextPage = function () {
    api.gotoPage(api.ref.currentPage + 1);
  };

  api.onLocationDistanceChange = function () {
    $('.locationFinder-results-container').html('');
    var temp = allLocation;
    allLocation = [];
    locationStore = [];
    api.processData(temp.slice(0, maxAmount));
    api.gotoPage(0);
  };

  api.onTagSelect = function (ele) {
    api.ref.selectedTag = $(this).html();
    api.onLocationFinderClick(false);
  };

  api.onLocationFinderClick = function (resetTag) {
    var locationInfo = $('#locationInfo').val();
    var geocoder = new google.maps.Geocoder();
    var provider, getLocation;
    geocoder.geocode({
      'address': locationInfo
    }, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0].geometry.location.lat() != null) {
          Lat = results[0].geometry.location.lat();
        } else {
          Lat = "0.00";
        }

        if (results[0].geometry.location.lng() != null) {
          Long = results[0].geometry.location.lng();
        } else {
          Long = "0.00";
        }

        api.reset(resetTag);
        api.fetchData();
        api.gotoPage(0);
      }
    });
  };

  api.loadConfigs = function () {
    var content = $(".locationFinderResults");
    api.config.provider = content.data("providerPath");
    api.config.storePath = content.data("storePath");
    api.config.unit = content.data("unit");
    api.config.per_page = content.data("resultsPerpage");
  };

  api.fetchData = function () {
    var csrfToken = $(".locationFinder #cq_csrf_token").val();

    if (api.config.provider) {
      $.ajax({
        type: "POST",
        dataType: "json",
        cache: false,
        url: api.config.provider,
        async: false,
        data: {
          "path": api.config.storePath,
          "latitude": Lat,
          "longitude": Long,
          "unit": api.config.unit,
          "subset": api.ref.currentSet,
          "tag": api.ref.selectedTag,
          ":cq_csrf_token": csrfToken
        },
        success: function success(data) {
          api.ref.currentSet++;
          api.processData(data);
          $(".locationFinder-pagination .page_result").show();
        }
      });
    }
  };

  api.processData = function (data) {
    var content = $(".locationFinderResults");
    var unitSelection = content.data("unitSelection");
    var unitShow = content.data("unitShow");
    var distanceInput = $(".locationFinder-selectOption").val();
    var unitInput = $(".locationFinder-selectOption1").val();
    var locations = data;
    var tagInput = $(".locationFinder-tagSelectOption li");
    var updatedLocation = [];
    $.each(locations, function (idx, obj) {
      if (locations[idx]["imagePath"] != undefined) {
        locations[idx]["thumbnailClass"] = "showthumbnail";
      } else {
        locations[idx]["thumbnailClass"] = "hidethumbnail";
      }

      locations[idx]["Lat"] = Lat;
      locations[idx]["Long"] = Long;

      if (unitSelection == "Kilometers") {
        locations[idx]["distance"] = locations[idx]["distanceInKm"];
        locations[idx]["unitInput"] = unitSelection;
      } else if (unitSelection == "Miles") {
        locations[idx]["distance"] = locations[idx]["distanceInMiles"];
        locations[idx]["unitInput"] = unitSelection;
      }

      if (unitInput == 'Kilometers' && locations[idx]["distanceInKm"] <= distanceInput) {
        locations[idx]["distance"] = locations[idx]["distanceInKm"];
        locations[idx]["unitInput"] = unitInput;
        updatedLocation.push(locations[idx]);
      } else if (unitInput == 'Miles' && locations[idx]["distanceInMiles"] <= distanceInput) {
        locations[idx]["distance"] = locations[idx]["distanceInMiles"];
        locations[idx]["unitInput"] = unitInput;
        updatedLocation.push(locations[idx]);
      }

      allLocation.push(locations[idx]);
    });
    api.generateTemplate(updatedLocation);
  };

  api.gotoPage = function (page, type) {
    api.ref.currentPage = page;
    var startIndex = api.config.per_page * page;
    var endIndex = startIndex + api.config.per_page;

    if (api.config.type == 'pagination') {
      $('.locationFinder-results-container').html(locationStore.slice(startIndex, endIndex));
    } else if (api.config.type == 'loadMore') {
      $('.locationFinder-results-container').append(locationStore.slice(startIndex, endIndex));
    }

    if (locationStore.length <= endIndex + api.config.per_page) {
      api.fetchData();
    }

    if (locationStore.length <= endIndex) {
      $(".locationFinder-loadMore .loadMore").hide();
      $(".locationFinder-pagination .next").hide();
    } else {
      $(".locationFinder-loadMore .loadMore").show();
      $(".locationFinder-pagination .next").show();
    }

    if (page != 0) {
      $(".locationFinder-pagination .prev").show();
    } else {
      $(".locationFinder-pagination .prev").hide();
    }

    $('.current_page').html(page + 1);
  };

  api.generateTemplate = function (location) {
    var template = $(".locationFinder-template")[0].innerHTML,
        output = "",
        count = 0;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g,
      evaluate: /\{\%(.+?)\%\}/g
    };
    mapStore.push(location);

    _.forEach(location, function (store) {
      locationStore.push(_.template(template, store).replace(/(^\s+|\s+$)/g, ''));
    });

    api.mapData(location);
  };

  api.reset = function (resetTag) {
    $('.locationFinder-results-container').html('');
    api.ref.currentSet = 0;
    api.ref.currentPage = 0;

    if (resetTag != false) {
      api.ref.selectedTag = null;
    }

    if ($('.locationFinder-loadMore').length > 0) {
      api.config.type = 'loadMore';
    } else {
      api.config.type = 'pagination';
    }

    myLatlng = new google.maps.LatLng(-25.363882, 131.044922);
    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    mapOptions = {
      zoom: 10,
      center: myLatlng
    };
    storeMap = new google.maps.Map(document.getElementById("Map-0"), mapOptions);
    locationStore = [];
    mapStore = [];
  };

  api.mapData = function (locations) {
    if (locations.length > 0) {
      var marker;
      $.each(locations, function (idx, obj) {
        var position = new google.maps.LatLng(locations[idx]["latitude"], locations[idx]["longitude"]);
        bounds.extend(position);
        marker = new google.maps.Marker({
          position: position,
          draggable: true,
          map: storeMap
        });
        google.maps.event.addListener(marker, 'click', function (marker) {
          return function () {
            var infoData = locations[idx]["addressLine1"] + "," + locations[idx]["addressLine2"];
            infoWindow.setContent(infoData);
            infoWindow.open(storeMap, marker);
          };
        }(marker));
        storeMap.fitBounds(bounds);
      });
    }
  };

  Cog.registerComponent({
    name: "locationFinder",
    api: api,
    selector: ".locationFinder"
  });
})(Cog.jQuery());