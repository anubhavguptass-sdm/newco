"use strict";

/**
 * Newsfeed
 */
(function ($, _) {
  'use strict';

  var api = {};

  function Newsfeed($component) {
    this.$component = $component;
    this.initialize();
  }

  Newsfeed.prototype = {
    page: 1,
    perPage: 10,
    tag: {},
    resourcePath: null,
    type: null,
    finalItem: false,
    initialized: false,
    $componentContent: null,
    parentGrid: null,
    initialize: function initialize() {
      var config = this.$component.find('.config');
      this.resourcePath = config.data('resource-path');
      this.type = config.data('type');
      this.perPage = config.data('per-page');
      this.tileGridWidth = config.data('news-grid-width');
      this.parentGrid = this.calculateParentGrid();

      if (typeof this.resourcePath !== 'undefined') {
        this.loadPage(true);
      }

      this.attachFilterByEvents();
    },
    getSelector: function getSelector() {
      return this.type === 'list' ? 'list' : 'promo';
    },
    getTagArea: function getTagArea(tag) {
      var split = tag.split(/[/:]/);
      return split[split.length - 2];
    },
    setTag: function setTag(tag) {
      if (tag === 'all') {
        this.tag = {};
      } else if (tag) {
        // one tag only:
        this.tag = {};
        this.tag[this.getTagArea(tag)] = tag;
      }
    },
    tagChangedHandler: function tagChangedHandler(e) {
      this.page = 1;
      this.setTag(e.eventData.id);
      this.loadPage();
    },
    attachFilterByEvents: function attachFilterByEvents() {
      if (this.type === 'list') {
        Cog.addListener('newsfeedFilterBy', 'tagChanged', $.proxy(this.tagChangedHandler, this));
      }
    },
    attachEvents: function attachEvents() {
      this.$componentContent.find('.newsfeed-pagination a').click($.proxy(this.pageChangedHandler, this));
      this.$componentContent.find('.newsfeed-perPage a').click($.proxy(this.perPageChangedHandler, this));
      this.$componentContent.find('.newsfeed-perPage .heading').click($.proxy(this.perPageHeadingClickHandler, this));
    },
    markSelectedPerPage: function markSelectedPerPage() {
      this.$componentContent.find('.newsfeed-perPage [data-per-page="' + this.perPage + '"]').addClass('active');
    },
    fireTagChangedEvent: function fireTagChangedEvent(tagId) {
      Cog.fireEvent('newsfeed', 'tagChanged', {
        id: tagId
      });
    },
    insertHtmlListDivItem: function insertHtmlListDivItem(item) {
      var $item = $(item),
          date = $item.find('.newsfeed-date').data('date-bucket'),
          id = 'id-' + date.toLowerCase().replace(/[\s,]/g, ''),
          $container = this.$componentContent.find('#' + id.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1")); // if month grouping container is not there yet

      if ($container.length === 0) {
        $container = $('<div id="' + id + '" class="month-container"/>');
        var $header = $('<h2>' + date + '</h2>');
        $container.append($header);
        this.$componentContent.append($container);
      }

      $container.append($item);
    },
    insertHtmlList: function insertHtmlList($content) {
      this.$componentContent.empty();
      this.$componentContent.append($content.filter('.newsfeed-number'));

      _.forEach($content.filter('.newsfeed-result'), $.proxy(this.insertHtmlListDivItem, this));

      this.$componentContent.append($content.filter('.newsfeed-noResults'));
      this.$componentContent.append($content.filter('.newsfeed-pagination'));
      this.$componentContent.append($content.filter('.newsfeed-perPage'));
      this.initializePerPageState();
      this.attachEvents();
      this.markSelectedPerPage();
    },
    insertHtmlPromo: function insertHtmlPromo($content) {
      this.$componentContent.append($content.filter('div, span, a'));
      this.$componentContent.append($content.filter('.button'));
    },
    initializeContainer: function initializeContainer(data) {
      if (!this.initialized) {
        this.initialized = true;
        this.$componentContent = $(data).clone();
        this.$componentContent.empty();
        this.$component.append(this.$componentContent);
      }
    },
    done: function done(data) {
      this.initializeContainer(data);
      var $content = $(data).contents();

      if (this.type === 'list') {
        this.insertHtmlList($content);
      } else {
        this.insertHtmlPromo($content);
      }

      if (this.type === 'list' || this.type === 'promo') {
        this.gridify();
      }
    },
    calculateParentGrid: function calculateParentGrid() {
      var cssClass = this.$component.parents().filter('[class*=grid_]').first().attr('class'),
          //read from parent
      //var cssClass = this.$component.attr('class'), //read from self
      grid = cssClass.substring(cssClass.indexOf('grid_') + 5),
          indexOfSpace = grid.indexOf(' ');
      return indexOfSpace > 0 ? grid.substring(0, indexOfSpace) : grid;
    },
    gridify: function gridify() {
      var $news = this.$componentContent.find('.newsfeed-result');

      if (this.type === 'list') {
        $news.addClass('grid_' + this.tileGridWidth);
        this.$componentContent.find('.month-container').each($.proxy(this.splitMonthNewsIntoRows, this));
      } else if (this.type === 'promo') {
        var $notFeatured = $news.filter(':not(.featured:first)');
        var $featured = $news.filter('.featured:first');
        $featured.addClass('grid_' + 2 * this.tileGridWidth);
        $notFeatured.addClass('grid_' + this.tileGridWidth);
        $news.first().addClass('alpha');
        $news.last().addClass('omega');
      } else if (this.type === 'related') {
        $news.addClass('grid_' + this.tileGridWidth + ' alpha omega');
      }
    },
    splitMonthNewsIntoRows: function splitMonthNewsIntoRows(index, element) {
      var $container = $(element),
          $monthNews = $container.find('.newsfeed-result'),
          tilesPerRow = this.parentGrid / this.tileGridWidth;
      $container.addClass('grid_' + this.parentGrid);

      for (var i = 0; i < $monthNews.length / tilesPerRow; i++) {
        var $rowNews = $monthNews.slice(tilesPerRow * i, tilesPerRow * (i + 1));
        $rowNews.first().addClass('alpha');
        $rowNews.last().addClass('omega');
      }
    },
    equalify: function equalify($tiles) {
      var tallest = 0;
      $tiles.each(function () {
        var thisHeight = $(this).height();

        if (thisHeight > tallest) {
          tallest = thisHeight;
        }
      });
      $tiles.height(tallest);
    },
    getParamFromHashString: function getParamFromHashString(param) {
      var result = null;

      if (document.location.hash.length > 1) {
        var hash = document.location.hash,
            indexStart = hash.indexOf('#' + param + '=');
        indexStart = indexStart == 0 ? 0 : hash.indexOf('&' + param + '=');

        if (indexStart >= 0) {
          var value = hash.substring(indexStart + param.length + 2),
              indexEnd = value.indexOf('&');
          result = indexEnd > 0 ? value.substring(0, indexEnd) : value;
        }
      }

      return result;
    },
    decomposeHashString: function decomposeHashString() {
      this.page = this.getParamFromHashString('p') || this.page;
      this.perPage = this.getParamFromHashString('g') || this.perPage;
      this.setTag(this.getParamFromHashString('t'));

      if (typeof history !== 'undefined' && history.pushState) {
        history.pushState('', document.title, window.location.href.substring(0, window.location.href.indexOf('#')));
      } else {
        document.location.hash = '';
      }
    },
    buildQueryString: function buildQueryString() {
      var query = '?ts=' + Date.now();

      if (this.type == 'list') {
        if (this.page) {
          query += '&p=' + this.page;
        }

        if (this.perPage) {
          query += '&g=' + this.perPage;
        }

        var tagsArray = [];

        for (var tag in this.tag) {
          tagsArray.push(this.tag[tag]);
        }

        if (tagsArray.length) {
          query += '&t=' + tagsArray.join(',');
        }
      }

      return query;
    },
    pageChangedHandler: function pageChangedHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      var p = $(e.target).parent().data('page');

      if (p) {
        this.page = p;
      }

      this.loadPage();
    },
    perPageChangedHandler: function perPageChangedHandler(e) {
      e.preventDefault();
      e.stopPropagation();
      var g = $(e.target).parent().data('per-page');

      if (g) {
        this.page = 1;
        this.perPage = g;
      }

      this.loadPage();
      this.perPageHeadingClickHandler();
    },
    perPageHeadingClickHandler: function perPageHeadingClickHandler() {
      this.$component.find('.newsfeed-perPage .slider').slideToggle(300, $.proxy(function () {
        this.$component.find('.newsfeed-perPage .heading').toggleClass('open');
      }, this));
    },
    initializePerPageState: function initializePerPageState() {
      this.$componentContent.find('.newsfeed-perPage .heading').html(this.perPage);
    },
    loadPage: function loadPage(decomposeHash) {
      if (decomposeHash) {
        this.decomposeHashString();
      }

      this.fireTagChangedEvent(this.tag);
      var path = this.resourcePath + '.' + this.getSelector() + '.html' + this.buildQueryString();
      $.ajax(path).done($.proxy(this.done, this));
    }
  };

  api.onRegister = function (scope) {
    new Newsfeed(scope.$scope);
  };

  Cog.registerComponent({
    name: 'newsfeed',
    api: api,
    selector: '.newsfeed',
    requires: [{
      name: 'newsfeedFilterBy',
      apiId: 'newsfeedFilterBy'
    }]
  });
})(Cog.jQuery(), _);