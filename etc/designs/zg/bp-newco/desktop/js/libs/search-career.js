(function ($) {
    $(document).ready(function() {
        $('#searchCareer').click(function(){
          careerSearch();
      });
      });
  //careerSearch for search jobs
  function careerSearch() {
    // let job = encodeURI(document.getElementById('jobTitle').value);
    // let location = encodeURI(document.getElementById('location').value);
    if (document.getElementById('jobTitle')) {
      var job = encodeURI(document.getElementById('jobTitle').value);
    }
    if (document.getElementById('location')) {
      var location = encodeURI(document.getElementById('location').value);
    }
    if (
      job &&
      location != undefined &&
      job &&
      location != '' &&
      job &&
      location != null
    ) {
      let link =
        'https://haleon.staging.jibeapply.com/jobs' +
        `?keywords=${job}&location=${location}`;
      window.location.href = link;
    }
  }

})(Cog.jQuery());