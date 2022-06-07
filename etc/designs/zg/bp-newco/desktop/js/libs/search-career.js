(function ($) {
    $(document).ready(function() {
        $('#searchCareer').click(function(){
          careerSearch();
      });
      $('#jobTitle , #location').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if(keycode == '13'){
          careerSearch();
        }
        //Stop the event from propogation to other handlers
        //If this line will be removed, then keypress event handler attached 
        //at document level will also be triggered
        event.stopPropagation();
      });
      });
  //careerSearch for search jobs
  function careerSearch() {
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
      $('#jobTitle').val('');
      $('#location').val('');
      let link =
        'https://haleon.staging.jibeapply.com/jobs' +
        `?keywords=${job}&location=${location}`;
      window.location.href = link;
     
      
    }
  }

})(Cog.jQuery());