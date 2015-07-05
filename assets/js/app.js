var TwitterAnalytics = angular.module('TwitterAnalytics', ['ngRoute','ngResource', 'ngMaterial', 'ngMessages', 'ui.router', 'ngAnimate']);

HardwareAscender.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'cloudinaryProvider', 'cfpLoadingBarProvider', function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, cloudinaryProvider, cfpLoadingBarProvider){
  .when('/', {
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .otherwise({
  templateUrl:'/views/404.html'
  });
}]);
