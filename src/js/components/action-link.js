/*
 ** SUPPORTED EVENTS:
 ** animationend
 ** animationiteration
 ** animationstart
 ** blur
 ** change
 ** click
 ** contextmenu
 ** dblclick
 ** focus
 ** focusin
 ** focusout
 ** input
 ** keydown
 ** keypress
 ** keyup
 ** load
 ** mousedown
 ** mouseenter
 ** mouseleave
 ** mousemove
 ** mouseover
 ** mouseout
 ** mouseup
 ** mousewheel
 ** submit
 ** touchcancel
 ** touchend
 ** touchmove
 ** touchstart
 ** transitionend
 ** wheel
 */

/*eslint-disable*/
(function($) {
  const events = 'animationend, animationiteration, animationstart, blur, change, click, contextmenu, dblclick, focus, focusin, focusout, input, keydown, keypress, keyup, load, mousedown, mousemove, mouseover, mouseout, mouseup, mousewheel, submit, touchcancel, touchend, touchmove, touchstart, transitionend, wheel'.split(
    /,\ ?/gi
  );

  $(document).ready(e => {
    $(events).each((ind, el) => {
      $('body').on(el, e => {
        try {
          let t = $(e.target);
          if (
            t.is(
              `[class*=bpaction-${el}]${(() => {
                let regExp = new RegExp(
                    `bpaction\-(${el})\-[^\-]+\-true`,
                    'ig'
                  ),
                  cls = t.closest(`[class*=bpaction-${el}]`).attr('class'),
                  matched =
                    typeof cls === 'undefined' ? null : cls.match(regExp);
                return matched !== null ? `, [class*=bpaction-${el}] *` : '';
              })()}`
            )
          ) {
            let actionTarget = t.closest(`[class*=bpaction-${el}]`),
              eventTarget = t,
              data = actionTarget.data(),
              regExp = new RegExp(`bpaction\-(${el})\-([^\-]+)(\-true)?`, 'i');
            action = t
              .closest(`[class*=bpaction-${el}]`)
              .attr('class')
              .match(regExp)[2];
            window.bpComponents.bpActions[action](
              eventTarget.get(0),
              actionTarget.get(0),
              data,
              e
            );
          }
        } catch (err) {
          console.warn(err);
        }
      });
    });
  });
})(Cog.jQuery());
/*eslint-enable*/
