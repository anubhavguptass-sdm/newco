/**
 * Site Tools component - utils/siteTools.js
 */

(function ($, document) {
    "use strict";

    var path = window.location.pathname.split('.') [0];

    $(".delete-user-account").on('click', function () {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: path + 'softDelete.json',
            success: function (data) {
                console.log(data);
            }
        });
    })

})(Cog.jQuery(), document);

(function ($, document) {
    "use strict";

    Cog.component.siteTools = {

        init: function () {
            $(".siteTools .siteTools-inner:not(.initialized)").each(function () {
                var $siteTools = $(this);

                $siteTools.find(".toolPrint a").click(function (event) {
                    window.print();
                    event.preventDefault();
                });

                $siteTools.addClass("initialized");
            });
        },

        initSocialLinks: function () {
            $(".shareThis .socialBookmarks a, .share .share-container a").each(function () {
                var href = $(this).attr("href");

                href = href.replace(/\{\{url\}\}/ig, encodeURIComponent(document.location.href));
                href = href.replace(/\{\{title\}\}/ig, encodeURIComponent(document.title));

                $(this).attr("href", href);
            });

            $(".shareThis .socialBookmarks:not(.initialized)," +
                " .share .share-container:not(.initialized)").each(function () {
                $(this).delegate("a", "click", function (e) {
                    window.open(this.href);
                    e.preventDefault();
                }).addClass("initialized");
            });
        }
    };


})(Cog.jQuery(), document);


(function ($) {
    "use strict";

    Cog.component.videoEventTracker = {

        turnOnTracking: function (options) {
            var trackingOptions = options || {},
                pagePath = trackingOptions.pagePath || null,
                servletUrl = trackingOptions.url || null,
                pageTitle = trackingOptions.pageTitle || null;

            Cog.addListener("videoEventTracker", "eventToTrack", function (eventData) {
                var csrfToken = $('#cq_csrf_token').val();
                var path = window.location.pathname.split('.') [0];
                var config = eventData ? eventData.eventData : {},
                    eventType = config.eventType || null,
                    gzgEvent = config.gzgEvent || null,
                    gzgscEvent = config.gzgscEvent || null,
                    trackingName = config.trackingName || null,
                    brandId = config.brandId || null;

                if (eventType === "ended") {
                    /*
                     $.ajax({
                     cache: false,
                     url: servletUrl,
                     data: {
                     pagePath: pagePath,
                     pageTitle: pageTitle,
                     gzgEvent: gzgEvent,
                     gzgscEvent: gzgscEvent,
                     trackingName: trackingName,
                     brandId: brandId
                     }
                     });
                     */
                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        url: path + '.trackactivity.json',
                        data: {
                            ':cq_csrf_token': csrfToken,
                            'AE_DESC': trackingName,
                            'AE_SUBTYPE': gzgscEvent,
                            'PRODUCT_CD': brandId,
                            'TRIGGER_SRC_CD': gzgEvent,
                            'buId': cf.veevaBuId
                        }, success: function (data) {
                            console.log(data);
                        }
                    });
                }
            });
        },

    };
}(Cog.jQuery()));


