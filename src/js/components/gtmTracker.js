const mygtmStructure = [
  {
    id: 'gigya-composite-control-submit',
    targetElement: 'input',
    labelTarget: 'input',
    event: 'customEvent',
    eventCategory: 'form : Advil Sign Up',
    action: 'submission complete',
    label: ''
  },
  {
    id: 'gigya-composite-control-submit',
    targetElement: 'input',
    labelTarget: 'input',
    event: 'customEvent',
    eventCategory: 'form : Advil Sign Up',
    action: 'opt in',
    label: ''
  },
  {
    id: 'gigyaform-wrapper',
    class: [
      {
        id: 'gigya-heading',
        targetElement: 'h2',
        labelTarget: 'h2',
        event: 'customEvent',
        eventCategory: 'form : Advil Sign Up',
        action: 'open/close form',
        label: ''
      }
    ]
  },
  {
    id: 'searchResults-results',
    class: [
      {
        id: 'searchResults-title',
        targetElement: 'a',
        labelTarget: 'a',
        event: 'customEvent',
        eventCategory: 'site search',
        action: '',
        label: ''
      }
    ]
  },
  {
    id: 'mainMobileNav',
    targetElement: 'button',
    labelTarget: 'button',
    event: 'customEvent',
    eventCategory: 'navigation',
    action: 'mobile',
    label: !1
  } ,
  {
    id: 'searchCareer',
    targetElement: 'button',
    labelTarget: 'button',
    event: 'customEvent',
    eventCategory: 'searchCareer',
    action: '',
    label: ''
  }
];
function buyBtnClick() {
  let e = document.querySelectorAll('.shoppable-item-merchant-group-option');
  console.log('buyBtn', e);
  for (let t = 0; t < e.length; t++)
    e[t].addEventListener('click', function(e) {
      logEvent(
        'customEvent',
        'where to buy',
        'product select',
        `Advil - ${e.target.innerHTML}`
      ),
        console.log('dataLayer', dataLayer);
    });
  checkoutBtnClick();
}
function checkoutBtnClick() {
  let e = document.querySelectorAll('.shoppable-v4checkout-btn ');
  console.log('buyBtn', e);
  for (let t = 0; t < e.length; t++)
    e[t].addEventListener('click', function(e) {
      logEvent(
        'customEvent',
        'where to buy',
        'tab select',
        `${e.target.innerHTML}`
      ),
        console.log('dataLayer', dataLayer);
    });
}
function openReviewForm() {
  let e = document.querySelectorAll('.bv-submission-button-submit');
  for (let t = 0; t < e.length; t++)
    e[t].addEventListener('click', function(e) {
      getFormData();
    });
}
function getFormData() {
  var e,
    t = document.querySelectorAll('.bv-form');
  for (e = 0; e < t.length; e++)
    if (
      null == t[0].elements.rating.value ||
      ('usernickname' == t[0].elements[e].name &&
        null == t[0].elements[e].value) ||
      ('hostedauthentication_authenticationemail' == t[0].elements[e].name &&
        null == t[0].elements[e].value) ||
      ('agreements_reviews_TermsConditions' == t[0].elements[e].name &&
        null == t[0].elements[e].value) ||
      ('agreements_reviews_PrivacyPolicy' == t[0].elements[e].name &&
        null == t[0].elements[e].value)
    )
      return;
  let n = +t[0].elements.rating.value;
  switch (
    (logEvent(
      'customEvent',
      'product ratings',
      'Voltaren Arthritis Pain Gel',
      `${n}`
    ),
    n)
  ) {
    case 1:
      logEvent('customEvent', 'product reviews', 'review submission', 'Poor');
      break;
    case 2:
      logEvent('customEvent', 'product reviews', 'review submission', 'Fair');
      break;
    case 3:
      logEvent(
        'customEvent',
        'product reviews',
        'review submission',
        'Average'
      );
      break;
    case 4:
      logEvent('customEvent', 'product reviews', 'review submission', 'Good');
      break;
    case 5:
      logEvent(
        'customEvent',
        'product reviews',
        'review submission',
        'Excellent'
      );
  }
}

