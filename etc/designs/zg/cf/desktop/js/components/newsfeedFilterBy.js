"use strict";

/**
 * Newsfeed Filter By
 */
(function ($) {
  "use strict";

  var api = {};

  function NewsfeedFilterBy($component) {
    this.$component = $component;
    this.initialize();
  }

  NewsfeedFilterBy.prototype = {
    initialize: function initialize() {
      this.attachEvents();
    },
    attachEvents: function attachEvents() {
      this.$component.find('a').on('click', $.proxy(this.tagClickHandler, this));
      this.$component.find('.heading').on('click', $.proxy(this.headingClickHandler, this));
      Cog.addListener('newsfeed', 'tagChanged', $.proxy(this.tagChangedHandler, this));
    },
    headingClickHandler: function headingClickHandler() {
      this.$component.find('.slider').slideToggle(300, $.proxy(function () {
        this.$component.find('.heading').toggleClass('open');
      }, this));
    },
    tagClickHandler: function tagClickHandler(e) {
      Cog.fireEvent('newsfeedFilterBy', 'tagChanged', {
        id: $(e.target).parent().data('id')
      });
      this.headingClickHandler();
    },
    markSelected: function markSelected(tags) {
      this.$component.find('.active').removeClass('active');

      for (var tag in tags) {
        var decodedTag = decodeURIComponent(tags[tag]);
        this.$component.find('[data-id="' + decodedTag + '"]').addClass('active');
      }
    },
    tagChangedHandler: function tagChangedHandler(e) {
      this.markSelected(e.eventData.id);
    }
  };

  api.onRegister = function (scope) {
    new NewsfeedFilterBy(scope.$scope);
  };

  Cog.registerComponent({
    name: "newsfeedFilterBy",
    api: api,
    selector: ".newsfeedFilterBy"
  });
})(Cog.jQuery());