"use strict";

(function ($) {
  var api = {};
  var city = "",
      cityId = "",
      province = "",
      BUType = "",
      hospitalname = "",
      resultsperpage = 0;
  var pageIndex = 0;

  api.onRegister = function (element) {
    var $hospitalSearch = element.$scope;
    $hospitalSearch.each(function () {
      $(this).on("click", ".hospitalSearch-type input", api.onBUTypeClick);
      $(this).on("click", ".hospitalSearch-province button", api.onProvinceClick);
      $(this).on("click", ".hospitalSearch-city button", api.onCityClick);
      $(this).on("click", ".hospitalSearch-result-list a", api.onHospitalNameClick);
      $(this).on("click", "button.hospitalSearch-submit", api.onHospitalSearchClick);
      $(this).on("click", "li.hospitalSearch-pagination-item a", api.onHospitalPaginationClick);
      $(this).on("load", cf.loadCsrfToken('.hospitalSearch.component'));
    });
  };

  api.onHospitalSearchClick = function (event, triggered) {
    pageIndex = 0;
    hospitalname = $("#hospitalSearchTxt").val();
    $(".hospitalSearch .result-list-1").show();
    $(".hospitalSearch .list-1").parent().addClass("hospitalSearch-list-active");
    api.ajaxHospitalList();
  };

  api.onBUTypeClick = function (event, triggered) {
    pageIndex = 0;
    BUType = $(this).val();
    $(".hospitalSearch-province").show("slow");
    var csrfToken = $(".hospitalSearch #cq_csrf_token").val();
    $.ajax({
      dataType: "json",
      type: 'POST',
      data: {
        "dsname": "ProvinceData",
        "dsParams": JSON.stringify({
          "BUType": BUType
        }),
        ":cq_csrf_token": csrfToken
      },
      url: window.location.pathname.replace(".html", "").replace(".desktop", "") + '.dssearch.json',
      success: function success(result) {
        var provinceTemplate = $(".hospitalSearch-province ul").html();
        var output = "";

        _.forEach(result.results, function (province) {
          var eachProvince = province.data;
          _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /\{\%(.+?)\%\}/g
          };
          output += _.template(provinceTemplate, eachProvince);
        });

        $('.hospitalSearch-province ul').html(output);
      }
    });
  };

  api.onProvinceClick = function (event, triggered) {
    var csrfToken = $(".hospitalSearch #cq_csrf_token").val();
    pageIndex = 0;
    province = $(this).data("provincename");
    var provinceIdglobal = $(this).data("province");
    $(".hospitalSearch-city").show("slow");
    $(".hospitalSearch-province button").removeClass("active");
    $(this).addClass("active");
    $(".hospitalSearch-city button").hide();

    if ($(".hospitalSearch-city-results").html() == "") {
      $.ajax({
        dataType: "json",
        type: 'POST',
        data: {
          "dsname": "cityData",
          "dsParams": JSON.stringify({
            "BUType": BUType,
            "ProvinceID": provinceIdglobal
          }),
          ":cq_csrf_token": csrfToken
        },
        url: window.location.pathname.replace(".html", "").replace(".desktop", "") + '.dssearch.json',
        success: function success(data) {
          var template = $(".hospitalSearch-city ul").remove().html();
          var output = "";
          _.templateSettings = {
            interpolate: /\{\{(.+?)\}\}/g,
            evaluate: /\{\%(.+?)\%\}/g
          };

          _.forEach(data.results, function (pro) {
            output += "<ul data-provinceid=" + provinceIdglobal + ">";
            output += _.template(template, pro.data);
            output += "</ul>";
          });

          $(".hospitalSearch-city-results").html(output);
          api.showCityList(provinceIdglobal);
        }
      });
    } else {
      api.showCityList(provinceIdglobal);
    }
  };

  api.showCityList = function (provinceId) {
    $('.hospitalSearch-city ul').hide();
    $('.hospitalSearch-city ul[data-provinceid="' + provinceId + '"]').show();
    $('.hospitalSearch-city ul[data-provinceid="' + provinceId + '"] li button').show();
  };

  api.onCityClick = function (event, triggered) {
    pageIndex = 0;
    resultsperpage = $(".hospitalSearch-city").data("resultsperpage");
    city = $(this).data("cityname");
    cityId = $(this).data("city");
    $(".hospitalSearch-results").show("slow");
    $(".hospitalSearch-city button").removeClass("active");
    $(this).addClass("active");
    $('.hospitalSearch-result-list ul').html("");
    api.ajaxHospitalList();
  };

  api.onHospitalNameClick = function (event, triggered) {
    event.preventDefault();
    $("#hospitalSearchTxt").val($(this).text());
  };

  api.onHospitalPaginationClick = function (event, triggered) {
    event.preventDefault();
    $(".hospitalSearch .hospitalSearch-pagination-item").removeClass("hospitalSearch-list-active");
    $(this).parent().addClass("hospitalSearch-list-active"); // $(".hospitalSearch .hospitalSearch-result-list").hide();
    // $(".hospitalSearch .result-"+this.className).show();

    if ($(this).attr("class") == "item-previous" && pageIndex > 0) {
      pageIndex = pageIndex - 1;
    }

    if ($(this).attr("class") == "item-next") {
      pageIndex = pageIndex + 1;
    }

    api.ajaxHospitalList();
  };

  api.ajaxHospitalList = function () {
    var csrfToken = $(".hospitalSearch #cq_csrf_token").val();
    $.ajax({
      data: {
        "dsname": "ChinaHospitalData",
        "dsParams": JSON.stringify({
          "CityID": cityId,
          "BUType": BUType,
          "HospitalName": hospitalname
        }),
        "PageIndex": pageIndex,
        "pagesize": resultsperpage,
        _charset_: "utf8",
        ":cq_csrf_token": csrfToken
      },
      type: 'POST',
      url: window.location.pathname.replace(".html", "").replace(".desktop", "") + '.dssearch.json',
      success: function success(result) {
        if (result == "") {
          $(".hospitalSearch .hospitalSearch-no-result").show();
          $(".hospitalSearch .hospitalSearch-pagination-list").hide();
          $('.hospitalSearch-result-list ul').hide();
        } else {
          $(".hospitalSearch .hospitalSearch-no-result").hide();
          $(".hospitalSearch .hospitalSearch-pagination-list").show();
          $('.hospitalSearch-result-list ul').show();
          var hospitalTemplate = $('.hospital-result-template').html();
          var output = "";

          _.forEach(result.results, function (hospital) {
            var eachHospital = hospital.data;
            _.templateSettings = {
              interpolate: /\{\{(.+?)\}\}/g,
              evaluate: /\{\%(.+?)\%\}/g
            };
            output += _.template(hospitalTemplate, eachHospital);
          });

          $('.hospitalSearch-result-list ul').html(output);
        }
      }
    });
  };

  Cog.registerComponent({
    name: "hospitalSearch",
    api: api,
    selector: ".hospitalSearch"
  });
})(Cog.jQuery());