function signUpFormBtn() {}
function logEvent(e, t, n, o) {
  let a = { event: e, eventCategory: t, eventAction: n, eventLabel: o };
  dataLayer.push(a), console.log('dataLayer', dataLayer);
}
signUpFormBtn(),
  (function() {
    'use strict';
    const e = function(e) {
        return e
          .replace(/<[^>]*>/g, '')
          .replace(/&amp;/g, '&')
          .trim();
      },
      t = [];
    for (var n = 0; n < mygtmStructure.length; n++) {
      const u = mygtmStructure[n],
        d = document.querySelector('.' + u.id);
      console.log('mymyhtmlTargets main loop', d);
      var o = location.search.split('q=')[1];
      const docVal = document.getElementById(u.id);
      if('searchCareer' ===  u.id && docVal){
        docVal.addEventListener('click', function() {
          if(document.getElementById('jobTitle').value && document.getElementById('location').value){
            dataLayer.push({
              event: u.event,
              eventCategory: u.eventCategory || 'Could not find',
              eventAction: `Job: ${document.getElementById('jobTitle').value} ,  Loaction :  ${document.getElementById('location').value}`,
            });
          }
        })
      
      }
      if ('gtm-search' === u.id && o) {
        var a = document.querySelector('.' + u.labelTarget);
        let e = a.querySelector('span.searchResults-term').innerHTML;
        dataLayer.push({
          event: u.event,
          eventCategory: u.eventCategory || 'Could not find',
          eventAction: e || 'Could not find',
          eventLabel:
            `results:${((s = a.innerHTML),
            s
              .replace(/<[^>]*>/g, '')
              .trim()
              .match(/\d+/g)[0])}` || 'Could not find'
        });
      }
      if (d && u.event) {
        const t = d.getElementsByTagName(u.targetElement);
        console.log('mymyhtmlTargets of events', t);
        for (var l = 0; l < t.length; l++) {
          const n = t[l];
          console.log('myhtmlTarget of events', n),
            (('a' === u.targetElement && n.href) ||
              ('span' === u.targetElement && 0 === n.tabIndex) ||
              ('a' !== u.targetElement && 'span' !== u.targetElement)) &&
              n.addEventListener('click', function() {
                let t = e(n.innerHTML) || n.title;
                var o = u.action,
                  a =
                    n.querySelector('.' + u.labelTarget) ||
                    d.querySelector('.' + u.labelTarget);
                a && !u.id.includes('search')
                  ? (t = e(a.innerHTML))
                  : u.id.includes('search')
                  ? ((o = document.querySelector(
                      'div.searchResults-number>span.searchResults-term'
                    ).innerHTML),
                    (t = `selected:${n.href}` || ''))
                  : n.firstElementChild && n.firstElementChild.title
                  ? (t = n.firstElementChild.title)
                  : 'reference-add-to-cart' == u.id
                  ? (t = n.firstElementChild.title)
                  : 'mainMobileNav' == u.id &&
                    (t = n.classList.contains('activeNav') ? 'close' : 'open'),
                  dataLayer.push({
                    event: u.event,
                    eventCategory: u.eventCategory || 'Could not find',
                    eventAction: o || 'Could not find',
                    eventLabel: t || 'Could not find'
                  }),
                  console.log('dataLayer', dataLayer);
              });
        }
      } else if (d && u.class)
        for (var i = 0; i < u.class.length; i++) {
          const n = u.class[i],
            o = document.querySelectorAll('.' + n.id);
          for (var r = 0; r < o.length; r++) {
            const a = o[r];
            if (n.targetElement) {
              const t = a.getElementsByTagName(n.targetElement);
              for (var c = 0; c < t.length; c++) {
                const o = t[c];
                (('a' === n.targetElement && o.href) ||
                  ('span' === n.targetElement && 0 === o.tabIndex) ||
                  ('a' !== n.targetElement && 'span' !== n.targetElement)) &&
                  o.addEventListener('click', function() {
                    let t = e(o.innerHTML) || o.title,
                      a = '';
                    var l =
                      o.querySelector('.' + n.labelTarget) ||
                      d.querySelector('.' + n.labelTarget);
                    if (
                      (l && !n.id.includes('search')
                        ? (t = e(l.innerHTML))
                        : o.querySelector('.accordion-title-link') &&
                          (t = o.querySelector('.accordion-title-link').title),
                      n.eventCategorys)
                    )
                      for (var i = 0; i < n.eventCategorys.length; i++) {
                        const e = n.eventCategorys[i];
                        o.href.includes(e.id) && (a = e.eventCategory);
                      }
                    else a = n.eventCategory;
                    ('bv-write-container' !== n.id &&
                      'bv_main_container_row_flex' !== n.id) ||
                      setTimeout(function() {
                        openReviewForm();
                      }, 5e3),
                      console.log('mygtmStructureElementChild.id', n.id),
                      ('gigyaform-wrapper' !== n.id &&
                        'gigya-heading' !== n.id) ||
                        setTimeout(function() {
                          signUpFormBtn();
                        }, 5e3),
                      'searchResults-results' === n.id &&
                        (console.log('mygtmStructureElementChild', n),
                        (u.class[0].action = '')),
                      'accordion' === n.id && (n.action, n.action),
                      'reference-add-to-cart' === n.id
                        ? (dataLayer.push({
                            event: u.class[0].event,
                            eventCategory:
                              u.class[0].eventCategory || 'Could not find',
                            eventAction: u.class[0].action || 'Could not find',
                            eventLabel: u.class[0].label || 'Could not find'
                          }),
                          setTimeout(function() {
                            buyBtnClick();
                          }, 5e3))
                        : dataLayer.push({
                            event: n.event,
                            eventCategory: a || 'Could not find',
                            eventAction: n.action
                              ? n.action
                              : this.classList.contains('is-active')
                              ? 'close'
                              : 'open',
                            eventLabel: t || 'Could not find'
                          }),
                      console.log('dataLayer', dataLayer);
                  });
              }
            } else
              a.addEventListener('click', function() {
                var o = a.querySelector(u.labelTarget);
                let l = '';
                (l = o ? e(o.innerHTML) : e(a.innerHTML) || a.title),
                  a.firstElementChild &&
                    a.firstElementChild.title &&
                    (l = a.firstElementChild.title);
                var i = n.action
                  ? n.action
                  : a.parentNode.classList.contains('is-active')
                  ? 'close'
                  : 'open';
                if (
                  (a.classList.contains('shareThis-item') &&
                    ((i = o.title), (l = a.firstElementChild.href)),
                  t.push(l),
                  2 === t.length)
                ) {
                  let e = `${t[1]}:${t[0]}`;
                  dataLayer.push({
                    event: n.event,
                    eventCategory: n.eventCategory || 'Could not find',
                    eventAction: i,
                    eventLabel: e || 'Could not find'
                  }),
                    console.log('dataLayer', dataLayer);
                }
              });
          }
        }
    }
    var s;
  })();
