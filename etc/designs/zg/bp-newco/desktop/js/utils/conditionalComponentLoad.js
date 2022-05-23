/***** Conditional loading of CSS/JS files for specific components/pages *****/
var ConditionalComponentLoad = function () {
  var _this = this;
  // add more components/pages here while following the same object pattern
  this.components = [
    {
      selector: ".article-filter",
      js: ["./components/articleFilter.js"],
      name: "Article filter",
    },
    {
      selector: ".reference-custom-video",
      js: ["./components/custom-video.js"],
      name: "Custom video",
    },
    // {
    //   selector: ".shareThis",
    //   js: ["components/shareThis.js"],
    //   name: "shareThis",
    // },
    {
      selector: ".haleon-contact-form",
      js: ["./components/contact.js"],
      name: "Contact Page",
    },
    {
      selector: ".products-table",
      js: ["./components/productsTable.js"],
      name: "Products table",
    },
    {
      selector: ".gtm-search",
      js: ["./components/search.js"],
      name: "Search",
    },
    {
      selector: ".dotter-store",
      js: ["./components/dotter.js"],
      name: "Dotter",
    },
    {
      selector: ".quiz-container",
      js: ["./components/quizData.js"],
      name: "Quiz",
    },
    {
      selector: ".accordion",
      js: ["./components/accordion.js"],
      name: "accordion",
    },
    {
      selector: ".imageGallery",
      js: ["./components/imageGallery.js"],
      name: "imageGallery",
    },
    {
      selector: ".map-canvas",
      js: ["./components/map.js"],
      name: "map",
    },
    {
      selector: ".questionanswers",
      js: ["./components/questionanswers.js"],
      name: "questionanswers",
    },
    {
      selector: ".cf-search-box",
      js: ["./components/search.box.js"],
      name: "searchbox",
    },
    {
      selector: ".searchresults",
      js: ["./components/search.results.js"],
      name: "searchresults",
    },
    {
      selector: ".table",
      js: ["./components/table.js"],
      name: "table",
    },
    {
      selector: ".tabs",
      js: ["./components/tabs.js"],
      name: "tabs",
    },
    {
      selector: ".tagBasedFilter",
      js: ["./components/tagbasedFilter.js"],
      name: "tagBasedFilter",
    },
    {
      selector: ".videoGallery",
      js: ["./components/videoGallery.js"],
      name: "videoGallery",
    },
    {
      selector: ".short-nav-abreva",
      js: ["./parallax.js"],
      name: "Parallax",
    },
    {
      selector: ".gigyaraas",
      js: [
        "./libs/lodash.js",
        "./libs/cf.js",
        "visitorSyncUtil.js",
        "./components/gigya.raas.js",
        "./components/gigya.ssolink.js",
        "./components/gigya.raas.extension.js",
        "./components/gigya.raas.adobeaudience.extension.js",
        "./components/gigya.raas.unsubscribe.js",
      ],
      name: "gigya",
    },
  ];

  this.loadCssArray = function (paths, index) {
    index = index === undefined ? 0 : index;
    var styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.href = Cog.themeRoot + "css/" + paths[index];
    styleSheet.onload = function () {
      var nextPath = paths[index + 1];
      if (nextPath) {
        _this.loadCssArray(paths, index + 1);
      }
    };
    document.head.appendChild(styleSheet);
  };

  this.loadJsArray = function (paths, index) {
    index = index === undefined ? 0 : index;
    var script = document.createElement("script");

    script.src = Cog.themeRoot + "js/" + paths[index];
    script.onload = function () {
      var nextPath = paths[index + 1];
      if (nextPath) {
        _this.loadJsArray(paths, index + 1);
      }
    };
    document.body.appendChild(script);
  };

  this.init = function () {
    // find theme files url and add them to Cog object (to be available globally if needed later)
    Cog.themeRoot = document
      .querySelector("script[src*='head']")
      .src.split("js")[0];

    for (var i = 0; i < this.components.length; i++) {
      var comp = this.components[i];
      var shouldLoad = false;

      // check if current component is present on the page/is the current page
      if (comp.isPage) {
        shouldLoad = document.body.classList.contains(comp.selector);
      } else {
        shouldLoad = document.querySelectorAll(comp.selector).length > 0;
      }

      // load CSS and/or JS files specified in the component
      if (shouldLoad) {
        console.log(
          "Conditional loading for " + comp.name + " component triggered..."
        );
        if (comp.css) {
          this.loadCssArray(comp.css);
        }
        if (comp.js) {
          this.loadJsArray(comp.js);
        }
      }
    }
  };
};

var condCompLoad = new ConditionalComponentLoad();
condCompLoad.init();

if (window.gigyaCustomLang === undefined) {
  window.gigyaCustomLang = {};
}
window.gigyaCustomLang["TiioyApjHycfisZPadDi"] = {};
