(function ($) {
// it for scroll section based on href
$( '.scrollPage' ).on( 'click', function(e){
  var href = $(this).attr( 'href' );
 let height = $( href ).offset().top -175;
  $( 'html, body' ).animate({
        scrollTop: height
  }, '300' );
  e.preventDefault();
});
})(Cog.jQuery());