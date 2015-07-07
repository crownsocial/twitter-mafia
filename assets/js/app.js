var TwitterAnalytics = angular.module('TwitterAnalytics', ['ngRoute','ngResource', 'ngMaterial', 'ngMessages', 'ui.router', 'ngAnimate']);

TwitterAnalytics.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider){
  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', {
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .otherwise({
  templateUrl:'/views/404.html'
  });

}]);

TwitterAnalytics.run(['$rootScope', 'UserService', function($rootScope, UserService) {

  UserService.check(function(err, data){
    console.log('Current User',UserService.currentUser)
    $rootScope.UserService = UserService;

    $rootScope.$watchCollection('UserService', function(){
      $rootScope.currentUser = UserService.currentUser;
    })
  });

}]);