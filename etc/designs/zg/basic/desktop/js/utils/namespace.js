Cog.utils = Cog.utils || {};

/**
 * Creates objects so a passed path exists
 * @param namespaceString string representation of object's path
 */

(function() {
	"use strict";

	function namespace(namespaceString) {
		var parts = namespaceString.split("."),
			parent = window,
			currentPart = "";

		for (var i = 0, length = parts.length; i < length; i++) {
			currentPart = parts[i];
			parent[currentPart] = parent[currentPart] || {};
			parent = parent[currentPart];
		}

		return parent;
	}

	Cog.registerStatic({
		name: "utils.namespace",
		sharedApi: namespace,
		api: {}
	});
})();
