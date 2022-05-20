(function($) {
  function handleLanguageSelector() {
    let languageSelectorInstance = $('.reference-language-list');
    let languageSelectorButton = $('.reference-language-selector');

    $('body').on('click', e => {
      let t = $(e.target);
      if (
        t.is(
          '.reference-language-selector, .reference-language-selector *, .reference-language-list, .reference-language-list *'
        )
      ) {
        languageSelectorInstance.toggleClass('opened');
        languageSelectorButton.toggleClass('opened');
        let body = $('.megamenu > .component-content');
        body.stop().animate({ scrollTop: 0 }, 200, 'swing');
        return;
      }

      languageSelectorInstance.removeClass('opened');
      languageSelectorButton.removeClass('opened');
    });
  }

  // Apply lang into selectors
  $(document).ready(function() {
    handleLanguageSelector();
    var code = document.documentElement.lang.toLowerCase();

    if (code === 'es-ar' || code === 'ar') {
      country = 'Argentina';
    } else if (code === 'en-au' || code === 'au') {
      country = 'Australia';
    } else if (code === 'de-at' || code === 'at') {
      country = 'Österreich';
    } else if (code === 'nl-be' || code === 'fr-be' || code === 'be') {
      country = 'Belgien';
    } else if (code === 'pt-br' || code === 'br') {
      country = 'Brasil';
    } else if (code === 'en-ca' || code === 'ca') {
      country = 'Canada';
    } else if (code === 'ar-lb' || code === 'lb') {
      country = 'لبنان';
    } else if (code === 'de-de' || code === 'de') {
      country = 'Deutschland';
    } else if (code === 'gu-in' || code === 'in') {
      country = 'भारत';
    } else if (code === 'en-ie' || code === 'ie') {
      country = 'Ireland';
    } else if (code === 'it-it' || code === 'it') {
      country = 'Italia';
    } else if (code === 'ja-jp' || code === 'jp') {
      country = '日本';
    } else if (code === 'ur-pk' || code === 'pk') {
      country = 'پاکستان';
    } else if (code === 'pt-pt' || code === 'pt') {
      country = 'Portugal';
    } else if (code === 'ro-ro' || code === 'ro') {
      country = 'România';
    } else if (code === 'ar-sa' || code === 'sa') {
      country = 'المملكة العربية السعودية';
    } else if (code === 'en-za' || code === 'za') {
      country = 'Sauth Africa';
    } else if (code === 'es-es' || code === 'es') {
      country = 'España';
    } else if (code === 'th-th' || code === 'th') {
      country = 'ประเทศไทย';
    } else if (code === 'ar-ae' || code === 'ae') {
      country = 'الإمارات العربية المتحدة';
    } else if (code === 'en-uk' || code === 'uk') {
      country = 'United Kingdom';
    } else if (code === 'en-us' || code === 'us') {
      country = 'United States of America';
    } else if (code === 'zh-cn' || code === 'cn') {
      country = '中国';
    } else if (code === 'nl-nl' || code === 'nl') {
      country = 'Nederland';
    } else if (code === 'fr-fr' || code === 'fr') {
      country = 'France';
    } else if (code === 'fr-ch' || code === 'de-ch' || code === 'ch') {
      country = 'Schweiz';
    } else if (code === 'zh-tw' || code === 'tw') {
      country = 'Taiwan';
    } else {
      country = 'Select country';
    }

    // desktop selector
    $('.country-selected').html(country + '<span class="chevron-down"></span>');
    // mobile dropdown
    $('.country-dropdown option[value="' + country + '"]').attr(
      'selected',
      'selected'
    );
  });
})(Cog.jQuery());