(function ($) {
    "use strict";

    Cog.component.submitEventTracker = {
        turnOnTracking: function (options) {
            var trackingOptions = options || {},
                pagePath = trackingOptions.pagePath || null,
                servletUrl = trackingOptions.url || null,
                pageTitle = trackingOptions.pageTitle || null;

            Cog.addListener("submitEventTracker", "eventToTrack", function (eventData) {
                var csrfToken = $('#cq_csrf_token').val();
                var path = window.location.pathname.split('.') [0];
                var config = eventData ? eventData.eventData : {},
                    gzgEvent = config.gzgEvent || null,
                    gzgscEvent = config.gzgscEvent || null,
                    trackingName = config.trackingName || null,
                    brandId = config.brandId || null,
                    userUid = config.userUid || null,
                    userCrmId = config.userCrmId || "",
                    userBuId = config.userBuId || "";
                /*
                 $.ajax({
                 async: false,
                 cache: false,
                 url: servletUrl,
                 data: {
                 pagePath: pagePath,
                 pageTitle: pageTitle,
                 trackingName: trackingName,
                 gzgEvent: gzgEvent,
                 gzgscEvent: gzgscEvent,
                 brandId: brandId
                 }
                 })
                 */
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: path + '.trackactivity.json',
                    data: {
                        ':cq_csrf_token': csrfToken,
                        'AE_DESC': trackingName,
                        'AE_SUBTYPE': gzgscEvent,
                        'PRODUCT_CD': brandId,
                        'TRIGGER_SRC_CD': gzgEvent,
                        'UID': userUid,
                        'CRMID': userCrmId,
                        'buId': userBuId
                    }, success: function (data) {
                        console.log(data);
                    }
                });
            });
        },
    };


}(Cog.jQuery()));

(function ($) {
    "use strict";
    var api = {},
        ajaxCallOptions,
        onEvent;
    Cog.component.linkEventTracker = {
        onEvent: function () {
            /*
             var $this = $(this),
             trackingServletUrl = ajaxCallOptions.url || "/bin/zg/analytics",
             pagePath = ajaxCallOptions.pagePath || null,
             pageTitle = ajaxCallOptions.pageTitle || null,
             trackingName = $this.data("gzgname"),
             gzgEvent = $this.data("gzgevent"),
             gzgscEvent = $this.data("gzgscevent"),
             brandId = $this.data("brandid");
             $.ajax({
             async: false,
             cache: false,
             url: trackingServletUrl,
             data: {
             pagePath: pagePath,
             pageTitle: pageTitle,
             trackingName: trackingName,
             gzgEvent: gzgEvent,
             gzgscEvent: gzgscEvent,
             brandId: brandId
             }
             });
             */
            var csrfToken = $('#cq_csrf_token').val();
            var path = window.location.pathname.split('.') [0];
            var trackingName = $(this).data('gzgname');
            var gzgEvent = $(this).data('gzgevent');
            var gzgscEvent = $(this).data('gzgscevent');
            var brandId = $(this).data('brandid');
            if(typeof trackingName != 'undefined' && trackingName != null && trackingName != ''){
                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: path + '.trackactivity.json',
                    data: {
                        ':cq_csrf_token': csrfToken,
                        'AE_DESC': trackingName,
                        'AE_SUBTYPE': gzgscEvent,
                        'PRODUCT_CD': brandId,
                        'TRIGGER_SRC_CD': gzgEvent,
                        'buId': cf.veevaBuId
                    }, success: function (data) {
                        console.log(data);
                    }
                });
            }
        },

        turnOnTracking: function (options) {
            ajaxCallOptions = options || {};
            $("a[data-gzgname]").on("click", this.onEvent);
        },

    };

}(Cog.jQuery()));


(function ($, document) {

    var api = {};
    api.onRegister = function () {
        if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
            var viewportmeta = document.querySelector("meta[name='viewport']");
            if (viewportmeta) {
                viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0";
                document.body.addEventListener("gesturestart", function () {
                    viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
                }, false);
            }
        }
    };

    Cog.register({
        name: "iosScaleFix",
        api: api
    });
}(Cog.jQuery(), document));

(function ($) {
    "use strict";
    var api = {};
    api.onRegister = function (elements) {
        var html = $("html"),
            $elements = elements.$scope;

        if (html.hasClass("overthrow-enabled")) {

            if ($elements) {
                $elements.each(function () {
                    var $element = $(this);

                    if ($element.is(":not(.sortableTable)")) {
                        $element.addClass("overthrow");
                        window.overthrow.set(); //init overflow polyfill
                    }
                });
            }
        }
    };
    Cog.register({
        name: "overthrowInit",
        api: api,
        selector: ".table"
    });

}(Cog.jQuery()));
