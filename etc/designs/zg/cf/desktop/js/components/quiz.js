"use strict";

/*
* Quiz
*/
(function ($) {
  var api = {},
      totalScore = 0,
      j = 0,
      progressLeftMargin = 0,
      progressLeftMarginNext,
      percent,
      bgQuesCount = 0,
      perPagePaginationLength = 0,
      progressBtnLevel = 1,
      factor = .5,
      flag = "true",
      temp = "true",
      validationFail = new Boolean(false),
      questionPageId = "",
      questionPageScore = 0,
      progressQuestions = new Array();

  api.onRegister = function (arg) {};

  api.init = function (element) {
    if (flag === 'true') {
      var $quiz = element,
          $ques = $quiz.find(".questionContainer");
      $('.questionContainer').each(function (index) {
        index++;
        $(this).attr("id", "question" + index);
        bgQuesCount = index;
      });

      for (i = 2; i <= bgQuesCount; i++) {
        $(".quizPrimaryContainer #question" + i).hide();
      }

      $(".questionWithImage .imgContainer").each(function (index) {
        $(this).attr("id", "question" + index);
      });
      $(".questionWithRadio .imgContainer").each(function (index) {
        $(this).attr("id", "question" + index);
      });
      $(".questionWithRadio .quizScoreBox").each(function (index) {
        $(this).attr("id", "question" + index + "score");
      });
      $(".questionWithCheck .imgContainer").each(function (index) {
        $(this).attr("id", "question" + index);
      });
      $(".questionWithCheck .quizScoreBox").each(function (index) {
        $(this).attr("id", "question" + index + "score");
      });
      $(".questionWithImage .quizScoreBox").each(function (index) {
        $(this).attr("id", "question" + index + "score");
      });
      $(".questionContainer").each(function (index) {
        progressQuestions[index] = $(this).attr("data-question-label");
        index++;
        $(this).attr("id", "question" + index);
        bgQuesCount = index;
      });
      percent = 100 / (bgQuesCount - 1);
      percent -= 1;

      for (j = 1; j <= bgQuesCount; j++) {
        progressLeftMarginNext = j == 1 ? "left:" + "2%" : "left:" + progressLeftMargin + "%";
        var classNameDot = j == 1 ? "quizProgressDots firstactive" : "quizProgressDots";

        if (j == bgQuesCount) {
          classNameDot = "quizProgressDots last";
        }

        $(".quizProgressBarQuestions").append('<input type="button" class="quizProgressBarQuestion" value="' + progressQuestions[j - 1] + '" style=' + progressLeftMarginNext + '></input>');
        $(".quizProgressBarDots").append('<input type="button" id="progressLevel' + j + '" data-score="0" class="' + classNameDot + '" style=' + progressLeftMarginNext + '></input>');
        progressLeftMargin = parseInt(progressLeftMargin + percent);
      }

      $(".quizProgressBarQuestions .quizProgressBarQuestion:last-child").css('left', "96%");
      $(".quizProgressBarDots .quizProgressDots:last-child").css('left', "98%");
      $quiz.each(function () {
        $(this).on("click", ".imgContainer input[type=image]", api.onQuizImageOptionClick);
        $(this).on("click", ".quizWithBGImage button.quizOptionButton", api.onQuizBGImageOptionClick);
        $(this).on("click", ".questionsPaginationContainer button.prevQuestionPage", api.onQuizPrevPageClick);
        $(this).on("click", ".questionsPaginationContainer button.nextQuestionPage", api.onQuizNextPageClick);
        $(this).on("click", ".imgContainer input[type=radio]", api.onQuizRadioOptionClick);
        $(this).on("click", ".imgContainer input[type=checkbox]", api.onQuizCheckBoxOptionClick);
        $(this).on("click", ".imgContainer button", api.onQuizRadioOptionClick);
        $(this).on("click", "button.generateScore", api.generateScoreClick);
        $(this).on("click", "button.generateScoreNewPage", api.generateScoreNewPageClick);
        $(this).on("click", ".quizOverlayContainer .overlay-close", api.OverlayClose);
        $(this).on("click", ".quizOverlayContainer .overlay-bg", api.OverlayBGClose);
        $(this).on("click", ".quizOverlayContainer .overlay-content", api.OverlayContentAreaClick);
        $(this).on("click", ".progressActive", api.updateProgressQuizScore);
        $(this).on("click", ".firstactive", api.updateProgressQuizScore);
        $(this).on("click", ".quizBannerOption", api.onQuizBannerClick);
        $(this).on("click", "button.generateScoreNewPage1", api.printQuizContainer);
      });
      perPagePaginationLength = $(".questionsPerPage").length;

      for (k = 2; k <= perPagePaginationLength; k++) {
        $("#page" + k).hide();
      }
    }

    flag = 'false';
  };

  api.onQuizBannerClick = function (event, triggered) {
    $(this).hide();
    $(".quizPrimaryContainer").show();
  };

  $(this).on("click", ".quizBannerOption a", api.onQuizBannerClick);

  api.OverlayClose = function (event, triggered) {
    $('.overlay-bg').hide();
  };

  api.OverlayBGClose = function (event, triggered) {
    $('.overlay-bg').hide();
  };

  api.OverlayContentAreaClick = function (event, triggered) {
    return false;
  };

  api.onQuizBannerClick = function (event, triggered) {
    $(this).hide();
    $(".quizPrimaryContainer").show();
  };

  api.generateScoreClick = function (event, triggered) {
    event.stopPropagation();
    var quizType = $(".quizPrimaryContainer").attr("data-quiz-type");
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    var totalScore = api.generateTotalScore.call(self);

    if (totalScore != "") {
      api.quizTypeIdentifer.call(self, totalScore, quizType);
    }

    $(".totalScoreBox p").html(totalScore);
    $("html, body").animate({
      scrollTop: $(".quiz").offset().top
    }, "slow");
  };

  api.generateTotalScore = function () {
    $('.errorQuizOverlay .errorQuestion span').html("");
    $('.resultQuizOverlay .quizYourScore span').html("");
    var scoreBoxID,
        itemWeightage = 0;
    var totalScore = questionPageId != "" ? questionPageScore : 0;
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    var quizScoreDiv = questionPageId != "" ? quizScoreDiv = quizScoreDiv = "#" + questionPageId + " .quizScoreBox" : ".component-content .quizScoreBox";
    $(quizScoreDiv).each(function (index) {
      index++;
      scoreBoxID = $(this).attr("id");
      itemWeightage = parseInt($("#" + scoreBoxID + " p").html());

      if (!isNaN(itemWeightage)) {
        validationFail = false;
        totalScore += itemWeightage;
        questionPageScore = totalScore;
      } else {
        validationFail = true;
        $('.errorQuizOverlay .errorQuestion span').append(" :" + index);
        $('.errorQuizOverlay.overlay-bg').show().css({
          'height': docHeight
        });
        $('.errorQuizOverlay.overlay-content').css({
          'top': scrollTop + 180 + 'px'
        });
        totalScore = "";
      }
    });
    return totalScore;
  };

  api.onQuizImageOptionClick = function (event, triggered) {
    event.stopPropagation();
    var questionId = $(this).parent().attr("id");
    $(".questionWithImage #" + questionId + " input[type=image]").each(function () {
      $(this).show();
    });
    $(".questionWithImage #" + questionId + " img.cross-tick").each(function () {
      $(this).hide();
    });
    $(this).parents(".imgContainer").find("input[type='radio']").removeAttr("checked");
    $(this).hide();
    $(this).next(".cross-tick").remove();
    $(this).after("<img src='/etc/designs/zg/cf/desktop/assets/img/boxX.gif' class='cross-tick'/>");
    $(this).next("img").next("input[type='radio']").prop("checked", true);
    var scoreID = questionId + "score p";
    var weightage = $(this).attr("data-weightage");
    $(".questionWithImage #" + scoreID).html(weightage);
  };

  api.onQuizBGImageOptionClick = function (event, triggered) {
    event.stopPropagation();
    var widthVal;
    var quizType = $(".quizPrimaryContainer").attr("data-quiz-type");
    progressBtnLevel = progressBtnLevel + 1;
    $("#progressLevel" + progressBtnLevel).addClass('progressActive');
    widthVal = $("#progressLevel" + progressBtnLevel).attr("style");

    if (widthVal != undefined) {
      percent = parseInt(widthVal.substring(widthVal.indexOf(":") + 1, widthVal.indexOf("%")));
    }

    if ($("#progressLevel" + progressBtnLevel).hasClass('last')) {
      percent = 99;
    }

    if (percent <= 100) {
      percent += factor;
      $('.progressDotActive').css('width', percent + "%", 'background', "#099696", 'height', "10px");
    }

    var questionId = $(this).closest(".questionContainer").attr("id");
    $("#" + questionId).hide();
    var nextQuestion = questionId.replace(/\d+$/, function (n) {
      return ++n;
    });
    $("#" + nextQuestion).show();
    var bgDataWeightage = $(this).attr("data-weightage");

    if (!isNaN(bgDataWeightage)) {
      totalScore = parseInt(bgDataWeightage) + parseInt(totalScore);
    }

    var progressInputLevel = parseInt(questionId.charAt(questionId.length - 1)) + 1;
    var $dataDiv = $('#progressLevel' + progressInputLevel);
    $dataDiv.attr('data-score', totalScore);

    if (questionId == "question" + bgQuesCount) {
      api.quizTypeIdentifer.call(self, totalScore, quizType);
    }
  };

  api.onQuizNextPageClick = function (event, triggered) {
    event.stopPropagation();
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    var quizType = $(".quizPrimaryContainer").attr("data-quiz-type");
    questionPageId = $(this).closest(".questionsPerPage").attr("id");
    var nextQuestion = questionPageId.replace(/\d+$/, function (n) {
      return ++n;
    });
    $('.errorQuizOverlay .errorQuestion span').html(" ");
    var totalScore = api.generateTotalScore.call(self);

    if (validationFail != true) {
      $("#" + questionPageId).hide();
      $("#" + nextQuestion).show();
    } else {
      $("#" + questionPageId).show();
    }

    if (questionPageId == "page" + perPagePaginationLength && validationFail != true) {
      $("#page1").show();
      api.quizTypeIdentifer.call(self, totalScore, quizType);
    }
  };

  api.onQuizPrevPageClick = function (event, triggered) {
    event.stopPropagation();
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();
    questionPageId = $(this).closest(".questionsPerPage").attr("id");
    $("#" + questionPageId).hide();
    var nextQuestion = questionPageId.replace(/\d+$/, function (n) {
      return --n;
    });
    $("#" + nextQuestion).show();
  };

  api.generateRecommendationURL = function (totalScore) {
    var recmDataMinRange, recmDataMaxRange, recmDataURL;
    $(".quizRecommendationContainer .quizRecommendation").each(function () {
      recmDataMaxRange = $(this).attr("data-max-range");
      recmDataMinRange = $(this).attr("data-min-range");

      if (totalScore >= recmDataMinRange && totalScore <= recmDataMaxRange) {
        recmDataURL = $(this).attr("data-url");
      }
    });
    return recmDataURL;
  };

  api.generateRecommendation = function (totalScore, showDivContainer) {
    $(".quizScoreHeading").remove();
    var displayScore = $(".quizPrimaryContainer").attr("data-score-display");
    $.ajax({
      type: "GET",
      url: api.generateRecommendationURL.call(self, totalScore),
      dataType: "html",
      success: function success(response) {
        var parse = $($.parseHTML(response));
        $(showDivContainer).show();
        $(showDivContainer).html(parse);

        if (temp === 'true' && displayScore == 'true') {
          $(showDivContainer).before("<h1 class='quizScoreHeading'>Your Score::" + totalScore + "</h1>");
        }

        temp = 'false';
      }
    });
  };

  api.onQuizCheckBoxOptionClick = function (event, triggered) {
    event.stopPropagation();
    var questionId = $(this).closest(".imgContainer").attr("id"),
        questionWeightage = 0;
    $("#" + questionId + " .formControl-radio input[type=checkbox]").each(function (index) {
      var weightage = $(this).attr("data-weightage");

      if (this.checked) {
        questionWeightage += parseInt(weightage);
      }
    });
    $(".questionWithCheck #" + questionId + " .quizScoreBox p").html(questionWeightage);
  };

  api.onQuizRadioOptionClick = function (event, triggered) {
    event.stopPropagation();
    var questionId = $(this).closest(".imgContainer").attr("id");
    var weightage = $(this).attr("data-weightage");
    $("#" + questionId + " button.optionActive").each(function () {
      $(this).removeClass("optionActive");
    });
    $(this).addClass("optionActive");
    $(".questionWithRadio #" + questionId + " .quizScoreBox p").html(weightage);
    $(".questionWithImage #" + questionId + "score p").html(weightage);
    $(this).prev(".cross-tick").remove();
    $(this).prev("input[type='image']").click();
  };

  api.printQuizContainer = function (event, triggered) {
    var divToPrint = $(".quizPrimaryContainer").html();
    var newWin = window.open('', 'Print-Window', 'width=400,height=400,top=100,left=100');
    newWin.document.open();
    newWin.document.write('<html><body onload="window.print()">' + divToPrint + '</body></html>');
    newWin.document.close();
  };

  api.quizTypeIdentifer = function (totalScore, quizType) {
    var docHeight = $(document).height();
    var scrollTop = $(window).scrollTop();

    if (quizType == "overlay") {
      $(".quiz.quizProgressBar").hide();
      api.generateRecommendation.call(self, totalScore, ".overlayContainerDiv");
      $('.resultQuizOverlay .quizYourScore span').append(totalScore);
      $('.resultQuizOverlay.overlay-bg').show().css({
        'height': docHeight
      });
      $('.resultQuizOverlay.overlay-content').css({
        'top': scrollTop + 180 + 'px'
      });
    } else if (quizType == "redirect") {
      window.location.href = api.generateRecommendationURL.call(self, totalScore);
    } else if (quizType == "samePage") {
      api.generateRecommendation.call(self, totalScore, ".quizPrimaryContainer");
    }
  };

  api.updateProgressQuizScore = function (event, triggered) {
    var progressLevelId, questionLevel, progressMargin, progressMarginVal;
    progressLevelId = $(this).attr("id");
    totalScore = $("#" + progressLevelId).attr("data-score");
    totalScore = parseInt(totalScore);
    $('.questionContainer').hide();
    questionLevel = parseInt(progressLevelId.charAt(progressLevelId.length - 1));
    $('#question' + questionLevel).show();
    progressBtnLevel = questionLevel;

    while (questionLevel < bgQuesCount) {
      questionLevel++;

      if ($("#progressLevel" + questionLevel).hasClass('progressActive')) {
        $("#progressLevel" + questionLevel).removeClass('progressActive');
      }
    }

    progressMargin = $(this).attr("style");
    progressMarginVal = parseInt(progressMargin.substring(progressMargin.indexOf(":") + 1, progressMargin.indexOf("%")));
    progressMarginVal += factor;
    $('.progressDotActive').css('width', progressMarginVal + "%", 'background', "#099696", 'height', "10px");
  };

  Cog.registerComponent({
    name: "quiz",
    api: api,
    selector: ".quiz"
  });
})(Cog.jQuery());