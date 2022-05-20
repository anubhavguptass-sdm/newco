// eslint-disable
(function($) {
  /*
   ** jQuery inVeiwport
   */
  !(function(t) {
    let i = t(window);
    t.fn.visible = function(t, e, o) {
      if (!(this.length < 1)) {
        let r = this.length > 1 ? this.eq(0) : this,
          n = r.get(0),
          f = i.width(),
          h = i.height(),
          o = o ? o : 'both',
          l = e === !0 ? n.offsetWidth * n.offsetHeight : !0;
        if ('function' == typeof n.getBoundingClientRect) {
          let g = n.getBoundingClientRect(),
            u = g.top >= 0 && g.top < h,
            s = g.bottom > 0 && g.bottom <= h,
            c = g.left >= 0 && g.left < f,
            a = g.right > 0 && g.right <= f,
            v = t ? u || s : u && s,
            b = t ? c || a : c && a;
          if ('both' === o) return l && v && b;
          if ('vertical' === o) return l && v;
          if ('horizontal' === o) return l && b;
        } else {
          let d = i.scrollTop(),
            p = d + h,
            w = i.scrollLeft(),
            m = w + f,
            y = r.offset(),
            z = y.top,
            B = z + r.height(),
            C = y.left,
            R = C + r.width(),
            j = t === !0 ? B : z,
            q = t === !0 ? z : B,
            H = t === !0 ? R : C,
            L = t === !0 ? C : R;
          if ('both' === o) return !!l && p >= q && j >= d && m >= L && H >= w;
          if ('vertical' === o) return !!l && p >= q && j >= d;
          if ('horizontal' === o) return !!l && m >= L && H >= w;
        }
      }
    };
  })($);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ),
    JVPControls = {
      simple: `
      <div class="controls">
          <div class="icon {{iconPosition}}" style="background-image:url('{{icon}}')">{{iconLink}}</div>
          <div class="top">
              <div class="title">{{title}}</div>
          </div>
          <div class="bottom">
              <div class="play-controls" data-play-status="stopped">
                  <div class="play">
                      <div class="btn control-btn" role="button" tabindex="1" title="Play" aria-label="Play"></div>
                  </div>
              </div>
              <div class="timeline-controls">
                  <div class="bar">
                      <div class="loaded"></div>
                      <div class="played"></div>
                      <div class="seektime">00:00:00</div>
                  </div>
                  <div class="player-time">
                      <div class="player-played">00:00:00</div>
                      <div class="player-total">00:00:00</div>
                  </div>
              </div>
              <div class="settings-controls">
                  <div class="volume">
                      <div class="volume-handle">
                          <div class="vbar">
                              <div class="vol"></div>
                          </div>
                      </div>
                      <div class="btn control-volume">
                          <div class="handle"></div>
                      </div>
                  </div>
                  <div class="fullscreen" data-fs-status="n">
                      <div class="btn control-fullscreen" role="button" tabindex="2" title="Togggle fullscreen" aria-label="Toggle fullscreen">
                          <div class="i"></div>
                          <div class="i"></div>
                          <div class="i"></div>
                          <div class="i"></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  `
    },
    description =
      'BP Player. Playes local or youtube videos. Spacebar plays or pauses video on active player. Key up or key down adjusts volume. Key left and key right sets current playhead. Alt key + Enter key toggles fullscreen mode. Escape in fullscreenmode exits the fullscreen mode.';
  Number.prototype.toHHMMSS = function() {
    let sec_num = this, // don't forget the second param
      hours = Math.floor(sec_num / 3600),
      minutes = Math.floor((sec_num - hours * 3600) / 60),
      seconds = sec_num - hours * 3600 - minutes * 60;

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };
  Element.prototype.addLocalPlayer = function(data) {
    if (!data || typeof data !== 'object') {
      console.warn('LocalPlayer: no data provided');
    }
    if (this.localPlayer) {
      console.warn(
        'LocalPlayer: There is already one instance of LocalPlayer.'
      );
      return;
    }
    let video = document.createElement('video');
    if (data.playerlets.controls) {
      // video.setAttribute('controls')
    }

    video.setAttribute('src', data.videoId);
    data.width = (() => {
      return data.width ? `${data.width}px` : `100%`;
    })();
    data.height = (() => {
      return data.height ? `${data.height}px` : `auto`;
    })();
    video.style.cssText = `
      width: ${data.width}
      height: ${data.height}
  `;
    this.localPlayer = {
      video: this.appendChild(video),
      data: data,
      initiated: false,
      onPlayerReady:
        typeof data.onPlayerReady === 'function'
          ? data.onPlayerReady
          : function() {},
      onStateChange:
        typeof data.onStateChange === 'function'
          ? data.onStateChange
          : function() {}
    };
    video.onloadeddata = function() {
      video.addEventListener('progress', function() {
        try {
          let range = 0,
            bf = this.buffered,
            time = this.currentTime;
          while (!(bf.start(range) <= time && time <= bf.end(range))) {
            range += 1;
          }
          this.loadStartPercentage = bf.start(range) / this.duration;
          this.loadEndPercentage = bf.end(range) / this.duration;
          this.loadPercentage =
            this.loadEndPercentage - this.loadStartPercentage;
        } catch (err) {}
      });
      let rootPlayer = $(this).closest('.bpplayer'),
        duration = Math.round(video.duration);
      rootPlayer.find('.player-total').text(duration.toHHMMSS());
      rootPlayer.find('.player-played').text('00:00:00');
    };
    return this;
  };
  window.bpComponents.bpVideoPlayers = {};
  let altDown = false,
    ytTimeLine = player => {
      let rootPlayer = $(player),
        playerData = player.playerData,
        local = playerData.type === 'local',
        elapsed = rootPlayer.find('.player-played'),
        total = rootPlayer.find('.player-total'),
        loaded = rootPlayer.find('.loaded'),
        played = rootPlayer.find('.played'),
        currentTimeStamp = !local
          ? player.player.getCurrentTime()
          : playerData.video.currentTime,
        totalTimeStamp = !local
          ? player.player.getDuration()
          : playerData.video.duration,
        currentTime = Math.round(currentTimeStamp).toHHMMSS(),
        totalTime = Math.round(totalTimeStamp).toHHMMSS(),
        totalPlayedPercent = (currentTimeStamp / totalTimeStamp) * 100,
        loadedFraction = !local
          ? (player.player.getVideoLoadedFraction() * 100).toFixed(2)
          : (playerData.video.loadPercentage * 100).toFixed(2);
      loaded.css('width', `${loadedFraction}%`);
      played.css('width', `${totalPlayedPercent}%`);
      elapsed.text(currentTime);
      total.text(totalTime);
    },
    initJvPlayer = () => {
      let descriptorId = `descriptor${new Date().getTime()}`;
      $(`<p id="${descriptorId}" aria-hidden>${description}</p>`)
        .hide()
        .appendTo($('body'));
      $('.bpplayer').each((ind, el) => {
        let rootPlayer = $(el),
          playerEl = rootPlayer.closest(
            '.advancedParametrizedHtml, .parametrizedhtml'
          ),
          playerData = rootPlayer.attr('data-settings');
        playerData = JSON.parse(playerData.replace(/'/gi, '"'));
        let bpplayer = playerData.type === 'youtube',
          localPlayer = playerData.type === 'local',
          vimeoPlayer = playerData.type === 'vimeo', //prepare for vimeo?
          matchId = playerEl.attr('class').match(/idclass\-([^\s]+)/gi),
          pId =
            matchId === null
              ? `player${new Date().getTime()}`
              : matchId[0].replace('idclass-', '').camelize();

        playerData.playerId = pId;
        rootPlayer.attr('id', playerData.playerId);

        window.bpComponents.bpVideoPlayers[
          rootPlayer.get(0).id
        ] = rootPlayer.get(0);
        el.playerData = playerData;
        rootPlayer.removeAttr('data-settings');
        rootPlayer.attr({
          'aria-describedby': descriptorId
        });
        rootPlayer.append(
          $(`
    <div class="placeholder"><img alt="${
      playerData.placeholderAlt && playerData.placeholderAlt !== ' '
        ? playerData.placeholderAlt
        : 'Video placeholder image'
    }" title="${playerData.title}" src="${playerData.placeholderImage}"></div>
  `)
        );
        let videocontent = $(`
    <div class="videocontent" id="${playerData.playerId}yt"></div>
  `).appendTo(rootPlayer);
        el.stopVideo = () => {
          clearInterval(el.timeline);
          let video = el.playerData.video;
          if (bpplayer) el.player.stopVideo();
          else if (localPlayer) {
            video.pause();
            video.currentTime = 0;
          } else return;
          el.playing = false;
          el.status = 'stopped';
          $(el)
            .attr('data-status', 'stopped')
            .find('[data-play-status]')
            .attr('data-play-status', 'stopped');
        };
        el.playVideo = () => {
          let activePlayer = $('.bpplayer.active'),
            video = el.playerData.video;
          if (activePlayer.length > 0 && !$(el).is(activePlayer)) {
            activePlayer.get(0).stopVideo();
          }
          if (bpplayer) el.player.playVideo();
          else if (localPlayer) {
            video.play();
          } else return;
          el.playing = true;
          el.status = 'playing';
          $(el)
            .attr('data-status', 'playing')
            .find('.controls')
            .removeClass('controls-active-f');
          $(el)
            .find('[data-play-status]')
            .attr('data-play-status', 'playing');
          el.timeline = setInterval(ytTimeLine, 1, el);
        };
        el.pauseVideo = () => {
          let video = el.playerData.video;
          clearInterval(el.timeline);
          if (bpplayer) el.player.pauseVideo();
          else if (localPlayer) {
            video.pause();
          } else return;
          el.playing = el.playing ? false : true;
          el.status = el.playing ? 'playing' : 'paused';
          $(el)
            .attr('data-status', 'paused')
            .find('.controls');
          $(el)
            .find('[data-play-status]')
            .attr('data-play-status', 'paused');
        };
        el.onPlayerReady = event => {
          el.playing = false;
          let duration = el.player.getDuration(),
            videoData = el.player.getVideoData();
          $(el)
            .find('.top .title')
            .text(
              el.playerData.title === ' '
                ? videoData.title
                : el.playerData.title
            );
          $(el)
            .find('.player-total')
            .text(duration.toHHMMSS());
          el.setVolume(el.playerData.defaultVolume);
          el.status = 'stopped';
          $(el)
            .attr('data-status', 'stopped')
            .find('[data-play-status]')
            .attr('data-play-status', 'stopped');
        };
        el.fullScreen = () => {
          try {
            if (el.requestFullscreen) {
              el.requestFullscreen();
            } else if (el.mozRequestFullScreen) {
              /* Firefox */
              el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) {
              /* Chrome, Safari and Opera */
              el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) {
              /* IE/Edge */
              el.msRequestFullscreen();
            }
            $(el)
              .addClass('fs')
              .find('.fullscreen')
              .attr('data-fs-status', 'fs');
          } catch (err) {}
        };
        el.setVolume = (vol, programatic) => {
          let t = $(el);
          if (programatic) {
            t.find('.controls').addClass('controls-active');
            t.find('.volume').addClass('opened');
            if (window.hider) clearTimeout(window.hider);
            window.hider = setTimeout(() => {
              t.find('.volume.opened').removeClass('opened');
              t.find('.controls.controls-active').removeClass(
                'controls-active'
              );
            }, 2000);
          }
          let local = el.playerData.type === 'local';
          if (vol > 0 && vol <= 100) {
            if (!local) {
              el.player.setVolume(vol);
              el.player.unMute();
            }
            if (local) {
              el.playerData.video.volume = vol / 100;
              el.playerData.video.muted = false;
            }
            $(el)
              .find('.volume')
              .removeClass('muted');
            $(el)
              .find('.vol')
              .height(`${vol}%`);
            $(el)
              .find('.control-volume .handle')
              .width(`${vol}%`);
          } else if (vol === 0) {
            if (!local) {
              el.player.mute();
            }
            if (local) {
              el.playerData.video.muted = true;
            }
            $(el)
              .find('.volume')
              .addClass('muted');
          }
        };
        el.toggleMute = () => {
          let vol = $(el).find('.volume'),
            local = el.playerData.type === 'local';
          if (!local) {
            if (el.player.isMuted()) {
              el.player.unMute();
              vol.removeClass('muted');
            } else {
              el.player.mute();
              vol.addClass('muted');
            }
          }
          if (local) {
            if (el.playerData.video.muted) {
              el.playerData.video.muted = false;
              vol.removeClass('muted');
            } else {
              el.playerData.video.muted = true;
              vol.addClass('muted');
            }
          }
        };
        el.seekToPercentage = (percentage, programatic) => {
          if (percentage < 0) percentage = 0;
          if (percentage > 100) percentage = 100;
          let rootPlayer = $(el),
            controls = rootPlayer.find('.controls'),
            alsoPlay = false,
            playerData = el.playerData,
            local = playerData.type === 'local',
            seekTimeContainer = rootPlayer.find('.seektime'),
            playerStatus = rootPlayer.attr('data-status'),
            totalTimeStamp = !local
              ? el.player.getDuration()
              : el.playerData.video.duration,
            seekToTime = Math.floor(totalTimeStamp * percentage);
          seekTimeContainer
            .css('left', `calc(${percentage * 100}% - 30px)`)
            .text(seekToTime.toHHMMSS());

          if (programatic) {
            controls.addClass('controls-active');
            if (window.hider) clearTimeout(window.hider);
            window.hider = setTimeout(() => {
              $('.volume.opened').removeClass('opened');
              controls.removeClass('controls-active');
            }, 2000);
          }

          if (
            (!local &&
              [-1, 0, 2, 3, 5].indexOf(el.player.getPlayerState()) > -1) ||
            (local &&
              (playerStatus === 'stopped' ||
                playerStatus === 'paused' ||
                typeof playerStatus === 'undefined'))
          ) {
            alsoPlay = true;
          }
          if (!local) {
            el.player.seekTo(seekToTime, true);
          }
          if (local) {
            el.playerData.video.currentTime = seekToTime;
          }

          if (alsoPlay) el.playVideo();
        };
        el.exitFullScreen = () => {
          try {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
              /* Firefox */
              document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
              /* Chrome, Safari and Opera */
              document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
              /* IE/Edge */
              document.msExitFullscreen();
            }
            $(el)
              .removeClass('fs autofs')
              .find('.fullscreen')
              .attr('data-fs-status', 'n');
          } catch (err) {}
        };
        el.onPlayerStateChange = event => {
          let rootPlayer = $(el);
          if (event.data === -1) {
            let duration = el.player.getDuration();
            rootPlayer.find('.player-total').text(duration.toHHMMSS());
            rootPlayer.find('.player-played').text('00:00:00');
          }
          if (event.data == YT.PlayerState.PLAYING) {
          }
          if (event.data == YT.PlayerState.BUFFERING) {
          }
        };
        el.hideControls = event => {
          let rootPlayer = $(el);
          if (rootPlayer.find('.top:hover, .bottom:hover').length < 1) {
            rootPlayer.find('.controls').removeClass('controls-active');
            return;
          }
          rootPlayer.get(0).hideTimeout = setTimeout(
            rootPlayer.get(0).hideControls,
            2000
          );
        };
        el.showControls = event => {
          let rootPlayer = $(el);
          rootPlayer.find('.controls').addClass('controls-active');
        };
        rootPlayer.append(
          JVPControls[playerData.player]
            .replace('{{title}}', playerData.title)
            .replace('{{icon}}', playerData.icon.src)
            .replace('{{iconPosition}}', playerData.iconPosition)
            .replace(
              '{{iconLink}}',
              playerData.icon.link === '' ||
                typeof playerData.icon.link === 'undefined'
                ? ''
                : `<a href="${playerData.icon.link}" target="_blank"></a>`
            )
        );
        if (playerData.type === 'local') {
          el.playerData.video = videocontent.get(0).addLocalPlayer({
            videoId:
              el.playerData.videoUrl &&
              el.playerData.videoUrl !== '' &&
              el.playerData.videoUrl !== '$videoUrl'
                ? el.playerData.videoUrl
                : el.playerData.videoId,
            playerlets: {
              controls: el.playerData.controls,
              rel: 0,
              modestbranding: 0,
              showinfo: 0
            },
            events: {
              onReady: el.onPlayerReady,
              onStateChange: el.onPlayerStateChange
            }
          }).localPlayer.video;
        }
      });
    };
  window.onYouTubeIframeAPIReady = function() {
    for (i in window.bpComponents.bpVideoPlayers) {
      if (window.bpComponents.bpVideoPlayers.hasOwnProperty(i)) {
        let el = window.bpComponents.bpVideoPlayers[i];
        let rootPlayer = $(el);

        if (el.playerData.type === 'youtube') {
          el.player = new YT.Player(el.playerData.playerId + 'yt', {
            height: rootPlayer.height(),
            width: rootPlayer.width(),
            videoId: el.playerData.videoId,
            playerlets: {
              controls: 0,
              rel: 0,
              modestbranding: 0,
              showinfo: 0
            },
            events: {
              onReady: el.onPlayerReady,
              onStateChange: el.onPlayerStateChange
            }
          });
        }
      }
    }
    // $(window.bpComponents.bpVideoPlayers).each(function(ind, el) {
    //   let rootPlayer = $(el)

    //   if (el.playerData.type === 'youtube') {
    //     el.player = new YT.Player(el.playerData.playerId + 'yt', {
    //       height: rootPlayer.height(),
    //       width: rootPlayer.width(),
    //       videoId: el.playerData.videoId,
    //       playerlets: {
    //         controls: 0,
    //         rel: 0,
    //         modestbranding: 0,
    //         showinfo: 0
    //       },
    //       events: {
    //         onReady: el.onPlayerReady,
    //         onStateChange: el.onPlayerStateChange
    //       }
    //     })
    //   }
    // })
  };
  $(document).ready(e => {
    $(window).on('orientationchange', e => {
      if (
        isMobile &&
        $('.bpplayer:visible').visible() &&
        window.orientation === 90
      ) {
        let already = false;
        $('.bpplayer:visible').each((ind, el) => {
          let t = $(el);
          if (t.visible() && !already) {
            el.fullScreen();
            $(el).addClass('autofs');
            setTimeout(() => {
              el.playVideo();
            }, 10);
            already = true;
          }
        });
      }
      if (isMobile && window.orientation === 0) {
        let fs = $('.autofs');
        if (fs.length > 0) fs.get(0).exitFullScreen();
      }
    });
    initJvPlayer();
    let tag = document.createElement('script'),
      firstScriptTag = document.getElementsByTagName('script')[0];

    tag.src = 'https://www.youtube.com/iframe_api';
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    $('body')
      //MOUSE OVER
      .on('mouseover', e => {
        let t = $(e.target),
          rootPlayer;
        if (t.is('.bpplayer *')) {
          rootPlayer = t.closest('.bpplayer');
          rootPlayer.get(0).showControls(e);
          try {
            clearTimeout(rootPlayer.get(0).hideTimeout);
          } catch (err) {}
          rootPlayer.get(0).hideTimeout = setTimeout(
            rootPlayer.get(0).hideControls,
            2000
          );
        }
      })
      //MOUSE MOVE
      .on('mousemove', e => {
        let t = $(e.target),
          rootPlayer;
        if (t.is('.window.bpComponents.bpVideoPlayers, .bpplayer *')) {
          rootPlayer = t.closest('.bpplayer');
          try {
            clearTimeout(rootPlayer.get(0).hideTimeout);
          } catch (err) {}
          rootPlayer.get(0).showControls();
          rootPlayer.get(0).hideTimeout = setTimeout(
            rootPlayer.get(0).hideControls,
            2000
          );
        }
        if (t.is('.bpplayer .bar, .bpplayer .bar *')) {
          rootPlayer = t.closest('.bpplayer');
          let el = rootPlayer.get(0),
            bar = rootPlayer.find('.bar'),
            playerData = el.playerData,
            local = playerData.type === 'local',
            seekTimeContainer = rootPlayer.find('.seektime'),
            start = bar.offset().left,
            totalTimeStamp = !local
              ? el.player.getDuration()
              : el.playerData.video.duration,
            seekToPercentage = (e.pageX - start) / bar.width(),
            seekToTime = Math.floor(totalTimeStamp * seekToPercentage);
          seekTimeContainer
            .css('left', `calc(${seekToPercentage * 100}% - 30px)`)
            .text(seekToTime.toHHMMSS());
        }
        if (
          t.is('.bpplayer .vbar, .bpplayer .vbar *') &&
          t.closest('.bpplayer').length > 0 &&
          t.closest('.bpplayer').get(0).mousedown === true
        ) {
          let vbar = t.closest('.vbar'),
            rootPlayer = vbar.closest('.bpplayer'),
            el = rootPlayer.get(0),
            vbarBaseTop = vbar.offset().top,
            vbarBaseBottom = vbarBaseTop + vbar.height(),
            pos = vbarBaseBottom - e.pageY,
            vol = Math.floor((pos / vbar.height()) * 100);
          el.setVolume(vol);
        }
      })
      //KEY PRESS
      .on('keydown', e => {
        try {
          let spacepress = e.keyCode === 32,
            keyRight = e.keyCode === 39,
            keyLeft = e.keyCode === 37,
            keyUp = e.keyCode === 38,
            keyDown = e.keyCode === 40,
            activePlayer = $('.bpplayer.active'),
            playerIsActive = $(document.activeElement).is(
              '.bpplayer, .bpplayer *'
            ),
            el = activePlayer.get(0),
            local = el.playerData.type === 'local',
            vbar = activePlayer.find('.vbar'),
            vol = !local
              ? el.player.getVolume()
              : el.playerData.video.volume * 100,
            t = $(e.target),
            newVol,
            volConst = (vol / 10) % 1 > 0 ? 0 : 10;

          if ((e.location === 1 || e.code === 'AltLeft') && e.keyCode === 18) {
            altDown = true;
          }
          if (altDown && e.keyCode === 13) {
            let rootPlayer = $('.bpplayer.active');
            rootPlayer.trigger('dblclick');
          }
          if (
            spacepress &&
            !t.is('input,form,textarea') &&
            (activePlayer.get(0).status === 'playing' ||
              activePlayer.get(0).status === 'paused') &&
            activePlayer.length === 1
          ) {
            if (playerIsActive) {
              e.preventDefault();
              $('.bpplayer.active .play').trigger('click');
            }
          }

          if (keyUp && vol <= 100) {
            if (playerIsActive) {
              e.preventDefault();
              newVol = Math.ceil(vol / 10) * 10 + volConst;
              vol = newVol < 100 ? newVol : 100;
              el.setVolume(vol, true);
            }
          }

          if (keyDown && vol >= 0) {
            if (playerIsActive) {
              e.preventDefault();
              newVol = Math.floor(vol / 10) * 10 - volConst;
              vol = newVol >= 0 ? newVol : 0;
              el.setVolume(vol, true);
            }
          }

          if (keyLeft || keyRight) {
            if (playerIsActive) {
              e.preventDefault();
              let bar = activePlayer.find('.bar'),
                played = bar.find('.played'),
                barWidth = bar.width(),
                playedWidth = played.width(),
                playedPercentage = playedWidth / barWidth,
                seekTo = playedPercentage + (keyLeft ? -0.05 : 0.05);
              el.seekToPercentage(seekTo, true);
            }
          }
        } catch (err) {}
      })
      //CLICK + KEYUP
      .on('click keyup', e => {
        try {
          if (e.keyCode === 9) return;
          altDown = false;
          let t = $(e.target),
            rootPlayer,
            alsoPlay = false;
          if (t.is('.bpplayer .bar, .bpplayer .bar *')) {
            rootPlayer = t.closest('.bpplayer');
            let bar = rootPlayer.find('.bar'),
              start = bar.offset().left,
              seekToPercentage = (e.pageX - start) / bar.width();
            rootPlayer.get(0).seekToPercentage(seekToPercentage);
          }
          if (
            t.is('.bpplayer .fullscreen .btn, .bpplayer .fullscreen .btn *')
          ) {
            rootPlayer = t.closest('.bpplayer');
            rootPlayer.trigger('dblclick');
          }
          if (
            t.is(
              '.bpplayer .volume, .bpplayer .control-volume, .bpplayer .control-volume *'
            )
          ) {
            rootPlayer = t.closest('.bpplayer');
            let el = rootPlayer.get(0);
            el.toggleMute();
          }
          if (
            t.is('.bpplayer .play,.bpplayer .play *, .bpplayer .controls') ||
            alsoPlay
          ) {
            rootPlayer = t.closest('.bpplayer');
            let el = rootPlayer.get(0),
              bar = rootPlayer.find('.bar'),
              controls = rootPlayer.find('.controls');
            if (
              (el.playing && !isMobile) ||
              (isMobile && el.playing && rootPlayer.is('.ca')) ||
              (isMobile &&
                el.playing &&
                controls.is('.controls-active, .controls-active-f'))
            )
              el.pauseVideo();
            else if (
              (!el.playing && !isMobile) ||
              (isMobile && !el.playing && rootPlayer.is('.ca')) ||
              (isMobile &&
                !el.playing &&
                controls.is('.controls-active, .controls-active-f'))
            )
              el.playVideo();
            if (isMobile) {
              rootPlayer.addClass('ca'); // click available
              try {
                if (el.caTimeout) clearInterval(el.caTimeout);
                el.caTimeout = setTimeout(() => {
                  rootPlayer.removeClass('ca');
                }, 2000);
              } catch (err) {}
            }
            $('.bpplayer.active').removeClass('active');
            rootPlayer.addClass('active');
          }
          if (t.is('.bpplayer .vbar, .bpplayer .vbar *')) {
            let vbar = t.closest('.vbar');
            rootPlayer = vbar.closest('.bpplayer');
            el = rootPlayer.get(0);
            let vbarBaseTop = vbar.offset().top,
              vbarBaseBottom = vbarBaseTop + vbar.height(),
              pos = vbarBaseBottom - e.pageY,
              vol = Math.floor((pos / vbar.height()) * 100);
            el.setVolume(vol);
          }
        } catch (err) {}
      })
      //DOUBLE CLICK
      .on('dblclick', e => {
        try {
          let t = $(e.target),
            rootPlayer;
          if (t.is('.bpplayer,.bpplayer *')) {
            rootPlayer = t.closest('.bpplayer');
            let el = rootPlayer.get(0);
            if (window.innerHeight == screen.height) {
              // browser is fullscreen
              el.exitFullScreen();
            } else el.fullScreen();
          }
        } catch (err) {}
      })
      //FULLSCREEN CHANGE
      .on(
        'fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange',
        e => {
          try {
            let fullscreenElement =
              document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullscreenElement ||
              document.msFullscreenElement;
            if (!fullscreenElement) {
              $('.bpplayer')
                .removeClass('fs')
                .find('.fullscreen')
                .attr('data-fs-status', 'n');
            }
          } catch (error) {}
        }
      )
      .on('mousedown', e => {
        try {
          let t = $(e.target),
            rootPlayer;
          if (t.is('.bpplayer .vbar')) {
            rootPlayer = t.closest('.bpplayer');
            let el = rootPlayer.get(0);
            el.mousedown = true;
          }
        } catch (error) {}
      })
      .on('mouseup', e => {
        try {
          let t = $(e.target),
            rootPlayer,
            el;
          if ($('.bpplayer.active .vbar').length > 0) {
            rootPlayer = $('.bpplayer.active');
            el = rootPlayer.get(0);
            el.mousedown = false;
          }
        } catch (error) {}
      })
      .on('mouseleave', e => {
        try {
          let t = $(e.target),
            rootPlayer,
            el;
          if (t.is('.bpplayer .vbar')) {
            rootPlayer = t.closest('.bpplayer');
            el = rootPlayer.get(0);
            el.mousedown = false;
          }
        } catch (error) {}
      });
  });

  //solving carousel and video interactions
  $(function() {
    try {
      let players = $('body').find('.carousel-slide .bpplayer'),
        playersPresent = players.length > 0,
        carouselVideoID = playersPresent
          ? $(playersPresent[0].closest('ul.carousel-slides')).attr('id')
          : void 0;

      if (!playersPresent) return;

      if (playersPresent) {
        //fix for puase on hover function resuming carousel sliding
        $('.lSSlideWrapper').mouseleave(function() {
          if (
            $('.carousel-slide.active .bpplayer').attr('data-status') ===
            'playing'
          ) {
            window.bpComponents.bpCarousels[carouselVideoID].pause();
          }
        });

        let targetNodes = $('.carousel-slide .bpplayer'),
          MutationObserver =
            window.MutationObserver || window.WebKitMutationObserver,
          myObserver = new MutationObserver(mutationHandler),
          obsConfig = {
            childList: false,
            characterData: false,
            attributes: true,
            subtree: false
          };

        targetNodes.each(function() {
          myObserver.observe(this, obsConfig);
        });

        function mutationHandler(mutationRecords) {
          let mutated = false;
          mutationRecords.forEach(function(mutation) {
            if (mutation.type === 'attributes') {
              mutated = true;
            }
          });
          if (mutated) {
            if (
              $('.carousel-slide.active .bpplayer').attr('data-status') ===
              'playing'
            ) {
              window.bpComponents.bpCarousels[carouselVideoID].pause();
            }
          }
        }
      }
    } catch (error) {
      console.warn(error);
    }
  });
})(Cog.jQuery());
// eslint-enable
