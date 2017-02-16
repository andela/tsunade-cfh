angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global',
    '$location', 'socket', 'game', 'AvatarService', '$http',
    function ($scope, Global, $location, socket, game, AvatarService, $http) {
      $scope.global = Global;

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      $scope.avatars = [];
      AvatarService.getAvatars()
      .then((data) => {
        $scope.avatars = data;
      });


      $scope.login = () => {
        const user = {
          email: $scope.login_email,
          password: $scope.login_password
        };

        $http.post('/api/auth/login', user).then((response) => {
          localStorage.setItem('token', response.data.token);
          $location.path('/app');
        }, (err) => {
          $scope.showError();
          $scope.error = err;
        });
      };

      $scope.logout = () => {
        localStorage.removeItem('token');
        $scope.showOptions = true;
      };

      $scope.signup = () => {
        if (!$scope.name || !$scope.username || !$scope.email || !$scope.password) {
          const error = {
          data: { message: 'Data incomplete.' }
        };
          $scope.showError();
          $scope.error = error;
        } else {
          const newuser = {
          email: $scope.email,
          username: $scope.username,
          password: $scope.password,
          name: $scope.name
        };

          $http.post('/api/auth/signup', newuser).then(() => {
          $location.path('/app');
        }, (err) => {
          $scope.showError();
          $scope.error = err;
        });
        }
      };


      $scope.facebookLogin = () => {
        const facebook = hello('facebook');
        facebook.login({ scope: 'email' }).then(
        () => {
          hello('facebook').api('me').then((user) => {
            const userDetails = {
              name: user.name,
              email: user.email,
              provider: 'facebook'
            };
            $http.post('/api/auth/social', userDetails).then(() => {
              $location.path('/app');
            });
          });
        },
        (err) => {
          $scope.showError();
          $scope.error = err;
        }
      );
      };

      $scope.twitterLogin = () => {
        const twitter = hello('twitter');
        twitter.login({ scope: 'email' }).then(
        () => {
          hello('twitter').api('me').then((user) => {
            const userDetails = {
              name: user.name,
              email: user.id,
              provider: 'twitter'
            };
            $http.post('/api/auth/social', userDetails).then(() => {
              $location.path('/app');
            });
          });
        }, (err) => {
          $scope.showError();
          $scope.error = err;
        });
      };

      $scope.googleLogin = () => {
        const google = hello('google');
        google.login({
          redirect_uri: 'http://localhost:3000/',
          scope: 'email'
        }).then(
        () => {
          hello('google').api('me').then((user) => {
            const userDetails = {
              name: user.name,
              email: user.email,
              provider: 'google'
            };
            $http.post('/api/auth/social', userDetails).then(() => {
              $location.path('/app');
            });
          });
        }, (err) => {
          $scope.showError();
          $scope.error = err;
        });
      };

      $scope.start = () => {
        hello.init({
          facebook: '1867221413501027',
          google: '825562793958-hsbrf2tri06upbvs40tbhept97a5t5qs.apps.googleusercontent.com',
          twitter: 'EsqPppinJViefxGH67ILoM7AJ'
        }, {
          redirect_uri: '/'
        });
      };
      $scope.start();
    }]);
