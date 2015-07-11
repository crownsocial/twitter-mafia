var TwitterMafia = angular.module('TwitterMafia', ['ngRoute','ngResource', 'ngMessages', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngCookies']);

TwitterMafia.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, $httpProvider){
  // $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .when('/login', {
    templateUrl: 'templates/modals/loginModal.html',
    controller: 'modalCtrl'
  })
  .when('/register', {
    templateUrl: 'templates/modals/signupModal.html',
    controller: 'modalCtrl'
  })
  .when('/auth/twitter', {

  })
  .otherwise({
  templateUrl:'/views/404.html'
  });

  // $httpProvider.defaults.useXDomain = true;
  // $httpProvider.defaults.withCredentials = true;
}]);

TwitterMafia.run(['$rootScope', '$cookies', '$http', function($rootScope, $cookies, $http){
  // $http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken
}])

// TwitterMafia.run(['$rootScope', 'UserService', function($rootScope, UserService) {

//   UserService.check(function(err, data){
//     console.log('Current User',UserService.currentUser)
//     $rootScope.UserService = UserService;

//     $rootScope.$watchCollection('UserService', function(){
//       $rootScope.currentUser = UserService.currentUser;
//     })
//   });

// }]);