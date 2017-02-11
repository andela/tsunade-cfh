angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', 'socket', 'game', 'AvatarService', '$http', function ($scope, Global, $location, socket, game, AvatarService, $http) {
    $scope.global = Global;

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

    $scope.login = function() {
       var user = {
         email: $scope.login_email,
         password: $scope.login_password
       };

       $http.post('/api/auth/login', user).then(function(data) {
         $location.path('/app');
       }, function(err) {
         $scope.showError();
         $scope.error = err;
       });
     };

     $scope.signup = function() {
       if(!$scope.name || !$scope.email || !$scope.password) {
         const error = {
           data: { message: 'Data incomplete.' }
         };
         $scope.showSignUpErrors(error);
       } else {
         var newuser = {
           email: $scope.email,
           username: $scope.username,
           password: $scope.password,
           name: $scope.name
         };

         $http.post('/api/auth/signup', newuser).then(function(data) {
           $location.path('/app');
         }, function(err) {
           $scope.showError();
           $scope.error = err;
         });
       }
     };

     $scope.facebookLogin = function() {
       const facebook = hello('facebook');
       facebook.login({ scope: 'email' }).then(
         function() {
           hello('facebook').api('me').then(function(user) {
             const userDetails = {
               name: user.name,
               email: user.email,
               provider: 'facebook'
             };
             $http.post('/api/auth/social', userDetails).then(function(data) {
               $location.path('/app');
             });
           });
         },
         function(err) {
           $scope.showError();
           $scope.error = err;
         }
       );
     };

     $scope.twitterLogin = () => {
       const twitter = hello('twitter');
       twitter.login({ scope: 'email' }).then(
       function() {
         hello('twitter').api('me').then(function(user) {
           const userDetails = {
             name: user.name,
             email: user.id,
             provider: 'twitter'
           };
           $http.post('/api/auth/social', userDetails).then(function(data) {
             $location.path('/app');
           });
         });
       }, function(err) {
         $scope.showError();
         $scope.error = err;
      });
     }

   $scope.googleLogin = function() {
     const google = hello('google');
     google.login({ redirect_uri: 'http://localhost:3000/', scope: 'email'}).then(
       function() {
         hello('google').api('me').then(function(user) {
           const userDetails = {
             name: user.name,
             email: user.email,
             provider: 'google'
           };
           $http.post('/api/auth/social', userDetails).then(function(data) {
             $location.path('/app');
           });
         });
       }, function(err) {
         $scope.showError();
         $scope.error = err;
     });
   };


   $scope.start = function () {
     hello.init({
       facebook: "1867221413501027",
       google: "825562793958-hsbrf2tri06upbvs40tbhept97a5t5qs.apps.googleusercontent.com",
       twitter: "EsqPppinJViefxGH67ILoM7AJ"
     }, {
       redirect_uri: '/'
     })
   };

   $scope.start();
}]);
