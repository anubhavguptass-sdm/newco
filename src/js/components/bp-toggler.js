(function($) {
  const togglerSelector = '.bp-toggler';
  $('body').on('click', e => {
    try {
      let t = $(e.target);
      //comment
      if (t.is('.toggler-controller')) {
        e.preventDefault();
        let data = e.target.data,
          content = $(data.content),
          isActive = content.is('.active-js'),
          togglesTo = (isActive ? data.valueOff : data.valueOn)
            .toString()
            .split(/, ?/g),
          toggles = data.toggle.split(/, ?/g),
          units = data.valueUnit.split(/, ?/g),
          classAction = isActive ? 'removeClass' : 'addClass',
          text = isActive ? data.labelOff : data.labelOn;

        t.text(text)[classAction]('active-js');
        content
          .css(
            (() => {
              let r = {};
              $(toggles).each((i, property) => {
                let toggleTo = togglesTo[i],
                  unit = units[i];
                if (
                  /((min|max)\-)height$|^height$/g.test(property) &&
                  toggleTo === 'auto'
                ) {
                  toggleTo = content.get(0).scrollHeight;
                  unit = 'px';
                }
                if (/^margin\-(top|bottom)$/g.test(property) && unit === '%') {
                  toggleTo = content.get(0).scrollHeight * (toggleTo / 100);
                  unit = 'px';
                }
                if (/^margin\-(left|right)$/g.test(property) && unit === '%') {
                  toggleTo = content.get(0).scrollWidth * (toggleTo / 100);
                  unit = 'px';
                }
                if (
                  /^background\-color$|^color$|^background$/g.test(property) &&
                  unit === '#'
                ) {
                  toggleTo = `rgb(${Object.values(hexToRgb(toggleTo)).join()})`;
                  unit = '';
                }
                r[property] = `${toggleTo}${unit}`;
              });
              return r;
            })()
          )
          [classAction]('active-js')
          .attr({
            'aria-expanded': isActive ? false : true
          });

        e.target[isActive ? '_ondeact' : '_onact']();
      }
    } catch (error) {
      console.warn(error);
    }
  });

  $(() => {
    $(togglerSelector).each((i, togglerEl) => {
      try {
        let togglerBase = $(togglerEl),
          data = togglerBase.data(),
          togglerContainer = data.useClosestComponent
            ? togglerBase
                .closest(
                  '.component.box, .component.snippetRefference, .component.accordion, .component.carousel'
                )
                .eq(0)
            : $(togglerEl).parent();

        if (togglerContainer.length < 1) {
          console.warn(
            `BP TOGGLER::Toggler component can't be created without parent component (ie. box, snippetRefference, accordion, carousel)!`
          );
          return;
        }

        let validId = /^[a-z_][A-Za-z0-9_]+/g.test(data.id),
          togglerId = validId ? data.id : generateID('toggler');

        if (!validId) {
          console.warn(
            `BP TOGGLER::Invalid toggler ID ('${data.id}'). ID's should follow(^[a-z_][A-Za-z0-9_]+). This toggler is now registered as ${togglerId}!`
          );
        }

        let toggler = $(
          `<a aria-controls="${togglerId}" id="${togglerId}Controller" data-toggle="${
            data.toggle
          }" data-attr-label="${data.labelOn}" data-attr-label-inactive="${
            data.labelOff
          }" href="#" class="toggler-controller${
            data.useClosestComponent
              ? ` ${data.position} ${data.positionMobile}-m bleed-${data.bleed} bleed-${data.bleedMobile}-m`
              : ''
          } active-js">${data.labelOn}</a>`
        )
          .addClass(
            data.addButtonClasses
              .toString()
              .split(/, ?/g)
              .removeEmptyStrings()
              .join(' ')
          )
          .appendTo(togglerContainer)
          .get(0);
        toggler.data = data;

        let togglesTo = data.valueOn.toString().split(/, ?/g),
          toggles = data.toggle.split(/, ?/g),
          units = data.valueUnit.split(/, ?/g),
          classAction = 'addClass',
          togglerContent = data.useClosestComponent
            ? $(toggler)
                .prev('.component-content, .inner')
                .eq(0)
            : $(data.selector).eq(
                /[0-9]{1,}$/g.test(data.selectorIndex.toString())
                  ? data.selectorIndex
                  : 0
              );

        let addClass = data.useClosestComponent ? 'toggler-content' : '';
        if (!data.useClosestComponent)
          togglerContent.parent().css('overflow', 'hidden');

        toggler.data.content = togglerContent
          .attr({
            id: togglerId,
            'aria-expanded': true
          })
          .addClass(
            `${data.addContentClasses
              .toString()
              .split(/, ?/g)
              .removeEmptyStrings()
              .join(' ')} active-js`
          )
          .addClass(addClass)
          .css(
            (() => {
              let r = {};
              $(toggles).each((i, property) => {
                let toggleTo = togglesTo[i];
                if (/((min|max)\-)height$|^height$/g.test(property))
                  toggleTo = togglerContent.get(0).scrollHeight;
                if (
                  /^margin\-(top|bottom)$/g.test(property) &&
                  units[i] === '%'
                ) {
                  toggleTo =
                    togglerContent.get(0).scrollHeight * (toggleTo / 100);
                  units[i] = 'px';
                }
                if (
                  /^margin\-(left|right)$/g.test(property) &&
                  units[i] === '%'
                ) {
                  toggleTo =
                    togglerContent.get(0).scrollWidth * (toggleTo / 100);
                  units[i] = 'px';
                }
                if (
                  /^background\-color$|^color$|^background$/g.test(property) &&
                  units[i] === '#'
                ) {
                  toggleTo = `rgb(${Object.values(hexToRgb(toggleTo)).join()})`;
                  units[i] = '';
                }
                r[property] = `${toggleTo}${units[i]}`;
              });
              return r;
            })()
          )
          [classAction]('active-js')
          .get(0);

        toggler.open = function() {
          let t = $(this);
          if (t.is('.active-js')) return this;
          t.trigger('click');
          return this;
        };
        toggler.close = function() {
          let t = $(this);
          if (!t.is('.active-js')) return this;
          t.trigger('click');
          return this;
        };
        toggler._onact = function() {
          Function(`${toggler.data.onActivated}`).call(toggler, null);
        };
        toggler._ondeact = function() {
          Function(`${toggler.data.onDeactivated}`).call(toggler, null);
        };
        if (!bpComponents.bpTogglers) bpComponents.bpTogglers = {};
        bpComponents.bpTogglers[togglerId] = toggler;
        if (data.defaultState === 'off') $(toggler).trigger('click');
        if (data.useAnimation) {
          $(`<style>
              #${togglerId} {
                  transition: all ${data.animationTiming} ${data.animationEasing} !important;
              }
          </style>`).appendTo(toggler.data.content);
        }
        if (
          !togglerBase
            .closest('.advancedParametrizedHtml, .parametrizedhtml')
            .is('.cq-Editable-dom')
        )
          togglerBase.remove();
      } catch (error) {
        console.warn(error);
      }
    });
  });
})(Cog.jQuery());
