"use strict";

(function ($, document) {
  var api = {};

  api.loadScript = function (http, https) {
    var protocol = window.location.protocol;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = protocol === "https:" ? https : http;
    document.getElementsByTagName('head')[0].appendChild(script);
  };

  api.onRegister = function () {//Method create script tag with protocol based url and attach it to head
  };

  Cog.registerComponent({
    name: "loadExternalLibs",
    api: api
  });
})(Cog.jQuery());