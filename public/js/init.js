// window.bootstrap = function() {
//     angular.bootstrap(document, ['mean']);
// };

// window.init = function() {
//     window.bootstrap();
// };
if (window.location.hash == "#_=_") window.location.hash = "#!";
// $(document).ready(function() {
//     //Fixing facebook bug with redirect


//     //Then init the app
//     window.init();
// });

$(document).ready(function () {
      var myApp = angular.module('myApp');
      $('[data-toggle="tooltip"]').tooltip();
      $('.carousel').carousel();
      // Next slide
      $('.carousel').carousel('next');
      $('.carousel').carousel('next', 3); // Move next n times.
      // Previous slide
      $('.carousel').carousel('prev');
      $('.carousel').carousel('prev', 4); // Move prev n times.
      $('[data-toggle="tooltip"]').tooltip();
      $("#toggleSwitch_j").hover(

      function() {
            $("#theBox_3").slideDown(500);
      }, function() {
            $("#theBox_3").slideUp(500);
      });

      $("#StayOpen").hover(
      function() {
            $("#theBox_2").slideDown(500);
      }, function() {
            $("#theBox_2").slideUp(500);
      });
});
