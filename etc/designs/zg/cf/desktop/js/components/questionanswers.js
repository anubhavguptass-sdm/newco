"use strict";

(function ($) {
  var api = {};

  api.onRegister = function (elements) {
    $(".quizButton").on("click", "img", api.onQuizSubmitClick);
    $(".questionanswers .imgContainer").on("click", "input[type=radio]", api.onQuizRadioClick);
    $('.questionanswers input[type=radio]').removeAttr('checked');
  };

  api.onQuizSubmitClick = function (event, triggered) {
    var resultFound = new Boolean(true);
    $(".quizErrorBox").remove();
    $(".questionanswers .imgContainer").each(function (index) {
      index++;
      var radioInputChecked = $("input[name=question" + index + "]:checked").val();

      if (radioInputChecked == undefined) {
        resultFound = false;
      }
    });

    if (resultFound) {
      $(".quizResultBoxContainer .component").each(function (index) {
        if ($(this).data("showBox") == "yes") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
      $(".quizResultBoxContainer").addClass("showBoxQuiz");
    } else {
      $(".questionanswers:first-child").prepend("<h4 class='quizErrorBox'>Please select all options</h4>");
    }
  };

  api.onQuizRadioClick = function (event, triggered) {
    var OptionName = $(this).attr("name");
    var weightage = $(this).data("weightage");
    var questionId = $(this).closest(".imgContainer").attr("id");
    $(".questionWithRadio #" + questionId + " .quizScoreBox p").html(weightage);
    $("input[name=" + OptionName + "]").each(function (index) {
      var radioOption = $(this).attr("id");
      $(".component ." + radioOption).data("showBox", "no");
    });
    var showBox = $('input[name=' + OptionName + ']:checked').attr("id");
    $(".component ." + showBox).data("showBox", "yes");
  };

  Cog.registerComponent({
    name: "questionanswer",
    api: api,
    selector: ".questionanswer"
  });
})(Cog.jQuery());