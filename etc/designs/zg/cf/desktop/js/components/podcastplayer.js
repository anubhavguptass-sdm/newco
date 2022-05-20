"use strict";

(function ($) {
  "use strict";

  var api = {};

  api.onRegister = function (scope) {
    var $podcastplayer = scope.$scope,
        audioPlayer = $podcastplayer.find(".audio__player"),
        audio = $podcastplayer.find(".audio"),
        btnPlay = $podcastplayer.find(".audio__play"),
        btnPause = $podcastplayer.find(".audio__pause"),
        btnForwards = $podcastplayer.find(".audio__forwards"),
        btnBackwards = $podcastplayer.find(".audio__backwards"),
        progress = $podcastplayer.find("input[type=range]"),
        currentTime = $podcastplayer.find(".audio__current-time"),
        duration = $podcastplayer.find(".audio__duration"),
        shiftTime = $podcastplayer.find(".audio__forwards").data("value");

    audioPlayer.onloadedmetadata = function () {
      duration.get(0).textContent = audioPlayer.duration.get(0).toFixed(2);
    };

    btnPlay.on('click', function () {
      audio.addClass('audio--playing');
      audioPlayer.get(0).play();
    });
    btnPause.on('click', function () {
      audio.removeClass('audio--playing');
      audioPlayer.get(0).pause();
    });
    btnForwards.on('click', function () {
      audioPlayer.get(0).currentTime += shiftTime;
    });
    btnBackwards.on('click', function () {
      audioPlayer.get(0).currentTime -= shiftTime;
    });
    audioPlayer.on('timeupdate', function () {
      var current = audioPlayer.get(0).currentTime;
      var percent = current / audioPlayer.get(0).duration * 100;
      progress.get(0).value = percent;
      currentTime.get(0).textContent = current.toFixed(2);
    });
    progress.on('change', function () {
      audioPlayer.get(0).currentTime = audioPlayer.get(0).duration * (progress.get(0).value / 100);
    });
  };

  Cog.registerComponent({
    name: "podcastplayer",
    api: api,
    selector: ".podcast-player"
  });
})(Cog.jQuery());