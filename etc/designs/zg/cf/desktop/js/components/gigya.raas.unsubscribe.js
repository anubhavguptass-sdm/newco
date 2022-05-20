"use strict";

(function ($) {
  "use strict";

  if (typeof gigyaraas !== 'undefined') {
    var getConsentArray = function getConsentArray(response, config) {
      var consentArray = [];

      if (config.formType === 'unsubscribe') {
        if (gigyaraas.getVisibleScreen(response).find('.consent-update').length > 0) {
          var uid = cf.getParameterByName('uid') || cf.getParameterByName('id');
          gigyaraas.getVisibleScreen(response).find('.consent-update').each(function (index, consentUpdateElement) {
            var $input = $(consentUpdateElement).find('input[type="checkbox"]'),
                classPrint = $(consentUpdateElement).attr('class').split(' '),
                consentType = '',
                dataName = '',
                matchconsentType = /consentType-/,
                matchconsentValue = /consentValue-/,
                channelValue = $input.is(":checked");
            classPrint.forEach(function (element) {
              // replace ex. mass_email to 'mass email'
              if (matchconsentType.test(element)) {
                consentType = element.split('-')[1].replace('_', ' ');
              }

              if (matchconsentValue.test(element)) {
                dataName = element.split('-')[1];
              }
            });
            consentArray.push({
              "gigyaId": uid,
              "consentType": consentType,
              "dataName": dataName,
              "optStatus": channelValue
            });
          });
          return consentArray;
        }
      }
    };

    var getBuId = function getBuId(response) {
      var veevaBuId;

      if (cf.veevaSiteMode === "multiple" && response && response.data && response.data.ADDRESS && response.data.ADDRESS.COUNTRY) {
        veevaBuId = response.data.ADDRESS.COUNTRY;
      }

      return veevaBuId;
    };

    /**
     * Replaces placeholders in ${profile|data attribute} format with the appropriate value
     * @param visibleScreen gigya form
     * @param field whitelisted gigya profile or data field
     *
     */
    var dataObj,
        profileObj,
        uid = cf.getParameterByName('uid') || cf.getParameterByName('id'),
        replacePlaceholdersWithData = function replacePlaceholdersWithData(visibleScreen, field) {
      var elms = visibleScreen[0].getElementsByTagName("*"),
          len = elms.length;

      for (var i = 0; i < len; i++) {
        var child = elms[i].childNodes,
            childLength = child.length;

        for (var j = 0; j < childLength; j++) {
          if (child[j].nodeType === 3) {
            var fieldNameEscapedRegexp = new RegExp("\\${" + field.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "}", "g");
            child[j].textContent = child[j].textContent.replace(fieldNameEscapedRegexp, field.value);
          }
        }
      }
    },
        updateCheckboxes = function updateCheckboxes($checkboxesButUnsubscribe, $unsubscribeCheckbox) {
      var checkedInputsCount = $checkboxesButUnsubscribe.filter(function (index, checkbox) {
        return checkbox.checked;
      }).length;

      if (checkedInputsCount === 0) {
        $unsubscribeCheckbox.prop('checked', true).change();
      }
    };

    gigyaraas.registerAction("onAfterScreenLoad", "populate-unsubscribe-form", function (response, config) {
      if (config.formType === 'unsubscribe') {
        cf.loadCsrfToken('div[data-component-id="' + response.context.componentId + '"]');
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: window.location.pathname.split('.')[0] + '.subscriptiondata.json' + window.location.search,
          success: function success(servletResponse) {
            if (servletResponse && servletResponse.flattenedArray) {
              var $visibleScreen = gigyaraas.getVisibleScreen(response),
                  $unsubscribeCheckbox = $visibleScreen.find("input[name='data.UNSUBSCRIBE']"),
                  $checkboxesButUnsubscribe = $visibleScreen.find("input[type='checkbox']").not("input[name='data.UNSUBSCRIBE']");
              $unsubscribeCheckbox.on('change', function () {
                if ($unsubscribeCheckbox.is(':checked')) {
                  $.each($checkboxesButUnsubscribe, function (index, checkbox) {
                    checkbox.checked = false;
                  });
                } else {
                  updateCheckboxes($checkboxesButUnsubscribe, $unsubscribeCheckbox);
                }
              });
              $checkboxesButUnsubscribe.on('change', function (event) {
                if (event.target.checked) {
                  $unsubscribeCheckbox.prop('checked', false).change();
                }

                updateCheckboxes($checkboxesButUnsubscribe, $unsubscribeCheckbox);
              });
              servletResponse.flattenedArray.forEach(function (field) {
                var $input = $visibleScreen.find('input[name="' + field.name + '"]');

                if ($input.attr('type') === 'checkbox') {
                  $input.prop('checked', field.value === 'true' || field.value === true || field.value === 'on').change();
                } else {
                  $input.val(field.value);
                }

                replacePlaceholdersWithData($visibleScreen, field);
              });

              if (servletResponse.data != null) {
                dataObj = JSON.parse(servletResponse.data);
              }

              if (servletResponse.profile != null) {
                profileObj = JSON.parse(servletResponse.profile);
              }
            }
          }
        });
      }
    });
    gigyaraas.registerAction("onBeforeSubmit", "send-unsubscribe-form", function (response, config) {
      if (config.formType === 'unsubscribe') {
        var serializedData = gigyaraas.getVisibleScreen(response).find('input').serializeArray();
        serializedData = serializedData.concat(gigyaraas.getVisibleScreen(response).find('input[type=checkbox]:not(:checked)').map(function () {
          return {
            "name": this.name,
            "value": 'false'
          };
        }).get());
        serializedData.forEach(function (item) {
          if (item.value === 'on') {
            item.value = "true";
          }
        });
        var jsonData = {};
        $(serializedData).each(function (index, obj) {
          if (obj.value !== '') {
            jsonData[obj.name] = obj.value;
          }
        });
        var consentArray = getConsentArray(response, config);
        var buId = getBuId(response);
        var data = {
          "inputValues": JSON.stringify(jsonData),
          "consent": encodeURIComponent(JSON.stringify(consentArray)),
          "buId": buId,
          "uid": uid,
          ":cq_csrf_token": $('#cq_csrf_token').val()
        };
        $.ajax({
          type: 'POST',
          url: window.location.pathname.split('.')[0] + '.subscriptiondata.json',
          data: data
        }).done(function () {
          window.location = config.resource;
        }).fail(function () {
          window.location = config.errorPage;
        });
        return false;
      }
    });
  }
})(Cog.jQuery());