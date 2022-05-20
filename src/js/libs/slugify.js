/*eslint-disable*/
// window.transliteration = require('transliteration')
// window.slugifier = transliteration.slugify,
// window.tr = transliteration.transliterate,
// window.slug = str => {
//   return slugifier(tr(str))
// }
let lng = {
    '°': '0',
    '¹': '1',
    '²': '2',
    '³': '3',
    '⁴': '4',
    '⁵': '5',
    '⁶': '6',
    '⁷': '7',
    '⁸': '8',
    '⁹': '9',
    '₀': '0',
    '₁': '1',
    '₂': '2',
    '₃': '3',
    '₄': '4',
    '₅': '5',
    '₆': '6',
    '₇': '7',
    '₈': '8',
    '₉': '9',
    æ: 'ae',
    ǽ: 'ae',
    À: 'A',
    Á: 'A',
    Â: 'A',
    Ã: 'A',
    Å: 'AA',
    Ǻ: 'A',
    Ă: 'A',
    Ǎ: 'A',
    Æ: 'AE',
    Ǽ: 'AE',
    à: 'a',
    á: 'a',
    â: 'a',
    ã: 'a',
    å: 'aa',
    ǻ: 'a',
    ă: 'a',
    ǎ: 'a',
    ª: 'a',
    '@': 'at',
    Ĉ: 'C',
    Ċ: 'C',
    Ç: 'C',
    ç: 'c',
    ĉ: 'c',
    ċ: 'c',
    '©': 'c',
    Ð: 'Dj',
    Đ: 'D',
    ð: 'dj',
    đ: 'd',
    È: 'E',
    É: 'E',
    Ê: 'E',
    Ë: 'E',
    Ĕ: 'E',
    Ė: 'E',
    è: 'e',
    é: 'e',
    ê: 'e',
    ë: 'e',
    ĕ: 'e',
    ė: 'e',
    ƒ: 'f',
    Ĝ: 'G',
    Ġ: 'G',
    ĝ: 'g',
    ġ: 'g',
    Ĥ: 'H',
    Ħ: 'H',
    ĥ: 'h',
    ħ: 'h',
    Ì: 'I',
    Í: 'I',
    Î: 'I',
    Ï: 'I',
    Ĩ: 'I',
    Ĭ: 'I',
    Ǐ: 'I',
    Į: 'I',
    Ĳ: 'IJ',
    ì: 'i',
    í: 'i',
    î: 'i',
    ï: 'i',
    ĩ: 'i',
    ĭ: 'i',
    ǐ: 'i',
    į: 'i',
    ĳ: 'ij',
    Ĵ: 'J',
    ĵ: 'j',
    Ĺ: 'L',
    Ľ: 'L',
    Ŀ: 'L',
    ĺ: 'l',
    ľ: 'l',
    ŀ: 'l',
    Ñ: 'N',
    ñ: 'n',
    ŉ: 'n',
    Ò: 'O',
    Ó: 'O',
    Ô: 'O',
    Õ: 'O',
    Ō: 'O',
    Ŏ: 'O',
    Ǒ: 'O',
    Ő: 'O',
    Ơ: 'O',
    Ø: 'OE',
    Ǿ: 'O',
    Œ: 'OE',
    ò: 'o',
    ó: 'o',
    ô: 'o',
    õ: 'o',
    ō: 'o',
    ŏ: 'o',
    ǒ: 'o',
    ő: 'o',
    ơ: 'o',
    ø: 'oe',
    ǿ: 'o',
    º: 'o',
    œ: 'oe',
    Ŕ: 'R',
    Ŗ: 'R',
    ŕ: 'r',
    ŗ: 'r',
    Ŝ: 'S',
    Ș: 'S',
    ŝ: 's',
    ș: 's',
    ſ: 's',
    Ţ: 'T',
    Ț: 'T',
    Ŧ: 'T',
    Þ: 'TH',
    ţ: 't',
    ț: 't',
    ŧ: 't',
    þ: 'th',
    Ù: 'U',
    Ú: 'U',
    Û: 'U',
    Ü: 'U',
    Ũ: 'U',
    Ŭ: 'U',
    Ű: 'U',
    Ų: 'U',
    Ư: 'U',
    Ǔ: 'U',
    Ǖ: 'U',
    Ǘ: 'U',
    Ǚ: 'U',
    Ǜ: 'U',
    ù: 'u',
    ú: 'u',
    û: 'u',
    ü: 'u',
    ũ: 'u',
    ŭ: 'u',
    ű: 'u',
    ų: 'u',
    ư: 'u',
    ǔ: 'u',
    ǖ: 'u',
    ǘ: 'u',
    ǚ: 'u',
    ǜ: 'u',
    Ŵ: 'W',
    ŵ: 'w',
    Ý: 'Y',
    Ÿ: 'Y',
    Ŷ: 'Y',
    ý: 'y',
    ÿ: 'y',
    ŷ: 'y'
  },
  langMap = {
    arabic: ['ar-lb', 'lb', 'ar-sa', 'sa', 'ar-ae', 'ae'],
    armenian: [],
    austrian: ['de-at', 'at'],
    azerbaijani: [],
    bulgarian: [],
    burmese: [],
    chinese: [
      'zh-cn',
      'cn',
      'zh-tw',
      'tw',
      'cn-tw',
      'zh-hk',
      'zh-sg',
      'ko-kr',
      'ko'
    ],
    croatian: [],
    czech: ['en-US', 'cz-cz', 'cz'],
    danish: [],
    default: [],
    esperanto: [],
    estonian: [],
    finnish: ['fi', 'fi-fi'],
    french: ['fr-fr', 'fr', 'fr-be', 'fr-ca', 'fr-ch'],
    georgian: [],
    german: ['de-de', 'de', 'de-ch', 'ch', 'at-at', 'at', 'nl-nl', 'nl'],
    greek: ['gr-gr', 'gr'],
    hindi: [],
    hungarian: ['hu-hu', 'hu'],
    italian: ['it-it', 'it', 'it-ch', 'ch'],
    latvian: [],
    lithuanian: [],
    macedonian: [],
    norwegian: ['no'],
    persian: [],
    polish: ['pl-pl', 'pl'],
    'portuguese-brazil': ['pt-br', 'br', 'pt-pt', 'pt'],
    romanian: ['ro-ro', 'ro'],
    russian: ['ru-RU', 'ru'],
    serbian: [],
    slovak: ['sk'],
    swedish: [],
    turkish: ['tr-tr', 'tr'],
    thai: ['th-th', 'th', 'ms-my', 'ms'],
    turkmen: [],
    ukrainian: [],
    vietnamese: []
  },
  langsToLoad = (() => {
    let maps = [],
      langCode = document.documentElement.getAttribute('lang');
    if (langCode === null || typeof langCode === 'undefined') return [];
    langCode = langCode.toLowerCase();

    Object.entries(langMap).forEach((e, i) => {
      let language = e[0],
        list = Array.isArray(e[1])
          ? e[1]
              .join(',')
              .toLowerCase()
              .split(',')
          : [];

      if (list.indexOf(langCode) > -1) {
        maps.push(`${language}.lng`);
        if (!Array.isArray(bpComponents.bpLanguages.languageSets)) {
          bpComponents.bpLanguages.languageSets = ['Default'];

          bpComponents.bpLanguages.languages.default = {
            name: 'Default',
            loaded: true,
            charSet: lng
          };
          bpComponents.bpLanguages.pageLangCode = langCode;
        }
        let readable = `${language.charAt(0).toUpperCase()}${language.slice(
          1
        )}`;
        bpComponents.bpLanguages.languageSets.push(readable);
        bpComponents.bpLanguages.languages[language] = {
          name: readable,
          loaded: false,
          charSet: null
        };
      }
    });

    return maps;
  })();

