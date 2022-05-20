(function($) {
  const head = $(document.head),
    style = $(`
  <style>
  body [class*='hero-banner-'] .image,
  body .carouseSlide .no-image > .carousel-content > .content > .image {
    min-height: auto;
  }

  @media (min-width: $breakpoint-sm-min) {
    //desktop styles
    body [class*='hero-banner-'] .image,
    body .carouseSlide .no-image > .carousel-content > .content > .image {
      min-height: auto;
    }
  }
  </style>`);

  $(window).on('load', e => {
    head.append(style);
  });
})(Cog.jQuery());
