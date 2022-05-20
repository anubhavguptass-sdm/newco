const lTab = `\t\t\t\t`, //long tab
  sTab = `\t\t\t`; // short tab

window.offset = el => {
  return {
    left: el.getBoundingClientRect().left + window.scrollX,
    top: el.getBoundingClientRect().top + window.scrollY
  };
};
window.bpHashChangeHandler = e => {
  try {
    let hash = decodeURIComponent(window.location.hash),
      actionExists = !!bpComponents.bpActions[hash.replace(/#/g, '')],
      elementExists = (() => {
        try {
          return document.querySelectorAll(hash).length > 0;
        } catch (error) {
          return false;
        }
      })(),
      element,
      elementOffset,
      userOffset = (() => {
        try {
          let ret = 0;
          document
            .querySelector('[class*="offsetscroll-"]')
            .classList.forEach(el => {
              if (el.indexOf('offsetscroll') > -1) ret = el.split('-')[1];
            });
          return ret;
        } catch (error) {
          return 0;
        }
      })(), // set offset for page by adding offset-{num in px} to body element
      navOffset = document.querySelector(
        window.innerWidth < 768
          ? '.megamenu-bottom-center'
          : '.megamenu-nav-container'
      ).offsetHeight;

    if (actionExists) {
      try {
        e.preventDefault();
        bpComponents.bpActions[hash.replace(/#/g, '')]();
      } catch (error) {
        console.warn(error);
      }
    }

    if (elementExists) {
      e.preventDefault();
      element = document.querySelector(hash);
      elementOffset = offset(element);
      document.body.style.scrollBehavior = document.documentElement.style.scrollBehavior =
        'smooth';

      document.documentElement.scrollTop =
        elementOffset.top - navOffset - userOffset;
    }
  } catch (error) {
    console.warn(error);
  }
};

if (!window.bpComponents) {
  window.bpComponents = {
    version: '3.1',
    getNavigationType: function() {
      try {
        let simple = document.querySelectorAll('.simple-navigation').length > 0,
          mega = document.querySelectorAll('.megamenu-navigation').length > 0,
          error =
            document.querySelectorAll('.megamenu-navigation.simple-navigation')
              .length > 0,
          none =
            document.querySelectorAll(
              '.megamenu-navigation, .simple-navigation'
            ).length === 0;

        return none
          ? 'Not set'
          : error
          ? 'Wrongly set (both)'
          : simple
          ? 'SimpleNavigation'
          : mega
          ? 'MegaNavigation'
          : 'Not set';
      } catch (error) {
        return 'Error getting info';
      }
    },
    switchNavigation: type => {
      // type:String - 'megamenu' or 'simple'
      // this is just for debuging
      let nav = window.bpComponents.getNavigationType(),
        navNode,
        search,
        rep,
        re;

      if (nav === 'MegaNavigation') {
        navNode = document.querySelector('.megamenu-navigation');
        rep = 'simple';
        search = 'megamenu';
      }
      if (nav === 'SimpleNavigation') {
        navNode = document.querySelector('.simple-navigation');
        rep = 'megamenu';
        search = 'simple';
      }
      if (
        nav === 'Not set' ||
        nav === 'Wrongly set (both)' ||
        nav === 'Error getting info'
      ) {
        navNode = document.querySelector('.reference-megamenu');
        rep = '';
      }

      re = new RegExp(`\ ?${search}\-navigation`, 'g');
      type = type ? type : rep;

      navNode.className = `${navNode.classList
        .toString()
        .replace(re, '')} ${type}-navigation`.replace(/ $/g, '');
    },
    componentsNameMap: {
      accordions: {
        name: 'Accordion',
        selector: '.accordion.component:not(.box):not(.snippetReference)'
      },
      bpFilters: { name: 'Filter', selector: '.class-filter' },
      bpTogglers: { name: 'Togglers', selector: '.toggler-controller' },
      bpLoaders: {
        name: 'Content Loader',
        selector: '.bp-content-loader-container'
      },
      bpCarousels: { name: 'Carousel', selector: '.carousel' },
      bpSharers: { name: 'Sharer', selector: '.jv-share-link' },
      bpShareContainers: {
        name: 'Share Container',
        selector: '.bp-share-container'
      },
      bpVideoPlayers: { name: 'Video Player', selector: '.bpplayer' },
      tables: { name: 'Table', selector: `[role='table']` },
      bpActions: { name: 'Action Component', selector: '' },
      rtRegContainers: {
        name: 'RevTrax Register Container',
        selector: ''
      }
    },
    accordions: {}, // accordions, if accordion missing class idclass-{{yourid}} it won't be registered
    bpFilters: {}, // bp filter components
    bpLoaders: {}, // bp loader components, content loaders are registered after initializations, if content loader is set to init after it's in viewport only then it will be registered to this object
    bpCarousels: {}, // bp carousels components
    bpFontResizer: {}, // bp resizer component, since all font resizers working together as one, this object will have only setter method to set font size programatically ie. bpComponents.bpFontResizer.setFontSize('default')  available values:STRING are 'default', 'large', 'larger'
    bpSharers: {}, // bp sharer components
    bpShareContainers: {}, // bp share container components
    bpVideoPlayers: {}, // bp video player components
    tables: {}, // bp table components
    bpActions: {}, // bp action components
    rtRegContainers: {}, // bp rev trex register components
    bpMegaMenu: {}, // megamenu component,
    bpTogglers: {}, // megamenu component,
    bpTrackers: {}, // used GTMTrackers
    bpLanguages: {
      // slugify languages
      languages: {},
      get loaded() {
        try {
          for (const [key, value] of Object.entries(this.languages)) {
            if (value.loaded === false) return false;
          }
          return true;
        } catch (error) {
          console.warn(error);
          return false;
        }
      }
    },

    getUsedComponents: function(component) {
      if (arguments.length > 0 && typeof arguments[0] === 'string') {
        if (/filter/gi.test(component)) component = '.class-filter';
        if (/toggler/gi.test(component)) component = '.toggler-controller';
        if (/font|resizer/gi.test(component)) component = '.bp-font-resizer';
        if (/megamenu|menu|mega/gi.test(component)) component = '.megamenu';
        if (/player|video|videoplayer/gi.test(component))
          component = '.bpplayer';
        if (/sharer|share|sharelink|social/gi.test(component))
          component = '.jv-share-link';
        if (
          !/filter|font|resizer|megamenu|menu|mega|player|video|videoplayer|sharer|share|sharelink|social|toggler/gi.test(
            component
          )
        )
          component = `.component.${component}`;

        let res = document.querySelectorAll(component);
        return res;
      }
      const usedCustomComponents = {};
      usedCFComponents = {
        Box: {
          Count: document.querySelectorAll('.component.box').length,
          selector: '.component.box',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        Image: {
          Count: document.querySelectorAll('.component.image').length,
          selector: '.component.image',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        RichText: {
          Count: document.querySelectorAll('.component.richText').length,
          selector: '.component.richText',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        Title: {
          Count: document.querySelectorAll('.component.title').length,
          selector: '.component.title',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        Breadcrumbs: {
          Count: document.querySelectorAll('.component.breadcrumbs:not(.box)')
            .length,
          selector: '.component.breadcrumbs:not(.box)',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        'Parametrized HTML': {
          Count: document.querySelectorAll(
            '.component.advancedParametrizedHtml, .component.parametrizedhtml'
          ).length,
          selector:
            '.component.advancedParametrizedHtml, .component.parametrizedhtml',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        Navigation: {
          Count: document.querySelectorAll('.component.navigation').length,
          selector: '.component.navigation',
          action: 'createScreen',
          actionLabel: 'Print element'
        },
        'Snippet Reference': {
          Count: document.querySelectorAll('.component.snippetReference')
            .length,
          selector: '.component.snippetReference',
          action: 'createScreen',
          actionLabel: 'Print element'
        }
      };
      for (i in this) {
        if (
          this.hasOwnProperty(i) &&
          typeof this.componentsNameMap[i] !== 'undefined'
        ) {
          if (Object.keys(this[i]).length > 0 && this[i].constructor === Object)
            usedCustomComponents[this.componentsNameMap[i].name] = {
              Count: Object.keys(this[i]).length,
              selector: this.componentsNameMap[i].selector
            };
        }
      }

      let navigation = {
        Megamenu: { Count: 1 },
        'Menu Items': { Count: this.bpMegaMenu.itemsCount },
        'Menu Type': { Name: this.getNavigationType() },
        Dropdowns: {
          Count: this.bpMegaMenu.dropDowns,
          Used: this.bpMegaMenu.dropDownsUsed,
          Unused: this.bpMegaMenu.dropDownsUnUsed
        }
      };
      if (!bpComponents.isIE) {
        let headingStyle = 'color: green; font-size: 20px;';
        console.table('%cNavigation / Megamenu:', headingStyle);
        console.table(navigation);
        console.log('%cRegistered custom components:', headingStyle);
        console.table(usedCustomComponents);
        console.log('%cUsed CF Components:', headingStyle);
        console.table(usedCFComponents);
      }

      return {
        navigation: { o: navigation, name: 'Navigation / Megamenu' },
        usedCustomComponents: {
          o: usedCustomComponents,
          name: 'Registered custom components'
        },
        usedCFComponents: {
          o: usedCFComponents,
          name: 'Used CF Components'
        }
      };
    }
  };
  window.bpComponents.bpMegaMenu.navigationType = window.bpComponents.getNavigationType();
}

window.addEventListener('hashchange', bpHashChangeHandler, true);
window.addEventListener(
  'load',
  e => {
    try {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (error) {}
  },
  true
);
