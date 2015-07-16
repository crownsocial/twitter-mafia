var TwitterMafia = angular.module('TwitterMafia', ['ngRoute','ngResource', 'ngMessages', 'ui.router', 'ngAnimate', 'ui.bootstrap', 'ngCookies', 'ngMaterial', 'smoothScroll', 'chart.js']);

TwitterMafia.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider', 'ChartJsProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, $httpProvider, ChartJsProvider){
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
  .when('/auth/twitter/:callback', {
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })
  .otherwise({
  templateUrl:'/views/404.html'
  });

  // $httpProvider.defaults.useXDomain = true;
  // $httpProvider.defaults.withCredentials = true;

  ChartJsProvider.setOptions({
    colours: ['#FF5252', '#FF8A80'],
    responsive: false
  });
  // Configure all line charts
  ChartJsProvider.setOptions('Line', {
    datasetFill: false
  });

}]);

TwitterMafia.run(['$rootScope', '$cookies', '$http', function($rootScope, $cookies, $http){

  $rootScope.isLoggedIn = function(){
    $http.get('/authenticate')
    .success(function(data){
      console.log('userdata:', data)
      if(data.authenticated === true){
        $rootScope.loggedIn = true;
        $rootScope.currentUser = data.user;
      }else{
        $rootScope.loggedIn = false
      }
    })
  }
  $rootScope.isLoggedIn();

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