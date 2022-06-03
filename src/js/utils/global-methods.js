(function($) {
  class AjaxLoadHandler {
    #handlers = [];
    #exec = () => {
      this.#handlers.forEach(method => {
        if (typeof method === 'function') method();
      });
    };

    constructor() {
      if (AjaxLoadHandler._initalized)
        throw new Warning(
          'One instance of AjaxLoaderHandler is already initialized!'
        );
      AjaxLoadHandler._initalized = true;
      let self = this;
      let originOpen = XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', e => {
          self.#exec();
        });
        originOpen.apply(this, arguments);
      };
    }

    add = handler => {
      this.#handlers.push(handler);
    };
  }
  window.ajaxHandlers = new AjaxLoadHandler();

  // generates random id string
  // prefix: string
  // suffix: string
  window.generateID = function(prefix, suffix) {
    try {
      let abc = 'a,b,c,d,e,f,g,h,ch,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(
        ','
      );
      prefix =
        prefix && (typeof prefix === 'string' || typeof prefix === 'number')
          ? prefix
          : abc[Math.floor(Math.random() * (abc.length - 0) + 0)];
      suffix =
        suffix && (typeof suffix === 'string' || typeof suffix === 'number')
          ? suffix
          : '';
      return `${prefix}${new Date().getTime()}${suffix}`
        .replace(/\ /g, '')
        .replace(/\b\d+/gi, '');
    } catch (error) {
      return false;
    }
  };
  // converts strings with time unit to number representing ms
  // usage:
  window.timeStriToMs = function(string) {
    try {
      if (
        !/^[\d\.]{1,}(s|sec|seconds|ms|milliseconds|mins?|minutes|h|hr|hours|hrs|day|days|d)$/i.test(
          string
        )
      )
        return null;

      let timeUnit = string.match(
          /(s|sec|seconds|ms|milliseconds|mins?|minutes|h|hr|hours|hrs|day|days|d)$/i
        )[0],
        multiple = (() => {
          if (/^(s|sec|seconds)$/gi.test(timeUnit)) return 1000;
          if (/^(h|hr|hrs|hours)$/gi.test(timeUnit)) return 1000 * 60 * 60;
          if (/^(mins?|minutes)$/gi.test(timeUnit)) return 1000 * 60;
          if (/^(d|days?)$/gi.test(timeUnit)) return 1000 * 60 * 60 * 24;
          return 1;
        })();
      return parseFloat(string) * multiple;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };
  // hex to RGB conversion
  window.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : {
          r: 0,
          g: 0,
          b: 0
        };
  };
  // accordion height (for animation purpose) handler
  window.accordionHeight = function(accordionContentWrapperElement) {
    try {
      clearTimeout(window.accordionHeightTimeout);
    } catch (error) {}
    window.accordionHeightTimeout = setTimeout(function() {
      accordionContentWrapperElement =
        arguments.length > 0
          ? accordionContentWrapperElement
          : '.accordion-content-wrapper';
      $(accordionContentWrapperElement).each((ind, el) => {
        let t = $(el),
           possibleHeight,
   // commented for accordion .  click on accordion text accordio not hide.   
   
      //     style = `.accordion-slide.is-active #${el.id} {
      //   max-height: {{maxheight}}px
      // }
      //   .accordion-slide:focus-within #${el.id} {
      //   max-height: {{maxheight}}px
      // }
      
      // `,

      // commented for accordion .  click on accordion text accordio not hide.   
          styleEl = $('<style/>');
        possibleHeight = t.get(0).scrollHeight;
        // create a style element with it's own id and max height
        style = style.replace(/\{\{maxheight\}\}/gi, possibleHeight);
        styleEl.text(style);
        t.closest('.accordion-slide')
          .find(' > style')
          .remove();
        // prepend style element to content wrapper
        t.before(styleEl);
      });
    }, 100);
  };
  // in case something is loaded to accordion content run accordionHeight again
  ajaxHandlers.add(accordionHeight);

  $('body').on('mouseup', e => {
    let t = $(e.target);
    if (
      !t.is('form *:not(button), input, textarea, select, [contenteditable]')
    ) {
      t.trigger('blur');
    }
  });
})(Cog.jQuery());
// returns array with unique values
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};
// strip empty strings from array
Array.prototype.removeEmptyStrings = function() {
  return this.filter(function(value, index, self) {
    return /\b ?$/g.test(value.toString());
  });
};
// camelize string
String.prototype.camelize = function() {
  try {
    return this.replace(/^([A-Z])|[\s-_\.]+(\w)/g, function(
      match,
      p1,
      p2,
      offset
    ) {
      if (p2) return p2.toUpperCase();
      return p1.toLowerCase();
    });
  } catch (error) {
    return this;
  }
};