langsToLoad.forEach(el => {
  let xhr = new XMLHttpRequest(),
    path = document.body.dataset.themePath;
  xhr.onreadystatechange = e => {
    if (e.currentTarget.readyState === 4) {
      try {
        let local = JSON.parse(e.currentTarget.response);
        Object.assign(lng, local);
        bpObj = bpComponents.bpLanguages.languages[el.replace('.lng', '')];
        bpObj.charSet = local;
        bpObj.loaded = true;
      } catch (error) {
        console.warn(`Slugify error: ${error}!`);
      }
    }
  };
  xhr.open('get', `${path}/assets/languages/${el}`, true);
  xhr.send();
});

class Slugifier {
  static map = lng;
  constructor() {
    return str => {
      if (typeof str !== 'string') return '';
      return (() => {
        let s = '';
        str.split('').forEach(e => {
          if (/[abcdefghijklmnopqrstuvwxyz0123456789\-_]/gim.test(e)) s += e;
          else if (
            Slugifier.map.hasOwnProperty(e) &&
            typeof Slugifier.map[e] === 'string'
          )
            s += Slugifier.map[e];
          else s += '-';
        });
        return s
          .toLowerCase()
          .replace(/\s/gi, '-')
          .replace(/(\-+|\s+)$|^(\-+|\s+)/g, '')
          .replace(/\-{2,}/g, '-');
      })();
    };
  }
}

window.slug = new Slugifier();

/*eslint-enable*/
