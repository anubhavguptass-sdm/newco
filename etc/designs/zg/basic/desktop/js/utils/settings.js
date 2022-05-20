/**
 * Utils - Settings
 * File for setting initials
 */

(function($) {
	"use strict";

	var api = {},
		sharedApi = {};

	api.init = function() {
		// Set lo-dash delimiters to mustache-like
		_.templateSettings = {
			interpolate: /\{\{(.+?)\}\}/g,
			evaluate: /\{\%(.+?)\%\}/g
		};

		// Set external api with data passed on body
		$.extend(sharedApi, $("body").data());
	};

	Cog.registerStatic({
		name: "utils.settings",
		api: api,
		sharedApi: sharedApi
	});
})(Cog.jQuery());