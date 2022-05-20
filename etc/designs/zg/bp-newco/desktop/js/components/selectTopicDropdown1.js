(function($) {
  $('.topic-selector li:eq(0)').after('<li>All Topics</li>');
  $('.topic-selector li').click(function(e) {
    e.stopPropagation();
    toggleMenu();
    var listText = $(this).text();
    var className = listText.replace(/\s+/g, '-').toLowerCase();
    $('.topic-selector li')
      .first()
      .text(listText);

    if ($('.topic-selector li:eq(0)').text() !== 'All Topics') {
      $(this)
        .parents('.reference-faq-dropdown')
        .siblings('.faq-accordion-wrapper')
        .hide();
      $(this)
        .parents('.reference-faq-dropdown')
        .siblings('.' + className + '')
        .show();
    } else {
      $(this)
        .parents('.reference-faq-dropdown')
        .siblings('.faq-accordion-wrapper')
        .show();
    }
  });

  function toggleMenu() {
    $('.topic-selector').toggleClass('active');
    if ($('.topic-selector').hasClass('active')) {
      $(document).click(toggleMenu);
      $('.accordion-head').click(toggleMenu);
      return;
    }
    $(document).unbind('click', toggleMenu);
    $('.accordion-head').unbind('click', toggleMenu);
  }

})(Cog.jQuery());