const allArticles = document.querySelectorAll('a.article_read--more');
for (const e of allArticles)
  e.addEventListener('click', function(e) {
    e.preventDefault();
    let t = this.href;
    const n = this.closest('.richText-content').querySelector(
        '.articleHeading'
      ),
      o = n.tagName;
    (eventAction = 'H3' === o ? 'new' : 'related'),
      dataLayer.push({
        event: 'customEvent',
        eventCategory: 'article links',
        eventAction: eventAction || 'Could not find',
        eventLabel: n.innerText || 'Could not find'
      }),
      (window.location = t);
  });
function checkForm() {
  0 === document.querySelectorAll('div.gigya-raas.initialized').length &&
    setTimeout(() => {
      checkForm();
    }, 3e3);
}
function formsHVA() {
  const e = document.querySelectorAll('div.gigya-raas.initialized');
  for (const t of e)
    t.querySelector(
      'div.gigya-screen>form div.gigya-composite-control-submit>input'
    ).addEventListener('click', e => {
      setTimeout(() => {
        const e = t.querySelectorAll(
            'div.gigya-screen>form div.gigya-composite-control>span.gigya-error-msg-active'
          ),
          n = [];
        for (field of e) {
          const e = field
            .closest('div.gigya-composite-control')
            .querySelector(
              '.gigyaform-wrapper .gigyaraas.component .gigya-screen-content .gigya-composite-control.gigya-composite-control-textbox input'
            )
            .getAttribute('placeholder');
          n.push(e);
        }
        const o = 0 !== n.length ? 'validation errors' : 'submission complete',
          a = 0 !== n.length ? 'validation errors' : 'opt in',
          l = 0 !== n.length ? `${n}` : `${location.href}`,
          i = t.getAttribute('data-screen-set');
        dataLayer.push({
          event: 'customEvent',
          eventCategory: `form:${i}`,
          eventAction: o || 'Could not find',
          eventLabel: l || 'Could not find'
        }),
          dataLayer.push({
            event: 'customEvent',
            eventCategory: `form:${i}`,
            eventAction: a || 'Could not find',
            eventLabel: l || 'Could not find'
          });
      }, 1e3);
    });
}
checkForm();
