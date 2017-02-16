angular.module('mean', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.directives', 'angular-jwt'])
  .config(['$routeProvider',
    function ($routeProvider) {
      $routeProvider.
          when('/', {
            templateUrl: 'views/index.html'
          }).
          when('/app', {
            templateUrl: '/views/app.html',
          }).
          when('/privacy', {
            templateUrl: '/views/privacy.html',
          }).
          when('/bottom', {
            templateUrl: '/views/bottom.html'
          }).
          when('/signin', {
            templateUrl: '/views/signin.html'
          }).
          when('/signup', {
            templateUrl: '/views/signup.html'
          }).
          when('/choose-avatar', {
            templateUrl: '/views/choose-avatar.html'
          }).
          otherwise({
            redirectTo: '/'
          });
    }
  ]).config([() => {
    const fbConfig = {
      apiKey: 'AIzaSyDKtPdrh-Aa-Ximpkb-E1sIhTFKaDfN90g',
      authDomain: 'cardsforhumanity-8b53c.firebaseapp.com',
      databaseURL: 'https://cardsforhumanity-8b53c.firebaseio.com',
      storageBucket: 'cardsforhumanity-8b53c.appspot.com',
      messagingSenderId: '729251074640'
    };
    firebase.initializeApp(fbConfig);
  }
  ]).config(['$locationProvider',
    function ($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      var phase = this.$root.$$phase;
      if(phase == '$apply' || phase == '$digest') {
        if(fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }]).run(['DonationService', function (DonationService) {
    window.userDonationCb = function (donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', []);
angular.module('mean.directives', []);

