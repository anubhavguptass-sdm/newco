"use strict";

(function ($, _) {
  'use strict';

  var api = {};

  api.onRegister = function ($loadMore) {
    var $component = $loadMore.$scope;
    $component.each(function () {
      var $submit = $(this).find(".loadMore-button"),
          $response = $(this).find(".ajaxResponse"),
          $clear = $(this).find(".loadMore-clear");

      if ($submit && $submit.length > 0) {
        $submit.on("click", function () {
          if ($submit.data("active")) {
            $.ajax({
              type: 'GET',
              dataType: 'html',
              url: $submit.data("path") + "?t=" + Date.now() + '&clear=' + $clear.val() + '&wcmmode=disabled',
              data: {},
              success: function success(response) {
                $clear.val("false");
                $response.append(response);
              }
            });
          } else {
            alert("Load more works only in WCM DISABLED mode");
          }
        });
      }

      $component.addClass('initialized');
    });
  };

  Cog.registerComponent({
    name: "loadMore",
    selector: ".component.loadMore",
    api: api
  });
})(Cog.jQuery(), _);