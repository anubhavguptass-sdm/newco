/*
 ** GIGYA DOB CHECKER
 ** uses luxon to determine correct time distance
 ** luxon is in ./src/js/libs/luxon.js
 */
(function($) {
  $(() => {
    //set default age restriction
    const defaultAge = 18,
      init = form => {
        // initialize DOB form
        let t = $(form),
          classProp = t.prop('class'),
          dobMatch = classProp.match(/g\-dob\-(\d{1,2})/im), // check form classes for g-dob-... pattern
          // assign index to form, this index represents inex of input to be checked
          dobIndex = dobMatch === null ? false : dobMatch[1] - 1,
          // look for particular indexed input inside current form
          dobInput =
            typeof dobIndex === 'number' && dobIndex > -1
              ? t.find('input[type="date"]').eq(dobIndex)
              : null,
          age = defaultAge;

        if (dobInput !== null && dobInput.length && dobInput.length > 0) {
          // check if form has year class that will reassign defaultAge value
          // with the one extracted from class
          // i.e. g-dob-y-(#age) --- g-dob-y-21 will set defaultAge to 21
          age = t.is('[class*="g-dob-y-"]')
            ? parseInt(classProp.match(/g\-dob\-y\-(\d{1,3})/im)[1])
            : defaultAge;
          age = isNaN(age) ? defaultAge : age;
          dobInput.attr({
            dob: true,
            'data-valid-age': age
          });
          // disables submit btn in form by default
          t.find('input[type="submit"]').attr('disabled', true);
        }
      };

    // iterate over all g-dob- elements
    $('[class*="g-dob-"]').each((ind, el) => {
      let t = $(el);

      if (t.find('> .gigya-raas.initialized').length === 0) {
        el.dobInit = setInterval(() => {
          if (t.find('> .gigya-raas.initialized').length > 0) {
            // wati for gigya to be initialized first
            setTimeout(() => {
              // then init
              init(el);
            }, 1000);
            clearInterval(el.dobInit);
          }
        });
      }
    });

    $('body').on('change', e => {
      // listen to changes in DOB form inputs
      try {
        let t = $(e.target),
          form,
          submiter,
          age,
          dobTime,
          diff,
          today,
          dob;
        if (t.is('input[dob]')) {
          // calculate and handle current DOB form
          form = t.closest('.gigya-raas.initialized');
          age = t.data('valid-age');
          submiter = form.find('input[type="submit"]');
          dobTime = new Date(t.val()).getTime();
          if (isNaN(dobTime)) return;
          today = new moment(new Date().getTime());

          dob = new moment(dobTime);
          diff = today.diff(dob, 'years').toObject().years;
          if (diff >= age) submiter.removeAttr('disabled');
          else submiter.attr('disabled', true);
        }
      } catch (error) {
        console.warn(error);
      }
    });
  });
})(Cog.jQuery());
