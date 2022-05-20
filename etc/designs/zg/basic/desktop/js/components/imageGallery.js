/**
 * Image Gallery
 */

(function($) {
	"use strict";

	var api = {},
		refs = {
			componentName: "imageGallery",
			thumbnailsContainerSelector: ".imageGallery-thumbnails",
			imageViewOverlaySelector: ".imageGallery-view-overlay",
			imageViewSelector: ".imageGallery-view",
			thumbnailsListContainerSelector: ".imageGallery-list",
			mainArrowsSelector: ".imageGallery-view .imageGallery-arrow",
			thumbnailsArrowsSelector: ".imageGallery-thumbnails .imageGallery-arrow",
			thumbnailsArrowsLeftClass: "imageGallery-arrow-left",
			thumbnailsArrowsRightClass: "imageGallery-arrow-right",
			descriptionSelector: ".imageGallery-description",
			thumbnailsListInner: ".imageGallery-list-inner",
			thumbnailsList: ".imageGallery-list"
		},
		Direction = {
			PREV: -1,
			NEXT: 1
		},
		settings = {
			loop: true,
			playTimeout: 4000
		};

	api.onRegister = function(scope) {
		function showNext($context) {
			var currentItem = $context.filter(".is-active"),
				$nextItem = currentItem.next();

			if ($nextItem.length) {
				$nextItem.trigger("click");
			} else if (settings.loop) {
				$context.eq(0).trigger("click");
			}
		}

		function showPrev($context) {
			var currentItem = $context.filter(".is-active"),
				$prevItem = currentItem.prev();

			if ($prevItem.length) {
				$prevItem.trigger("click");
			} else if (settings.loop) {
				$context.last().trigger("click");
			}
		}

		function centerActiveThumbnail($context) {
			var activeItem = $context.filter(".is-active"),
				currentItemPosition = activeItem.position();
			scrollThumbnails($context, currentItemPosition.left * -1);
		}

		function scrollThumbnails($context, to) {
			to += $thumbnailsList.parent().width() / 2 - $context.filter(".is-active").width() / 2;
			to = Math.max(to, -1 * $thumbnailsList.width() + $thumbnailsList.parent().width());
			to = Math.min(0, to);

			$thumbnailsList.animate({left: to});
		}

		var $this = scope.$scope,
			$mainImage = $this.find(refs.imageViewSelector + " img"),
			$mainImageContainer = $this.find(refs.imageViewSelector),
			$thumbnailsContainer = $this.find(refs.thumbnailsContainerSelector),
			$thumbnailsListContainer = $thumbnailsContainer.find(
				refs.thumbnailsListContainerSelector),
			$thumbnailsList = $thumbnailsListContainer.find(refs.thumbnailsListInner),
			$thumbnailsItems = $thumbnailsList.find("li"),
			$arrowsMain = $this.find(refs.mainArrowsSelector),
			$arrowsThumbs = $this.find(refs.thumbnailsArrowsSelector),
			$descriptionContainer = $this.find(refs.descriptionSelector),
			$firstItem = $thumbnailsItems.eq(0),
			playingTimer,
			maxImageHeight = $mainImageContainer.data("height");

		function setListWidth() {
			var thumbnailWidth = $firstItem.outerWidth(true),
				listOuterWidth = $thumbnailsItems.length * thumbnailWidth;
			$thumbnailsList.css("width", listOuterWidth);
		}

		$mainImageContainer.on("click", function() {
			clearInterval(playingTimer);
			if ($this.hasClass("is-playing")) {
				$this.removeClass("is-playing");
			} else {
				playingTimer = setInterval(function() {
					var $activeItem = $thumbnailsItems.filter(".is-active"),
						$nextItem = $activeItem.next();
					if ($nextItem.length) {
						$nextItem.trigger("click");
					} else {
						$thumbnailsItems.eq(0).trigger("click");
					}
				}, settings.playTimeout);
				$this.addClass("is-playing");
			}
		});

		$thumbnailsItems.on("click", function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			var $this = $(this),
				$link = $this.find("a"),
				$linkImg = $link.find("img");

			if (!$this.hasClass("is-active")) {
				$thumbnailsItems.removeClass("is-active");
				$this.addClass("is-active");

				$mainImage.one("load", function () {
					$mainImage.fadeIn(200);
					$descriptionContainer.text($link.data("description"));
				});

				if ($linkImg.attr("src") !== $mainImage.attr("src")) {

					var thumbnailsListLeft = $thumbnailsList.parent().offset().left,
						thumbnailsListRight = thumbnailsListLeft +
							$thumbnailsList.parent().width(),

						thumbnailLeft = $this.offset().left,
						thumbnailRight = thumbnailLeft + $this.outerWidth(false);

					if (thumbnailsListLeft > thumbnailLeft) {
						$thumbnailsList.animate(
							{left: "+=" + (thumbnailsListLeft - thumbnailLeft)});
					} else if (thumbnailsListRight < thumbnailRight) {
						$thumbnailsList.animate(
							{left: "-=" + (thumbnailRight - thumbnailsListRight)});
					}

					$mainImage.fadeTo(200, 0, function() {

						var originalHeight = $linkImg.data("height"),
							correctHeight = !maxImageHeight ||
							originalHeight <= maxImageHeight ?
								originalHeight : maxImageHeight,

							originalWidth = $linkImg.data("width"),
							correctWidth = (correctHeight * originalWidth) / originalHeight;

						$mainImage.attr("width", parseInt(correctWidth, 10));
						$mainImage.attr("height", parseInt(correctHeight, 10));
						$mainImage.attr("src", $link.attr("href"));

						$mainImage.fadeTo(200, 1);

					});
				}
			}
		});

		$arrowsThumbs.on("click", function(e) {
			e.preventDefault();
			e.stopPropagation();
			var vector = $(this).hasClass(refs.thumbnailsArrowsLeftClass) ?
					Direction.PREV : Direction.NEXT,
				currentScroll = parseInt($thumbnailsList.css("left"), 10),
				to = currentScroll - vector * $thumbnailsItems.eq(0).width() * 2;

			to -= $thumbnailsList.parent().width() / 2 -
			$thumbnailsItems.filter(".is-active").width() / 2;
			scrollThumbnails($thumbnailsItems, to);
		});

		$arrowsMain.on("click", function(ev) {
			ev.preventDefault();
			ev.stopPropagation();
			$thumbnailsList.stop(false, true);

			var $this = $(this),
				vector = $this.hasClass(refs.thumbnailsArrowsLeftClass) ? Direction.PREV : Direction.NEXT;

			if (vector === Direction.NEXT) {
				showNext($thumbnailsItems);
			} else {
				showPrev($thumbnailsItems);
			}

			centerActiveThumbnail($thumbnailsItems);
			$arrowsMain.removeClass("is-disabled");

		});

		var originalHeight = $mainImage.attr("height"),
			correctHeight = !maxImageHeight ||
			originalHeight <= maxImageHeight ? originalHeight : maxImageHeight,

			originalWidth = $mainImage.attr("width"),
			correctWidth = (correctHeight * originalWidth) / originalHeight;

		$mainImage.attr("width", parseInt(correctWidth, 10));
		$mainImage.attr("height", parseInt(correctHeight, 10));

		setListWidth();
	};

	Cog.registerComponent({
		name: "imageGallery",
		api: api,
		selector: ".imageGallery"
	});
})(Cog.jQuery());
