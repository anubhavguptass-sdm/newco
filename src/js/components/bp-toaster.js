(function($) {
  /*
   ** BP Tosaster
   */

  class BPToaster {
    // default options
    options = {
      contentScrollable: true,
      cookieLifetime: 2,
      cookieName: `toastercookie${new Date().getTime()}`,
      defaultState: 'closed',
      id: `toaster${new Date().getTime()}`,
      onClosed: '',
      onOpened: '',
      openCloseTrigger: 'click',
      positionWithinContent: true,
      toasterPositionX: 'right',
      toasterPositionY: 'bottom',
      useAutoHeight: true,
      useCookie: true
    };
    container; // main container
    handle; // handle and settings holder
    content; // content container
    state; // state

    // private disable method
    #remove = () => {
      this.container.classList.add('disabled');
    };
    // private endable method
    #add = () => {
      this.container.classList.remove('disabled');
      this.container.classList.add('initiated');
      this.#onInit();
    };
    // provate setState method state /'disabled'|'enabled'|'opened'|'closed'/
    #setState = state => {
      let today = new Date().getTime();
      if (/disabled|enabled/gi.test(state)) {
        cookie = JSON.stringify({
          name: this.options.cookieName,
          expires:
            parseInt(this.options.cookieLifetime) * 24 * 60 * 60 * 1000 + today,
          value: state
        });

        localStorage.setItem(this.options.cookieName, cookie);

        if (state === 'disabled') this.#remove();
        if (state === 'enabled') {
          this.#add();
          this.toggle(this.state);
        }
      }

      if (/opened|closed/gi.test(state)) {
        this.state = state;
        this.toggle(state);
      }
    };
    // inInit private event handler
    #onInit = () => {
      try {
        Function(this.options.onInit).call(this, null);
        this.container.classList.add('initiated');
      } catch (err) {
        console.warn(err);
      }
    };
    // onOpened private event handler
    #onOpened = () => {
      try {
        Function(this.options.onOpened).call(this, null);
      } catch (err) {
        console.warn(err);
      }
    };
    // onClosed private event handler
    #onClosed = () => {
      try {
        Function(this.options.onClosed).call(this, null);
      } catch (err) {
        console.warn(err);
      }
    };

    // public toggle method /null|'opened'| 'closed'/
    toggle(state) {
      if (this.state === 'disabled') {
        this.container.classList.add('disabled');
        return;
      }
      if (
        arguments.length > 0 &&
        typeof state === 'string' &&
        /opened|closed/i.test(state)
      ) {
        this.state = state;
      } else {
        this.state =
          this.state === 'opened'
            ? (this.state = 'closed')
            : (this.state = 'opened');
      }

      this.container.classList.add(this.state);
      this.container.classList.remove(
        this.state === 'opened' ? 'closed' : 'opened'
      );
    }
    // public enable method
    enable() {
      this.#setState('enabled');
    }
    // public disable method
    disable() {
      this.#setState('disabled');
    }
    // public setCss method, handles recalculation of styles
    setCss() {
      if (this.state === 'disabled') return;
      let styleid = `#style${this.options.id}`,
        style = document.querySelector(styleid),
        exists = style !== null;

      if (!exists) {
        style = document.createElement('style');
        style.id = styleid.replace('#', '');
        this.container.appendChild(style);
      }

      let aSign = this.options.toasterPositionY === 'bottom' ? '' : '-',
        bSign = this.options.toasterPositionY === 'bottom' ? '-' : '+';

      this.container.style.maxWidth = `${this.options.maxWidth}px`;

      setTimeout(() => {
        style.innerHTML = `
          :root {
            --bp-toaster-head-height-${this.options.id.toLowerCase()}: ${
          this.handle.offsetHeight
        }px
          }

          #${this.options.id} {
            max-width: ${this.options.maxWidth}px;
            height: ${
              this.options.useAutoHeight
                ? 'auto'
                : `${this.handle.offsetHeight + this.content.scrollHeight}px`
            };
          }

          #${this.options.id}.closed {
            transform: translateY(calc(${aSign}100% ${bSign} var(--bp-toaster-head-height-${this.options.id.toLowerCase()})));
          }
        `;
        this.container.style.maxWidth = '';
      }, 10);
    }

    // class constructor
    constructor(handle) {
      // assign options extracted from handle dataset to default options
      Object.assign(this.options, handle.dataset);
      // define content, content is always considered any alement after handle
      let content = handle.closest('.reference-bp-toaster-handle')
          .nextElementSibling,
        // get fake cookie from local storag and parse it
        cookie = JSON.parse(localStorage.getItem(this.options.cookieName)),
        // set timestamp
        today = new Date().getTime();

      // assign local elements into local props
      this.container = handle.closest('.box.component');
      this.content =
        typeof content === 'undefined' ? 'No content element' : content;
      this.handle = handle;
      // check if cookie is expired and remove old one if so
      if (cookie !== null && today > cookie.expires) {
        localStorage.removeItem(this.options.cookieName);
        cookie = null;
      }
      // if cookie is set and value is disabled set state to disabled
      if (
        this.options.useCookie &&
        cookie !== null &&
        cookie.value === 'disabled'
      )
        this.#setState('disabled');
      // if cookie is not set enable it by default if useCookie is true
      if (this.options.useCookie && cookie === null) this.#setState('enabled');
      // remove attributes from handle
      Array.from(handle.attributes).forEach(attr =>
        /data\-/gi.test(attr.name) ? handle.removeAttribute(attr.name) : void 0
      );
      // re-parse Boolean props to valid data type
      this.options.contentScrollable =
        this.options.contentScrollable === 'true';
      this.options.positionWithinContent =
        this.options.positionWithinContent === 'true';
      this.options.useCookie = this.options.useCookie === 'true';
      this.options.useAutoHeight = this.options.useAutoHeight === 'true';
      // if state is not disabled set state with option
      this.state =
        this.state === 'disabled' ? 'disabled' : this.options.defaultState;
      // add id to container
      this.container.id = this.options.id;

      // handle classes of content and this.container
      this.container.classList.add(
        'bp-toaster',
        `y-${this.options.toasterPositionY}`,
        `x-${this.options.toasterPositionX}`
      );
      this.container.classList.toggle(
        'within-content',
        !!this.options.positionWithinContent
      );
      this.container.classList.toggle(
        'scrollable',
        !!this.options.contentScrollable
      );
      this.content.classList.add('bp-toaster-content');
      if (this.state === 'disabled') this.container.classList.add('disabled');
      // calculate css with setCss
      this.setCss();
      // resize handler for window to recalculate css
      window.addEventListener('resize', () => {
        this.setCss();
      });
      // handle triggers
      if (this.options.openCloseTrigger === 'click')
        this.handle.addEventListener('click', () => this.toggle());
      if (this.options.openCloseTrigger === 'mouseover') {
        this.container.addEventListener('mouseenter', e => this.toggle('open'));
        this.container.addEventListener('mouseleave', e =>
          this.toggle('close')
        );
        this.container.classList.add('mouseover');
      }
      // handlers for local Events, local events are based on css transitions
      this.container.addEventListener('transitionend', e => {
        if (e.propertyName === 'transform' && e.target === this.container) {
          if (this.state === 'opened') this.#onOpened();
          if (this.state === 'closed') this.#onClosed();
          if (!this.container.matches('.initiated')) {
            this.#onInit();
          }
        }
        // add click event handler for body, so this instance of toaster can be closed when clicked outside of the toaster
        document.body.addEventListener('click', e => {
          let t = e.target;
          if (!t.matches(`#${this.options.id}, #${this.options.id} *`)) {
            Object.values(bpComponents.bpToasters)
              .filter(toaster =>
                toaster.container.matches(`#${this.options.id}`)
              )
              .forEach(toaster => toaster.toggle('closed'));
          }
        });
      });
      // toggle toaster to it's default state
      this.toggle(this.options.defaultState);
      // register toaster to bpComponents and of create instance of it if not available
      if (!bpComponents) bpComponents = {};
      if (!bpComponents.bpToasters) bpComponents.bpToasters = {};
      bpComponents.bpToasters[this.options.id] = this;
    }
  }
  // scan and initialize all toasters with proper className
  // toasters are initialized out of the toaster handle i.e. '.bp-toaster-handle' class
  let tryCounts = 0;
  const maxTryCount = 1000,
    initToasters = () => {
      // wait until document ready
      if (
        document.readyState &&
        document.readyState !== 'complete' &&
        tryCounts <= maxTryCount
      ) {
        tryCounts++;
        setTimeout(initToasters, 10);
        return;
      }
      let toasters = document.querySelectorAll('.bp-toaster-handle');
      toasters.forEach(hadndle => new BPToaster(hadndle));
    };
  initToasters();
})(Cog.jQuery());
