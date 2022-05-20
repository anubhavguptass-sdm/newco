(function($) {
  /*
   **
   */

  // define clickable box and siblibgs selectors
  const clickableBoxSelector = '.anchor-box',
    clickableSiblingSelector = '.anchor-sibling';

  $('body').on('click', e => {
    // get clicked element
    let t = $(e.target),
      // set a to false by default
      a = false;

    // chceck if clicked object is clickable box or any of his children except anchors
    if (t.is(`${clickableBoxSelector}, ${clickableBoxSelector} *:not(a)`)) {
      // set t to closest element with the class of clickableBoxSelector
      t = t.closest(`${clickableBoxSelector}`);
      // get first anchor with href attribute that could be found within clickable box and assign it to a variable
      a = t.find('a[href]').eq(0);
    }

    //chceck if clicked object is clickable sibling or any of his children except anchors
    if (
      t.is(`${clickableSiblingSelector}, ${clickableSiblingSelector} *:not(a)`)
    ) {
      // set t to closest element with the class of clickableSiblingSelector
      t = t.closest(`${clickableSiblingSelector}`);
      // set anchor to false in case no anchor with href is found
      let anchor = false;
      // get first anchor with href attribute that could be found in a collection of sblings of clickable sibling and assign it to a variable
      // loop through all siblings
      t.siblings().each((ind, el) => {
        // if anchor already found skip the rest loops
        if (anchor) return;
        // find anchor
        let foundAnchors = $(el).find('a[href]');
        // assign found element to anchor
        if (foundAnchors.length > 0) anchor = foundAnchors.eq(0);
      });

      // assign anchor to a variable
      a = anchor;
    }

    // if any clickable element is set (clickable box or clickable siblibg)
    if (a) {
      // trigger click on particular anchor
      a.get(0).click();
    }
  });
})(Cog.jQuery());
