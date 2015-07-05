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
