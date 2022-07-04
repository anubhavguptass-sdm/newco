(function ($) {
    $(window).bind("load resize",function(){
        if ($(window).width() > 767 ) {
            $(".positioned-banner-wrapper").each(function(){
                var bannerTextHeight = $(this).find(".banner-text").innerHeight();
                var imgHeight = bannerTextHeight + 80;
                $(this).find(".dynamic-height img").height(imgHeight);
            });
    
        }
    
    });
})(Cog.jQuery());