/**
 * Form
 */

(function($) {
	"use strict";

	var api = {},
		clearForm,
		resetForm,
		manualInputs;

	clearForm = function($form, oldbrowser) {
		$form.find(":input").not(":checkbox, :radio, :hidden, :reset, :submit, :button").val("");
		$form.find("input:radio").prop("checked", false);
		$form.find("input:checkbox").prop("checked", false);

		if (oldbrowser) {
			$form.find(":input").not(":checkbox, :radio, :hidden, :reset, :submit, :button").blur();
		}
	};

	resetForm = function($form) {
		$form[0].reset();
		$form.find("input, textarea").blur();
	};

	manualInputs = (function() {
		function applyStyle($input, $label) {
			if ($input.is(":checked")) {
				$label.addClass("checked");
			} else {
				$label.removeClass("checked");
			}
		}

		return function($inputs) {
			$inputs.each(function(i, input) {
				var $input = $(input),
					$label = $input.parent().find("label");

				$label.on("click", function(ev) {
					ev.preventDefault();
					input.checked = !input.checked;
				});

				applyStyle($input, $label);
				$input.on("change", function() {
					applyStyle($input, $label);
				});
			});
		};
	})();

	api.onRegister = function(scope) {

		var form = scope.$scope,
			disabledMessage = "Submit functionality is disabled" +
				" in Edit mode - switch to Preview mode to use it.",
			browser = this.external.browser,
			status = this.external.status;

		form.find("textarea[maxlength]").bind("change keyup", function() {
			var maxlength = $(this).attr("maxlength"),
				val = $(this).val();

			if (val.length > maxlength) {
				$(this).val(val.substring(0, maxlength));
			}
		});

		manualInputs(form.find("input[type=radio], input[type=checkbox]"));

		form.find("button.clearButton").bind("click", function() {
			clearForm($(this.form));
		});

		form.find("button.control-tooltip-button").bind("click", function(e) {
			e.preventDefault();
		});

		if (browser.msie && browser.version < 10) {
			form.on("click", "button.clearButton", function() {
				clearForm($(this.form), true);
			});
			form.find("input.reset").bind("click", function(e) {
				e.preventDefault();
				resetForm($(this.form));
			});
			form.find("button.editSubmit").bind("click", function(e) {
				if (status.isAuthor()) {
					return true;
				}
				e.preventDefault();
				window.alert(disabledMessage);
			});
		} else {
			form.on("click", "button.clearButton", function() {
				clearForm($(this.form));
			});
			form.find("button.editSubmit").bind("click", function(e) {
				if (status.isAuthor()) {
					return true;
				}
				e.preventDefault();
				window.alert(disabledMessage);
			});
		}
	};

	Cog.registerComponent({
		name: "form",
		api: api,
		selector: ".form",
		requires: [
			{
				name: "utils.browser",
				apiId: "browser"
			},
			{
				name: "utils.status",
				apiId: "status"
			}
		]
	});
}(Cog.jQuery()));
