/* eslint-disable */
(function($) {
  //fallback copy url method
  function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }
  // copy to clipboard method
  function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function() {
        console.log('Async: Copying to clipboard was successful!');
      },
      function(err) {
        console.error('Async: Could not copy text: ', err);
      }
    );
  }
  // declare isMobile var as false
  let isMobile = false;
  // device detection
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      navigator.userAgent.substr(0, 4)
    )
  ) {
    //set isMobile to true in case it's a mobile device
    isMobile = true;
  }
  // sharable link selector
  const jvShareLinkSelector = '.jv-share-link',
    // declare macros for url replacement
    macros = {
      share_uri: 'shareUrl',
      fb_app_id: 'fbAppId',
      origin: 'origin',
      share_title: 'shareTitle',
      share_description: 'shareDescription',
      hashtags: 'hashTags'
    },
    // declare sharable platforms and therir urls or app protocols if no protocol provided by API use same as url
    platforms = {
      facebook: {
        app: 'https://www.facebook.com/sharer.php?u={{share_uri}}', //'fb://share?u={{share_uri}}',
        url: 'https://www.facebook.com/sharer.php?u={{share_uri}}'
      },
      digg: {
        app: 'http://digg.com/submit?url={{share_uri}}&title={{share_title}}',
        url: 'http://digg.com/submit?url={{share_uri}}&title={{share_title}}'
      },
      tumblr: {
        app:
          'https://www.tumblr.com/widgets/share/tool?canonicalUrl={{share_uri}}&title={{share_title}}&caption={{share_description}}',
        url:
          'https://www.tumblr.com/widgets/share/tool?canonicalUrl={{share_uri}}&title={{share_title}}&caption={{share_description}}'
      },
      reddit: {
        app:
          'https://reddit.com/submit?url={{share_uri}}&title={{share_title}}',
        url: 'https://reddit.com/submit?url={{share_uri}}&title={{share_title}}'
      },
      evernote: {
        app: 'http://www.evernote.com/clip.action?url={{share_uri}}',
        url: 'http://www.evernote.com/clip.action?url={{share_uri}}'
      },
      flipboard: {
        app:
          'https://share.flipboard.com/bookmarklet/popout?v=2&title={{share_title}}&url={{share_uri}}',
        url:
          'https://share.flipboard.com/bookmarklet/popout?v=2&title={{share_title}}&url={{share_uri}}'
      },
      skype: {
        app: 'https://web.skype.com/share?url={{share_uri}}',
        url: 'https://web.skype.com/share?url={{share_uri}}'
      },
      vkontakte: {
        app: 'http://vk.com/share.php?url={{share_uri}}',
        url: 'http://vk.com/share.php?url={{share_uri}}'
      },
      okru: {
        app:
          'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl={{share_uri}}&title={{share_title}}',
        url:
          'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl={{share_uri}}&title={{share_title}}'
      },
      baidu: {
        app: 'http://cang.baidu.com/do/add?it={{share_title}}&iu={{share_uri}}',
        url: 'http://cang.baidu.com/do/add?it={{share_title}}&iu={{share_uri}}'
      },
      qzone: {
        app:
          'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{share_uri}}',
        url:
          'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={{share_uri}}'
      },
      xing: {
        app: 'https://www.xing.com/app/user?op=share&url={{share_uri}}',
        url: 'https://www.xing.com/app/user?op=share&url={{share_uri}}'
      },
      weibo: {
        app:
          'http://service.weibo.com/share/share.php?url={{share_uri}}&title={{share_title}}',
        url:
          'http://service.weibo.com/share/share.php?url={{share_uri}}&title={{share_title}}'
      },
      viber: {
        app: 'viber://forward?text={{share_title}}',
        url: null
      },
      douban: {
        app:
          'http://www.douban.com/recommend/?url={{share_uri}}&title={{share_title}}',
        url:
          'http://www.douban.com/recommend/?url={{share_uri}}&title={{share_title}}'
      },
      delicious: {
        app:
          'https://delicious.com/save?v=5&provider=%7Bprovider%7D&noui&jump=close&url={{share_uri}}&title={{share_title}}',
        url:
          'https://delicious.com/save?v=5&provider=%7Bprovider%7D&noui&jump=close&url={{share_uri}}&title={{share_title}}'
      },
      stumbleupon: {
        app:
          'http://www.stumbleupon.com/submit?url={{share_uri}}&title={{share_title}}',
        url:
          'http://www.stumbleupon.com/submit?url={{share_uri}}&title={{share_title}}'
      },
      linkedin: {
        app:
          'https://www.linkedin.com/shareArticle?mini=true&url={{share_uri}}&title={{share_title}}&summary={{share_description}}&source={{share_uri}}', //'fb://share?u={{share_uri}}',
        url:
          'https://www.linkedin.com/shareArticle?mini=true&url={{share_uri}}&title={{share_title}}&summary={{share_description}}&source={{share_uri}}'
      },
      messenger: {
        app:
          'fb-messenger://share/?link={{share_uri}}&app_id={{fb_app_id}}&redirect_uri={{origin}}',
        url:
          'https://www.facebook.com/dialog/send?link={{share_uri}}&app_id={{fb_app_id}}&redirect_uri={{origin}}'
      },
      whatsapp: {
        app: 'whatsapp://send?text={{share_title}} {{share_uri}}',
        url: 'https://wa.me/?text={{share_title}} {{share_uri}}'
      },
      email: {
        app:
          'mailto:?subject={{share_title}}&body={{share_description}}: {{share_uri}}',
        url:
          'mailto:?subject={{share_title}}&body={{share_description}}: {{share_uri}}'
      },
      twitter: {
        app:
          'twitter://post?url={{share_uri}}&text={{share_title}}&hashtags={{hashtags}}',
        url:
          'https://twitter.com/share?url={{share_uri}}&text={{share_title}}&hashtags={{hashtags}}'
      },
      pinterest: {
        app:
          'http://pinterest.com/pin/create/button/?url={{share_uri}}&media=&description={{share_title}}%3A%20{{share_description}}',
        url:
          'http://pinterest.com/pin/create/button/?url={{share_uri}}&media=&description={{share_title}}%3A%20{{share_description}}'
      },
      copy: {
        app: '{{share_uri}}',
        url: '{{share_uri}}'
      },
      custom: {
        app: 'custom',
        url: 'custom'
      }
    };
  // sharer method
  function jvSharePlatform(shareButton) {
    //check if shareButton is jQuery object
    if (!shareButton || !shareButton instanceof $) return;
    // check if set plarform is supported
    if (
      !platforms.hasOwnProperty(shareButton.attr('data-service').toLowerCase())
    )
      return;
    // set uri to pickup url string out of platform
    let uri = isMobile ? 'app' : 'url',
      // get platform out of shareButton data-service
      platform = shareButton.attr('data-service').toLowerCase(),
      // declare macroReps object, all replacements for macros are stored here
      macroReps = {
        fbAppId: shareButton.attr('data-fbapp-id'), // fb AppId must be provided in case of messenger sharing
        shareUrl: window.location.href, // sharable url
        origin: window.location.origin, // origin used only for messenger
        shareTitle: $(`meta[property="og:title"]`).attr('content'), // get title out of OG:TITLE
        shareDescription: $(`meta[property="og:description"]`).attr('content'), // get description out of OG:DESCRIPTION
        hashTags: $(`meta[property="og:title"]`)
          .attr('content')
          .split(' ')
          .join(',') // create hash tags for twitter out of OG:TITLE
      },
      // declare sharable url base
      sharerURL = platforms[platform][uri];

    if (sharerURL === 'custom' && shareButton.attr('data-custom-pattern-url')) {
      sharerURL = shareButton.attr('data-custom-pattern-url');
    } else if (
      sharerURL === 'custom' &&
      !shareButton.attr('data-custom-pattern-url')
    ) {
      console.warn('JV Sharer::Missing custom url:data-custom-pattern-url');
      return;
    }

    if (sharerURL === null) {
      alert('This url cannot be shared on this device');
      return;
    }
    // iterate over each macro and replace it in sharable base
    for (let i in macros) {
      if (!macros.hasOwnProperty(i)) continue;
      let regExp = new RegExp(`\{\{${i}\}\}`, 'g');
      // in case of url do not encode for copying
      sharerURL = sharerURL.replace(
        regExp,
        platform === 'copy'
          ? macroReps[macros[i]]
          : encodeURIComponent(macroReps[macros[i]])
      );
    }
    // check if platform is url so it should be copied
    if (platform === 'copy') {
      copyTextToClipboard(sharerURL);
      alert(shareButton.attr('data-copied')); // if copy platform used data-copied should be provided to let user know it's been copied
      return;
    }

    if (!isMobile) {
      // if is not mobile device try open external url
      window.open(
        sharerURL,
        '',
        'menubar=yes,location=no,resizable=yes,scrollbars=yes,status=yes,top=0,left=0,width=640,height=480'
      );
    } else {
      // else set url with desired protocol to open app with specified protocol or open url
      window.location.href = sharerURL;
    }
  }
  // catch all click on body
  $('body').on('click', e => {
    let t = $(e.target);
    // check if target is jv share component link
    if (t.is(`${jvShareLinkSelector}, ${jvShareLinkSelector} *`)) {
      e.preventDefault();
      t = t.closest(jvShareLinkSelector);
      jvSharePlatform(t);
    }
  });
})(Cog.jQuery());
/* eslint-enable */
