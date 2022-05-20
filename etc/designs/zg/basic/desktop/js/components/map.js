/**
 * Map
 * https://developers.google.com/maps/documentation/javascript/reference
 */

(function($) {
	"use strict";

	var api = {},
		loaded = false,
		$maps = [],
		URL = "https://maps.googleapis.com/maps/api/js",
		defaultOptions = {
			height: 250,
			zoom: 14,
			latitude: 51.500134,
			longitude: -0.12623,
			mapType: "ROADMAP",
			markers: []
		};

	function loadScript(params) {
		var scriptElement = document.createElement("script"),
			to = document.getElementsByTagName("script")[0];
		scriptElement.async = true;
		scriptElement.src = URL + "?" + $.param(params);
		to.parentNode.insertBefore(scriptElement, to);
		loaded = true;
	}

	function showMarkers(scope) {
		if (!scope.mapOptions.markers.length) {
			return;
		}

		var marker, k, infoWindow, tmarker;

		for (k in scope.mapOptions.markers) {
			if (scope.mapOptions.markers.hasOwnProperty(k) && scope.mapOptions.markers[k].title.length) {
				marker = scope.mapOptions.markers[k];
				tmarker = new google.maps.Marker({
					position: new google.maps.LatLng(marker.latitude, marker.longitude),
					map: scope.gmap,
					title: marker.title
				});

				if (marker.description.length) {
					infoWindow = new google.maps.InfoWindow({
						content: _.unescape(marker.description)
					});

					google.maps.event.addListener(tmarker, "click", openInfoWindow(tmarker, infoWindow, scope.gmap));
				}
			}
		}
	}

	function openInfoWindow(tmarker, infoWindow, gMap) {
		return (function(tmarker, infoWindow) {
			return function() {
				infoWindow.open(gMap, tmarker);
			};
		})(tmarker, infoWindow);
	}

	function onRegister(scope) {
		var map = scope,
				options = $.extend(defaultOptions, map.data()),
				centerPosition;

		map.height(options.height);

		centerPosition = new google.maps.LatLng(options.latitude, options.longitude);

		scope.mapOptions = {
			zoom: options.zoom,
			center: centerPosition,
			markers: options.markers,
			mapTypeId: google.maps.MapTypeId[options.mapType]
		};

		scope.gmap = new google.maps.Map(map[0], scope.mapOptions);

		showMarkers(scope);

		var tabContent = map.parents(".tabs-content");
		if (tabContent.size()) {
			Cog.addListener("tab", "change", function(e) {
				if (tabContent.attr("id") === e.eventData.id) {
					google.maps.event.trigger(scope.gmap, "resize");
				}
			});
		}
	}

	api.callback = function() {
		_.each($maps, function(el) {
			onRegister($(el));
		});
	};

	api.init = function(components) {
		var params = {};

		$maps = components;

		if (!$maps.size()) {
			return false;
		}

		if (loaded) {
			api.callback();
			return false;
		}

		if ($maps.first().data("key")) {
			params.key = $maps.first().data("key");
		}
		params.callback = "Cog.component.map.callback";

		loadScript(params);
	};

	api.onRegister = $.noop;

	Cog.registerComponent({
		name: "map",
		api: api,
		selector: ".map-canvas"
	});

	Cog.component.map = api;

})(Cog.jQuery());
