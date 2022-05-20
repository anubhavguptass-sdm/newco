/**
 * Utils - URL - url modification helpers
 */

(function() {
	"use strict";
	var api = {},
		sharedApi = {};

	/* @CQ.shared.HTTP.setSelector */
	sharedApi.setSelector = function(url, selector, index) {
		var newUrl = url;
		var newIndex = index || 0;
		var protocol = "";
		var post = "";
		var pIndex = newUrl.indexOf("?");
		var host;
		var path;
		var selectors;
		var ext;
		var protocolIndex;

		if (pIndex === -1) {
			pIndex = newUrl.indexOf("#");
		}
		if (pIndex !== -1) {
			post = newUrl.substring(pIndex);
			newUrl = newUrl.substring(0, pIndex);
		}

		protocolIndex = newUrl.indexOf("//");

		if (protocolIndex !== -1) {
			protocol = newUrl.substring(0, newUrl.indexOf("//")+2);
			newUrl = newUrl.substring(newUrl.indexOf("//")+2);
		}

		selectors = sharedApi.getSelectors(newUrl);
		host = newUrl.substring(0, newUrl.indexOf("/"));
		path = newUrl.substring(newUrl.indexOf("/"));
		ext = path.substring(path.lastIndexOf(".")) !== path ? path.substring(path.lastIndexOf(".")) : "";

		path = path.lastIndexOf(".") > 0 ? path.substring(0, path.lastIndexOf(".")) : path;
		path = (selectors.length > 0) ? path.replace("." + selectors.join("."), "") : path;

		if (selectors.length > 0) {
			for (var i = 0; i < selectors.length; i++) {
				if (newIndex === i) {
					path += "." + selector;
				} else {
					path += "." + selectors[i];
				}
			}
		} else {
			path += "." + selector;
		}

		newUrl = protocol + host + path + ext + post;

		return newUrl;
	};

	/* @CQ.shared.HTTP.getSelectors */
	sharedApi.getSelectors = function(url) {
		var selectors = [];
		url = url || window.location.href;
		url = sharedApi.removeParameters(url);
		url = sharedApi.removeAnchor(url);
		var fragment = url.substring(url.lastIndexOf("/"));
		if (fragment) {
			var split = fragment.split(".");
			if (split.length > 2) {
				for (var i = 0; i < split.length; i++) {
					// don't add node name and extension as selectors
					if (i > 0 && i < split.length - 1) {
						selectors.push(split[i]);
					}
				}
			}
		}

		return selectors;
	};

	/* @_g.HTTP.removeParameters */
	sharedApi.removeParameters = function(url) {
		return (url.indexOf("?") !== -1) ? url.substring(0, url.indexOf("?")) : url;
	};

	/* @_g.HTTP.removeAnchor*/
	sharedApi.removeAnchor = function(url) {
		return (url.indexOf("#") !== -1) ? url.substring(0, url.indexOf("#")) : url;
	};

	Cog.registerStatic({
		name: "utils.url",
		api: api,
		sharedApi: sharedApi
	});

})();
